import { defineStore } from 'pinia';
import { ref } from 'vue';

const THEME_KEY = 'i18n-manager:theme';

const readStoredTheme = (): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useGlobalStore = defineStore('global', () => {
  const isSettingsVisible = ref(false);
  const theme = ref<'light' | 'dark'>(readStoredTheme());

  const showSettings = (): void => {
    isSettingsVisible.value = true;
  };

  const hideSettings = (): void => {
    isSettingsVisible.value = false;
  };

  const setTheme = (value: 'light' | 'dark'): void => {
    theme.value = value;
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const toggleTheme = (): void => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  return { isSettingsVisible, theme, showSettings, hideSettings, setTheme, toggleTheme };
});
