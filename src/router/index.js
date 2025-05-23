import * as vueRouter from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/oauth/login/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/oauth/callback/',
    name: 'Callback',
    component: () => import('../views/OAuth.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Notfound',
    component: () => import('../views/Error404.vue'),
  },
];

const router = vueRouter.createRouter({
  history: vueRouter.createWebHistory(),
  routes,
});

export default router;
