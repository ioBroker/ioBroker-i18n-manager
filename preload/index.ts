import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron';
import * as ipcMessages from '../common/ipcMessages';

// Only allow channels that are part of the known IPC message contract.
const validChannels = new Set<string>(Object.values(ipcMessages));

const api = {
  /** Send a message to the main process. */
  send(channel: string, data?: unknown): void {
    if (validChannels.has(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  /** Subscribe to a message from the main process. Returns an unsubscribe function. */
  on(channel: string, listener: (data: unknown) => void): () => void {
    if (!validChannels.has(channel)) {
      return () => undefined;
    }

    const handler = (_event: IpcRendererEvent, data: unknown) => listener(data);
    ipcRenderer.on(channel, handler);

    return () => ipcRenderer.removeListener(channel, handler);
  },

  /** Open an URL in the user's default browser (handled by the main process). */
  openExternal(url: string): void {
    ipcRenderer.send('open-external', url);
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

export type ElectronAPI = typeof api;
