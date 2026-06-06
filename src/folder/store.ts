import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios, { CancelTokenSource } from 'axios';
import deepEqual from 'fast-deep-equal';
import _ from 'lodash/fp';

import router from '@/router';
import { sendIpc } from '@/ipc';
import * as ipcMessages from '@common/ipcMessages';
import { LoadedPath } from '@common/types';
import { useSettingsStore } from '@/settings/store';

import {
  AddItemPayload,
  ChangeFolderValuePayload,
  ClipboardItemAction,
  DeleteItemPayload,
  LanguageListItem,
  PasteItemPayload,
  RenameItemPayload,
  SetClipboardPayload,
  TranslatePayload,
  TranslationError,
  TranslationProgress,
  TreeItem,
  TreeMap,
} from './types';
import { addItem as addItemToFolder, deleteItem as deleteItemFromFolder, pasteItem as pasteItemInFolder, renameItem as renameItemInFolder } from './utils/files';
import { createLanguageList as buildLanguageList, getLanguageLabel, getLanguagePath } from './utils/language';
import { getTranslationItems, translate as translateText, isIoBroker } from './utils/translate';
import { createTree, createTreeStatus, pathToString, updateTreeStatus as updateTreeStatusUtil } from './utils/tree';

const GOOGLE_TRANSLATE_LANGUAGES_URL =
  'https://translation.googleapis.com/language/translate/v2/languages';

const sortTree = (tree: TreeMap): TreeMap =>
  _.pipe(
    Object.entries,
    _.sortBy(([id]: string[]) => id),
    Object.fromEntries,
  )(tree) as TreeMap;

export const useFolderStore = defineStore('folder', () => {
  const tree = ref<TreeMap>({});
  const folder = ref<LoadedPath[]>([]);
  const originalFolder = ref<LoadedPath[]>([]);
  const selectedItem = ref<TreeItem | null>(null);
  const modifiedContent = ref(false);
  const languageList = ref<LanguageListItem[]>([]);

  const isTranslationEnabled = ref(false);
  const isTranslating = ref(false);
  const translationProgress = ref<TranslationProgress | null>(null);
  const translationErrors = ref<TranslationError[]>([]);

  const clipboardItemId = ref<string | null>(null);
  const clipboardItemAction = ref<ClipboardItemAction | null>(null);

  const isSaving = ref(false);

  // Not part of the reactive state, just kept across the translate run.
  let cancelToken: CancelTokenSource | null = null;
  // Increments on every openFolder/closeFolder so a slow language-list fetch
  // from a previous open doesn't overwrite the current folder's languageList.
  let folderRevision = 0;

  const treeItems = computed<TreeItem[]>(() => Object.values(tree.value));

  function setSelectedItem(item: TreeItem | null): void {
    selectedItem.value = item;
  }

  function setIsTranslating(value: boolean): void {
    isTranslating.value = value;
  }

  function sendModifiedContent(): void {
    sendIpc(ipcMessages.dataChanged, modifiedContent.value);
  }

  async function closeFolder(): Promise<void> {
    folderRevision++;
    await router.push('/');

    tree.value = {};
    folder.value = [];
    originalFolder.value = [];
    selectedItem.value = null;
    modifiedContent.value = false;
    clipboardItemId.value = null;
    clipboardItemAction.value = null;
    sendModifiedContent();
  }

  async function openFolder(loaded: LoadedPath[]): Promise<void> {
    const revision = ++folderRevision;
    folder.value = _.cloneDeep(loaded);
    originalFolder.value = _.cloneDeep(loaded);
    modifiedContent.value = false;

    let newTree: TreeMap = {};
    createTree(newTree, folder.value);
    newTree = sortTree(newTree);
    // Compute the status before committing so reactivity fires once.
    createTreeStatus(newTree, folder.value, folder.value);
    tree.value = newTree;

    await createLanguageList(revision);
    sendModifiedContent();
  }

  async function refreshFolder(loaded: LoadedPath[]): Promise<void> {
    await openFolder(loaded);
  }

  function save(data: unknown): void {
    isSaving.value = true;
    sendIpc(ipcMessages.save, { data, payload: folder.value });
  }

  function saveComplete(_data: unknown): void {
    isSaving.value = false;
  }

  async function refreshTranslationKey(): Promise<void> {
    if (folder.value.length === 0) {
      return;
    }
    await createLanguageList();
  }

  async function createLanguageList(revision: number = ++folderRevision): Promise<void> {
    const { googleTranslateApiKey, translationEngine } = useSettingsStore().settings;

    let supportedLanguages: string[] = [];
    let enabled = false;

    if (googleTranslateApiKey && (translationEngine === 'google' || !translationEngine)) {
      try {
        const supportedLanguagesResponse = await fetch(
          `${GOOGLE_TRANSLATE_LANGUAGES_URL}?key=${googleTranslateApiKey}`,
        );
        const supportedLanguagesBody = await supportedLanguagesResponse.json();

        supportedLanguages = _.get('data.languages', supportedLanguagesBody).map(
          (it: any) => it.language,
        );
        enabled = true;
      } catch (e) {
        enabled = false;
      }
    } else if (translationEngine === 'deeplIoBroker') {
      supportedLanguages = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'ru', 'uk'];
      enabled = true;
    } else if (
      translationEngine === 'awsIoBroker' ||
      translationEngine === 'googleIoBroker' ||
      translationEngine === 'libreIoBroker'
    ) {
      supportedLanguages = ['de', 'en', 'fr', 'es', 'it', 'nl', 'pl', 'pt', 'ru', 'uk', 'zh-CN'];
      enabled = true;
    }
    // 'deepl' and 'aws' (direct providers) are not yet implemented in translate.ts;
    // leave enabled=false so the UI shows "Configure" instead of failing per item.

    // Drop stale results: another openFolder/closeFolder may have happened
    // while we were awaiting the network fetch above.
    if (revision !== folderRevision) {
      return;
    }
    isTranslationEnabled.value = enabled;
    languageList.value = buildLanguageList(tree.value, folder.value, supportedLanguages);
  }

  function updateValue(payload: ChangeFolderValuePayload): void {
    const itemPath = tree.value[payload.itemId].path;

    const path = getLanguagePath(itemPath, payload.index);
    folder.value = _.set(path, payload.value, folder.value);

    modifiedContent.value = !deepEqual(folder.value, originalFolder.value);
  }

  function updateTreeStatus(): void {
    if (!selectedItem.value) {
      return;
    }
    updateTreeStatusUtil(tree.value, folder.value, originalFolder.value, selectedItem.value.id);
  }

  function updateTreeItemStatus(itemId: string): void {
    if (!itemId) {
      return;
    }
    updateTreeStatusUtil(tree.value, folder.value, originalFolder.value, itemId);
  }

  function addTranslationError(error: TranslationError): void {
    translationErrors.value.push(error);
  }

  async function cancelTranslate(): Promise<void> {
    cancelToken?.cancel();
  }

  async function translate(payload: TranslatePayload): Promise<void> {
    // Prevent a second translate from racing the first: cancel the in-flight
    // run before swapping cancelToken so we don't strand the previous loop.
    if (isTranslating.value && cancelToken) {
      cancelToken.cancel();
    }

    const items =
      payload.mode === 'this' && selectedItem.value
        ? [selectedItem.value]
        : Object.values(tree.value).filter(it => it.type === 'item');

    translationErrors.value = [];
    const translationItems = getTranslationItems(addTranslationError, folder.value, items, payload);

    const isFolderFromIoBroker = isIoBroker(folder.value);

    const progress: TranslationProgress = {
      total: translationItems.length,
      current: 0,
      path: [],
      language: '',
      estimatedTimeInMs: 0,
    };

    const updateProgress = _.throttle(1000, () => {
      translationProgress.value = { ...progress };
    });

    updateProgress();
    const runToken = axios.CancelToken.source();
    cancelToken = runToken;
    isTranslating.value = true;

    let totalTime = 0;
    for (let index = 0; index < translationItems.length; index++) {
      const item = translationItems[index];

      progress.current = index + 1;
      progress.path = item.formattedPath;
      progress.language = getLanguageLabel(item.targetLanguage);

      updateProgress();

      if (item.done) {
        continue;
      }

      try {
        const start = new Date().getTime();
        const result = await translateText(
          item.sourceText,
          item.sourceLanguage,
          item.targetLanguage,
          item.formattedPath,
          useSettingsStore().settings,
          runToken,
          isFolderFromIoBroker,
        );
        const end = new Date().getTime();
        totalTime += end - start;

        const meanTime = totalTime / progress.current;
        progress.estimatedTimeInMs = (progress.total - progress.current) * meanTime;

        if (typeof result === 'string') {
          updateValue({
            index: item.index,
            value: result,
            itemId: item.itemId,
          } as ChangeFolderValuePayload);

          updateTreeItemStatus(item.itemId);
        } else if (typeof result === 'object' && (result as Record<string, string>)[item.targetLanguage] !== undefined) {
          const bulk = result as Record<string, string>;
          Object.keys(bulk).forEach(lang => {
            if (lang === item.sourceLanguage) {
              return;
            }
            const translated = bulk[lang];
            if (translated === undefined) {
              return;
            }
            // Apply the bulk result to EVERY item with the same source text +
            // target language, not just the first one. Otherwise duplicate
            // source strings (e.g. "Save" appearing in two keys) would each
            // trigger their own paid API call.
            for (const lItem of translationItems) {
              if (lItem.sourceText === item.sourceText && lItem.targetLanguage === lang) {
                lItem.done = true;
                updateValue({
                  index: lItem.index,
                  value: translated,
                  itemId: lItem.itemId,
                } as ChangeFolderValuePayload);
                updateTreeItemStatus(lItem.itemId);
              }
            }
          });
        } else if (result) {
          addTranslationError(result as TranslationError);
        }
      } catch (e) {
        if (axios.isCancel(e)) {
          isTranslating.value = false;
          break;
        }
        addTranslationError({
          path: item.formattedPath,
          error: (e as Error)?.message ?? String(e),
        });
      }
    }

    updateProgress();
    sendModifiedContent();

    // Only clear cancelToken if no newer translate() has replaced it.
    if (cancelToken === runToken) {
      cancelToken = null;
    }

    if (translationErrors.value.length === 0) {
      setTimeout(() => {
        isTranslating.value = false;
      }, 500);
    }
  }

  function deleteItem({ item }: DeleteItemPayload): void {
    folder.value = deleteItemFromFolder(folder.value, item.path);

    let newTree = _.pipe(
      Object.entries,
      _.filter(([id]: string[]) => id !== item.id && !id.startsWith(`${item.id}.`)),
      _.sortBy(([id]: string[]) => id),
      Object.fromEntries,
    )(Object.assign({}, tree.value)) as TreeMap;

    tree.value = newTree;
    modifiedContent.value = true;

    if (selectedItem.value?.id === item.id) {
      selectedItem.value = null;
    }
  }

  function addItem({ parent, label, isItem }: AddItemPayload): void {
    const path = parent.path.slice();
    path.push(label);

    folder.value = addItemToFolder(folder.value, path, label, isItem);

    let newTree: TreeMap = Object.assign({}, tree.value);
    createTree(newTree, folder.value);
    newTree = sortTree(newTree);

    const newId = pathToString(path);
    updateTreeStatusUtil(newTree, folder.value, originalFolder.value, newId);

    tree.value = newTree;
    modifiedContent.value = true;

    if (isItem) {
      selectedItem.value = newTree[newId];
    }
  }

  function renameItem({ item, label }: RenameItemPayload): void {
    const newPath = item.path.slice();
    newPath.pop();
    newPath.push(label);

    folder.value = renameItemInFolder(folder.value, item.path, newPath);

    let newTree: TreeMap = Object.assign({}, tree.value);
    createTree(newTree, folder.value);
    newTree = _.pipe(
      Object.entries,
      _.filter(([id]: string[]) => id !== item.id && !id.startsWith(`${item.id}.`)),
      _.sortBy(([id]: string[]) => id),
      Object.fromEntries,
    )(newTree) as TreeMap;

    const newId = pathToString(newPath);
    updateTreeStatusUtil(newTree, folder.value, originalFolder.value, newId);

    tree.value = newTree;
    modifiedContent.value = true;
    if (newTree[newId].type === 'item') {
      selectedItem.value = newTree[newId];
    }
  }

  function setClipboard({ item, action }: SetClipboardPayload): void {
    if (!item) {
      clipboardItemId.value = null;
      clipboardItemAction.value = null;
      return;
    }

    clipboardItemId.value = item.id;
    clipboardItemAction.value = action;
  }

  function pasteItem({ parent, label }: PasteItemPayload): void {
    if (!clipboardItemId.value) {
      return;
    }

    const item = tree.value[clipboardItemId.value];

    const newPath = parent.path.slice();
    newPath.push(label);

    folder.value = pasteItemInFolder(folder.value, item.path, newPath);

    let newTree: TreeMap = Object.assign({}, tree.value);

    if (clipboardItemAction.value === ClipboardItemAction.cut) {
      folder.value = deleteItemFromFolder(folder.value, item.path);

      newTree = _.pipe(
        Object.entries,
        _.filter(([id]: string[]) => id !== item.id && !id.startsWith(`${item.id}.`)),
        Object.fromEntries,
      )(newTree) as TreeMap;
    }

    createTree(newTree, folder.value);
    newTree = sortTree(newTree);
    createTreeStatus(newTree, folder.value, originalFolder.value);

    tree.value = newTree;
    modifiedContent.value = true;

    clipboardItemId.value = null;
    clipboardItemAction.value = null;

    const newId = pathToString(newPath);
    if (newTree[newId].type === 'item') {
      selectedItem.value = newTree[newId];
    }
  }

  return {
    // state
    tree,
    folder,
    originalFolder,
    selectedItem,
    modifiedContent,
    languageList,
    isTranslationEnabled,
    isTranslating,
    translationProgress,
    translationErrors,
    clipboardItemId,
    clipboardItemAction,
    isSaving,
    // getters
    treeItems,
    // actions
    setSelectedItem,
    setIsTranslating,
    sendModifiedContent,
    closeFolder,
    openFolder,
    refreshFolder,
    save,
    saveComplete,
    refreshTranslationKey,
    createLanguageList,
    updateValue,
    updateTreeStatus,
    updateTreeItemStatus,
    cancelTranslate,
    translate,
    deleteItem,
    addItem,
    renameItem,
    setClipboard,
    pasteItem,
  };
});
