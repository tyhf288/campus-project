import type { MenuItem } from '@campus/types'
import type { RouteRecordRaw } from 'vue-router'

// ✅ 使用 eager: false 确保真正的按需加载
const modules = import.meta.glob('@/views/**/index.vue', { eager: false })

export const addMenu = (menu: MenuItem[]): RouteRecordRaw[] => {
  return menu.map((item) => {
    // 处理 component 可能为 undefined 的情况
    const componentPath = item.component as string | undefined

    const route: RouteRecordRaw = {
      path: item.path,
      name: item.name,
      component: componentPath ? loadView(componentPath) : undefined,
      meta: {
        title: item.meta.title,
        icon: item.meta.icon,
        roles: item.meta.roles,
      },
    } as RouteRecordRaw

    if (item.children && item.children.length > 0) {
      route.children = addMenu(item.children)
    }

    return route as RouteRecordRaw
  })

  function loadView(viewPath: string) {
    // 构建正确的物理路径
    const fullPath = `/src/views/${viewPath}/index.vue`
    const module = modules[fullPath]

    if (!module) {
      console.error(`未找到组件: ${fullPath}`)
      // 返回一个空组件作为降级处理
      return () => Promise.resolve({ render: () => null })
    }

    // 返回异步导入函数，实现真正的按需加载
    return module()
  }
}
