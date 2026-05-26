import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueVirtualScroller from 'vue-virtual-scroller';

import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { sendIpc } from '@/ipc';
import { registerIpcListeners } from '@/registerIpc';
import * as ipcMessages from '@common/ipcMessages';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VueVirtualScroller);

app.mount('#app');

registerIpcListeners();
sendIpc(ipcMessages.settings);
