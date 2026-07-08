<template>
  <!-- 没有子菜单：显示普通菜单项 -->
  <el-menu-item v-if="!item.children || item.children.length === 0" :index="item.path">
    <el-icon v-if="item.meta.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <span>{{ item.meta.title }}</span>
  </el-menu-item>

  <!-- 有子菜单：显示子菜单 -->
  <el-sub-menu v-else :index="item.path">
    <template #title>
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>

    <!-- 递归渲染子菜单项 -->
    <Menu v-for="child in item.children" :key="child.name" :item="child" />
  </el-sub-menu>
</template>

<script setup lang="ts">
import type { MenuItem } from '@campus/types'
import Menu from './menu.vue'

defineProps<{
  item: MenuItem
}>()
</script>
<style scoped lang="scss">
:deep(.el-menu-item.is-active) {
  background-color: #2fa2dc;
  color: white;
}
</style>
