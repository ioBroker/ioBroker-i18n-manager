import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const storedTheme = (() => {
  try {
    return localStorage.getItem('i18n-manager:theme');
  } catch {
    return null;
  }
})();

const defaultTheme = storedTheme === 'dark' || storedTheme === 'light'
  ? storedTheme
  : prefersDark ? 'dark' : 'light';

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme,
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          'warning-darken-1': '#FFA000',
          surface: '#FFFFFF',
          background: '#FAFAFF',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#1976D2',
          secondary: '#90A4AE',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#64B5F6',
          success: '#66BB6A',
          warning: '#FFA726',
          'warning-darken-1': '#FB8C00',
          surface: '#1E1E1E',
          background: '#121212',
          'on-surface': '#E0E0E0',
          'on-background': '#E0E0E0',
        },
      },
    },
  },
});
