<template>
  <div class="icon-demo">
    <el-icon :size="20"><Expand /></el-icon>
    <el-icon :size="20"><Fold /></el-icon>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="scss">
@use "../../assets/style/variables.module.scss" as *;

:deep(.el-icon) {
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    color: $menuTextActive;
    transform: scale(1.2);
  }
}
</style>
