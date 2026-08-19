import type { MenuItem } from '@campus/types'
import type { RouteRecordRaw } from 'vue-router'

// ✅ 使用 eager: false 确保真正的按需加载
const modules = import.meta.glob('@/views/**/index.vue', { eager: false })

export const addMenu = (menu: MenuItem[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []

  menu.forEach((item) => {
    // 有子菜单：递归展开子项，不生成「无组件的中转路由」
    // （否则中间层级没有 component，会导致叶子页面无法渲染）
    if (item.children && item.children.length > 0) {
      routes.push(...addMenu(item.children))
      return
    }

    // 叶子节点：有 component 才生成路由
    const componentPath = item.component as string | undefined
    if (componentPath) {
      routes.push({
        path: item.path,
        name: item.name,
        component: loadView(componentPath),
        meta: {
          title: item.meta.title,
          icon: item.meta.icon,
          roles: item.meta.roles,
        },
      } as RouteRecordRaw)
    }
  })

  return routes

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
    // 注意：module 本身就是 () => import(...)，直接返回函数，不要调用 module()
    return module
  }
}
