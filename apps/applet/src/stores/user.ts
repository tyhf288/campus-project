import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { storage } from '@/utils/storage'
import { UserVO } from '@campus/types'

export const useUserStore = defineStore(
  'user',
  () => {
    const state = reactive({
      //用户登录后的用户信息
      userData: {} as UserVO,
      token: storage.getItem('token') || '',
    })
    //设置用户信息
    const setUserData = (userData: UserVO) => {
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
