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
      role: '',
      menu: [] as MenuItem[], //侧边栏菜单
      user: {} as UserVO,
    })

    //登录后设置角色和user内容
    const setAdmin = (user: UserVO) => {
      state.role = user.role
      state.user = user
      localStorage.setItem('admin', JSON.stringify(state))
    }
    //登录后只设置侧边栏菜单，路由菜单由路由守卫添加
    const setMenu = () => {
      const filteredMenu = filterMenuByRoute(fullMenu, state.role as UserRole)
      state.menu = filteredMenu
    }

    //设置路由菜单
    const init = () => {
      if (state.menu && state.menu.length > 0) {
        const addMenuToRouter = addMenu(state.menu) //路由菜单不能是响应式结构
        addMenuToRouter.forEach((item) => {
          if (!router.hasRoute(item.name as string)) {
            router.addRoute('layout', item)
          }
        })
      } else {
        setMenu()
      }
    }

    // 清除数据
    const clearAdmin = () => {
      state.menu = []
      localStorage.removeItem('admin')
      state.role = ''
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
