import { defineStore } from 'pinia'
import { useAdminStore } from './admin'
import { useTagStore } from './tag'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const state = reactive({
      userToken: localStorage.getItem('token') || '',
    })

    const setUserToken = (token: string) => {
      state.userToken = token
      localStorage.setItem('token', token)
    }

    const getUserToken = () => {
      return state.userToken
    }

    const clearUserToken = () => {
      state.userToken = ''
      localStorage.removeItem('token')
      localStorage.removeItem('auth')
    }

    const logout = () => {
      const adminStore = useAdminStore()
      adminStore.clearAdmin()
      const tagStore = useTagStore()
      tagStore.clearTags()
      clearUserToken()
    }

    return { state, setUserToken, getUserToken, clearUserToken, logout }
  },
  {
    // 持久化配置
    persist: true, // 启用默认持久化（所有状态都会保存）
  }
)
