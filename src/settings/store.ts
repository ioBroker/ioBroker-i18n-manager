import { defineStore } from 'pinia';
import { ref } from 'vue';

import { CustomSettings } from '@common/types';
import { sendIpc } from '@/ipc';
import * as ipcMessages from '@common/ipcMessages';
import { useGlobalStore } from '@/store/global';

const defaultSettings = (): CustomSettings => ({
  translationEngine: 'google',
  googleTranslateApiKey: '',
  awsTranslateApiKey: '',
  deepLTranslateApiKey: '',
  iobrokerTranslateApiKey: '',
  sortOnSave: 'no sort',
  spacesIndentation: '2',
  translationFrom: 'en',
  translationTo: [],
  translationMode: 'this',
  translationOverwrite: false,
});

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<CustomSettings>(defaultSettings());

  function loadSettings(value: CustomSettings): void {
    settings.value = value;
  }

  function saveSettings(value: CustomSettings): void {
    sendIpc(ipcMessages.saveSettings, value);
    useGlobalStore().hideSettings();
    settings.value = value;
  }

  return { settings, loadSettings, saveSettings };
});
