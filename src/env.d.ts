/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

export interface ElectronAPI {
  /** Send a message to the main process. */
  send: (channel: string, data?: unknown) => void;
  /** Subscribe to a message from the main process. Returns an unsubscribe function. */
  on: (channel: string, listener: (data: any) => void) => () => void;
  /** Open an URL in the user's default browser. */
  openExternal: (url: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
