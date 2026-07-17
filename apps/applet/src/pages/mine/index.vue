<template>
  <view class="mine-container">
    <CommonHeader></CommonHeader>
    <!-- 个人信息头部 -->
    <view class="profile-header">
      <view class="profile-info">
        <image class="avatar" src="/static/releaseIdle.svg" mode="aspectFill" />
        <view class="info-content">
          <text class="username">张三</text>
          <view class="credit-badge">
            <text class="credit-label">信誉：</text>
            <text class="credit-value excellent">优秀</text>
          </view>
        </view>
      </view>
      <view class="edit-btn" @click="handleEditProfile">
        <text class="edit-text">编辑</text>
      </view>
    </view>

    <!-- 四大核心模块 -->
    <view class="main-modules">
      <view class="module-item" @click="handleModuleClick('idle')">
        <image class="module-icon" src="/static/releaseIdle.svg" mode="aspectFit" />
        <text class="module-name">我的闲置</text>
      </view>
      <view class="module-item" @click="handleModuleClick('post')">
        <image class="module-icon" src="/static/campusPosting.svg" mode="aspectFit" />
        <text class="module-name">我的帖子</text>
      </view>
      <view class="module-item" @click="handleModuleClick('collect')">
        <image class="module-icon" src="/static/mark.svg" mode="aspectFit" />
        <text class="module-name">我的收藏</text>
      </view>
      <view class="module-item" @click="handleModuleClick('order')">
        <image class="module-icon" src="/static/wall.svg" mode="aspectFit" />
        <text class="module-name">我的订单</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="handleMenuClick('follow')">
        <view class="menu-left">
          <text class="menu-text">我的关注</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('report')">
        <view class="menu-left">
          <text class="menu-text">举报记录</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('history')">
        <view class="menu-left">
          <text class="menu-text">历史浏览</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('credit')">
        <view class="menu-left">
          <text class="menu-text">信誉记录</text>
        </view>
        <text class="arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('settings')">
        <view class="menu-left">
          <text class="menu-text">设置</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 安全提示 -->
    <view class="safety-tip">
      <text class="tip-text">校内交易尽量选择面交，注意保护个人信息</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import CommonHeader from '@/components/commonHeader/index.vue'
// 编辑个人资料
const handleEditProfile = () => {
  uni.showToast({
    title: '编辑资料',
    icon: 'none',
  })
  uni.navigateTo({
    url: '/pages/login/login',
  })
}

// 核心模块点击
const handleModuleClick = (type: string) => {
  const moduleMap: Record<string, string> = {
    idle: '我的闲置',
    post: '我的帖子',
    collect: '我的收藏',
    order: '我的订单',
  }
  uni.showToast({
    title: `进入${moduleMap[type]}`,
    icon: 'none',
  })
}

// 菜单列表点击
const handleMenuClick = (type: string) => {
  const menuMap: Record<string, string> = {
    follow: '我的关注',
    report: '举报记录',
    history: '历史浏览',
    credit: '信誉记录',
    settings: '设置',
  }
  uni.showToast({
    title: `进入${menuMap[type]}`,
    icon: 'none',
  })
}
</script>

<style scoped lang="scss">
.mine-container {
  min-height: 100vh;
  background-color: $bg-page;
  padding: 0 $page-padding;
  display: flex;
  flex-direction: column;
  gap: $gap-xl;

  // 个人信息头部
  .profile-header {
    background-color: $bg-card;
    border-radius: $radius-lg;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    padding: $gap-lg;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .profile-info {
      display: flex;
      align-items: center;
      gap: $gap-base;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: $radius-full;
        border: 4rpx solid $color-primary-fade;
      }

      .info-content {
        display: flex;
        flex-direction: column;
        gap: $gap-xs;

        .username {
          font-size: $font-size-lg;
          color: $text-main;
          font-weight: $font-bold;
        }

        .credit-badge {
          display: flex;
          align-items: center;
          gap: $gap-xs;

          .credit-label {
            font-size: $font-size-sm;
            color: $text-secondary;
          }

          .credit-value {
            font-size: $font-size-sm;
            font-weight: $font-medium;
            padding: 4rpx 16rpx;
            border-radius: $radius-full;

            &.excellent {
              background-color: $color-primary-fade;
              color: $color-primary;
            }
          }
        }
      }
    }

    .edit-btn {
      padding: 12rpx 32rpx;
      background-color: $color-primary-fade;
      border-radius: $radius-full;

      .edit-text {
        font-size: $font-size-sm;
        color: $color-primary;
        font-weight: $font-medium;
      }
    }
  }

  // 四大核心模块
  .main-modules {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $gap-sm;

    .module-item {
      background-color: $bg-card;
      border-radius: $radius-base;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      padding: $gap-base $gap-sm;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $gap-xs;

      .module-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: $radius-lg;
      }

      .module-name {
        font-size: $font-size-sm;
        color: $text-main;
        font-weight: $font-medium;
      }
    }
  }

  // 功能列表
  .menu-list {
    background-color: $bg-card;
    border-radius: $radius-lg;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $gap-base $gap-lg;
      border-bottom: 1rpx solid $border-color;

      &:last-child {
        border-bottom: none;
      }

      .menu-left {
        .menu-text {
          font-size: $font-size-base;
          color: $text-main;
          font-weight: $font-normal;
        }
      }

      .arrow {
        font-size: 48rpx;
        color: $text-placeholder;
        font-weight: $font-normal;
      }
    }
  }

  // 安全提示
  .safety-tip {
    background-color: rgba(255, 159, 91, 0.1);
    border-radius: $radius-base;
    padding: $gap-base $gap-lg;
    border-left: 6rpx solid $color-orange;

    .tip-text {
      font-size: $font-size-sm;
      color: $color-orange;
      line-height: 1.6;
      text-align: center;
    }
  }
}
</style>
