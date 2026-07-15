<template>
  <view class="home">
    <view class="header">
      <view
        class="logo"
        :style="{
          paddingTop: safeAreaInsets?.top + 'px',
        }"
        ><text>校园墙</text></view
      >
    </view>
    <view class="search">
      <SearchInput></SearchInput>
    </view>
    <view class="swiper">
      <Swiper :style="{ height: '$swiper-banner-height' }"></Swiper>
    </view>
    <view class="sub">
      <view class="sub-item" v-for="item in useList" :key="item.id" @click="handleC(item.path)">
        <image :src="item.img" class="item-img"></image>
        <text class="item-text">{{ item.title }}</text>
      </view>
    </view>
    <view class="good">
      <Mine></Mine>
    </view>
    <view class="wall">
      <Wall></Wall>
    </view>
  </view>
</template>

<script setup lang="ts">
import SearchInput from '@/components/searchInput/index.vue'
import Swiper from '@/components/swiper/index.vue'
import { ref } from 'vue'

const useList = ref([
  {
    id: 1,
    title: '发布闲置',
    img: '/static/releaseIdle.png',
    path: '/sub-goods/pages/goods/publish',
  },
  {
    id: 2,
    title: '校园发帖',
    img: '/static/campusPosting.png',
    path: '/sub-wall/pages/wall/publish',
  },
  {
    id: 3,
    title: '二手市场',
    img: '/static/mark.png',
    path: '/sub-goods/pages/market/index',
  },
  {
    id: 4,
    title: '校园墙',
    img: '/static/wall.png',
    path: '/sub-wall/pages/wall/index',
  },
])

const handleC = (path: string) => {
  uni.navigateTo({
    url: path,
  })
}

const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<style scoped lang="scss">
.home {
  background-color: $bg-page;
  padding: 0 $page-padding;
  display: flex;
  flex-direction: column;
  gap: $gap-xl;
  .header {
    .logo {
      color: $text-main;
      font-size: $font-size-lg;
      font-weight: $font-bold;
      font-family: fantasy;
    }
  }
  .search {
    border-radius: $radius-base;
  }
  .swiper {
    height: $swiper-banner-height;
  }
  .sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $gap-sm;
    height: 180rpx;
    .sub-item {
      flex: 1;
      height: 100%;
      background-color: $bg-card;
      border-radius: $radius-base;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: $gap-xs;
      .item-img {
        $img-size: 100rpx;
        width: $img-size;
        height: $img-size;
      }
      .item-text {
        font-size: $font-size-base;
        color: $text-regular;
      }
    }
  }
  .good {
    height: 300rpx;
    background-color: yellow;
    border-radius: $radius-base;
  }
  .wall {
    height: 300rpx;
    background-color: blue;
    border-radius: $radius-base;
  }
}
</style>
