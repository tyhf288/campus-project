<template>
  <el-form ref="userDetailForm" label-width="80px">
    <!-- 登录账号（只读） -->
    <el-form-item label="登录账号">
      <el-input v-model="userData.loginKey" disabled />
    </el-form-item>

    <!-- 昵称（可编辑） -->
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="updata.nickname" placeholder="请输入昵称" :disabled="!isEdit" />
    </el-form-item>

    <!-- 头像（可编辑） -->
    <el-form-item label="头像" prop="avatar">
      <el-upload
        class="avatar-uploader"
        :show-file-list="false"
        :http-request="handleUpload"
        :before-upload="beforeAvatarUpload"
        drag
      >
        <img v-if="updata.avatar" :src="updata.avatar" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <!-- 邮箱（可编辑） -->
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userData.email" placeholder="请输入邮箱" clearable :disabled="!isEdit" />
    </el-form-item>

    <!-- 状态（只读） -->
    <el-form-item label="状态">
      <el-tag v-if="userData.status === UserStatus.ACTIVE" type="success">正常</el-tag>
      <el-tag v-else type="danger">禁用</el-tag>
    </el-form-item>

    <!-- 角色（只读） -->
    <el-form-item label="角色">
      <el-tag v-if="userData.role === UserRole.ADMIN" type="danger">管理员</el-tag>
      <el-tag v-else-if="userData.role === UserRole.AUDITOR" type="warning">审核员</el-tag>
      <el-tag v-else type="success">用户</el-tag>
    </el-form-item>

    <!-- 终端（只读） -->
    <el-form-item label="终端">
      <el-tag v-if="userData.terminal === UserTerminal.MINI_PROGRAM" type="success">小程序</el-tag>
      <el-tag v-else type="warning">PC端</el-tag>
    </el-form-item>

    <!-- 创建时间（只读） -->
    <el-form-item label="创建时间">
      <span>{{ userData.createdAt }}</span>
    </el-form-item>

    <!-- 更新时间（只读） -->
    <el-form-item label="更新时间">
      <span>{{ userData.updatedAt }}</span>
    </el-form-item>

    <!-- 按钮区域（仅编辑模式显示） -->
    <div v-if="isEdit" class="dialog-button">
      <el-button type="primary" @click="handleSubmit">保存</el-button>
      <el-button @click="emit('closeDialog')">取消</el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type { UserVO, UserUpdate } from '@campus/types'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'
import type { UploadProps } from 'element-plus'
import { uploadAvatar } from '@/api/userManagement/userList'

/**
 * 表单引用
 */
const userDetailForm = ref()

/**
 * 定义组件属性
 * - userData: 用户数据对象
 * - isEdit: 是否为编辑模式，默认为 false（详情模式）
 */
interface Props {
  userData: UserVO
  isEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
})

/**
 * 定义组件事件
 * - submitRequest: 提交编辑请求（仅在编辑模式下触发）
 * - closeDialog: 关闭弹窗
 */
const emit = defineEmits<{
  handleEditSubmit: [data: UserUpdate]
  closeDialog: []
}>()

const updata = ref<UserUpdate>({
  id: props.userData.id,
  nickname: props.userData.nickname,
  avatar: props.userData.avatar,
  email: props.userData.email,
})

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
    updata.value.avatar = res.data.url
    options.onSuccess(res.data)
    ElMessage.success('上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
  }
}
/**
 * 处理提交操作
 * 仅在编辑模式下触发，将修改后的数据传递给父组件
 */
const handleSubmit = () => {
  console.log('提交数据：', updata.value)
  emit('handleEditSubmit', updata.value)
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
