import { PermissionCode, UserRole } from '@campus/types'
import { getPermissionsByRole, hasPermission } from '@campus/utils'
import { useAdminStore } from './admin'

export const usePermissionStore = defineStore(
  'premission',
  () => {
    const state = reactive({
      permissions: [] as PermissionCode[],
    })

    /**
     * 获取当前用户获取权限列表
     */
    const setPermissions = (role: UserRole) => {
      state.permissions = getPermissionsByRole(role)
      localStorage.setItem('permissions', JSON.stringify(state.permissions))
    }

    /**
     * 检查角色是否拥有指定权限
     */
    const checkPermission = (code: PermissionCode | PermissionCode[]) => {
      const adminState = useAdminStore()
      return hasPermission(adminState.state.role, code)
    }

    /**
     * 清除
     */
    const clear = () => {
      state.permissions = []
      localStorage.removeItem('permissions')
    }

    return {
      state,
      setPermissions,
      checkPermission,
      clear,
    }
  },
  {
    persist: true,
  }
)
