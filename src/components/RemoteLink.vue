<template>
  <a href="#" @click.prevent="openLink">
    <slot>
      {{ href }}
    </slot>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  href: string;
}>();

function openLink(): void {
  window.electronAPI.openExternal(props.href);
}
</script>
