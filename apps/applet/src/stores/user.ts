import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore(
  'user',
  () => {
    const state = reactive({
      //用户登录后的用户信息
      userData: {},
      token: storage.getItem('token') || '',
    })
    //设置用户信息
    const setUserData = (userData: any) => {
      state.userData = userData
    }
    //存储token
    const setToken = (token: string) => {
      storage.setItem('token', token)
    }
    //获取token
    const getToken = () => {
      return state.token
    }
    return {
      state,
      setUserData,
      setToken,
      getToken,
    }
  },
  {
    persist: {
      storage,
    },
  }
)
