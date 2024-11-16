<template>
  <v-dialog
    v-model="visible"
    fullscreen
    @close="hideSettings"
  >
    <v-form
      v-model="isFormValid"
      @submit.prevent="handleSubmit"
      class="settings-form"
    >
      <v-card class="settings">
        <v-card-title primary-title>
          <v-btn
            icon
            class="mr-2"
            @click="hideSettings"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          Settings
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-select
                  v-model="settings.sortOnSave"
                  label="Sort words on save"
                  :items="['sort', 'no sort']"
                  outlined
              />
            </v-col>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.spacesIndentation"
                label="Spaces indentation"
                :items="['4', '2', 'tab', 'detect']"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.translationEngine"
                label="Translation Engine"
                :items="[{ text: 'Google Translate', value: 'google'}, { text: 'DeepL', value: 'deepl'}, { text: 'Amazon Web Services', value: 'aws'}, { text: 'DeepL (only for ioBroker projects)', value: 'deeplIoBroker'}, { text: 'Amazon Web Services (only for ioBroker projects)', value: 'awsIoBroker'}, { text: 'Google Translate (only for ioBroker projects)', value: 'googleIoBroker'}, { text: 'Libre Translation (only for ioBroker projects)', value: 'libreIoBroker' }]"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row v-if="settings.translationEngine === 'google'">
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.googleTranslateApiKey"
                label="Google Translate™ API Key"
                hide-details
                outlined
              />
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
                hide-details
                outlined
              />
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
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <div class="px-2" v-if="settings.translationEngine === 'aws'">
            <RemoteLink href="https://aws.amazon.com/en/translate/" />
          </div>
          <!--v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.iobrokerTranslateApiKey"
                label="ioBroker translate API Key"
                hide-details
                outlined
              />
            </v-col>
          </v-row-->
        </v-card-text>

        <v-spacer />

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="hideSettings"
            text
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

<script lang="ts">
import { useNamespace } from '@/store/utils';
import { CustomSettings } from '@common/types';
import { defineComponent, watch } from '@vue/composition-api';
import RemoteLink from '@/components/RemoteLink.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    RemoteLink,
  },
  setup() {
    const globalModule = useNamespace('global');
    const visible = globalModule.useState<boolean>('isSettingsVisible');
    const hideSettings = globalModule.useMutation('hideSettings');

    const settingsModule = useNamespace('settings');
    const settings = settingsModule.useState<CustomSettings>('settings', { immediate: true });
    const saveSettings = settingsModule.useAction('saveSettings');

    const folderModule = useNamespace('folder');
    const refreshTranslationKey = folderModule.useAction('refreshTranslationKey');

    const isFormValid = false;

    async function handleSubmit() {
      await saveSettings(settings.value);
      await refreshTranslationKey();
    }

    // Synchronize when the dialog is closed using ESC key
    watch(visible, () => {
      if (!visible.value) {
        hideSettings();
      }
    });

    return {
      visible,
      settings,
      hideSettings,
      handleSubmit,
      isFormValid,
    };
  },
});
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
