<template>
  <div>
    <v-menu v-model="isOpened" :target="[positionX, positionY]">
      <v-list>
        <v-list-item v-if="hasChildren()" @click="addItem">
          <v-list-item-title>Add Item</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="hasChildren()" @click="addNode">
          <v-list-item-title>Add Node</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isItemOrNode()" @click="copyItem">
          <v-list-item-title>Copy</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isItemOrNode()" @click="cutItem">
          <v-list-item-title>Cut</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isItemOrNode()" @click="duplicateItem">
          <v-list-item-title>Duplicate</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isFileOrNode() && clipboardItemId" @click="pasteItem">
          <v-list-item-title>Paste</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isItemOrNode()" @click="renameItem">
          <v-list-item-title>Rename</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isItemOrNode()" @click="deleteItem">
          <v-list-item-title>Delete</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isItemOrNode()" @click="copyItemPath">
          <v-list-item-title>Copy path</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="isDialogVisible" eager width="500" @keydown.esc="cancelAction">
      <v-card class="px-0 d-flex flex-column">
        <v-card-title>{{ actionTitle }}</v-card-title>

        <v-card-text>
          <v-text-field
            label="Name"
            ref="itemLabelRef"
            v-model="itemLabel"
            :error-messages="!isValidLabel ? 'There is another item with this name' : ''"
            @keyup.enter="finishAction"
          />
        </v-card-text>

        <v-spacer />

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cancelAction">Cancel</v-btn>
          <v-btn color="primary" @click="finishAction">Ok</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs, watch } from 'vue';

import {
  AddItemPayload,
  ClipboardItemAction,
  DeleteItemPayload,
  PasteItemPayload,
  RenameItemPayload,
  SetClipboardPayload,
  TreeItem,
  TreeMap,
} from '@/folder/types';

const props = defineProps<{
  tree: TreeMap;
  treeItems: TreeItem[];
  clipboardItemId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'send-modified-content'): void;
  (e: 'add-item', payload: AddItemPayload): void;
  (e: 'paste-item', payload: PasteItemPayload): void;
  (e: 'rename-item', payload: RenameItemPayload): void;
  (e: 'delete-item', payload: DeleteItemPayload): void;
  (e: 'set-clipboard', payload: SetClipboardPayload): void;
}>();

const itemLabelRef = ref<any>(null);
const clickedItem = ref<TreeItem | null>(null);
const isDialogVisible = ref(false);
const siblings = ref<TreeItem[]>([]);
const actionTitle = ref('');
const itemLabel = ref('');
const isValidLabel = ref(true);
const finishAction = ref<() => void>(() => undefined);

const menuState = reactive({
  isOpened: false,
  positionX: 0,
  positionY: 0,
});
const { isOpened, positionX, positionY } = toRefs(menuState);

const handleRightClick = (event: MouseEvent, item: TreeItem): void => {
  clickedItem.value = item;
  menuState.positionX = event.clientX;
  menuState.positionY = event.clientY;
  menuState.isOpened = true;
};

const sendModifiedContent = (): void => emit('send-modified-content');

watch([siblings, itemLabel], () => {
  isValidLabel.value = siblings.value.filter(it => it.label === itemLabel.value).length === 0;
});

const getItemType = () => clickedItem.value?.type;
const hasChildren = () => getItemType() !== 'item';
const isItemOrNode = () => getItemType() === 'item' || getItemType() === 'node';
const isFileOrNode = () => getItemType() !== 'folder' && getItemType() !== 'item';

const focusLabelInput = (): void => {
  setTimeout(() => itemLabelRef.value?.focus?.(), 100);
};

const showDialog = (): void => {
  isDialogVisible.value = true;
};
const hideDialog = (): void => {
  isDialogVisible.value = false;
};
const cancelAction = (): void => {
  itemLabel.value = '';
  isValidLabel.value = true;
  hideDialog();
};
finishAction.value = cancelAction;

const addItemStart = (isItem: boolean) => () => {
  finishAction.value = addItemFinish(isItem);
  siblings.value = props.treeItems.filter(it => it.parent === clickedItem.value!.id);
  actionTitle.value = 'Add Item';
  showDialog();
  focusLabelInput();
};
const addItemFinish = (isItem: boolean) => () => {
  if (!isValidLabel.value) {
    return;
  }

  emit('add-item', {
    parent: clickedItem.value,
    label: itemLabel.value,
    isItem,
  } as unknown as AddItemPayload);
  cancelAction();
  sendModifiedContent();
};

const addItem = addItemStart(true);
const addNode = addItemStart(false);

const copyItem = (): void => {
  emit('set-clipboard', {
    item: clickedItem.value,
    action: ClipboardItemAction.copy,
  } as unknown as SetClipboardPayload);
};

const cutItem = (): void => {
  emit('set-clipboard', {
    item: clickedItem.value,
    action: ClipboardItemAction.cut,
  } as unknown as SetClipboardPayload);
};

const duplicateItem = (): void => {
  copyItem();

  finishAction.value = pasteItemFinish;
  siblings.value = props.treeItems.filter(it => it.parent === clickedItem.value!.parent);
  actionTitle.value = 'Duplicate Item';
  itemLabel.value = clickedItem.value!.label;
  clickedItem.value = props.tree[clickedItem.value!.parent];

  showDialog();
  focusLabelInput();
};

const pasteItem = (): void => {
  finishAction.value = pasteItemFinish;
  siblings.value = props.treeItems.filter(it => it.parent === clickedItem.value!.id);
  actionTitle.value = 'Paste Item';
  itemLabel.value = props.tree[props.clipboardItemId!]?.label;

  showDialog();
  focusLabelInput();
};
const pasteItemFinish = (): void => {
  if (!isValidLabel.value) return;

  emit('paste-item', {
    parent: clickedItem.value,
    label: itemLabel.value,
  } as unknown as PasteItemPayload);
  cancelAction();
  sendModifiedContent();
};

const renameItem = (): void => {
  finishAction.value = renameItemFinish;

  siblings.value = props.treeItems.filter(
    it => it.parent === clickedItem.value!.parent && it.id !== clickedItem.value!.id,
  );
  actionTitle.value = 'Rename Item';
  itemLabel.value = clickedItem.value!.label;

  showDialog();
  focusLabelInput();
};
const renameItemFinish = (): void => {
  if (!isValidLabel.value || itemLabel.value === clickedItem.value!.label) return;

  emit('rename-item', {
    item: clickedItem.value,
    label: itemLabel.value,
  } as unknown as RenameItemPayload);
  cancelAction();
  sendModifiedContent();
};

const deleteItem = (): void => {
  if (confirm('Are you sure to delete this item?')) {
    emit('delete-item', {
      item: clickedItem.value,
    } as unknown as DeleteItemPayload);
    sendModifiedContent();
  }
};

const copyItemPath = (): void => {
  let path = '';
  for (let i = 0; i < clickedItem.value!.level; i++) {
    if (i > 0) {
      path = '.'.concat(path);
    }
    path = clickedItem.value!.path[clickedItem.value!.path.length - 1 - i].concat(path);
  }
  void navigator.clipboard.writeText(path);
};

defineExpose({ handleRightClick });
</script>

<style scoped></style>
