<template>
  <v-expansion-panels variant="accordion" class="translate-panels">
    <v-expansion-panel>
      <v-expansion-panel-title style="padding-top: 8px; padding-bottom: 8px">
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
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row>
          <v-col>
            <v-autocomplete
              label="From"
              v-model="settings.translationFrom"
              :items="languageItems"
              class="source"              density="compact"
              hide-details
              @update:model-value="handleChange"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-autocomplete
              label="To"
              v-model="settings.translationTo"
              :items="languageItems"
              class="targets"              multiple
              density="compact"
              chips
              closable-chips
              counter
              clearable
              @update:model-value="handleChange"
            />
          </v-col>
          <v-col cols="2" class="pb-0">
            <v-btn @click="selectAll" class="select-all" variant="tonal">All</v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3" class="pt-0">
            <v-radio-group v-model="settings.translationMode" @update:model-value="handleChange">
              <v-radio label="This Key" value="this" :disabled="!selectedItem" />
              <v-radio label="All Keys" value="all" class="all-keys" />
            </v-radio-group>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-checkbox label="Overwrite not empty fields" v-model="settings.translationOverwrite" @update:model-value="handleChange" />
          </v-col>
          <v-col class="pt-0">
            <v-btn v-if="isTranslationEnabled" color="primary" @click="translate">
              Translate
            </v-btn>
            <v-btn v-if="!isTranslationEnabled" color="error" @click="emit('showSettings')">
              Configure Google Translate™
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { LanguageListItem, TranslatePayload, TreeItem } from '../types';
import { useSettingsStore } from '@/settings/store';

const props = defineProps<{
  languageList: LanguageListItem[];
  selectedItem?: TreeItem | null;
  isTranslationEnabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'translate', payload: TranslatePayload): void;
  (e: 'showSettings'): void;
}>();

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const languageItems = computed(() =>
  props.languageList.map(it => ({
    title: it.label,
    value: it.language,
    props: { disabled: it.disabled },
  })),
);

function handleChange(): void {
  settingsStore.saveSettings(settings.value);
}

function selectAll(): void {
  settings.value.translationTo = props.languageList.filter(it => !it.disabled).map(it => it.language);
  handleChange();
}

watch(() => settings.value.translationMode, current => {
  if (current === 'all' && settings.value.translationOverwrite) {
    const result = confirm(xOptionSelectedWarningMessage('Overwrite'));
    if (!result) {
      settings.value.translationMode = 'this';
    }
  }
});

watch(() => settings.value.translationOverwrite, current => {
  if (current && settings.value.translationMode === 'all') {
    const result = confirm(xOptionSelectedWarningMessage('All Keys'));
    if (!result) {
      settings.value.translationOverwrite = false;
    }
  }
});

function translate(e?: MouseEvent): void {
  e?.stopPropagation();
  emit('translate', {
    mode: settings.value.translationMode,
    overwrite: settings.value.translationOverwrite,
    sourceLanguage: settings.value.translationFrom,
    targetLanguages: settings.value.translationTo,
  } as TranslatePayload);
}

function hint(): string {
  return `${settings.value.translationFrom} -> ${settings.value.translationTo.join(', ')} (${settings.value.translationEngine})${settings.value.translationMode === 'all' ? ' | All' : ''}${settings.value.translationOverwrite ? ' | Overwrite empty' : ''}`;
}

function xOptionSelectedWarningMessage(option: string): string {
  return `The "${option}" option is selected, this will overwrite ALL your keys, are you sure?`;
}
</script>

<style lang="scss">
  .translate-panels {
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  }

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
      color: rgb(var(--v-theme-error)) !important;
    }
  }
</style>
