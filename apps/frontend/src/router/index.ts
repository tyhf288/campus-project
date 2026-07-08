import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layouts/index.vue'
import { useTagStore } from '@/stores/tag'
import { useAdminStore } from '@/stores/admin'

const routes: RouteRecordRaw[] = [
  {
    name: 'layout',
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 标志位：防止重复初始化
let isRoutesInitialized = false

router.beforeEach((to, from, next) => {
  const adminStore = useAdminStore()

  // 如果路由还未初始化，先初始化
  if (!isRoutesInitialized) {
    adminStore.init()
    isRoutesInitialized = true
    next(to.fullPath)
  }
  next()
})

// 路由后置守卫：添加标签
router.afterEach((to) => {
  const tagStore = useTagStore()
  tagStore.addTag(to)
})

export default router
