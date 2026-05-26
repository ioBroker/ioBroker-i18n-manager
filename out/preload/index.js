"use strict";
const electron = require("electron");
const save = "save";
const saveComplete = "saveComplete";
const convert = "convert";
const convertComplete = "convertComplete";
const open = "open";
const dataChanged = "dataChanged";
const showContextMenu = "showContextMenu";
const addTreeItem = "addTreeItem";
const removeTreeItem = "removeTreeItem";
const renameTreeItem = "renameTreeItem";
const navigateTo = "navigateTo";
const showSettings = "showSettings";
const settings = "settings";
const saveSettings = "saveSettings";
const recentFolders = "recentFolders";
const closeFolder = "closeFolder";
const refreshFolder = "refreshFolder";
const ipcMessages = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addTreeItem,
  closeFolder,
  convert,
  convertComplete,
  dataChanged,
  navigateTo,
  open,
  recentFolders,
  refreshFolder,
  removeTreeItem,
  renameTreeItem,
  save,
  saveComplete,
  saveSettings,
  settings,
  showContextMenu,
  showSettings
}, Symbol.toStringTag, { value: "Module" }));
const validChannels = new Set(Object.values(ipcMessages));
const api = {
  /** Send a message to the main process. */
  send(channel, data) {
    if (validChannels.has(channel)) {
      electron.ipcRenderer.send(channel, data);
    }
  },
  /** Subscribe to a message from the main process. Returns an unsubscribe function. */
  on(channel, listener) {
    if (!validChannels.has(channel)) {
      return () => void 0;
    }
    const handler = (_event, data) => listener(data);
    electron.ipcRenderer.on(channel, handler);
    return () => electron.ipcRenderer.removeListener(channel, handler);
  },
  /** Open an URL in the user's default browser (handled by the main process). */
  openExternal(url) {
    electron.ipcRenderer.send("open-external", url);
  }
};
electron.contextBridge.exposeInMainWorld("electronAPI", api);
