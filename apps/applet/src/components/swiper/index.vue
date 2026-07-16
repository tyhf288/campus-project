<template>
  <swiper
    class="swiper"
    :style="{ height: '320rpx' }"
    circular
    :indicator-dots="true"
    indicator-color="rgb(255,255,255)"
    indicator-active-color="#C0C4CC"
    :autoplay="true"
    :interval="5000"
    :duration="500"
  >
    <swiper-item class="swiper-item" v-for="item in swiperImg" :key="item.id">
      <image :src="item.img" class="item-img" mode="scaleToFill"></image>
    </swiper-item>
  </swiper>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const swiperImg = ref([
  {
    img: '/static/swiper1.png',
    id: '1',
  },
  {
    img: '/static/swiper2.png',
    id: '2',
  },
  {
    img: '/static/swiper3.png',
    id: '3',
  },
])
</script>
<style scoped lang="scss">
.swiper {
  border-radius: $radius-base;
  .swiper-item {
    border-radius: $radius-base;
    height: 100%;
    .item-img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
