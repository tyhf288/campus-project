import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { MenuItem, AdminRole } from '@canpus/types';
import { filterMenuByRoute } from '@canpus/utils';
import { addMenu } from '@/router/addMenu';
import { fullMenu } from '@/router/fullMenu';
import router from '@/router/index';

export const useAdminStore = defineStore(
  'admin',
  () => {
    const state = reactive({
      role: 'admin' as AdminRole | null,
      menu: [] as MenuItem[],
    });

    /**
     * 设置菜单并注册路由（首次加载时使用）
     */
    const setMenu = () => {
      const filteredMenu = filterMenuByRoute(fullMenu, state.role as AdminRole);
      state.menu = filteredMenu;
      console.log('菜单过滤完成:', state.menu);
      const addMenuToRouter = addMenu(filteredMenu);
      addMenuToRouter.forEach((item) => {
        if (!router.hasRoute(item.name as string)) {
          router.addRoute('layout', item);
        }
      });

      console.log('动态路由注册完成:', addMenuToRouter.length, '个路由');
    };

    const init = () => {
      if (state.menu && state.menu.length > 0) {
        const addMenuToRouter = addMenu(state.menu);
        addMenuToRouter.forEach((item) => {
          if (!router.hasRoute(item.name as string)) {
            router.addRoute('layout', item);
          }
        });
      } else {
        setMenu();
      }
    };

    return {
      state,
      setMenu,
      init,
    };
  },
  {
    // 持久化配置
    persist: true, // 启用默认持久化（所有状态都会保存）
  },
);
