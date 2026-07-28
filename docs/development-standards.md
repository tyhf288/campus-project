# Campus Project 前后端统一开发规范

## 📋 目录

- [1. 日期时间处理规范](#1-日期时间处理规范)
- [2. API 响应格式规范](#2-api-响应格式规范)
- [3. 权限控制规范](#3-权限控制规范)
- [4. 数据库设计规范](#4-数据库设计规范)
- [5. 前端开发规范](#5-前端开发规范)
- [6. 后端开发规范](#6-后端开发规范)
- [7. Git 提交规范](#7-git-提交规范)

---

## 1. 日期时间处理规范

### 1.1 核心原则

**全项目统一使用 `timestamptz`（带时区的时间戳）存储和传输日期时间数据。**

```
数据库 (timestamptz) → API 传输 (ISO 8601) → 前端展示 (本地格式化)
```

### 1.2 数据库层

#### Entity 实体定义

```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'blacklist', schema: 'userManagement' })
export class Black {
  @PrimaryKey()
  id!: number

  /** 拉黑时间 - 自动创建 */
  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt!: Date

  /** 计划解封时间（null 表示永久封禁） */
  @Property({ type: 'timestamptz', nullable: true })
  unbannedAt: Date | null = null

  /** 实际解封执行时间 */
  @Property({ type: 'timestamptz', nullable: true })
  unbannedDate: Date | null = null
}
```

**关键点：**

- ✅ 所有日期字段必须指定 `type: 'timestamptz'`
- ✅ MikroORM 会自动处理 UTC 时区转换
- ✅ 可空字段设置 `nullable: true`，默认值为 `null`

### 1.3 后端 API 层

#### Service 返回数据

```typescript
// ❌ 错误：不要在后端格式化日期
createdAt: formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss')

// ✅ 正确：直接返回 ISO 8601 格式字符串
createdAt: new Date(item.createdAt).toISOString()
// 示例输出: "2024-07-27T12:30:00.000Z"
```

**完整示例：**

```typescript
async findList(params: FilterParams): Promise<{ list: BlackVO[]; total: number }> {
  const rawData = await this.em.execute(sql, queryParams)

  const list: BlackVO[] = rawData.map((item) => ({
    id: item.id,
    createdAt: new Date(item.createdAt).toISOString(),
    unbannedAt: item.unbannedAt ? new Date(item.unbannedAt).toISOString() : null,
    unbannedDate: item.unbannedDate ? new Date(item.unbannedDate).toISOString() : null,
  }))

  return { list, total }
}
```

**关键点：**

- ✅ 使用 `.toISOString()` 转换为标准 ISO 8601 格式
- ✅ 空值使用 `null` 而非 `undefined`
- ❌ 禁止在 Service 层进行日期格式化

### 1.4 前端接收与展示

#### VO 类型定义

```typescript
// packages/types/src/vo/black.vo.ts
export interface BlackVO {
  id: number
  createdAt: string // ISO 8601 格式
  unbannedAt: string | null // ISO 8601 格式或 null
  unbannedDate: string | null
}
```

#### 前端展示格式化

```vue
<template>
  <el-table-column label="拉黑时间" prop="createdAt">
    <template #default="{ row }">
      {{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
    </template>
  </el-table-column>

  <el-table-column label="解封时间" prop="unbannedAt">
    <template #default="{ row }">
      {{ row.unbannedAt ? formatDate(row.unbannedAt, 'YYYY-MM-DD HH:mm:ss') : '永久封禁' }}
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { formatDate } from '@campus/utils'

// formatDate 内部会根据浏览器时区自动转换
// 输入: "2024-07-27T12:30:00.000Z" (UTC)
// 输出: "2024-07-27 20:30:00" (东八区)
</script>
```

**关键点：**

- ✅ 前端接收 ISO 8601 格式字符串
- ✅ 使用共享工具库 `@campus/utils` 的 `formatDate` 函数
- ✅ 格式化标准为 `YYYY-MM-DD HH:mm:ss`
- ✅ 根据用户浏览器时区自动转换

### 1.5 日期计算场景

#### 后端计算解封时间

```typescript
// 根据封禁时长（分钟）计算解封时间
const banDuration = 1440 // 24小时
const unbannedAt = new Date(Date.now() + banDuration * 60 * 1000)

const black = this.blackRepository.create({
  userId: createBlackDto.userId,
  reason: createBlackDto.reason,
  unbannedAt, // Date 对象，MikroORM 自动转为 timestamptz
})
```

#### 定时任务自动解封

```typescript
@Cron(CronExpression.EVERY_MINUTE)
async handleAutoUnban() {
  const now = new Date() // UTC 时间

  // 查询已过期但未解封的记录
  const expiredBlacks = await this.blackRepository.find({
    unbannedAt: { $lte: now },
    unbannedDate: null
  })

  for (const black of expiredBlacks) {
    black.unbannedDate = new Date() // 记录实际解封时间
  }

  await this.em.flush()
}
```

### 1.6 常见错误与解决方案

| 错误场景                | 错误示例                         | 正确做法                                                 |
| ----------------------- | -------------------------------- | -------------------------------------------------------- |
| 后端格式化日期          | `formatDate(date, 'YYYY-MM-DD')` | `date.toISOString()`                                     |
| 前端直接展示 ISO 字符串 | `{{ row.createdAt }}`            | `{{ formatDate(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}` |
| Entity 未指定类型       | `@Property() createdAt!: Date`   | `@Property({ type: 'timestamptz' })`                     |
| 空值处理不一致          | `undefined` / `""`               | 统一使用 `null`                                          |

---

## 2. API 响应格式规范

### 2.1 统一响应结构

所有 API 接口必须遵循 `{ code, message, data }` 格式：

```typescript
{
  code: number // 业务状态码，200 表示成功
  message: string // 响应消息描述
  data: any // 实际返回的数据
}
```

### 2.2 成功响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [...],
    "total": 100
  }
}
```

### 2.3 错误响应示例

```json
{
  "code": 400,
  "message": "用户不存在",
  "data": null
}
```

### 2.4 前端响应拦截器

```typescript
// apps/frontend/src/api/http/index.ts
http.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data

    if (code === 200) {
      return data // 只返回 data 字段
    } else {
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // HTTP 错误统一处理
    if (error.response?.status === 401) {
      // 未授权，跳转登录
    }
  }
)
```

### 2.5 后端异常处理

```typescript
// 主动抛出业务异常
if (!user) {
  throw new NotFoundException('用户不存在')
}

if (user.status === UserStatus.DISABLED) {
  throw new ConflictException('用户已拉黑')
}

if (userRole === UserRole.ADMIN) {
  throw new ForbiddenException('无法拉黑管理员')
}
```

---

## 3. 权限控制规范

### 3.1 RBAC 模型

基于角色的访问控制（Role-Based Access Control）：

```typescript
enum UserRole {
  ADMIN = 'admin', // 管理员
  AUDITOR = 'auditor', // 审核员
  STUDENT = 'student', // 学生
}

enum PermissionCode {
  USER_CREATE = 'user:create',
  USER_DELETE = 'user:delete',
  BLACKLIST_CREATE_STUDENT = 'blacklist:create:student',
  BLACKLIST_CREATE_AUDITOR = 'blacklist:create:auditor',
}
```

### 3.2 后端权限控制

#### Controller 层装饰器

```typescript
@Post()
@Permission([PermissionCode.BLACKLIST_CREATE_STUDENT])
create(@Body() createBlackDto: CreateBlackDto, @Req() req) {
  const { user } = req
  return this.blacksService.create(createBlackDto, user.role)
}
```

#### Service 层动态校验

```typescript
async create(createBlackDto: CreateBlackDto, role: UserRole) {
  const user = await this.usersService.findOneById(createBlackDto.userId)
  const userRole = user.role

  // 基于目标对象的动态权限校验
  const permissionCode: PermissionCode[] = [PermissionCode.BLACKLIST_CREATE_AUDITOR]
  const bool = hasPermission(role, permissionCode)

  if (userRole === UserRole.ADMIN) {
    throw new ForbiddenException('无法拉黑管理员')
  } else if (userRole === UserRole.AUDITOR && !bool) {
    throw new ForbiddenException('没有权限拉黑审核员')
  }
}
```

### 3.3 前端权限控制

#### Pinia Store

```typescript
// apps/frontend/src/stores/permission.ts
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: [] as PermissionCode[],
  }),
  actions: {
    setPermissions(permissions: PermissionCode[]) {
      this.permissions = permissions
    },
    hasPermission(code: PermissionCode): boolean {
      return this.permissions.includes(code)
    },
  },
})
```

#### v-permission 指令

```vue
<el-button v-permission="PermissionCode.USER_DELETE">删除</el-button>
```

---

## 4. 数据库设计规范

### 4.1 外键设计策略

**推荐使用逻辑外键**（不建立物理外键约束）：

```typescript
@Entity({ tableName: 'blacklist', schema: 'userManagement' })
export class Black {
  /** 用户ID（逻辑外键，不建立数据库外键约束） */
  @Property({ type: 'int' })
  userId!: number

  /** 操作人ID（逻辑外键） */
  @Property({ type: 'int' })
  operatorId!: number
}
```

**优势：**

- ✅ 删除主表记录不会因外键约束失败
- ✅ 更灵活的数据管理
- ✅ 更好的性能（无外键检查开销）

### 4.2 标识符命名规范

**PostgreSQL 大小写敏感规则：**

```sql
-- ❌ 错误：未加双引号会转为小写
FROM userManagement.blacklist

-- ✅ 正确：双引号保持原始大小写
FROM "userManagement"."blacklist"
```

**最佳实践：**

- Schema、表名、字段名使用驼峰命名时，必须用双引号包裹
- 避免混合使用带引号和不带引号的标识符

### 4.3 分页查询规范

```typescript
// 总数查询（独立 COUNT）
const countSql = `SELECT COUNT(*) as total FROM "userManagement"."blacklist" b ${whereClause}`
const countResult = await this.em.execute(countSql, queryParams)
const total = parseInt(countResult[0].total, 10)

// 列表查询（带 LIMIT/OFFSET）
const dataSql = `SELECT ... FROM ... ${whereClause} LIMIT ? OFFSET ?`
const listParams = [...queryParams, pageSizeNum, offset]
const rawData = await this.em.execute(dataSql, listParams)
```

**关键点：**

- ✅ 必须通过独立的 `COUNT(*)` 获取总数
- ❌ 禁止使用 `list.length` 作为总条数

---

## 5. 前端开发规范

### 5.1 Table 组件使用规范

```vue
<template>
  <Table
    :list="tableData.list"
    :list-total="tableData.total"
    :page="pagination.page"
    :page-size="pagination.pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <!-- 搜索表单 -->
      <el-input v-model="searchForm.keyword" placeholder="关键词" />
    </template>

    <template #table-item>
      <!-- 表格列定义 -->
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
    </template>
  </Table>
</template>

<script setup lang="ts">
const tableData = ref({ list: [], total: 0 })
const pagination = reactive({ page: 1, pageSize: 10 })

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}
</script>
```

### 5.2 布局溢出处理

**Flexbox 布局方案：**

```css
/* 父容器 */
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* 固定区域 */
.search-bar {
  flex-shrink: 0;
}

/* 可变区域 */
.table-wrapper {
  flex: 1;
  overflow: auto;
}
```

---

## 6. 后端开发规范

### 6.1 Service 层集成规范

**同时注入 EntityManager 和 EntityRepository：**

```typescript
@Injectable()
export class BlacksService {
  constructor(
    private readonly em: EntityManager, // 事务控制、批量操作
    @InjectRepository(Black)
    private readonly blackRepository: EntityRepository<Black>, // CRUD 查询
    private readonly usersService: UsersService
  ) {}
}
```

**职责划分：**

- **EntityManager**: 事务控制、批量操作、`assign` 合并变更、`flush` 持久化
- **EntityRepository**: 便捷的 `find`/`findOne` 等查询方法

### 6.2 模块依赖规范

**子模块必须显式导入所需模块：**

```typescript
@Module({
  imports: [
    MikroOrmModule.forFeature([Black]), // 注册实体
    ScheduleModule.forRoot(), // 定时任务
    UsersModule, // 跨模块服务
  ],
  controllers: [BlacksController],
  providers: [BlacksService, BlacksScheduler],
  exports: [BlacksService],
})
export class BlacksModule {}
```

**注意：**

- ❌ 父模块导入的模块不会自动传递给子模块
- ✅ 每个子模块必须在 `imports` 中显式声明依赖

### 6.3 DTO 设计规范

**优先使用 `implements` 而非 `extends`：**
**注意：**

- ✅ dto 继承于type子包的api文件下定义的接口

```typescript
export class CreateBlackDto implements ICreateBlackDto {
  @ApiProperty({ description: '用户ID' })
  @IsInt()
  userId!: number

  @ApiProperty({ description: '拉黑原因' })
  @IsString()
  reason!: string

  @ApiProperty({
    description: '封禁时长(分钟)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  banDuration?: number
}
```

---

## 7. Git 提交规范

### 7.1 Conventional Commits 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 7.2 Type 类型

| 类型       | 说明                   |
| ---------- | ---------------------- |
| `feat`     | 新功能                 |
| `fix`      | 修复 bug               |
| `docs`     | 文档变更               |
| `style`    | 代码格式（不影响功能） |
| `refactor` | 重构                   |
| `test`     | 测试相关               |
| `chore`    | 构建过程或辅助工具变动 |
| `perf`     | 性能优化               |
| `ci`       | CI/CD 配置变更         |

### 7.3 Scope 范围

- `backend` - 后端服务
- `frontend` - Web 管理端
- `applet` - 移动端小程序
- `types` - 共享类型定义
- `utils` - 共享工具函数
- `eslint-config` - ESLint 配置

### 7.4 示例

```bash
# 新功能
feat(blacks): 添加自动解封定时任务

# 修复 bug
fix(auth): 修复微信登录 token 过期问题

# 文档更新
docs: 完善开发规范文档

# 重构
refactor(utils): 优化日期格式化函数性能
```

---

## 📝 附录

### A. 常用工具函数

#### 日期格式化

```typescript
// packages/utils/src/FormatDate/index.ts
export function formatDate(dateStr: string | null, format: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
```

#### 权限检查

```typescript
// packages/utils/src/permission.ts
export function hasPermission(
  userRole: UserRole,
  permissionCode: PermissionCode | PermissionCode[]
): boolean {
  // ADMIN 角色拥有所有权限
  if (userRole === UserRole.ADMIN) return true

  const codes = Array.isArray(permissionCode) ? permissionCode : [permissionCode]
  const permissions = getPermissionsByRole(userRole)

  return codes.every((code) => permissions.includes(code))
}
```

### B. 快速参考

| 场景     | 规范                       |
| -------- | -------------------------- |
| 日期存储 | `timestamptz`              |
| 日期传输 | ISO 8601 (`toISOString()`) |
| 日期展示 | `YYYY-MM-DD HH:mm:ss`      |
| API 响应 | `{ code, message, data }`  |
| 空值表示 | `null`                     |
| 外键策略 | 逻辑外键（无物理约束）     |
| 分页总数 | 独立 `COUNT(*)` 查询       |
| 权限模型 | RBAC                       |
| Git 提交 | Conventional Commits       |

---

**文档版本**: v1.0  
**最后更新**: 2026-07-27  
**维护者**: tyhf
