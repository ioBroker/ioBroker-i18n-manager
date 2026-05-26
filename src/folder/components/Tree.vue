<template>
  <div
    class="tree-item"
    :class="{ expanded, selected, copy: isItemBeingCopied(), cut: isItemBeingCut() }"
  >
    <div
      @click="select"
      @click.right="handleRightClick"
      class="label"
      :class="[item.status, item.type]"
      :style="{ paddingLeft: `${item.level * 16 + 8}px` }"
    >
      <v-icon class="folder-arrow">
        mdi-menu-right
      </v-icon>

      <v-icon>{{ icon }}</v-icon>

      <v-tooltip location="bottom" open-delay="1000" color="rgba(0, 0, 0, 1)">
        <template v-slot:activator="{ props: tooltipProps }">
          <span class="item-name" v-bind="tooltipProps">
            {{ !item.level && item.label === 'Unknown Prefix' ? 'i18n': item.label }}
          </span>
        </template>

        {{ !item.level && item.label === 'Unknown Prefix' ? 'i18n': item.label }}
      </v-tooltip>

      <span v-if="item.missingCount > 0" class="badge missing-count" title="Missing items" @click="onMissingCount">
        {{ item.missingCount }}
      </span>
      <span v-if="item.duplicatedCount > 0" class="badge duplicated-count" title="Duplicated items" @click="onDuplicatedCount">
        {{ item.duplicatedCount }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { ClipboardItemAction, TreeItem } from '../types';

const props = defineProps<{
  item: TreeItem;
  selectedItem?: TreeItem | null;
  expanded?: boolean;
  hasCopiedItem?: boolean;
  clipboardItemId?: string | null;
  clipboardItemAction?: ClipboardItemAction | null;
}>();

const emit = defineEmits<{
  (e: 'select', item: TreeItem): void;
  (e: 'right-click', event: MouseEvent, item: TreeItem): void;
}>();

const icon = getIcon(props.item);

const selected = ref(false);
const select = (): void => emit('select', props.item);

watch(
  () => props.selectedItem,
  item => {
    selected.value = item?.id === props.item?.id;
  },
);

const handleRightClick = (event: MouseEvent): void => emit('right-click', event, props.item);

const onMissingCount = (event: MouseEvent): void => {
  if (!props.item.level) {
    event.stopPropagation();
    window.postMessage('missing', '*');
  }
};

const onDuplicatedCount = (event: MouseEvent): void => {
  if (!props.item.level) {
    event.stopPropagation();
    window.postMessage('duplicated', '*');
  }
};

const isClipboardItem = (): boolean => props.item.id === props.clipboardItemId;
const isItemBeingCopied = (): boolean =>
  isClipboardItem() && props.clipboardItemAction === ClipboardItemAction.copy;
const isItemBeingCut = (): boolean =>
  isClipboardItem() && props.clipboardItemAction === ClipboardItemAction.cut;

function getIcon(item: TreeItem): string {
  switch (item.type) {
    case 'folder':
      return 'mdi-folder-outline';
    case 'file':
      return 'mdi-file-document-outline';
    case 'node':
      return 'mdi-menu';
    case 'item':
    default:
      return 'mdi-minus';
  }
}
</script>

<style scoped lang="scss">
  .tree-item {
    --selected-background-color: #f0f2f5;
    min-width: 100%;

    border: 2px solid transparent;

    &.selected {
      .label {
        background-color: var(--selected-background-color);
      }
    }

    &.expanded {
      .folder-arrow {
        transform: rotate(45deg);
      }
    }

    &.copy {
      border: 2px solid rgb(var(--v-theme-primary));
    }

    &.cut {
      border: 2px dashed rgb(var(--v-theme-primary));
    }

    .label {
      display: flex;
      flex-direction: row;
      padding: 8px;
      cursor: pointer;

      > .v-icon {
        margin-right: 8px;
      }

      &:hover {
        background-color: var(--selected-background-color);
      }

      &.item {
        .folder-arrow {
          opacity: 0;
        }
      }

      &.missing {
        color: rgb(var(--v-theme-error));
      }

      &.changed {
        color: rgb(var(--v-theme-warning-darken-1));
      }

      &.new {
        color: rgb(var(--v-theme-success));
      }
    }

    .folder-arrow {
      transform: rotate(0);
    }

    .badge {
      $size: 24px;
      width: auto;
      height: $size;
      min-width: $size;

      border-radius: 12px;
      line-height: 16px;
      padding: 4px;

      text-align: center;
      font-size: 14px;

      margin-left: 8px;
    }

    .missing-count {
      background-color: rgb(var(--v-theme-error));
      color: #ffffff;
    }

    .duplicated-count {
      background-color: rgb(var(--v-theme-warning));
      color: #ffffff;
    }

    .item-name {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
</style>
