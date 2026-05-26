<template>
  <v-dialog
    v-model="visible"
    fullscreen
  >
    <v-form
      v-model="isFormValid"
      class="settings-form"
      @submit.prevent="handleSubmit"
    >
      <v-card class="settings">
        <v-card-title>
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            class="mr-2"
            @click="hideSettings"
          />
          Settings
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.sortOnSave"
                label="Sort words on save"
                :items="['sort', 'no sort']"              />
            </v-col>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.spacesIndentation"
                label="Spaces indentation"
                :items="['4', '2', 'tab', 'detect']"              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.translationEngine"
                label="Translation Engine"
                :items="translationEngines"
                hide-details              />
            </v-col>
          </v-row>
          <v-row v-if="settings.translationEngine === 'google'">
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.googleTranslateApiKey"
                label="Google Translate™ API Key"
                hide-details              />
            </v-col>
          </v-row>
          <div class="px-2" v-if="settings.translationEngine === 'google'">
            <RemoteLink href="https://console.cloud.google.com/apis/credentials/wizard?api=translate.googleapis.com" />
          </div>
          <v-row v-if="settings.translationEngine === 'deepl'">
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.deepLTranslateApiKey"
                label="DeepL translate API Key"
                hide-details              />
            </v-col>
          </v-row>
          <div class="px-2" v-if="settings.translationEngine === 'deepl'">
            <RemoteLink href="https://www.deepl.com/en/pro" />
          </div>
          <v-row v-if="settings.translationEngine === 'aws'">
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.awsTranslateApiKey"
                label="AWS Translate API Key"
                hide-details              />
            </v-col>
          </v-row>
          <div class="px-2" v-if="settings.translationEngine === 'aws'">
            <RemoteLink href="https://aws.amazon.com/en/translate/" />
          </div>
        </v-card-text>

        <v-spacer />

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="hideSettings"
          >Cancel</v-btn>
          <v-btn
            :disabled="!isFormValid"
            type="submit"
            color="primary"
            class="ml-4"
          >Save</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useGlobalStore } from '@/store/global';
import { useSettingsStore } from '@/settings/store';
import { useFolderStore } from '@/folder/store';
import RemoteLink from '@/components/RemoteLink.vue';

const globalStore = useGlobalStore();
const settingsStore = useSettingsStore();
const folderStore = useFolderStore();

const { settings } = storeToRefs(settingsStore);

const isFormValid = ref(true);

const translationEngines = [
  { title: 'Google Translate', value: 'google' },
  { title: 'DeepL', value: 'deepl' },
  { title: 'Amazon Web Services', value: 'aws' },
  { title: 'DeepL (only for ioBroker projects)', value: 'deeplIoBroker' },
  { title: 'Amazon Web Services (only for ioBroker projects)', value: 'awsIoBroker' },
  { title: 'Google Translate (only for ioBroker projects)', value: 'googleIoBroker' },
  { title: 'Libre Translation (only for ioBroker projects)', value: 'libreIoBroker' },
];

// Writable proxy so closing the dialog (ESC / backdrop) hides the settings.
const visible = computed<boolean>({
  get: () => globalStore.isSettingsVisible,
  set: value => {
    if (!value) {
      globalStore.hideSettings();
    }
  },
});

function hideSettings(): void {
  globalStore.hideSettings();
}

async function handleSubmit(): Promise<void> {
  settingsStore.saveSettings(settings.value);
  await folderStore.refreshTranslationKey();
}
</script>

<style scoped lang="scss">
.settings {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.settings-form {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
