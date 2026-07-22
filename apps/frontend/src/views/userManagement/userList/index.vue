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
        <el-select placeholder="请选择角色" style="width: 140px" v-model="userFilterGet.role">
          <el-option
            v-for="item in roleDict"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select placeholder="请选择状态" style="width: 140px" v-model="userFilterGet.status">
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
        <el-button type="success" @click="resetSearch">创建</el-button>
      </el-form-item>
    </template>
    <template v-slot:table-item>
      <el-table-column label="账号" prop="loginKey" align="center" />
      <el-table-column label="昵称" prop="nickname" align="center" />
      <el-table-column label="头像" prop="avatar" width="80px" align="center" />
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
      <el-table-column label="操作" width="180px" align="center">
        <template v-slot="{ row }">
          <el-button type="success" link> 详情 </el-button>
          <el-button type="primary" link> 编辑 </el-button>
          <el-button type="danger" link> 拉黑 </el-button>
        </template>
      </el-table-column>
    </template>
  </Table>
</template>
<script setup lang="ts">
import { getUserList } from '@/api/userManagement/userList'
import type { UserFilterGet } from '@campus/types'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'
import Table from '@/components/Table/index.vue'

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

//获取用户列表
const userList = ref([])
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
