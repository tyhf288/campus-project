<template>
  <div class="collapse-icon">
    <el-icon :size="18" :class="{ 'rotate-180': !isCollapse }" @click="disCollapse">
      <DArrowRight />
    </el-icon>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { isCollapse } = storeToRefs(appStore)
const { disCollapse } = appStore
</script>
<style scoped lang="scss">
@use '../../assets/style/variables.module.scss' as *;

.collapse-icon {
  width: var(--nav-height);
  height: var(--nav-height);
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.el-icon) {
  color: #636363;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    color: $menuTextActive;
    transform: scale(1.2);
  }
}

.rotate-180 {
  transform: rotate(180deg);
  &:hover {
    transform: rotate(180deg) scale(1.2);
  }
}
</style>
