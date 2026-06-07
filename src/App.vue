<template>
  <v-app :theme="theme" style="height: 100%">
    <v-main class="app" :class="{ 'app-dark': theme === 'dark' }">
      <router-view />
    </v-main>

    <Settings />
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '@/store/global';
import Settings from '@/settings/views/Settings.vue';

const { theme } = storeToRefs(useGlobalStore());
</script>

<style lang="scss">
  html,
  body,
  .app {
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .app {
    background-image: url('./assets/logo.png');
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 500px 125px;
    background-blend-mode: lighten;
    background-color: #fafaffb3;
  }

  .app.app-dark {
    background-blend-mode: multiply;
    background-color: #121212;
  }

  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.4);
  }
</style>
