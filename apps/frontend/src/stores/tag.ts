import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import router from '@/router/index'

export const useTagStore = defineStore(
  'tag',
  () => {
    const tagList = ref<RouteLocationNormalizedLoadedGeneric[]>([])
    const addTag = (tag: RouteLocationNormalizedLoadedGeneric) => {
      // 重复的和标记为ignore的不加入tags
      if (!tagList.value.some((item) => item.path === tag.path) && tag.meta.title !== 'ignore') {
        tagList.value.push(tag)
      }
      if (tagList.value.length > 10) {
        tagList.value.splice(1, 1)
      }
    }

    const closeTag = (path: string, routePath: string) => {
      const agIndex: number = tagList.value.findIndex((item) => item.path === path)
      if (agIndex !== -1) {
        tagList.value.splice(agIndex, 1)

        if (path === routePath && tagList.value.length >= 1) {
          const pushTag = tagList.value[agIndex] ? agIndex : agIndex - 1

          const targetTag = tagList.value[pushTag]
          if (targetTag) {
            router.push(targetTag.path)
          }
        }
      }
    }

    const clearTags = () => {
      tagList.value = []
      localStorage.removeItem('tag')
    }
    return {
      tagList,
      addTag,
      closeTag,
      clearTags,
    }
  },
  { persist: true }
)
