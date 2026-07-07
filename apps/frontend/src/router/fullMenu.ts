import type { MenuItem } from '@canpus/types';

export const fullMenu: MenuItem[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '首页',
      icon: 'House',
      roles: ['admin', 'auditor'],
    },
    component: 'dashboard',
  },
  {
    path: '/userManagement',
    name: 'userManagement',
    meta: {
      title: '用户管理',
      icon: 'User',
      roles: ['admin', 'auditor'],
    },
    children: [
      {
        path: '/userManagement/userList',
        name: 'userList',
        component: 'userManagement/userList',
        meta: {
          title: '用户列表',
          icon: 'List',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/userManagement/blickList',
        name: 'blickList',
        component: 'userManagement/blickList',
        meta: {
          title: '黑名单列表',
          icon: 'Failed',
          roles: ['admin', 'auditor'],
        },
      },
    ],
  },
];
