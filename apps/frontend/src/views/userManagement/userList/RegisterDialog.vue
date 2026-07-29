<template>
  <el-form ref="registerForm" label-width="80px" :rules="formRule">
    <!-- 头像 -->
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="handleUpload"
        :before-upload="beforeAvatarUpload"
        drag
      >
        <img v-if="registerData.avatar" :src="registerData.avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>
    <!-- 登录账号 -->
    <el-form-item label="登录账号" prop="loginKey">
      <el-input v-model="registerData.loginKey" placeholder="请输入登录账号" />
    </el-form-item>

    <!-- 昵称 -->
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="registerData.nickname" placeholder="请输入昵称" />
    </el-form-item>

    <!-- 邮箱 -->
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="registerData.email" placeholder="请输入邮箱（可选）" clearable />
    </el-form-item>

    <!-- 角色 -->
    <el-form-item label="角色" prop="role">
      <el-select v-model="registerData.role" placeholder="请选择角色" style="width: 100%">
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <!-- 密码 -->
    <el-form-item label="密码">
      <el-input
        v-model="registerData.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>

    <!-- 按钮区域 -->
    <div class="dialog-button">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="emit('closeDialog')">取消</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { registerVO } from '@campus/types'
import { UserRole } from '@campus/types'
import type { UploadProps } from 'element-plus'
import { uploadAvatar } from '@/api/userManagement/userList'

/**
 * 表单引用
 */
const registerForm = ref()

/**
 * 注册表单数据
 */
const registerData = ref<registerVO>({
  loginKey: '',
  nickname: '',
  avatar: null,
  email: null,
  role: UserRole.STUDENT,
  password: '',
})

/**
 * 头像上传处理
 * - 获取上传成功的图片URL
 * - 将图片URL保存到表单数据中
 */

// 头像上传前处理
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  if (!allowMimeTypes.includes(rawFile.type)) {
    ElMessage.error('仅支持 JPG、PNG、WebP、SVG 图片！')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片大小不能超过5MB!')
    return false
  }
  return true
}

/**
 * 自定义上传处理（代理模式）
 * @param options - 上传选项
 */
const handleUpload = async (options: any) => {
  try {
    const res = await uploadAvatar(options.file)
    registerData.value.avatar = res.data.url
    options.onSuccess(res.data)
    ElMessage.success('上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}

/**
 * 角色选项列表
 */
const roleOptions = [
  {
    label: '管理员',
    value: UserRole.ADMIN,
  },
  {
    label: '审核员',
    value: UserRole.AUDITOR,
  },
]

/**
 * 定义组件事件
 * - submitRequest: 提交注册请求
 * - closeDialog: 关闭弹窗
 */
const emit = defineEmits<{
  submitRequest: [data: registerVO]
  closeDialog: []
}>()

/**
 * 处理提交操作
 * 触发自定义事件，将表单数据传递给父组件
 */
const handleSubmit = () => {
  emit('submitRequest', registerData.value)
}

/**
 * 表单验证规则
 */
const formRule = {
  loginKey: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}
</script>

<style lang="scss" scoped>
.dialog-button {
  text-align: right;
}
.avatar-uploader {
  border: 1px dashed #b0b0b0;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s ease-in-out;
  .avatar {
    width: 178px;
    height: 178px;
  }
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
