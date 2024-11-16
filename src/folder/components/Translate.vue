<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header style="padding-top: 8px; padding-bottom: 8px">
        <v-btn
            color="primary"
            v-if="isTranslationEnabled"
            style="width: 122px; max-width: 122px; margin-right: 16px"
            @click="translate"
        >
          Translate
        </v-btn>
        <div
            v-if="!isTranslationEnabled"
            style="width: 122px; max-width: 122px; margin-right: 16px"
        >
          Translate
        </div>
        {{ hint() }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col>
            <v-autocomplete
              label="From"
              v-model="settings.translationFrom"
              v-on:change="handleChange"
              :items="languageList"
              item-disabled="disabled"
              item-text="label"
              item-value="language"
              class="source"
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-autocomplete
              label="To"
              v-model="settings.translationTo"
              v-on:change="handleChange"
              :items="languageList"
              item-disabled="disabled"
              item-text="label"
              item-value="language"
              class="targets"
              outlined
              multiple
              dense
              small-chips
              deletable-chips
              counter
              clearable
            />
          </v-col>
          <v-col cols="2" class="pb-0">
            <v-btn @click="selectAll" class="select-all" outlined>All</v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3" class="pt-0">
            <v-radio-group v-model="settings.translationMode" v-on:change="handleChange">
              <v-radio label="This Key" value="this" :disabled="!selectedItem" />
              <v-radio label="All Keys" value="all" class="all-keys" />
            </v-radio-group>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-checkbox label="Overwrite not empty fields" v-model="settings.translationOverwrite" v-on:change="handleChange" />
          </v-col>
          <v-col class="pt-0">
            <v-btn v-if="isTranslationEnabled" color="primary" @click="translate">
              Translate
            </v-btn>
            <v-btn v-if="!isTranslationEnabled" color="error" @click="$emit('showSettings')">
              Configure Google Translate™
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from '@vue/composition-api';
  import { LanguageListItem, TranslatePayload, TreeItem } from '../types';
import { useNamespace } from '@/store/utils';
import { CustomSettings } from '@common/types';

  export default defineComponent({
    name: 'Translate',
    props: {
      languageList: {
        type: Array as () => LanguageListItem[],
        required: true,
      },
      selectedItem: Object as () => TreeItem,
      isTranslationEnabled: Boolean,
    },
    setup(props, { emit }) {
      // const source = ref('');

      const settingsModule = useNamespace('settings');
      const settings = settingsModule.useState<CustomSettings>('settings', { immediate: true });
      const saveSettings = settingsModule.useAction('saveSettings');

      async function handleChange() {
        await saveSettings(settings.value);
      }

      function selectAll() {
        settings.value.translationTo = props.languageList.filter(it => !it.disabled).map(it => it.language);
      }

      watch(() => settings.value.translationMode, (current, previous) => {
        if (current === 'all' && settings.value.translationOverwrite) {
          const result = confirm(xOptionSelectedWarningMessage('Overwrite'));
          if (!result) {
            settings.value.translationMode = 'this'
          }
        }
      });

      watch(() => settings.value.translationOverwrite, (current, previous) => {
        if (current && settings.value.translationMode === 'all') {
          const result = confirm(xOptionSelectedWarningMessage('All Keys'));
          if (!result) {
            settings.value.translationOverwrite = false
          }
        }
      });

      function translate(e: MouseEvent) {
        e?.stopPropagation();
        emit('translate', {
          mode: settings.value.translationMode,
          overwrite: settings.value.translationOverwrite,
          sourceLanguage: settings.value.translationFrom,
          targetLanguages: settings.value.translationTo,
        } as TranslatePayload);
      }

      const hint = () => {
        return `${settings.value.translationFrom} -> ${settings.value.translationTo.join(', ')} (${settings.value.translationEngine})${settings.value.translationMode === 'all' ? ' | All' : ''}${settings.value.translationOverwrite ? ' | Overwrite empty' : ''}`
      }

      return {
        settings,
        handleChange,
        selectAll,
        translate,
        hint,
      };
    },
  });

  function xOptionSelectedWarningMessage(option: string) {
    return `The "${option}" option is selected, this will overwrite ALL your keys, are you sure?`;
  }
</script>

<style lang="scss">
  .targets {
    .v-select__selections {
      max-height: 72px;
      overflow: auto;
      margin-top: 8px;
      margin-bottom: 2px;
    }
  }

  .all-keys {
    label {
      color: var(--v-error-base) !important;
    }
  }
</style>
