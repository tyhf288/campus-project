<template>
  <view class="publish-layout">
    <!-- 顶部标题栏 -->
    <view class="header">
      <text class="title">发布内容</text>
      <button class="publish-btn" @click="handleSubmit">发布</button>
    </view>

    <!-- 发布类型选择 -->
    <view class="type-selector">
      <view
        class="type-item"
        :class="{ active: publishType === 'idle' }"
        @click="handleTypeChange('idle')"
      >
        <view class="type-icon">
          <image src="/static/releaseIdle.svg" class="item-img"></image>
        </view>
        <text class="type-label">发布闲置</text>
      </view>

      <view
        class="type-item"
        :class="{ active: publishType === 'post' }"
        @click="handleTypeChange('post')"
      >
        <view class="type-icon">
          <image src="/static/campusPosting.svg" class="item-img"></image>
        </view>
        <text class="type-label">发布帖子</text>
      </view>
    </view>

    <!-- 图片上传区域 -->
    <view class="section">
      <view class="section-header">
        <uni-icons :type="'star-filled' as any" size="20" color="#FF9F5B"></uni-icons>

        <text class="section-title">图片上传</text>
      </view>

      <scroll-view scroll-x class="image-scroll" :show-scrollbar="false">
        <uni-file-picker
          v-model="images"
          limit="6"
          title="最多选择6张图片"
          mode="grid"
          :image-styles="imageStyles"
          file-mediatype="image"
          @select="handleImageSelect($event as any)"
        ></uni-file-picker>
      </scroll-view>
    </view>

    <!-- 根据类型渲染对应的表单组件 -->
    <PublishIdlePage v-show="publishType === 'idle'" ref="idlePageRef" />
    <PublishPostPage v-show="publishType === 'post'" ref="postPageRef" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
// 直接导入两个发布页面作为子组件
import PublishIdlePage from '@/sub-goods/pages/goods/publish.vue'
import PublishPostPage from '@/sub-wall/pages/wall/publish.vue'

/** 发布类型 */
const publishType = ref<'idle' | 'post'>('idle')
onLoad((options) => {
  // 根据传入的参数设置初始发布类型
  if (options!.publishType) {
    handleTypeChange(options!.publishType as 'idle' | 'post')
  }
})

/** 图片相关 */
//回显图片
const images = ref<any[]>([])
//图片数据
const imageList = ref<any[]>([])
const imageStyles = {
  border: {
    radius: '10%',
  },
}

/** 表单组件引用 */
const idlePageRef = ref()
const postPageRef = ref()

// ==================== 事件处理 ====================

/** 切换发布类型 */
function handleTypeChange(type: 'idle' | 'post') {
  publishType.value = type
  // 切换类型时清空图片
  images.value = []
  imageList.value = []
}

/** 图片选择回调 */
const handleImageSelect = (env: any) => {
  imageList.value = [...imageList.value, env.tempFilePaths[0]]
}
/** 提交发布 - 委托给子组件处理 */
const handleSubmit = async () => {
  const child = publishType.value === 'idle' ? idlePageRef.value : postPageRef.value
  if (!child?.submit) {
    return uni.showToast({ title: '请先完成表单', icon: 'none' })
  }
  await child.submit(imageList.value)
}
</script>

<style scoped lang="scss">
.publish-layout {
  min-height: 100vh;
  background-color: $bg-page;
  padding-bottom: 40rpx;
}

/* ==================== 顶部标题栏 ==================== */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx $page-padding 20rpx;

  .title {
    font-size: 56rpx;
    font-weight: $font-bold;
    color: $text-main;
  }

  .publish-btn {
    background-color: $color-orange;
    color: #fff;
    border-radius: $radius-full;
    font-size: $font-size-base;
    font-weight: $font-bold;
    border: none;
    box-shadow: 0 4rpx 12rpx rgba(255, 159, 91, 0.3);
    margin: $gap-base;

    &::after {
      border: none;
    }
  }
}

/* ==================== 发布类型选择 ==================== */
.type-selector {
  display: flex;
  gap: $gap-base;
  padding: 20rpx $page-padding;

  .type-item {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 32rpx;
    background-color: #effbd5;
    border-radius: $radius-lg;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s;

    &.active {
      box-shadow: 0 8rpx 20rpx rgba(5, 88, 63, 0.2);
      background-color: #d6f4c4;
    }

    .type-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: $gap-base;
      .item-img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
    }

    .type-label {
      font-size: $font-size-base;
      font-weight: $font-medium;
      color: $text-main;
    }
  }
}

/* ==================== 图片上传区域 ==================== */
:deep(.file-picker__box-content) {
  background-color: white;
}
.section {
  padding: 32rpx $page-padding;
  margin-top: $gap-sm;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: $gap-base;
    gap: $gap-xs;

    .section-title {
      font-size: $font-size-lg;
      font-weight: $font-bold;
      color: $text-main;
    }
  }
}

.image-scroll {
  white-space: nowrap;
}

.image-list {
  display: inline-flex;
  gap: $gap-sm;
  padding-right: $gap-sm;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: $radius-base;
  overflow: hidden;
  flex-shrink: 0;

  .img {
    width: 100%;
    height: 100%;
  }

  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 48rpx;
    height: 48rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 $radius-base 0 $radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.add-image-btn {
  width: 200rpx;
  height: 200rpx;
  border-radius: $radius-base;
  background-color: $bg-card;
  border: 2rpx dashed $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
