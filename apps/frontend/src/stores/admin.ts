import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { MenuItem, UserVO, UserRole } from '@campus/types'
import { filterMenuByRoute } from '@campus/utils'
import { addMenu } from '@/router/addMenu'
import { fullMenu } from '@/router/fullMenu'
import router from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const state = reactive({
      role: '' as UserRole,
      menu: [] as MenuItem[], //侧边栏菜单
      user: {} as UserVO,
    })

    //登录后设置角色和user内容
    const setAdmin = (user: UserVO) => {
      state.role = user.role
      state.user = user
      localStorage.setItem('admin', JSON.stringify(state))
    }
    // 注册路由菜单到 router（幂等，重复调用安全）
    const registerRoutes = (menu: MenuItem[]) => {
      const routes = addMenu(menu)
      routes.forEach((item) => {
        if (!router.hasRoute(item.name as string)) {
          router.addRoute('layout', item)
        }
      })
    }

    //登录后设置侧边栏菜单，并同步注册路由
    const setMenu = () => {
      const filteredMenu = filterMenuByRoute(fullMenu, state.role as UserRole)
      state.menu = filteredMenu
      registerRoutes(filteredMenu)
    }

    //设置路由菜单（页面刷新后从持久化菜单恢复路由）
    const init = () => {
      if (state.menu && state.menu.length > 0) {
        registerRoutes(state.menu)
      } else {
        setMenu()
      }
    }

    // 清除数据
    const clearAdmin = () => {
      state.menu = []
      localStorage.removeItem('admin')
      state.role = '' as UserRole
      state.user = {} as UserVO
    }

    return {
      state,
      setMenu,
      init,
      clearAdmin,
      setAdmin,
    }
  },
  {
    // 持久化配置
    persist: true, // 启用默认持久化（所有状态都会保存）
  }
)
