<template>
  <view class="container">
    <view class="login-page">
      <!-- Logo和标题区域 -->
      <view class="login-header">
        <text class="app-name">校园墙</text>
        <text class="app-slogan">校内生活，一墙搞定</text>
      </view>

      <!-- 用户信息卡片 - 注册模式 -->
      <view class="user-card" v-if="!isLogin">
        <up-form :model="userInfo" ref="formRef" :rules="rules" labelWidth="120rpx">
          <!-- 头像上传 -->

          <view class="avatar-section">
            <up-upload
              :fileList="fileList"
              @afterRead="afterRead"
              @delete="deletePic"
              name="avatar"
              multiple
              :maxCount="1"
              :previewImage="true"
            >
              <image class="upload-avatar" :src="userInfo.avatar || undefined" mode="aspectFill" />
            </up-upload>
            <button open-type="chooseAvatar" @chooseavatar="handleGetWxAvatar" class="avatar-btn">
              使用微信头像
            </button>
          </view>

          <!-- 昵称输入 -->
          <up-form-item label="昵称" prop="nickname">
            <up-input
              v-model="userInfo.nickname"
              placeholder="请输入您的昵称"
              maxlength="12"
              clearable
              type="nickname"
            />
          </up-form-item>

          <!-- 邮箱输入 -->
          <up-form-item label="邮箱" prop="email">
            <up-input v-model="userInfo.email" placeholder="请输入您的邮箱（可选）" clearable />
          </up-form-item>
        </up-form>
      </view>
      <view class="login-action" v-show="!isLogin">
        <button @click="wxRegister" class="wechat-login-btn">
          <text class="btn-text">使用微信注册</text>
        </button>
        <text class="text-ch" @click="isLogin = !isLogin">登录</text>
      </view>
      <!-- 登录按钮区域 -->
      <view class="login-action" v-show="isLogin">
        <button @click="wxLogin" class="wechat-login-btn">
          <text class="btn-text">微信一键登录</text>
        </button>
        <text class="text-ch" @click="isLogin = !isLogin">注册</text>
      </view>

      <!-- 底部安全提示 -->
      <view class="safety-notice">
        <text class="notice-text">保护个人信息安全，谨防诈骗</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { appletLoginVO, tokenVO, appletRegisterVO, ApiResponse } from '@campus/types'
import { login, register } from '@/api/login'
import { useUserStore } from '@/stores/user'

// 登录还是注册
const isLogin = ref(false)

// 表单引用
const formRef = ref()

// 用户信息表单数据
const userInfo = ref<appletRegisterVO>({
  code: '',
  nickname: '',
  avatar: null,
  email: null,
})

// 上传文件列表
const fileList = ref<any[]>([])

/**
 * 表单校验规则
 */
const rules = ref({
  nickname: [
    {
      required: true,
      message: '请填写昵称',
      trigger: ['blur', 'change'],
    },
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
        // 邮箱为可选字段，填写时才校验格式
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

/**
 * 获取微信头像回调
 */
const handleGetWxAvatar = async (e: any) => {
  const wxAvatarUrl = e.detail.avatarUrl

  if (!wxAvatarUrl) return

  uni.showLoading({ title: '加载头像...' })
  try {
    // 重点：微信头像地址需要下载到本地临时路径
    const downloadRes = await uni.downloadFile({
      url: wxAvatarUrl,
    })
    if (downloadRes.statusCode === 200) {
      const tempPath = downloadRes.tempFilePath
      // 更新视图与表单数据
      fileList.value = [{ url: tempPath }]
      userInfo.value.avatar = tempPath
    }
  } catch (err) {
    uni.showToast({ title: '头像获取失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}
/**
 * 读取图片后的回调
 * @param res 上传组件返回的文件信息
 */
const afterRead = (res: any) => {
  // 更新表单中的头像字段
  userInfo.value.avatar = res.tempFilePaths[0]
  // 更新文件列表用于展示
  fileList.value = [{ url: res.tempFilePaths[0] }]
}

/**
 * 删除图片的回调
 */
const deletePic = () => {
  // 清空表单中的头像字段
  userInfo.value.avatar = null
  // 清空文件列表
  fileList.value = []
}

const userStore = useUserStore()

/**
 * 微信一键注册
 */
const wxRegister = async () => {
  try {
    // 表单校验失败会直接抛出异常，进入catch
    await formRef.value?.validate()
    uni.showLoading({ title: '注册中...' })
    const res = await uni.login()
    userInfo.value.code = res.code
    const res2 = await register(userInfo.value)

    // 如果后端返回业务失败，手动抛出异常
    if (res2.code !== 200) {
      // reject等价方案：主动抛出错误
      throw new Error(res2.message || '注册失败')
    }

    userStore.setUserData(res2.data.user)
    userStore.setToken(res2.data.access_token)
    uni.showToast({ title: '注册成功' })
  } catch (err: any) {
    uni.showToast({ title: err.message || '注册失败', icon: 'error' })
  } finally {
    uni.hideLoading()
  }
}

/**
 * 微信一键登录/注册
 */
const wxLogin = async () => {
  // 校验通过再执行登录逻辑
  uni.showLoading({ title: '登录中...' })
  try {
    const res = await uni.login()
    // 获取code向后端请求
    userInfo.value.code = res.code
    const res2 = await login(userInfo.value)
    // 存储用户信息
    userStore.setUserData(res2.data.user)
    userStore.setToken(res2.data.access_token)
    uni.showToast({ title: '登录成功' })
  } catch (_error) {
    uni.showToast({
      title: '登录失败',
      icon: 'error',
    })
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

    // 头像区域：垂直排列、居中
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $gap-sm;
    }

    // 自定义上传头像样式
    .upload-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: $radius-full;
      border: 4rpx solid $color-primary;
      box-shadow: 0 4rpx 12rpx rgba(72, 187, 152, 0.2);
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
    .text-ch {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-sm;
      color: #36844e;
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
