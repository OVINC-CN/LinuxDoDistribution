import * as vueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/oauth/login/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/oauth/callback/',
    name: 'Callback',
    component: () => import('@/views/OAuth.vue'),
  },
  {
    path: '/virtual_content/receive_history/',
    name: 'VirtualContentReceiveHistory',
    component: () => import('@/views/VirtualContentReceiveHistory.vue'),
  },
  {
    path: '/virtual_content/share/',
    name: 'VirtualContentShare',
    component: () => import('@/views/VirtualContentShare.vue'),
  },
  {
    path: '/virtual_content/stats/',
    name: 'VirtualContentStats',
    component: () => import('@/views/VirtualContentStats.vue'),
  },
  {
    path: '/virtual_content/:id/',
    name: 'VirtualContentDetail',
    component: () => import('@/views/VirtualContentDetail.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: () => import('@/views/Error404.vue'),
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes,
});

export default router;
