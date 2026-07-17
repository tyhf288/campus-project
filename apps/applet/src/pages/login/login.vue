<template>
  <view class="container">
    <view class="login-page">
      <!-- Logo和标题区域 -->
      <view class="login-header">
        <text class="app-name">校园墙</text>
        <text class="app-slogan">校内生活，一墙搞定</text>
      </view>

      <!-- 用户信息卡片 -->
      <view class="user-card">
        <!-- 头像区域 -->
        <view class="avatar-section">
          <view class="avatar-wrapper">
            <image
              class="avatar-img"
              :src="userInfo.avatarUrl || '/static/default-avatar.png'"
              mode="aspectFill"
            />
            <view class="avatar-edit-btn">
              <text class="edit-icon">📷</text>
            </view>
          </view>
          <button open-type="chooseAvatar" @chooseavatar="handleAvatar" class="avatar-button">
            <text class="avatar-tip">点击更换头像</text>
          </button>
        </view>

        <!-- 昵称输入区域 -->
        <view class="nickname-section">
          <text class="section-label">昵称</text>
          <input
            type="nickname"
            placeholder="请输入您的昵称"
            v-model="userInfo.nickName"
            class="nickname-input"
          />
        </view>
      </view>

      <!-- 登录按钮区域 -->
      <view class="login-action">
        <button @click="wxLogin" class="wechat-login-btn">
          <text class="btn-text">微信一键登录</text>
        </button>
      </view>

      <!-- 底部安全提示 -->
      <view class="safety-notice">
        <text class="notice-text">保护个人信息安全，谨防诈骗</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import http from '@/api/http/index'
import { ref } from 'vue'

const userInfo = ref({
  nickName: '',
  avatarUrl: '',
})

// 获取微信头像
const handleAvatar = async (e: any) => {
  // 1. 获取用户头像
  userInfo.value.avatarUrl = e.detail.avatarUrl
}
// 微信一键登录
const wxLogin = async () => {
  const res = await uni.login()
  //获取code向后端请求
}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  background-color: $bg-page;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.login-page {
  padding: 0 $page-padding;
  display: flex;
  flex-direction: column;
  gap: $gap-xl;

  // Logo和标题区域
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $gap-base;
    padding-top: 80rpx;
    padding-bottom: $gap-lg;

    .logo {
      width: 120rpx;
      height: 120rpx;
      border-radius: $radius-xl;
      box-shadow: 0 4rpx 16rpx rgba(72, 187, 152, 0.2);
    }

    .app-name {
      font-size: 48rpx;
      color: $text-main;
      font-weight: $font-bold;
      font-family: fantasy;
    }

    .app-slogan {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  // 用户信息卡片
  .user-card {
    background-color: $bg-card;
    border-radius: $radius-base;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    padding: $gap-lg;
    display: flex;
    flex-direction: column;
    gap: $gap-lg;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $gap-sm;

      .avatar-wrapper {
        position: relative;
        width: 160rpx;
        height: 160rpx;

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: $radius-full;
          border: 4rpx solid $color-primary;
          box-shadow: 0 4rpx 12rpx rgba(72, 187, 152, 0.2);
        }

        .avatar-edit-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 48rpx;
          height: 48rpx;
          background-color: $color-primary;
          border-radius: $radius-full;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3rpx solid #ffffff;
          box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);

          .edit-icon {
            font-size: 24rpx;
          }
        }
      }

      .avatar-button {
        border: none;
        padding: 0;
        margin: 0;
        line-height: normal;

        &::after {
          border: none;
        }

        .avatar-tip {
          font-size: $font-size-xs;
          color: $color-primary;
        }
      }
    }

    .nickname-section {
      display: flex;
      flex-direction: column;
      gap: $gap-xs;

      .section-label {
        font-size: $font-size-sm;
        color: $text-secondary;
        font-weight: $font-medium;
      }

      .nickname-input {
        background-color: #ffffff;
        border: 2rpx solid $border-color;
        border-radius: $radius-base;
        padding: $gap-base $gap-lg;
        font-size: $font-size-base;
        color: $text-main;
        transition: all 0.3s ease;

        &:focus {
          border-color: $color-primary;
          box-shadow: 0 0 0 4rpx rgba(72, 187, 152, 0.1);
        }
      }
    }
  }

  // 登录按钮区域
  .login-action {
    .wechat-login-btn {
      border: none;
      background-color: #07c160;
      border-radius: $radius-lg;
      padding: $gap-base $gap-xl;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8rpx 24rpx rgba(72, 187, 152, 0.3);
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 12rpx rgba(72, 187, 152, 0.2);
      }

      .btn-text {
        font-size: $font-size-base;
        color: #ffffff;
        font-weight: $font-bold;
      }
    }
  }

  // 底部安全提示
  .safety-notice {
    background-color: rgba(255, 159, 91, 0.1);
    border-radius: $radius-base;
    padding: $gap-base $gap-lg;
    margin-top: auto;
    margin-bottom: $gap-xl;

    .notice-text {
      font-size: $font-size-xs;
      color: $color-orange;
      text-align: center;
      line-height: 1.6;
      display: block;
    }
  }
}
</style>
