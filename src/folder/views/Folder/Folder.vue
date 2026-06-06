<template>
  <div class="folder">
    <div class="folder-toolbar">
      <v-select
        id="treeVisibilityFilter"
        v-model="treeVisibilityFilter"
        :items="treeVisibilityFilterOptions"
        item-value="value"
        item-title="label"
        label="Show"
        density="compact"
        hide-details
        class="show-select"
      />
      <v-text-field
        v-model="treeFilter"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        hide-details
        class="search-field"
        @update:model-value="() => filterTree()"
      />
      <v-btn
        v-if="isFolders()"
        color="white"
        variant="tonal"
        @click="onConvert"
      >
        Convert folders
      </v-btn>
    </div>
    <div class="main">
      <div class="tree-pane">
        <v-card class="left-card">
          <RecycleScroller
            :items="expandedTreeItems"
            :item-size="44"
            key-field="id"
            class="tree-scroller"
            v-slot="{ item }"
          >
            <Tree
              :key="item.id"
              :item="item"
              :selected-item="selectedItem"
              :expanded="isParentExpanded(item)"
              :clipboard-item-id="clipboardItemId"
              :clipboard-item-action="clipboardItemAction"
              @select="selectItem"
              @right-click="handleItemRightClick"
            />
          </RecycleScroller>
        </v-card>
      </div>
      <div class="content-pane">
        <div class="translate-wrap">
          <Translate
            :language-list="languageList"
            :is-translation-enabled="isTranslationEnabled"
            :selected-item="selectedItem"
            @showSettings="showSettings"
            @translate="translate"
          />
        </div>
        <div class="content-wrap">
          <Content
            :selected-item="selectedItem"
            :folder="folder"
            :original-folder="originalFolder"
            :language-list="languageList"
            :is-translation-enabled="isTranslationEnabled"
            @update-value="updateFolderValue"
            @translate="translate"
          />
        </div>
      </div>
    </div>
    <v-row class="status-bar">
      <v-col class="pb-0 pt-2">
        <v-card
          rounded="0"
          class="d-flex align-center"
        >
          <div
            class="status-item animate"
            v-if="isSaving"
          >
            <v-icon>mdi-content-save-outline</v-icon>
          </div>
          <div
            class="status-item"
            v-if="!isSaving && selectedItem"
          >
            <template v-for="(part, index) in selectedItemPath(selectedItem)" :key="index">
              <span>{{ part }}</span>
              <span><v-icon v-if="index < selectedItemPath(selectedItem).length - 1">mdi-arrow-right</v-icon></span>
            </template>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <TranslationProgressPanel
      :is-translating="isTranslating"
      :translation-progress="translationProgress"
      :translation-errors="translationErrors"
      @setIsTranslating="setIsTranslating"
      @cancelTranslate="cancelTranslate"
    />

    <ContextMenu
      ref="contextMenuRef"
      :tree="tree"
      :tree-items="treeItems"
      :clipboard-item-id="clipboardItemId"
      @add-item="onAddItem"
      @paste-item="onPasteItem"
      @rename-item="renameItem"
      @delete-item="deleteItem"
      @send-modified-content="sendModifiedContent"
      @set-clipboard="setClipboard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import {
  AddItemPayload,
  ChangeFolderValuePayload,
  PasteItemPayload,
  TreeItem,
} from '@/folder/types';
import { LoadedGroup } from '@common/types';
import { useFolderStore } from '@/folder/store';
import { useGlobalStore } from '@/store/global';
import useTree from './compositions/tree';

import Content from '../../components/Content.vue';
import Translate from '../../components/Translate.vue';
import TranslationProgressPanel from '../../components/TranslationProgressPanel.vue';
import Tree from '../../components/Tree.vue';
import ContextMenu from '../../components/ContextMenu.vue';
import { sendIpc } from '@/ipc';
import { convert } from '@common/ipcMessages';

const globalStore = useGlobalStore();
const folderStore = useFolderStore();

const {
  tree,
  treeItems,
  folder,
  originalFolder,
  selectedItem,
  languageList,
  isTranslationEnabled,
  isTranslating,
  translationProgress,
  translationErrors,
  isSaving,
  clipboardItemId,
  clipboardItemAction,
} = storeToRefs(folderStore);

const showSettings = (): void => globalStore.showSettings();

const treeComposition = useTree(tree, treeItems, folder);
const {
  treeFilter,
  treeVisibilityFilter,
  treeVisibilityFilterOptions,
  expandedTreeItems,
  expandTreeNode,
  toggleTreeNode,
  isParentExpanded,
  filterTree,
} = treeComposition;

const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null);

function onConvert(): void {
  const first = folder.value[0] as LoadedGroup | undefined;
  const files = first?.items?.map(item => ({
    path: item.filePath,
    language: item.language,
  })) ?? [];
  if (files.length === 0) return;
  sendIpc(convert, files);
}

function isFolders(): boolean {
  const first = folder.value[0] as LoadedGroup | undefined;
  return !!first?.items.find(item => item.filePath.match(/translations\.json$/));
}

function selectItem(item: TreeItem): void {
  folderStore.setSelectedItem(item);
  if (item.type !== 'item') {
    toggleTreeNode(item);
  }
}

function updateFolderValue(payload: ChangeFolderValuePayload): void {
  folderStore.updateValue(payload);
  folderStore.updateTreeStatus();
  folderStore.sendModifiedContent();
}

function onAddItem(payload: AddItemPayload): void {
  folderStore.addItem(payload);
  expandTreeNode(payload.parent);
}

function onPasteItem(payload: PasteItemPayload): void {
  folderStore.pasteItem(payload);
  expandTreeNode(payload.parent);
}

function handleItemRightClick(event: MouseEvent, item: TreeItem): void {
  contextMenuRef.value?.handleRightClick(event, item);
}

function selectedItemPath(item: TreeItem): any[] {
  return item.path.slice(item.path.length - item.level, item.path.length);
}

// Actions forwarded to the template / child components.
const translate = folderStore.translate;
const cancelTranslate = folderStore.cancelTranslate;
const setIsTranslating = folderStore.setIsTranslating;
const renameItem = folderStore.renameItem;
const deleteItem = folderStore.deleteItem;
const setClipboard = folderStore.setClipboard;
const sendModifiedContent = folderStore.sendModifiedContent;
</script>

<style scoped lang="scss">
.folder {
  height: 100vh;
}

.folder-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 64px;
  padding: 0 16px;
  background-color: rgb(var(--v-theme-primary));

  // White text/icons/labels on the blue toolbar
  :deep(.v-field__input),
  :deep(.v-field__input input),
  :deep(input),
  :deep(.v-label),
  :deep(.v-field-label),
  :deep(.v-select__selection-text),
  :deep(.v-icon) {
    color: #ffffff !important;
    opacity: 1;
  }

  :deep(input::placeholder) {
    color: #ffffff;
    opacity: 0.85;
  }

  // Underline of the filled fields
  :deep(.v-field__outline::before) {
    border-color: rgba(255, 255, 255, 0.7);
  }
  :deep(.v-field__outline::after) {
    border-color: #ffffff;
  }
}

.show-select {
  flex: 0 0 220px;
  max-width: 220px;
}

.search-field {
  flex: 1 1 auto;
}

.main {
  display: flex;
  gap: 8px;
  height: calc(100vh - 64px - 46px - 8px);
  margin-top: 8px;
  padding-right: 8px;
}

.tree-pane {
  flex: 0 0 33%;
  min-width: 0;
  height: 100%;
  padding-bottom: 4px;
  outline: 3px solid red;
}

.left-card {
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;

  height: 100%;
  display: flex;
  flex-direction: column;
}

.tree-scroller {
  height: 100%;
}

.content-pane {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  outline: 3px solid lime;
}

.translate-wrap {
  margin-bottom: 16px;
}

.content-wrap {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.status-bar {
  .v-card {
    height: 30px;
  }

  .status-item {
    padding: 0 8px;
    &.animate {
      animation: status-animation 2s infinite;
    }
  }
}

@keyframes status-animation {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>

<style lang="scss">
.tree-container {
  .tree-scroller {
    > div {
      overflow: visible;
    }
  }
}
.light-button {
  color: black;
}
</style>
