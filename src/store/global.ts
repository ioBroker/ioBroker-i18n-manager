import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  const isSettingsVisible = ref(false);

  const showSettings = (): void => {
    isSettingsVisible.value = true;
  };

  const hideSettings = (): void => {
    isSettingsVisible.value = false;
  };

  return { isSettingsVisible, showSettings, hideSettings };
});
