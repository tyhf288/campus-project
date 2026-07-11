import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { MenuItem, AdminRole } from '@campus/types'
import { filterMenuByRoute } from '@campus/utils'
import { addMenu } from '@/router/addMenu'
import { fullMenu } from '@/router/fullMenu'
import router from '@/router/index'

export const useAdminStore = defineStore(
  'admin',
  () => {
    const state = reactive({
      role: 'admin' as AdminRole | null,
      menu: [] as MenuItem[],
    })

    /**
     * 设置菜单并注册路由（首次加载时使用）
     */
    const setMenu = () => {
      const filteredMenu = filterMenuByRoute(fullMenu, state.role as AdminRole)
      state.menu = filteredMenu
      const addMenuToRouter = addMenu(filteredMenu)
      addMenuToRouter.forEach((item) => {
        if (!router.hasRoute(item.name as string)) {
          router.addRoute('layout', item)
        }
      })
    }

    const init = () => {
      if (state.menu && state.menu.length > 0) {
        const addMenuToRouter = addMenu(state.menu)
        addMenuToRouter.forEach((item) => {
          if (!router.hasRoute(item.name as string)) {
            router.addRoute('layout', item)
          }
        })
      } else {
        setMenu()
      }
    }

    return {
      state,
      setMenu,
      init,
    }
  },
  {
    // 持久化配置
    persist: true, // 启用默认持久化（所有状态都会保存）
  }
)
