<template>
  <view class="home">
    <!--  头部 -->
    <view
      class="header"
      :style="{
        paddingTop: safeAreaInsets?.top + 'px',
      }"
    >
      <view class="logo"><text>校园墙</text></view>
      <view class="search">
        <SearchInput></SearchInput>
      </view>
    </view>

    <!-- 轮播  -->
    <view class="swiper">
      <Swiper :style="{ height: '320rpx' }"></Swiper>
    </view>
    <!-- 功能模块  -->
    <view class="sub">
      <view class="sub-item" v-for="item in useList" :key="item.id" @click="handleC(item.path)">
        <image :src="item.img" class="item-img"></image>
        <text class="item-text">{{ item.title }}</text>
      </view>
    </view>

    <!--热门二手  -->
    <view class="good">
      <view class="hot-item">
        <image class="hot-item-img" src="/static/commonIcon1.png" mode="scaleToFill" />
        <text class="hot-item-text">热门闲置</text>
      </view>
      <!--组件  -->
      <GoodItem></GoodItem>
    </view>

    <!--热门墙  -->
    <view class="wall">
      <Wall></Wall>
    </view>
  </view>
</template>

<script setup lang="ts">
import SearchInput from '@/components/searchInput/index.vue'
import Swiper from '@/components/swiper/index.vue'
import GoodItem from '@/components/goodItem/index.vue'
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
    .search {
      padding-top: $gap-lg;
      border-radius: $radius-base;
    }
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
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: $gap-xs;
      .item-img {
        $img-size: 120rpx;
        width: $img-size;
        height: $img-size;
        border-radius: $radius-xl;
      }
      .item-text {
        font-size: $font-size-base;
        color: $text-main;
        font-weight: $font-bold;
      }
    }
  }
  .good {
    border-radius: $radius-base;
    .hot-item {
      height: 100rpx;
      display: flex;
      align-items: center;
      gap: $gap-xs;
      .hot-item-img {
        $img-size: 70rpx;
        width: $img-size;
        height: $img-size;
        border-radius: $radius-lg;
      }
      .hot-item-text {
        font-size: 50rpx;
        color: $text-main;
        font-weight: $font-bold;
      }
    }
  }
  .wall {
    height: 400rpx;
    background-color: blue;
    border-radius: $radius-base;
  }
}
</style>
