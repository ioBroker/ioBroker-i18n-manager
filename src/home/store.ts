import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FormattedFolderPath } from '@common/types';
import packageJson from '../../package.json';

export const useHomeStore = defineStore('home', () => {
  const recentFolders = ref<FormattedFolderPath[]>([]);
  const currentVersion = ref<string>(packageJson.version);
  const latestVersion = ref<string>('');

  function receiveRecentFolders(data: FormattedFolderPath[]): void {
    recentFolders.value = data;
  }

  return { recentFolders, currentVersion, latestVersion, receiveRecentFolders };
});
