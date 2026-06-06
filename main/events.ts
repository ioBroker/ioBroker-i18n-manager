import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import * as path from 'node:path';

import * as ipcMessages from '../common/ipcMessages';
import { ParsedFile } from '../common/types';
import * as fileManager from './fileManager';
import * as settings from './Settings';
import * as windowManager from './windowManager';
import { readFileSync, rmSync, unlinkSync, writeFileSync } from 'fs';

const onSave = async (e: any, data: any) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (!window) return;

  const closeWindow = data.data.close;
  const closeDirectory = data.data.closeDirectory;
  const folder = data.payload;

  if ((folder as ParsedFile[]).length === 0) {
    windowManager.sendSaveComplete(window, []);
    return;
  }

  const result = await fileManager.saveFolder(folder);

  // Always notify the renderer so isSaving clears, even on failure.
  windowManager.sendSaveComplete(window, result);

  if (result.length > 0) {
    dialog.showErrorBox('Failed to save the following files', result.join('\n'));
    return;
  }

  window.setDocumentEdited(false);

  if (closeWindow) {
    window.close();
  }

  if (closeDirectory) {
    windowManager.sendClose(window);
  }
};

const onOpen = (e: any, data: string) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  fileManager.openFolderInWindow(data, window);
};

const onConvert = (e: any, files: {
  path: string
  language: string
}[]) => {
  if (!Array.isArray(files) || files.length === 0) return;

  windowManager.sendClose(e.sender);

  const failures: string[] = [];
  let parentDir: string | undefined;

  for (const file of files) {
    try {
      // file.path looks like <parent>/<language>/translations.json (any separator).
      const languageDir = path.dirname(file.path);              // .../<language>
      parentDir = parentDir ?? path.dirname(languageDir);       // .../<parent>
      const destination = path.join(parentDir, `${file.language}.json`);

      const data = readFileSync(file.path, 'utf8');
      writeFileSync(destination, data);
      unlinkSync(file.path);
      rmSync(languageDir, { recursive: true, force: true });
    } catch (err: any) {
      failures.push(`${file.path}: ${err?.message ?? err}`);
    }
  }

  if (failures.length > 0) {
    dialog.showErrorBox('Failed to convert the following files', failures.join('\n'));
  }

  if (parentDir) {
    onOpen(e, parentDir);
  }
};

const onDataChanged = (e: any, data: boolean) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  window.setDocumentEdited(data);
};

const onGetSettings = (e: any) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  windowManager.sendSettings(window, settings.getCustomSettings());
};

const onSaveSettings = (e: any, data: any) => {
  settings.saveCustomSettings(data);
};

const onOpenFile = (e: any, data: any) => {
  if (app.isReady()) {
    fileManager.openFolder(data);
  } else {
    app.on('ready', () => fileManager.openFolder(data));
  }
};

const onRecentFolders = (e: any) => {
  const window = BrowserWindow.fromWebContents(e.sender);
  if (!window) return;
  windowManager.sendRecentFolders(window, settings.getRecentFolders());
};

const registerAppEvents = () => {
  ipcMain.on(ipcMessages.open, onOpen);
  ipcMain.on(ipcMessages.save, onSave);
  ipcMain.on(ipcMessages.convert, onConvert);
  ipcMain.on(ipcMessages.dataChanged, onDataChanged);
  ipcMain.on(ipcMessages.saveSettings, onSaveSettings);
  ipcMain.on(ipcMessages.settings, onGetSettings);
  ipcMain.on(ipcMessages.recentFolders, onRecentFolders);
  ipcMain.on('open-external', (_e: any, url: string) => {
    void shell.openExternal(url);
  });

  // Register before will-finish-launching so we don't miss the initial macOS
  // open-file event when the app is launched from a file association.
  app.on('open-file', onOpenFile);
};

export default registerAppEvents;
