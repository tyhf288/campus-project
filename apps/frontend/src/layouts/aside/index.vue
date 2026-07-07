<template>
  <el-menu
    router
    :default-active="disActive"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
    :collapse="isCollapse"
    class="el-menu-vertical"
  >
    <el-menu-item index="dashboard">
      <el-icon><setting /></el-icon>
      <span>首页</span>
    </el-menu-item>
  </el-menu>
</template>
<script lang="ts" setup>
import variables from "@/assets/style/variables.module.scss"
import { useRoute } from "vue-router"
import { computed, ref } from "vue"

const route = useRoute()
const disActive = computed(() => {
  return route.path
})

const isCollapse = ref(true)
</script>
