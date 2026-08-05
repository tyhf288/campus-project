<template>
  <view class="container">
    <view class="login-page">
      <view class="login-header">
        <text class="app-name">校园墙</text>
        <text class="app-slogan">校内生活，一墙搞定</text>
      </view>

      <view class="user-card" v-if="!isLogin">
        <uni-forms :model="userInfo" ref="formRef" :rules="rules as any" labelWidth="60">
          <view class="avatar-section">
            <view class="avatar-wrapper" @click="chooseImage">
              <image
                class="upload-avatar"
                :src="userInfo.avatar || '/static/default-avatar.png'"
                mode="aspectFill"
              />
              <view class="avatar-mask">
                <text class="mask-text">更换头像</text>
              </view>
            </view>
            <view class="avatar-actions">
              <button open-type="chooseAvatar" @chooseavatar="handleGetWxAvatar" class="avatar-btn">
                使用微信头像
              </button>
              <text v-if="userInfo.avatar" class="clear-avatar" @click="deletePic">清除头像</text>
            </view>
          </view>

          <uni-forms-item label="昵称" name="nickname">
            <uni-easyinput
              v-model="userInfo.nickname"
              placeholder="请输入您的昵称"
              :maxlength="12"
              clearable
            />
          </uni-forms-item>

          <uni-forms-item label="邮箱" name="email">
            <uni-easyinput
              v-model="userInfo.email"
              placeholder="请输入您的邮箱（可选）"
              clearable
            />
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="login-action" v-show="!isLogin">
        <button @click="wxRegister" class="wechat-login-btn">
          <text class="btn-text">使用微信注册</text>
        </button>
        <text class="text-ch" @click="isLogin = !isLogin">登录</text>
      </view>
      <view class="login-action" v-show="isLogin">
        <button @click="wxLogin" class="wechat-login-btn">
          <text class="btn-text">微信一键登录</text>
        </button>
        <text class="text-ch" @click="isLogin = !isLogin">注册</text>
      </view>

      <view class="safety-notice">
        <text class="notice-text">保护个人信息安全，谨防诈骗</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { appletRegisterVO } from '@campus/types'
import { login, register } from '@/api/login'
import { useUserStore } from '@/stores/user'
import { uploadToOss } from '@/utils/oss-upload'

const isLogin = ref(false)
const formRef = ref()

const userInfo = ref<appletRegisterVO>({
  code: '',
  nickname: '',
  avatar: null,
  email: null,
})

const fileList = ref<any[]>([])

const rules = ref({
  nickname: [
    { required: true, message: '请填写昵称', trigger: ['blur', 'change'] },
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value && value.trim().length > 12) {
          callback(new Error('昵称不能超过12个字'))
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
  email: [
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (value && value.trim()) {
          const reg = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
          if (!reg.test(value)) {
            callback(new Error('邮箱格式不正确'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: ['blur', 'change'],
    },
  ],
})

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempPath = res.tempFilePaths[0]
      fileList.value = [{ url: tempPath }]
      uni.showLoading({ title: '上传头像中...' })
      try {
        const ossUrl = await uploadToOss(tempPath, 'avatars')
        userInfo.value.avatar = ossUrl
        uni.hideLoading()
      } catch {
        uni.hideLoading()
        uni.showToast({ title: '头像上传失败', icon: 'none' })
      }
    },
  })
}

const handleGetWxAvatar = async (e: any) => {
  const wxAvatarUrl = e.detail.avatarUrl
  if (!wxAvatarUrl) return
  uni.showLoading({ title: '加载头像...' })
  try {
    const downloadRes = await uni.downloadFile({ url: wxAvatarUrl })
    if (downloadRes.statusCode === 200) {
      const tempPath = downloadRes.tempFilePath
      uni.showLoading({ title: '上传头像中...' })
      const ossUrl = await uploadToOss(tempPath, 'avatars')
      fileList.value = [{ url: tempPath }]
      userInfo.value.avatar = ossUrl
    }
  } catch {
    uni.showToast({ title: '头像获取失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

const deletePic = () => {
  userInfo.value.avatar = null
  fileList.value = []
}

const userStore = useUserStore()

const wxRegister = async () => {
  try {
    await formRef.value?.validate()
    uni.showLoading({ title: '注册中...' })
    const res = await uni.login()
    userInfo.value.code = res.code
    const res2 = await register(userInfo.value)
    if (res2.code !== 200) {
      throw new Error(res2.message || '注册失败')
    }
    userStore.setUserData(res2.data.user)
    userStore.setToken(res2.data.access_token)
    uni.showToast({ title: '注册成功' })
    uni.reLaunch({ url: '/pages/index/index' })
  } catch (err: any) {
    uni.showToast({ title: err.message || '注册失败', icon: 'error' })
  } finally {
    uni.hideLoading()
  }
}

const wxLogin = async () => {
  uni.showLoading({ title: '登录中...' })
  try {
    const res = await uni.login()
    userInfo.value.code = res.code
    const res2 = await login(userInfo.value)
    userStore.setUserData(res2.data.user)
    userStore.setToken(res2.data.access_token)
    uni.showToast({ title: '登录成功' })
    uni.reLaunch({ url: '/pages/index/index' })
  } catch {
    uni.showToast({ title: '登录失败', icon: 'error' })
  } finally {
    uni.hideLoading()
  }
}
</script>

<style scoped lang="scss">
.avatar-btn {
  margin-top: 0;
  font-size: 26rpx;
  color: $color-primary;
  border: none;
  background: transparent;
  padding: 0;
  &::after {
    border: none;
  }
}

.clear-avatar {
  font-size: 22rpx;
  color: $color-danger;
  padding: 4rpx 12rpx;
}

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

  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $gap-base;
    padding-top: 80rpx;
    padding-bottom: $gap-lg;

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

  .user-card {
    background-color: $bg-card;
    border-radius: $radius-base;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    padding: $gap-lg;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $gap-sm;

      .avatar-wrapper {
        position: relative;
        width: 160rpx;
        height: 160rpx;

        .avatar-mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: $radius-full;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;

          .mask-text {
            color: #fff;
            font-size: $font-size-xs;
          }
        }

        &:active .avatar-mask {
          opacity: 1;
        }
      }

      .avatar-actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: $gap-base;
      }
    }

    .upload-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: $radius-full;
      border: 4rpx solid $color-primary;
      box-shadow: 0 4rpx 12rpx rgba(72, 187, 152, 0.2);
    }
  }

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
    .text-ch {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-sm;
      color: #36844e;
    }
  }

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
