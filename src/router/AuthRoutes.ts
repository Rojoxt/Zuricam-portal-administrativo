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

export default AuthRoutes;
