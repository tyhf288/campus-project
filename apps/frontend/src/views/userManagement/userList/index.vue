<template>
  <Table
    :list="userList"
    :listTotal="listTotal"
    :page="userFilterGet.page"
    :pageSize="userFilterGet.pageSize"
    @handleSizeChange="handleSizeChange"
    @handleCurrentChange="handleCurrentChange"
  >
    <template v-slot:form-item>
      <el-form-item label="用户名">
        <el-input clearable placeholder="请输入用户名" v-model="userFilterGet.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input placeholder="请输入邮箱" clearable v-model="userFilterGet.email"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-select
          placeholder="请选择角色"
          style="width: 140px"
          v-model="userFilterGet.role"
          :clearable="true"
        >
          <el-option
            v-for="item in roleDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          placeholder="请选择状态"
          style="width: 140px"
          v-model="userFilterGet.status"
          :clearable="true"
        >
          <el-option
            v-for="item in statusDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button type="info" @click="resetSearch">重置</el-button>
        <el-button
          type="success"
          @click="showRegisterDialog"
          v-permission="[PermissionCode.USER_CREATE]"
          >创建</el-button
        >
      </el-form-item>
    </template>
    <template v-slot:table-item>
      <el-table-column label="账号" prop="loginKey" align="center" />
      <el-table-column label="昵称" prop="nickname" align="center" />
      <el-table-column label="头像" prop="avatar" width="80px" align="center">
        <template v-slot="{ row }">
          <el-avatar :src="row.avatar" fit="cover"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="邮箱"
        prop="email"
        width="240px"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column label="状态" prop="status" width="80px" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.status === UserStatus.ACTIVE" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="role" width="95px" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.role === UserRole.ADMIN" type="danger">管理员</el-tag>
          <el-tag v-else-if="row.role === UserRole.AUDITOR" type="warning">审核员</el-tag>
          <el-tag v-else type="success">用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="终端" prop="terminal" width="95px" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.terminal === UserTerminal.MINI_PROGRAM" type="success">小程序</el-tag>
          <el-tag v-else type="warning">PC端</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" align="center" />
      <el-table-column label="更新时间" prop="updatedAt" align="center" />
      <el-table-column label="操作" width="240px" align="center">
        <template v-slot="{ row }">
          <el-button type="info" link @click="showDetail(row)"> 详情 </el-button>
          <el-button
            type="primary"
            link
            @click="showEdit(row)"
            v-permission="[PermissionCode.USER_CREATE]"
          >
            编辑
          </el-button>
          <el-button type="danger" link @click="pullBlack(row)" v-permission="permissionCode">
            拉黑
          </el-button>
        </template>
      </el-table-column>
    </template>
  </Table>

  <!--创建用户弹窗-->
  <el-dialog
    v-model="registerDialogVisible"
    title="创建用户"
    width="500"
    :show-close="true"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
  >
    <RegisterDialog @submitRequest="handleRegisterSubmit" @closeDialog="closeRegisterDialog" />
  </el-dialog>

  <!--用户详情/编辑弹窗-->
  <el-dialog
    v-model="detailDialogVisible"
    :title="isEditMode ? '编辑用户' : '用户详情'"
    width="500"
    :show-close="true"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
  >
    <UserDetailDialog
      :userData="currentUser"
      :isEdit="isEditMode"
      @handleEditSubmit="handleEditSubmit"
      @closeDialog="closeDetailDialog"
    />
  </el-dialog>

  <!--拉黑弹窗-->
  <el-dialog
    v-model="pullBackDialogVisible"
    title="拉黑用户"
    width="500"
    :show-close="true"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
  >
    <PullBlack
      :pullList="pullList"
      @pullBlackRequest="pullBlackRequest"
      @closeDialog="closeDialog"
    ></PullBlack>
  </el-dialog>
</template>
<script setup lang="ts">
import { getUserList } from '@/api/userManagement/userList'
import type { UserFilterGet, UserVO, BlackCreate, registerVO, UserUpdate } from '@campus/types'
import { UserRole, UserStatus, UserTerminal, PermissionCode } from '@campus/types'
import Table from '@/components/Table/index.vue'
import PullBlack from './pullBlack.vue'
import RegisterDialog from './RegisterDialog.vue'
import UserDetailDialog from './UserDetailDialog.vue'
import { useAdminStore } from '@/stores/admin.ts'
import { hasPermission } from '@campus/utils'
import { createBlack } from '@/api/userManagement/blackList/index.ts'
import { register, updateUser } from '@/api/userManagement/userList/index.ts'

//请求参数
const userFilterGet = ref<UserFilterGet>({
  page: 1,
  pageSize: 10,
  nickname: '',
  email: '',
  role: undefined,
  status: undefined,
})

//角色字典
const roleDict = ref([
  {
    label: '管理员',
    value: UserRole.ADMIN,
  },
  {
    label: '审核员',
    value: UserRole.AUDITOR,
  },
  {
    label: '用户',
    value: UserRole.STUDENT,
  },
])
//状态字典
const statusDict = ref([
  {
    label: '正常',
    value: UserStatus.ACTIVE,
  },
  {
    label: '禁用',
    value: UserStatus.DISABLED,
  },
])
//按钮权限
const permissionCode: PermissionCode[] = [PermissionCode.BLACKLIST_CREATE_STUDENT]

//获取用户列表
const userList = ref<UserVO[]>([])
const listTotal = ref()
const getList = async () => {
  const res = await getUserList(userFilterGet.value)
  userList.value = res.data.list
  listTotal.value = res.data.total
}

//重置搜索条件
const resetSearch = () => {
  userFilterGet.value = {
    page: 1,
    pageSize: 10,
    nickname: '',
    email: '',
    role: undefined,
    status: undefined,
  }
  getList()
}

//更改每页条数
const handleSizeChange = (val: number) => {
  userFilterGet.value.pageSize = val
  getList()
}
//更改当前页码
const handleCurrentChange = (val: number) => {
  userFilterGet.value.page = val
  getList()
}

/**
 * 创建用户相关
 */

/**
 * 创建用户弹窗显示状态
 */
const registerDialogVisible = ref(false)

/**
 * 打开创建用户弹窗
 */
const showRegisterDialog = () => {
  registerDialogVisible.value = true
}

/**
 * 关闭创建用户弹窗
 */
const closeRegisterDialog = () => {
  registerDialogVisible.value = false
}

/**
 * 处理创建用户提交
 * @param data - 注册表单数据
 */
const handleRegisterSubmit = async (data: registerVO) => {
  try {
    await register(data)
    ElMessage.success('创建成功')
    getList()
  } catch (error) {
    ElMessage.error('创建失败')
  } finally {
    closeRegisterDialog()
  }
}

/**
 * 详情/编辑相关
 */

/**
 * 详情/编辑弹窗显示状态
 */
const detailDialogVisible = ref(false)

/**
 * 当前选中的用户数据
 */
const currentUser = ref<UserVO>({
  id: 0,
  loginKey: '',
  nickname: '',
  avatar: null,
  email: null,
  status: UserStatus.ACTIVE,
  role: UserRole.STUDENT,
  terminal: UserTerminal.MINI_PROGRAM,
  createdAt: '',
  updatedAt: '',
})

/**
 * 是否为编辑模式
 */
const isEditMode = ref(false)

/**
 * 显示用户详情弹窗
 * @param row - 用户行数据
 */
const showDetail = (row: any) => {
  currentUser.value = { ...row }
  isEditMode.value = false
  detailDialogVisible.value = true
}

/**
 * 显示用户编辑弹窗
 * @param row - 用户行数据
 */
const showEdit = (row: any) => {
  currentUser.value = { ...row }
  isEditMode.value = true
  detailDialogVisible.value = true
}

/**
 * 关闭详情/编辑弹窗
 */
const closeDetailDialog = () => {
  detailDialogVisible.value = false
}

/**
 * 处理编辑用户提交
 * @param data - 修改后的用户数据
 */
const handleEditSubmit = async (data: UserUpdate) => {
  try {
    await updateUser(data)
    ElMessage.success('编辑成功')
    getList()
  } catch (error) {
    ElMessage.error('编辑失败')
  } finally {
    closeDetailDialog()
  }
}

/**
 * 拉黑弹窗
 */

//定义拉黑弹窗传入的参数
interface PullList {
  userId: number
  operatorId: number
  userNickname: string
  userLoginKey: string
  operatorNickname: string
}

const pullBackDialogVisible = ref(false)
//关闭弹窗
const closeDialog = () => {
  pullBackDialogVisible.value = false
}
//弹窗传入的参数
const pullList = ref<PullList>({
  userId: 0,
  operatorId: 0,
  userNickname: '',
  userLoginKey: '',
  operatorNickname: '',
})

//从store中获取当前管理员数据
const adminStore = useAdminStore()

//拉黑按钮
const pullBlack = (row: any) => {
  if (row.status === UserStatus.DISABLED) {
    ElMessage.error('用户已拉黑')
    return
  }
  if (row.id === adminStore.state.user.id) {
    ElMessage.error('不能拉黑自己')
    return
  }
  //查询拉黑权限
  const bool = hasPermission(adminStore.state.user.role, PermissionCode.BLACKLIST_CREATE_AUDITOR)
  if ((adminStore.state.user.role === UserRole.AUDITOR && !bool) || row.role === UserRole.ADMIN) {
    ElMessage.error('没有拉黑权限')
    return
  }
  pullList.value = {
    userId: row.id,
    operatorId: adminStore.state.user.id,
    userNickname: row.nickname,
    operatorNickname: adminStore.state.user.nickname,
    userLoginKey: row.loginKey,
  }

  pullBackDialogVisible.value = true
}
//进行拉黑请求
const pullBlackRequest = async (pullCreate: BlackCreate) => {
  try {
    await createBlack(pullCreate)
    ElMessage.success('拉黑成功')
    getList()
  } catch (error) {
    ElMessage.error('拉黑失败')
  } finally {
    closeDialog()
  }
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.table-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #fff;
}
footer {
  display: flex;
  justify-content: flex-end;
}
</style>
