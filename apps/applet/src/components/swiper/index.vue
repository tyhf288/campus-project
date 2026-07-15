<template>
  <swiper
    class="swiper"
    :style="{ height: '$swiper-banner-height' }"
    circular
    :indicator-dots="true"
    indicator-color="rgb(255,255,255)"
    indicator-active-color="#C0C4CC"
    :autoplay="true"
    :interval="5000"
    :duration="500"
  >
    <swiper-item class="swiper-item">
      <view class="swiper-item uni-bg-red" style="background-color: red">A</view>
    </swiper-item>
    <swiper-item class="swiper-item">
      <view class="swiper-item uni-bg-green" style="background-color: green">B</view>
    </swiper-item>
    <swiper-item class="swiper-item">
      <view class="swiper-item uni-bg-blue" style="background-color: blue">C</view>
    </swiper-item>
  </swiper>
</template>
<script lang="ts"></script>
<style scoped lang="scss">
.swiper {
  border-radius: $radius-base;
  .swiper-item {
    border-radius: $radius-base;
    height: $swiper-banner-height;
  }
}
</style>
