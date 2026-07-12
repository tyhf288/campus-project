<template>
  <TransitionGroup name="close">
    <div
      v-for="item in tagList"
      :key="item.path"
      class="tag"
      :class="{ activeTag: route.path === item.path }"
      @click="router.push(item.path)"
    >
      <div class="icon"><component :is="item.meta.icon" v-if="item.meta.icon" /></div>

      <p>{{ item.meta.title }}</p>
      <el-icon
        v-if="item.name !== 'dashboard'"
        class="active"
        :size="12"
        @click.stop="closeTag(item.path, route.path)"
        ><Close
      /></el-icon>
    </div>
  </TransitionGroup>
</template>
<script setup lang="ts">
import { useTagStore } from '@/stores/tag'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { Close } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const tagStore = useTagStore()
const { closeTag } = tagStore
const { tagList } = storeToRefs(tagStore)
</script>
<style lang="scss" scoped>
@use '../../assets/style/variables.module.scss' as *;

.close-enter-active,
.close-leave-active {
  transition: opacity 0.5s ease;
}

.close-enter-from,
.close-leave-to {
  opacity: 0;
}
.activeTag {
  background-color: #3a98da;
  color: white;
  .active:not(.activeTag) {
    cursor: pointer;
    &:hover {
      color: rgb(0, 0, 0);
    }
  }
}
.tag {
  display: flex;
  height: var(--nav-tag-height);
  border: 1px solid $menuText;
  box-shadow: 1px 1px 1px 0px $menuText;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 0 5px;
  cursor: pointer; // ✅ 添加指针样式，提示可点击
  .icon {
    width: 12px;
    height: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  p {
    font-size: 14px;
  }
  .active {
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: rgb(60, 151, 255);
      transform: scale(1.5);
    }
  }
}
</style>
