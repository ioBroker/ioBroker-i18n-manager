import * as ipcMessages from '@common/ipcMessages';
import { CustomSettings, FormattedFolderPath, LoadedPath } from '@common/types';
import router from '@/router';
import { useGlobalStore } from '@/store/global';
import { useSettingsStore } from '@/settings/store';
import { useHomeStore } from '@/home/store';
import { useFolderStore } from '@/folder/store';

/**
 * Wire incoming IPC messages from the main process to the corresponding store
 * actions. Replaces the old Vuex `ipc` module. Must run after Pinia is active.
 */
export function registerIpcListeners(): void {
  const global = useGlobalStore();
  const settings = useSettingsStore();
  const home = useHomeStore();
  const folder = useFolderStore();

  const { on } = window.electronAPI;

  on(ipcMessages.showSettings, () => global.showSettings());
  on(ipcMessages.save, data => folder.save(data));
  on(ipcMessages.saveComplete, data => folder.saveComplete(data));
  on(ipcMessages.open, data => void folder.openFolder(data as LoadedPath[]));
  on(ipcMessages.navigateTo, (data: any) => void router.push(data.path));
  on(ipcMessages.settings, data => settings.loadSettings(data as CustomSettings));
  on(ipcMessages.recentFolders, data => home.receiveRecentFolders(data as FormattedFolderPath[]));
  on(ipcMessages.closeFolder, () => void folder.closeFolder());
  on(ipcMessages.refreshFolder, data => void folder.refreshFolder(data as LoadedPath[]));

  // The following messages were intentionally ignored by the original ipc module:
  //   dataChanged, showContextMenu, addTreeItem, removeTreeItem, renameTreeItem, saveSettings
}
