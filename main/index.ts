import { app, BrowserWindow } from 'electron';
import { is } from '@electron-toolkit/utils';

import registerAppEvents from './events';
import loadMenu from './menu';
import { createWindow, hasWindows } from './windowManager';

registerAppEvents();

app.name = 'i18n Manager';
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'i18n Manager',
    applicationVersion: app.getVersion(),
    copyright: 'https://www.github.com/gilmarsquinelato',
    credits: 'Gilmar Quinelato',
    version: app.getVersion(),
  });
}

const openConsole = (window: BrowserWindow) => {
  if (is.dev) {
    window.webContents.openDevTools();
  }
};

app.on('ready', () => {
  loadMenu();
  const window = createWindow();

  openConsole(window);
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (!hasWindows()) {
    createWindow();
  }
});
