<template>
  <el-menu
    router
    :default-active="disActive"
    :active-text-color="variables.menuActiveText"
    :collapse="isCollapse"
    class="el-menu-vertical"
  >
    <Menu v-for="item in menu" :key="item.name" :item="item"></Menu>
  </el-menu>
</template>
<script lang="ts" setup>
import variables from '@/assets/style/variables.module.scss'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'
import { useAdminStore } from '@/stores/admin'
import Menu from './menu.vue'

const appStore = useAppStore()
const { isCollapse } = storeToRefs(appStore)
const route = useRoute()
const disActive = computed(() => {
  return route.path
})
const adminStore = useAdminStore()
const menu = computed(() => {
  return adminStore.state.menu
})
</script>
