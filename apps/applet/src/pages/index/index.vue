<template>
  <view class="home">
    <!--  头部 -->
    <CommonHeader></CommonHeader>

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
      <GoodItem :goodList="hotGoods"></GoodItem>
    </view>

    <!--热门墙  -->
    <view class="wall">
      <Wall></Wall>
    </view>
  </view>
</template>

<script setup lang="ts">
import Swiper from '@/components/swiper/index.vue'
import GoodItem from '@/components/goodItem/index.vue'
import CommonHeader from '@/components/commonHeader/index.vue'
import { ref } from 'vue'

// 功能模块数据（固定）
const useList = ref([
  {
    id: 1,
    title: '发布闲置',
    img: '/static/releaseIdle.svg',
    path: '/sub-goods/pages/goods/publish',
  },
  {
    id: 2,
    title: '校园发帖',
    img: '/static/campusPosting.svg',
    path: '/sub-wall/pages/wall/publish',
  },
  {
    id: 3,
    title: '二手市场',
    img: '/static/mark.svg',
    path: '/sub-goods/pages/market/index',
  },
  {
    id: 4,
    title: '校园墙',
    img: '/static/wall.svg',
    path: '/sub-wall/pages/wall/index',
  },
])

const handleC = (path: string) => {
  uni.navigateTo({
    url: path,
  })
}

//热门闲置(mock)
const hotGoods = ref([
  // 第一条数据（原图示例：数学书）
  {
    id: 1,
    goodsImg: '/static/releaseIdle.svg',
    goodsName: '数学书',
    sellerAvatar: '/static/campusPosting.svg',
    sellerName: '数学家高斯',
    price: 18,
  },
  // 第二条模拟数据1
  {
    id: 2,
    goodsImg: '/static/releaseIdle.svg',
    goodsName: '大学英语四级真题',
    sellerAvatar: '/static/campusPosting.svg',
    sellerName: '英语小达人',
    price: 12,
  },
])
</script>

<style scoped lang="scss">
.home {
  background-color: $bg-page;
  padding: 0 $page-padding;
  display: flex;
  flex-direction: column;
  gap: $gap-xl;

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
