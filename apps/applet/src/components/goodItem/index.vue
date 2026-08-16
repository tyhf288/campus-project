<template>
  <view class="good-list">
    <view class="list-item" v-for="item in props.goodList" :key="item.id">
      <!-- 商品主图 -->
      <image class="main-img" :src="getMainImage(item)" mode="aspectFill" lazy-load />
      <!-- 商品标题 -->
      <text class="goods-name">{{ item.title }}</text>
      <!-- 成色标签 + 价格 -->
      <view class="item-foot">
        <text class="quality-tag">{{ getQualityLabel(item.quality) }}</text>
        <text class="price">￥{{ item.price }}</text>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import type { GoodVO } from '@campus/types'

// 接收传进来的数据列表
const props = defineProps<{
  goodList: GoodVO[]
}>()

/** 成色 → 中文映射 */
const qualityLabelMap: Record<string, string> = {
  new: '全新',
  anew: '几乎全新',
  normal: '轻微使用',
  slight_used: '七成新',
  old: '五成新',
}

/**
 * 获取商品主图（优先 isMain，否则取第一张）
 */
function getMainImage(item: GoodVO): string {
  const images = item.images || []
  if (images.length === 0) return ''
  const main = images.find((img) => img.isMain)
  return (main || images[0]).imageUrl || ''
}

/**
 * 获取成色中文标签
 */
function getQualityLabel(quality: string): string {
  return qualityLabelMap[quality] || quality
}
</script>
<style lang="scss" scoped>
.good-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $gap-sm;
  /*
   * 卡片采用「固定高度」设计，为虚拟滚动做准备。
   * 高度构成：图片 320rpx + 标题区 80rpx + 底部信息 44rpx + padding(16*2) + gap(8*2)
   * 合计 ≈ 492rpx，所有卡片高度一致。
   */
  .list-item {
    height: 492rpx; // 固定卡片高度，防止加载后高度变化导致错位
    background-color: $bg-card;
    border-radius: $radius-base;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.08);
    padding: $gap-sm;
    display: flex;
    flex-direction: column;
    gap: $gap-xs;
    box-sizing: border-box;

    .main-img {
      width: 100%;
      height: 320rpx; // 固定图片高度，防止加载后高度变化导致错位
      border-radius: $radius-base;
      background-color: $bg-gray; // 加载中/失败占位底色
      display: block;
    }

    .goods-name {
      font-size: $font-size-sm;
      color: $text-main;
      font-weight: $font-medium;
      line-height: 1.4;
      // 固定两行高度，保证 1 行/2 行标题时卡片高度一致
      height: 80rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
    }

    .item-foot {
      height: 44rpx; // 固定底部信息高度
      display: flex;
      align-items: center;
      justify-content: space-between;

      .quality-tag {
        font-size: $font-size-xs;
        color: $color-orange;
        background-color: rgba(255, 159, 91, 0.1);
        padding: 4rpx 16rpx;
        border-radius: $radius-sm;
        white-space: nowrap; // 成色标签不换行
      }

      .price {
        font-size: $font-size-base;
        color: #fb4961;
        font-weight: $font-bold;
      }
    }
  }
}
</style>
