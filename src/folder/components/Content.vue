<template>
  <div class="content">
    <v-card class="my-4 pa-0" v-for="(item, index) in content" :key="item.language">
      <v-row align="center">
        <v-col cols="1">
          <div class="item-index">{{ index + 1 }}</div>
        </v-col>
        <v-col>
          <v-textarea
            v-model="item.value"
            :label="getLanguageLabel(item.language)"
            placeholder=" "
            :tabindex="index"
            class="item-input"
            :base-color="itemStatusColor(item, originalContent[index])"
            :color="itemStatusColor(item, originalContent[index])"
            hide-details
            rows="1"
            auto-grow
            density="compact"
            @keyup="onChange($event, item.languageIndex)"
            @blur="onChange.flush()"
          />
        </v-col>
        <v-col cols="1">
          <v-menu max-height="90vh">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="text" tabindex="-1">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item disabled title="Translate from" />

              <v-list-item
                v-for="languageItem in contextLanguageList"
                :key="languageItem.language"
                :title="getLanguageLabel(languageItem.language)"
                :disabled="languageItem.disabled || languageItem.language === item.language"
                @click="translate(languageItem.language, item.language)"
              />
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import _ from 'lodash';

import { LoadedPath } from '@common/types';
import { getLanguageLabel } from '../utils/language';
import { getContentFromPath } from '../utils/files';
import {
  ChangeFolderValuePayload,
  ContentItem,
  LanguageListItem,
  TranslatePayload,
  TreeItem,
} from '../types';

const props = defineProps<{
  selectedItem?: TreeItem | null;
  isTranslationEnabled?: boolean;
  folder: LoadedPath[];
  originalFolder: LoadedPath[];
  languageList: LanguageListItem[];
}>();

const emit = defineEmits<{
  (e: 'update-value', payload: ChangeFolderValuePayload): void;
  (e: 'translate', payload: TranslatePayload): void;
}>();

const { content, originalContent, refreshContent } = useContent();
const { contextLanguageList, updateLanguageList } = useContextLanguageList();

watch(
  [() => props.folder, () => props.selectedItem, () => props.languageList],
  () => {
    refreshContent(props.folder, props.originalFolder, props.selectedItem ?? undefined);
    updateLanguageList(props.languageList, content);
  },
  { immediate: true },
);

function updateValue(event: any, index: number): void {
  emit('update-value', {
    index,
    value: event.target.value,
    itemId: props.selectedItem!.id,
  } as ChangeFolderValuePayload);
}

// debounce: trailing-edge fires the last value (throttle dropped it).
const onChange = _.debounce(updateValue, 300, { leading: false, trailing: true });

function translate(sourceLanguage: string, targetLanguage: string): void {
  emit('translate', {
    mode: 'this',
    overwrite: true,
    sourceLanguage,
    targetLanguages: [targetLanguage],
  } as TranslatePayload);
}

function itemStatusColor(item: ContentItem, originalItem?: ContentItem): string | undefined {
  if (item.value !== undefined && originalItem?.value === undefined) return 'success';

  if (item.value && item.value !== originalItem?.value) return 'warning-darken-1';

  if (!item.value) return 'error';

  return undefined;
}

function useContent() {
  const content = ref<ContentItem[]>([]);
  const originalContent = ref<ContentItem[]>([]);

  function refreshContent(
    folder: LoadedPath[],
    originalFolder: LoadedPath[],
    selectedItem?: TreeItem,
  ): void {
    if (!selectedItem || selectedItem.type !== 'item') {
      content.value = [];
      originalContent.value = [];
      return;
    }

    const next = getContentFromPath(folder, selectedItem.path);
    originalContent.value = getContentFromPath(originalFolder, selectedItem.path);

    // Mutate existing items in place when the shape matches so v-model
    // bindings (and the active textarea cursor) survive folder updates
    // triggered by our own debounced edits or by translation results.
    const current = content.value;
    const sameShape =
      current.length === next.length &&
      current.every((it, i) => it.language === next[i].language);

    if (sameShape) {
      for (let i = 0; i < next.length; i++) {
        if (current[i].value !== next[i].value) {
          current[i].value = next[i].value;
        }
      }
    } else {
      content.value = next;
    }
  }

  return { content, originalContent, refreshContent };
}

function useContextLanguageList() {
  const contextLanguageList = ref<LanguageListItem[]>([]);

  function updateLanguageList(languageList: LanguageListItem[], content: Ref<ContentItem[]>): void {
    const contentLanguages = content.value.map(it => it.language);
    contextLanguageList.value = languageList.filter(it => contentLanguages.includes(it.language));
  }

  return { contextLanguageList, updateLanguageList };
}
</script>

<style lang="scss">
  .item-index {
    box-sizing: content-box;
    margin: 0 16px;
    padding: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    line-height: 32px;
    text-align: center;
    background-color: rgb(var(--v-theme-primary));
    color: #ffffff;
  }
</style>
