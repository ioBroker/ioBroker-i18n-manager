import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/home/views/Home.vue';
import Folder from '@/folder/views/Folder';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/folder',
    name: 'folder',
    component: Folder,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
