import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SignupView from '@/views/Auth/SignupView.vue';
import LoginView from '@/views/Auth/LoginView.vue';
import { useAuthStore } from '@/stores/authStore';
import CreateView from '@/views/Tasks/CreateView.vue';
import ShowView from '@/views/Tasks/ShowView.vue';
import UpdateView from '@/views/Tasks/UpdateView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { auth: true },
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
      meta: { guest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { auth: true },
    },
    {
      path: '/tasks/:id',
      name: 'show',
      component: ShowView,
      meta: { auth: true },
    },
    {
      path: '/tasks/update/:id',
      name: 'update',
      component: UpdateView,
      meta: { auth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.getUser();
  const guest = to.matched.some((record) => record.meta.guest);

  if (guest && authStore.user) {
    next({ name: 'home' });
  } else if (!guest && !authStore.user) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
