/**
 * Thin wrapper around the preload-exposed bridge for sending messages to the
 * Electron main process. The channel must be one of the known IPC messages.
 */
export const sendIpc = (message: string, data?: unknown): void =>
  window.electronAPI.send(message, data);
