import type { MenuItem } from '@campus/types'

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
  {
    path: '/goodsManage',
    name: 'goodsManage',
    meta: {
      title: '二手商品管理',
      icon: 'ShoppingBag',
      roles: ['admin', 'auditor'],
    },
    children: [
      {
        path: '/goodsManage/goodsAudit',
        name: 'goodsAudit',
        component: 'goodsManage/goodsAudit',
        meta: {
          title: '商品审核',
          icon: 'DocumentCheck',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/goodsManage/goodsAll',
        name: 'goodsAll',
        component: 'goodsManage/goodsAll',
        meta: {
          title: '全部商品',
          icon: 'List',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/goodsManage/category',
        name: 'goodsCategory',
        component: 'goodsManage/category',
        meta: {
          title: '分类管理',
          icon: 'Menu',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/postManage',
    name: 'postManage',
    meta: {
      title: '校园墙管理',
      icon: 'Document',
      roles: ['admin', 'auditor'],
    },
    children: [
      {
        path: '/postManage/postAudit',
        name: 'postAudit',
        component: 'postManage/postAudit',
        meta: {
          title: '帖子审核',
          icon: 'DocumentCheck',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/postManage/postAll',
        name: 'postAll',
        component: 'postManage/postAll',
        meta: {
          title: '全部帖子',
          icon: 'List',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/postManage/comment',
        name: 'comment',
        component: 'postManage/comment',
        meta: {
          title: '评论管理',
          icon: 'ChatDotRound',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/postManage/board',
        name: 'board',
        component: 'postManage/board',
        meta: {
          title: '板块配置',
          icon: 'Tickets',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/reportManage',
    name: 'reportManage',
    meta: {
      title: '举报工单',
      icon: 'Warning',
      roles: ['admin', 'auditor'],
    },
    children: [
      {
        path: '/reportManage/pending',
        name: 'reportPending',
        component: 'reportManage/pending',
        meta: {
          title: '待处理举报',
          icon: 'Clock',
          roles: ['admin', 'auditor'],
        },
      },
      {
        path: '/reportManage/history',
        name: 'reportHistory',
        component: 'reportManage/history',
        meta: {
          title: '举报记录',
          icon: 'DocumentCopy',
          roles: ['admin', 'auditor'],
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统设置',
      icon: 'Setting',
      roles: ['admin'],
    },
    children: [
      {
        path: '/system/sensitive',
        name: 'sensitive',
        component: 'system/sensitive',
        meta: {
          title: '敏感词管理',
          icon: 'Delete',
          roles: ['admin'],
        },
      },
      {
        path: '/system/banner',
        name: 'banner',
        component: 'system/banner',
        meta: {
          title: '轮播公告',
          icon: 'Picture',
          roles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/log',
    name: 'log',
    meta: {
      title: '系统日志',
      icon: 'DocumentCopy',
      roles: ['admin'],
    },
    children: [
      {
        path: '/log/adminLog',
        name: 'adminLog',
        component: 'log/adminLog',
        meta: {
          title: '操作日志',
          icon: 'List',
          roles: ['admin'],
        },
      },
      {
        path: '/log/userViolate',
        name: 'userViolate',
        component: 'log/userViolate',
        meta: {
          title: '违规日志',
          icon: 'Warning',
          roles: ['admin'],
        },
      },
    ],
  },
]
