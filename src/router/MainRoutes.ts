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
    {
      name: 'CameraManagement',
      path: '/camera-management',
      component: () => import('@/camera-management/views/CameraManagementView.vue')
    },
    {
      name: 'UnitManagement',
      path: '/unit-management',
      component: () => import('@/unit-management/views/UnitManagementView.vue')
    },
    {
      name: 'UserManagement',
      path: '/user-management',
      component: () => import('@/user-management/views/UserManagementView.vue')
    },
    {
      name: 'ReportManagement',
      path: '/report-management',
      component: () => import('@/report-management/views/ReportManagementView.vue')
    },

    {
      name: 'Default',
      path: '/dashboard/default',
      component: () => import('@/views/dashboards/default/DefaultDashboard.vue')
    }
  ]
};

export default MainRoutes;
