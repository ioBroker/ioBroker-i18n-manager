import { BrowserWindow, shell } from 'electron';

const helpMenu: Electron.MenuItemConstructorOptions = {
  role: 'help',
  submenu: [
    {
      label: 'Project Repository',
      click: () => shell.openExternal('https://github.com/gilmarsquinelato/i18n-manager'),
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: 'CommandOrControl+Shift+I',
      click: (_menuItem, window) => {
        if (window instanceof BrowserWindow) {
          window.webContents.toggleDevTools();
        }
      },
    },
  ],
};

export default helpMenu;
