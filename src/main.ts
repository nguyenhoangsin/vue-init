import { createApp, defineAsyncComponent } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { authGuard, loginGuard } from './services/authService';
import './styles/index.scss';
import App from './views/App.vue';
import Error404 from './views/Error404.vue';
import LoadingOverlay from './views/components/LoadingOverlay.vue';

const Home = defineAsyncComponent({
  loader: () => import('./views/Home.vue'),
  loadingComponent: LoadingOverlay,
  delay: 200,
});

const Login = defineAsyncComponent({
  loader: () => import('./views/Login.vue'),
  loadingComponent: LoadingOverlay,
  delay: 200,
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: App,
      beforeEnter: authGuard,
      children: [
        {
          path: '',
          name: 'HomeRoot',
          component: Home,
        },
        {
          path: 'home',
          name: 'Home',
          component: Home,
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: loginGuard,
    },
    {
      path: '/:catchAll(.*)',
      name: 'Error404',
      component: Error404,
    },
  ],
});

createApp(App).use(createPinia()).use(router).mount('#app');
