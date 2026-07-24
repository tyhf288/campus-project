# Table 组件快速上手指南

## 📦 基础用法

```vue
<template>
  <Table
    :list="dataList"
    :list-total="total"
    :page="currentPage"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <!-- 搜索表单 -->
    </template>
    <template #table-item>
      <!-- 表格列定义 -->
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'

// 表格数据列表
const dataList = ref([])
// 数据总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(10)

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

/**
 * 获取数据
 */
const fetchData = async () => {
  // TODO: 调用 API
}
</script>
```

---

## 💡 实际案例

### 案例1: 用户列表

```vue
<template>
  <Table
    :list="userList"
    :list-total="total"
    :page="currentPage"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <!-- 搜索表单 -->
    <template #form-item>
      <el-form-item label="用户名">
        <el-input v-model="searchForm.username" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择" clearable>
          <el-option label="正常" value="active" />
          <el-option label="禁用" value="disabled" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </template>

    <!-- 表格列 -->
    <template #table-item>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="150" />
      <el-table-column prop="email" label="邮箱" min-width="200" show-overflow-tooltip />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'

// 用户列表数据
const userList = ref([])
// 数据总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(10)

// 搜索表单数据
const searchForm = reactive({
  username: '',
  status: '',
})

/**
 * 获取用户列表数据
 */
const fetchData = async () => {
  // TODO: 调用 API
  console.log('获取数据', { page: currentPage.value, pageSize: pageSize.value, ...searchForm })
}

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

/**
 * 重置搜索条件
 */
const handleReset = () => {
  searchForm.username = ''
  searchForm.status = ''
  handleSearch()
}

/**
 * 处理编辑用户
 * @param row - 用户行数据
 */
const handleEdit = (row: any) => {
  console.log('编辑:', row)
}

/**
 * 处理删除用户
 * @param row - 用户行数据
 */
const handleDelete = (row: any) => {
  console.log('删除:', row)
}

fetchData()
</script>
```

---

### 案例2: 商品列表

```vue
<template>
  <Table
    :list="goodsList"
    :list-total="total"
    :page="currentPage"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <el-form-item label="商品名称">
        <el-input v-model="searchForm.title" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchForm.categoryId" placeholder="请选择" clearable>
          <el-option label="图书" :value="1" />
          <el-option label="电子产品" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </template>

    <template #table-item>
      <el-table-column prop="id" label="ID" width="80" />

      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            fit="cover"
            style="width: 60px; height: 60px; border-radius: 4px"
          />
        </template>
      </el-table-column>

      <el-table-column prop="title" label="商品名称" min-width="200" show-overflow-tooltip />

      <el-table-column label="价格" width="120">
        <template #default="{ row }">
          <span style="color: #f56c6c; font-weight: bold">¥{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="categoryName" label="分类" width="100" />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'approved' ? 'success' : 'warning'">
            {{ row.status === 'approved' ? '已通过' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'

// 商品列表数据
const goodsList = ref([])
// 数据总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(10)

// 搜索表单数据
const searchForm = reactive({
  title: '',
  categoryId: null,
})

/**
 * 获取商品列表数据
 */
const fetchData = async () => {
  // TODO: 调用 API
}

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

/**
 * 重置搜索条件
 */
const handleReset = () => {
  searchForm.title = ''
  searchForm.categoryId = null
  handleSearch()
}

/**
 * 处理查看商品
 * @param row - 商品行数据
 */
const handleView = (row: any) => console.log('查看:', row)

/**
 * 处理编辑商品
 * @param row - 商品行数据
 */
const handleEdit = (row: any) => console.log('编辑:', row)

fetchData()
</script>
```

---

### 案例3: 帖子列表（带展开行）

```vue
<template>
  <Table
    :list="postList"
    :list-total="total"
    :page="currentPage"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <el-form-item label="标题">
        <el-input v-model="searchForm.keyword" placeholder="关键词" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </template>

    <template #table-item>
      <!-- 展开行显示详情 -->
      <el-table-column type="expand">
        <template #default="{ row }">
          <div style="padding: 20px">
            <p><strong>内容:</strong></p>
            <p>{{ row.content }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />

      <el-table-column label="作者" width="150">
        <template #default="{ row }">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-avatar :size="32" :src="row.authorAvatar" />
            <span>{{ row.authorName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="互动" width="150">
        <template #default="{ row }">
          👁 {{ row.viewCount }} | ❤️ {{ row.likeCount }} | 💬 {{ row.commentCount }}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'approved' ? 'success' : 'warning'">
            {{ row.status === 'approved' ? '已通过' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="时间" width="180">
        <template #default="{ row }">
          {{ new Date(row.createdAt).toLocaleString() }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'pending'"
            size="small"
            type="success"
            @click="handleApprove(row)"
          >
            通过
          </el-button>
          <el-button size="small" @click="handleDetail(row)">详情</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'

// 帖子列表数据
const postList = ref([])
// 数据总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(10)

// 搜索表单数据
const searchForm = reactive({
  keyword: '',
})

/**
 * 获取帖子列表数据
 */
const fetchData = async () => {
  // TODO: 调用 API
}

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

/**
 * 重置搜索条件
 */
const handleReset = () => {
  searchForm.keyword = ''
  handleSearch()
}

/**
 * 处理审核通过
 * @param row - 帖子行数据
 */
const handleApprove = (row: any) => console.log('通过:', row)

/**
 * 处理查看详情
 * @param row - 帖子行数据
 */
const handleDetail = (row: any) => console.log('详情:', row)

/**
 * 处理删除帖子
 * @param row - 帖子行数据
 */
const handleDelete = (row: any) => console.log('删除:', row)

fetchData()
</script>
```

---

## ⚙️ Props 参数

| 参数      | 类型   | 必填 | 说明     |
| --------- | ------ | ---- | -------- |
| list      | Array  | ✅   | 表格数据 |
| listTotal | Number | ✅   | 数据总数 |
| page      | Number | ✅   | 当前页码 |
| pageSize  | Number | ✅   | 每页条数 |

---

## 📤 Events 事件

| 事件名              | 回调参数                | 说明         |
| ------------------- | ----------------------- | ------------ |
| handleSizeChange    | `(pageSize: number)`    | 每页条数改变 |
| handleCurrentChange | `(currentPage: number)` | 页码改变     |

---

## 🎰 Slots 插槽

### form-item

搜索表单区域，放置 `el-form-item`

### table-item

表格列定义区域，放置 `el-table-column`

---

## ⚠️ 注意事项

1. **确保父容器有高度约束**

   ```vue
   <!-- 在父级组件中设置高度 -->
   <template>
     <div class="page-container">
       <Table ... />
     </div>
   </template>
   ```

2. **分页事件必须处理**

   ```typescript
   const handleSizeChange = (val: number) => {
     pageSize.value = val
     currentPage.value = 1 // 重置到第一页
     fetchData()
   }
   ```

3. **固定列使用 fixed 属性**

   ```vue
   <el-table-column prop="id" label="ID" width="80" fixed="left" />
   <el-table-column label="操作" width="150" fixed="right" />
   ```

4. **文本溢出显示省略号**
   ```vue
   <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
   ```

---

## 🚀 快速开始模板

复制以下代码即可快速开始：

```vue
<template>
  <Table
    :list="list"
    :list-total="total"
    :page="page"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <el-form-item label="搜索">
        <el-input v-model="keyword" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
      </el-form-item>
    </template>

    <template #table-item>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" min-width="200" />
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'

// 表格数据列表
const list = ref([])
// 数据总数
const total = ref(0)
// 当前页码
const page = ref(1)
// 每页显示条数
const pageSize = ref(10)
// 搜索关键词
const keyword = ref('')

/**
 * 获取数据
 */
const fetchData = () => {
  // TODO: 调用 API
}

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  page.value = val
  fetchData()
}

/**
 * 处理编辑
 * @param row - 行数据
 */
const handleEdit = (row: any) => {
  console.log('编辑:', row)
}

fetchData()
</script>
```
