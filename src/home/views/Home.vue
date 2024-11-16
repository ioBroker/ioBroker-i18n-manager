<template>
  <div class="home">
    <v-row style="height: 100%">
      <v-col cols="7" style="height: 100%">
        <v-card style="height: 100%">
          <v-card-title>Recent folders</v-card-title>

          <v-list style="height: calc(100% - 64px); overflow: auto">
            <v-list-item
              v-for="folder in recentFolders"
              :key="folder.fullPath"
              @click="openFolder(folder)"
              two-line
            >
              <v-list-item-content>
                <v-list-item-title>{{ folder.folder }}</v-list-item-title>
                <v-list-item-subtitle>{{ folder.fullPath }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col>
        <v-card>
          <v-card-title>ioBroker edition Version</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api';
  import { useNamespace } from '@/store/utils';
  import { sendIpc } from '@/store/plugins/ipc';
  import { FormattedFolderPath } from '@common/types';
  import * as ipcMessages from '@common/ipcMessages';
  import RemoteLink from '@/components/RemoteLink.vue';

  export default defineComponent({
    name: 'Home',
    components: {
      RemoteLink,
    },
    setup() {
      const homeModule = useNamespace('home');
      const recentFolders = homeModule.useState<FormattedFolderPath[]>('recentFolders');
      // const checkVersion = homeModule.useAction('checkVersion');
      const currentVersion = homeModule.useState<string>('currentVersion');
      const latestVersion = homeModule.useState<string>('latestVersion');

      function openFolder(folder: FormattedFolderPath) {
        sendIpc(ipcMessages.open, folder.fullPath);
      }

      sendIpc(ipcMessages.recentFolders);
      // checkVersion();

      return {
        recentFolders,
        openFolder,
        currentVersion,
        latestVersion,
      };
    },
  });
</script>

<style lang="scss">
  .home {
    padding: 0 8px;
    height: 100%;
  }

  .gh-star {
    color: #24292e !important;
    background-color: #eff3f6;
    background-image: linear-gradient(180deg, #fafbfc, #eff3f6 90%);
    border-radius: 0.25em;
    padding: 2px 5px;
    font-size: 11px;
    font-weight: 600;
    line-height: 14px;
    user-select: none;
    border: 1px solid rgba(27, 31, 35, 0.2);
    text-decoration: none;
    outline: 0;
    margin-left: 8px;

    svg {
      width: 12.25px;
      height: 14px;
      display: inline-block;
      vertical-align: text-top;
      fill: currentColor;
    }
  }
</style>
