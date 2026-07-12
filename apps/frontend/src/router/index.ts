import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue'
import { useTagStore } from '@/stores/tag'
import { useAdminStore } from '@/stores/admin'
import { profileApi } from '@/api/auth'

const routes: RouteRecordRaw[] = [
  {
    name: 'layout',
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [],
    meta: {
      title: 'ignore', //设置ignore不加入tags
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'ignore',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 标志位：防止重复初始化
let isRoutesInitialized = false

router.beforeEach(async (to) => {
  const adminStore = useAdminStore()

  // 如果路由还未初始化，先初始化
  if (!isRoutesInitialized) {
    adminStore.init()
    isRoutesInitialized = true
    return { path: to.fullPath, replace: true }
  }
  //验证token是否过期,过期后由axios拦截器处理
  if (to.path !== '/login') {
    await profileApi()
  }
  return
})

// 路由后置守卫：添加标签
router.afterEach((to) => {
  const tagStore = useTagStore()
  tagStore.addTag(to)
})

export default router
