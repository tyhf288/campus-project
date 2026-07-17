<template>
  <view class="good-list">
    <view class="list-item" v-for="item in props.goodList">
      <!-- 商品内容 -->
      <view class="item-main">
        <image class="main-img" :src="item.goodsImg" mode="aspectFill" />
        <text class="main-text">{{ item.goodsName }}</text>
      </view>
      <!--商品卖家  -->
      <view class="item-foot">
        <view class="foot-left">
          <image class="left-img" :src="item.sellerAvatar" mode="aspectFill" />
          <text class="left-text">{{ item.sellerName }}</text>
        </view>
        <text class="foot-right">￥{{ item.price }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
//接收传进来的数据列表
const props = defineProps<{
  goodList: any[]
}>()
</script>
<style lang="scss" scoped>
.good-list {
  $main-img-size: 150rpx;
  $foot-img-size: 45rpx;
  $padding-size: 10rpx;
  // 高度计算：主图 + 主图文字行高 + 间距 + 卖家信息行高 + 价格行高 + 上下padding
  height: auto;
  min-height: $main-img-size + $foot-img-size + $padding-size * 4;
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
        font-size: $font-size-sm;
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
