import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const commonAlias = { '@common': resolve(__dirname, 'common') };

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: commonAlias },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'main/index.ts') },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias: commonAlias },
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'preload/index.ts') },
      },
    },
  },
  renderer: {
    root: '.',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@common': resolve(__dirname, 'common'),
      },
    },
    plugins: [vue(), vuetify({ autoImport: true })],
    build: {
      rollupOptions: {
        input: { index: resolve(__dirname, 'index.html') },
      },
    },
  },
});
