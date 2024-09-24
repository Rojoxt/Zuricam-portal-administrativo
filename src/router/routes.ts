// src/router/routes.ts

import { createRouter, createWebHistory } from 'vue-router';

// Importa tus componentes aquí
const AuthRoutes = {
  path: '/auth',
  component: () => import('@/layouts/blank/BlankLayout.vue'),
  meta: {
    requiresAuth: false
  },
  children: [
    {
      name: 'LandingPage',
      path: '/',
      component: () => import('@/security-management/views/LoginPage.vue')
    },
    {
      name: 'Login',
      path: '/auth/login',
      component: () => import('@/security-management/views/LoginPage.vue')
    },
    {
      name: 'ForgotPassword',
      path: '/auth/forgot-password',
      component: () => import('@/security-management/views/ForgotPasswordPage.vue')
    },
    {
      name: 'Error 404',
      path: '/pages/error',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    }
  ]
};

const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: false
  },
  redirect: '/main/dashboard/default',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      name: 'DriverManagement',
      path: '/driver-management',
      component: () => import('@/unit-management/views/DriverManagementView.vue')
    },
    // Agrega el resto de tus rutas aquí...
  ]
};

const routes = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
  },
  AuthRoutes,
  MainRoutes
];

// Crea el router aquí
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
