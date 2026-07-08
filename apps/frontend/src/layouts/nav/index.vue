<template>
  <div class="container">
    <section><Collapse></Collapse></section>
    <div class="tag-container"><Tag></Tag></div>
  </div>
</template>
<script setup lang="ts">
import Collapse from '@/components/Collapse/index.vue'
import Tag from './tag.vue'
</script>
<style lang="scss" scoped>
@use '../../assets/style/variables.module.scss' as *;
.container {
  display: flex;
  align-items: center;
  gap: 10px;
  section {
    box-shadow: 1px 0 1px $menuText;
  }
  .tag-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>
