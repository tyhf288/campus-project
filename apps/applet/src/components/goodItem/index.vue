<template>
  <view class="good-list">
    <view class="list-item">
      <!-- 商品内容 -->
      <view class="item-main">
        <image class="main-img" :src="'/static/releaseIdle.png'" mode="aspectFill" />
        <text class="main-text">数学书</text>
      </view>
      <!--商品卖家  -->
      <view class="item-foot">
        <view class="foot-left">
          <image class="left-img" :src="'/static/campusPosting.png'" mode="aspectFill" />
          <text class="left-text">数学家高斯</text>
        </view>
        <text class="foot-right">￥18</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.good-list {
  $main-img-size: 150rpx;
  $foot-img-size: 45rpx;
  $padding-size: 10rpx;
  height: $main-img-size + $foot-img-size + $padding-size;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $gap-sm;
  .list-item {
    background-color: $bg-card;
    border-radius: $radius-base;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    padding: $padding-size;
    .item-main {
      display: flex;
      align-items: center;
      gap: $gap-sm;
      padding-bottom: $padding-size;
      .main-img {
        width: $main-img-size;
        height: $main-img-size;
        border-radius: $radius-lg;
      }
      .main-text {
        font-size: $font-size-base;
        color: $text-main;
        font-weight: $font-medium;
      }
    }
    .item-foot {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .foot-left {
        display: flex;
        align-items: center;
        gap: $gap-xs;
        .left-img {
          width: $foot-img-size;
          height: $foot-img-size;
          border-radius: $radius-lg;
        }
        .left-text {
          font-size: $font-size-xs;
          color: $text-regular;
          font-weight: $font-normal;
        }
      }
      .foot-right {
        font-size: $font-size-base;
        color: #fb4961;
        font-weight: $font-bold;
      }
    }
  }
}
</style>
