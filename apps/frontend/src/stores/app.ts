import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const state = reactive({
    collapse: false,
  })

  const disCollapse = () => {
    state.collapse = !state.collapse
    console.log(state.collapse)
  }
  const isCollapse = computed(() => state.collapse)

  return { disCollapse, isCollapse }
})
