<template>
  <div class="home">
    <v-row no-gutters class="home-row">
      <v-col cols="7" class="home-col pr-2">
        <v-card style="height: 100%">
          <v-card-title>Recent folders</v-card-title>

          <v-list style="height: calc(100% - 64px); overflow: auto">
            <v-list-item
              v-for="folder in recentFolders"
              :key="folder.fullPath"
              :title="folder.folder"
              :subtitle="folder.fullPath"
              @click="openFolder(folder)"
            />
          </v-list>
        </v-card>
      </v-col>

      <v-col class="home-col pl-2">
        <v-card class="info-card">
          <v-card-item>
            <template v-slot:prepend>
              <v-icon size="32" color="primary">mdi-translate</v-icon>
            </template>
            <template v-slot:append>
              <v-btn
                :icon="theme === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                variant="text"
                :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggleTheme"
              />
            </template>
            <v-card-title>i18n Manager</v-card-title>
            <v-card-subtitle>ioBroker edition</v-card-subtitle>
          </v-card-item>
          <v-card-text class="d-flex align-center">
            <span class="text-medium-emphasis mr-2">Version</span>
            <v-chip size="small" color="primary" variant="tonal">{{ currentVersion }}</v-chip>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useHomeStore } from '@/home/store';
import { useGlobalStore } from '@/store/global';
import { sendIpc } from '@/ipc';
import { FormattedFolderPath } from '@common/types';
import * as ipcMessages from '@common/ipcMessages';

const homeStore = useHomeStore();
const { recentFolders, currentVersion } = storeToRefs(homeStore);

const globalStore = useGlobalStore();
const { theme } = storeToRefs(globalStore);
const toggleTheme = (): void => globalStore.toggleTheme();

function openFolder(folder: FormattedFolderPath): void {
  sendIpc(ipcMessages.open, folder.fullPath);
}

sendIpc(ipcMessages.recentFolders);
</script>

<style lang="scss">
  .home {
    padding: 8px;
    height: 100%;
    box-sizing: border-box;
  }

  .home-row {
    height: 100%;
  }

  .home-col {
    height: 100%;
  }
</style>
