# 📋 项目开发进度排单

> **最后更新时间**: 2026-08-17  
> **项目状态**: 二手商品模块三端（后端 + PC 管理端 + 小程序）基本打通，进入校园墙等后续模块开发阶段

---

## 📊 整体进度概览

| 模块分类        | 完成度 | 优先级 | 状态说明                                  |
| --------------- | ------ | ------ | ----------------------------------------- |
| ✅ 基础设施层   | 100%   | -      | 已完成                                    |
| ✅ 认证授权模块 | 95%    | P0     | 微信登录 / JWT / RBAC 权限守卫 已完成     |
| ✅ 用户管理模块 | 90%    | P0     | 用户 CRUD + 黑名单 + 自动解封 已完成      |
| 🚧 二手商品管理 | 85%    | **P0** | 后端 + PC 端已完成，小程序详情/收藏待补全 |
| ❌ 校园墙管理   | 5%     | **P0** | 仅小程序占位页面 + PC 端占位路由          |
| ❌ 举报工单模块 | 5%     | **P1** | 仅 PC 端占位路由（空页面）                |
| ❌ 系统设置模块 | 5%     | P1     | 仅 PC 端占位路由（空页面）                |
| ❌ 系统日志模块 | 5%     | P2     | 仅 PC 端占位路由（空页面）                |

> **说明**：完成度以「后端 Service/Controller + PC 管理端页面 + 小程序页面」三端联动为准，非仅统计某一端。

---

## ✅ 已完成工作清单

> 依据当前代码库实际结构与 Git 提交记录整理。

### 基础设施层（100%）

- [x] Monorepo 工程化：pnpm workspace + Turborepo 统一编排（`dev`/`build`/`type-check`/`lint`）
- [x] 共享类型包 `@campus/types`（VO / API / 枚举 / 通用分页与响应）
- [x] 共享工具包 `@campus/utils`（`formatDate` / `hasPermission` / `filterMenuByRoute`）
- [x] 统一 ESLint 配置 `@campus/eslint-config`
- [x] Git 提交规范：commitlint + commitizen + husky + lint-staged
- [x] 后端日志（nestjs-pino）、限流（@nestjs/throttler）、安全头（helmet）、全局异常过滤器与响应拦截器
- [x] Swagger API 文档、MikroORM 迁移 + Seeder（用户 / 商品种子工厂）

### 认证授权模块（95%）

- [x] 微信小程序登录（`code2session`）`auth/wechat.service.ts`
- [x] JWT 签发与全局认证守卫 `auth/guard/auth.guard.ts`
- [x] `@Public()` 公开路由装饰器 + `@Permission()` 权限装饰器 + 权限守卫
- [x] RBAC 三角色模型：`admin` / `auditor` / `student`

### 用户管理模块（90%）

- [x] 用户 CRUD + 角色分配
- [x] 头像上传（阿里云 OSS）
- [x] 黑名单封禁/解封 + 逻辑外键 + 分页原生 SQL（独立 COUNT）
- [x] 自动解封定时任务 `blacks/blacks.scheduler.ts`（`@Cron` 每分钟）
- [x] Bull 队列异步解封处理器 `blacks/unban.processor.ts`

### 二手商品管理模块（85%）

**后端 `apps/backend/src/goods-manage/`**：

- [x] `goods` 商品 CRUD + 审核（`goods-audit.controller.ts`）+ **Redis 分布式锁**防并发审核（`audit-lock.service.ts`）
- [x] `category` 分类管理、`collect` 收藏、`message` 商品留言
- [x] 商品实体（`good.entity.ts`）+ 图片实体（`image.entity.ts`）
- [x] 商品发布 + OSS 客户端直传签名（小程序直传）

**PC 管理端 `apps/frontend/src/views/goodsManage/`**：

- [x] 商品审核 `goodsAudit`（列表 + 批量/单条通过拒绝 + 理由）
- [x] 全部商品 `goodsAll`（分页 + 筛选 + 详情弹窗 + 编辑 + 下架）
- [x] 分类管理 `category`（树形 + 增删改）
- [x] API 封装 `api/goodsManage/{goods,category}/index.ts`
- [x] 虚拟滚动模块（解决长列表加载）

**小程序 `apps/applet/src/`**：

- [x] 商品发布 `sub-goods/pages/goods/publish.vue` + `pages/publish/index.vue`
- [x] 商品列表/首页 `sub-goods/pages/market/index.vue`、`pages/index/index.vue`
- [x] 商品 API 封装 `api/goods/index.ts`
- [ ] 商品详情 `sub-goods/pages/goods/detail.vue`（占位）
- [ ] 分类页 `sub-goods/pages/market/category.vue`（占位）
- [ ] 我的商品 / 我的收藏（占位）

---

## 🎯 开发优先级说明

### **P0 - 核心业务（必须优先完成）**

- 直接影响产品核心功能上线
- 用户高频使用场景
- 其他模块的依赖基础

### **P1 - 运营支撑（次优先）**

- 提升平台治理能力
- 内容安全与合规性保障
- 用户体验优化

### **P2 - 辅助功能（最后完善）**

- 运维监控与审计
- 数据分析支持
- 长期稳定性保障

---

## 🚀 第一阶段：核心业务模块（预计 4-6 周）

### 模块一：二手商品管理 🛍️ —— 🚧 三端基本打通（约 85%）

> **当前状态**：后端 + PC 管理端已完成，小程序端商品详情/分类/我的商品/收藏仍为占位页面，待补全后即可整体验收。以下为原始任务清单，已完成项见上方「已完成工作清单」。

**业务价值**: 校园二手交易平台核心功能，促进资源循环利用

#### 后端开发任务

##### 1.1 数据库设计

- [ ] 创建 `Goods` Entity（商品表）
- [ ] 创建 `Category` Entity（分类表）
- [ ] 创建枚举定义（GoodsStatus: PENDING/APPROVED/REJECTED/OFFLINE）

##### 1.2 DTO 定义

- [ ] `CreateGoodsDto` - 创建商品
- [ ] `UpdateGoodsDto` - 更新商品
- [ ] `GoodsFilterDto` - 商品筛选参数
- [ ] `AuditGoodsDto` - 审核商品（通过/拒绝）
- [ ] `CreateCategoryDto` - 创建分类
- [ ] `UpdateCategoryDto` - 更新分类

##### 1.3 Service 层实现

- [ ] `GoodsService`
  - [ ] `create()` - 创建商品（自动设为待审核状态）
  - [ ] `findAll()` - 分页查询商品列表（支持多条件筛选）
  - [ ] `findOne()` - 查询商品详情
  - [ ] `update()` - 更新商品信息
  - [ ] `remove()` - 删除/下架商品
  - [ ] `audit()` - 审核商品（管理员/审核员权限）
  - [ ] `getBySeller()` - 查询某卖家的所有商品

- [ ] `CategoryService`
  - [ ] `create()` - 创建分类
  - [ ] `findAll()` - 查询所有分类（树形结构）
  - [ ] `update()` - 更新分类
  - [ ] `remove()` - 删除分类（需检查是否有商品关联）

##### 1.4 Controller 层实现

- [ ] `GoodsController`
  - [ ] `POST /goods` - 创建商品
  - [ ] `GET /goods` - 查询商品列表
  - [ ] `GET /goods/:id` - 查询商品详情
  - [ ] `PATCH /goods/:id` - 更新商品
  - [ ] `DELETE /goods/:id` - 删除商品
  - [ ] `POST /goods/:id/audit` - 审核商品（需要权限）

- [ ] `CategoryController`
  - [ ] `POST /categories` - 创建分类
  - [ ] `GET /categories` - 查询分类列表
  - [ ] `PATCH /categories/:id` - 更新分类
  - [ ] `DELETE /categories/:id` - 删除分类

##### 1.5 模块注册

- [ ] 创建 `GoodsModule`
- [ ] 在 `AppModule` 中导入

#### 前端开发任务

##### 1.6 API 封装

- [ ] `apps/frontend/src/api/goodsManage/index.ts`

##### 1.7 页面开发

- [ ] **商品审核页面** (`apps/frontend/src/views/goodsManage/goodsAudit/index.vue`)
  - [ ] 商品列表表格（显示待审核商品）
  - [ ] 筛选功能（按分类、时间范围）
  - [ ] 审核操作按钮（通过/拒绝 + 理由输入）
  - [ ] 批量审核功能

- [ ] **全部商品页面** (`apps/frontend/src/views/goodsManage/goodsAll/index.vue`)
  - [ ] 商品列表表格（支持分页）
  - [ ] 高级筛选（价格区间、分类、状态、卖家）
  - [ ] 商品详情弹窗
  - [ ] 下架/删除操作

- [ ] **分类管理页面** (`apps/frontend/src/views/goodsManage/category/index.vue`)
  - [ ] 树形分类展示
  - [ ] 新增/编辑/删除分类
  - [ ] 拖拽排序功能
  - [ ] 启用/禁用开关

##### 1.8 类型定义

- [ ] `packages/types/src/vo/goods.vo.ts` - 商品 VO
- [ ] `packages/types/src/api/goods.api.ts` - 商品 API 类型
- [ ] `packages/types/src/enum/goods.enum.ts` - 商品状态枚举

#### 验收标准

- [ ] 商品 CRUD 功能正常
- [ ] 审核流程完整（待审核 → 已通过/已拒绝）
- [ ] 分类树形结构正确展示
- [ ] 图片上传功能正常（复用 OSS 服务）
- [ ] 权限控制生效（仅管理员/审核员可审核）

---

### 模块二：校园墙管理 📝 —— ❌ 未开始（仅占位）

> **当前状态**：后端无 `post`/`comment`/`board` 模块；PC 端 4 个页面（审核/全部/评论/板块）均为 3 行空占位；小程序 `sub-wall` 分包为占位页面。是下一优先级待开发模块。

**业务价值**: 校园社交核心功能，促进学生交流互动

#### 后端开发任务

##### 2.1 数据库设计

- [ ] 创建 `Post` Entity（帖子表）
- [ ] 创建 `Comment` Entity（评论表）
- [ ] 创建 `Board` Entity（板块表）
- [ ] 创建枚举定义（PostStatus, CommentStatus）

##### 2.2 敏感词集成

- [ ] 在 `PostService.create()` 和 `CommentService.create()` 中集成敏感词检测
- [ ] 调用系统设置模块的敏感词匹配服务
- [ ] 发现敏感词时阻止发布并返回提示

##### 2.3 Service 层实现

- [ ] `PostService`
  - [ ] `create()` - 创建帖子（含敏感词检测）
  - [ ] `findAll()` - 分页查询帖子列表
  - [ ] `findOne()` - 查询帖子详情（增加浏览量）
  - [ ] `update()` - 更新帖子
  - [ ] `remove()` - 删除帖子
  - [ ] `audit()` - 审核帖子
  - [ ] `like()` - 点赞帖子

- [ ] `CommentService`
  - [ ] `create()` - 发表评论（含敏感词检测）
  - [ ] `findByPost()` - 查询某帖子的所有评论
  - [ ] `remove()` - 删除评论
  - [ ] `audit()` - 审核评论

- [ ] `BoardService`
  - [ ] `create()` - 创建板块
  - [ ] `findAll()` - 查询所有板块
  - [ ] `update()` - 更新板块配置
  - [ ] `remove()` - 删除板块

##### 2.4 Controller 层实现

- [ ] `PostController`
  - [ ] `POST /posts` - 创建帖子
  - [ ] `GET /posts` - 查询帖子列表
  - [ ] `GET /posts/:id` - 查询帖子详情
  - [ ] `PATCH /posts/:id` - 更新帖子
  - [ ] `DELETE /posts/:id` - 删除帖子
  - [ ] `POST /posts/:id/audit` - 审核帖子
  - [ ] `POST /posts/:id/like` - 点赞帖子

- [ ] `CommentController`
  - [ ] `POST /comments` - 发表评论
  - [ ] `GET /comments/post/:postId` - 查询帖子评论
  - [ ] `DELETE /comments/:id` - 删除评论

- [ ] `BoardController`
  - [ ] `POST /boards` - 创建板块
  - [ ] `GET /boards` - 查询板块列表
  - [ ] `PATCH /boards/:id` - 更新板块
  - [ ] `DELETE /boards/:id` - 删除板块

#### 前端开发任务

##### 2.5 API 封装

- [ ] `apps/frontend/src/api/postManage/index.ts`

##### 2.6 页面开发

- [ ] **帖子审核页面** (`apps/frontend/src/views/postManage/postAudit/index.vue`)
  - [ ] 待审核帖子列表
  - [ ] 帖子预览（标题、内容、图片）
  - [ ] 审核操作（通过/拒绝 + 理由）

- [ ] **全部帖子页面** (`apps/frontend/src/views/postManage/postAll/index.vue`)
  - [ ] 帖子列表（支持按板块、状态筛选）
  - [ ] 帖子详情查看
  - [ ] 删除/隐藏操作

- [ ] **评论管理页面** (`apps/frontend/src/views/postManage/comment/index.vue`)
  - [ ] 评论列表（按帖子分组展示）
  - [ ] 评论内容搜索
  - [ ] 删除违规评论

- [ ] **板块配置页面** (`apps/frontend/src/views/postManage/board/index.vue`)
  - [ ] 板块列表管理
  - [ ] 新增/编辑板块
  - [ ] 板块启用/禁用

#### 验收标准

- [ ] 帖子发布流程完整（含敏感词检测）
- [ ] 评论嵌套回复功能正常
- [ ] 板块配置灵活可调整
- [ ] 审核流程与商品模块保持一致

---

### 模块三：举报工单模块 🚨 —— ❌ 未开始（仅占位）

> **当前状态**：后端无 `report` 模块；PC 端 `reportManage` 两个页面为空占位。依赖商品/帖子模块成型后开发。

**业务价值**: 平台内容治理核心，保障社区健康环境

#### 后端开发任务

##### 3.1 数据库设计

- [ ] 创建 `Report` Entity（举报表）
- [ ] 创建枚举定义（ReportType: GOODS/POST/COMMENT/USER, ReportStatus: PENDING/PROCESSING/RESOLVED/IGNORED）

##### 3.2 自动处罚逻辑

- [ ] 在 `ReportService.resolve()` 中实现：
  - [ ] 举报成立时，根据类型自动触发相应处罚
  - [ ] 商品举报成立 → 自动下架商品
  - [ ] 帖子举报成立 → 自动隐藏帖子
  - [ ] 用户多次被举报 → 自动加入黑名单

##### 3.3 Service 层实现

- [ ] `ReportService`
  - [ ] `create()` - 提交举报
  - [ ] `findPending()` - 查询待处理举报
  - [ ] `findHistory()` - 查询历史举报记录
  - [ ] `resolve()` - 处理举报（标记为已解决/忽略）
  - [ ] `getStatistics()` - 获取举报统计数据

#### 前端开发任务

##### 3.4 页面开发

- [ ] **待处理举报页面** (`apps/frontend/src/views/reportManage/pending/index.vue`)
  - [ ] 举报列表（按紧急程度排序）
  - [ ] 举报详情查看（被举报内容预览）
  - [ ] 处理操作（成立/不成立 + 处理说明）

- [ ] **举报记录页面** (`apps/frontend/src/views/reportManage/history/index.vue`)
  - [ ] 历史举报列表
  - [ ] 筛选功能（时间范围、处理结果、举报类型）
  - [ ] 导出功能（可选）

#### 验收标准

- [ ] 举报提交流程完整
- [ ] 处理流程清晰（待处理 → 已处理）
- [ ] 自动处罚逻辑正确触发
- [ ] 统计数据准确

---

## 🔧 第二阶段：运营支撑模块（预计 2-3 周）

### 模块四：系统设置模块 ⚙️ —— ❌ 未开始（仅占位）

> **当前状态**：后端无 `system`/敏感词/轮播模块；PC 端 `system` 两个页面为空占位。敏感词模块需优先于校园墙开发（校园墙发布依赖敏感词检测）。

#### 4.1 敏感词管理

**后端任务**:

- [ ] 创建 `SensitiveWord` Entity
- [ ] 实现敏感词 CRUD
- [ ] 实现高效匹配算法（Trie 树或 AC 自动机）
- [ ] 提供 `checkContent()` 方法供其他模块调用

**前端任务**:

- [ ] 敏感词管理页面（列表 + 批量导入/导出）
- [ ] 敏感词分类管理（政治、暴力、广告等）

#### 4.2 轮播公告管理

**后端任务**:

- [ ] 创建 `Banner` Entity
- [ ] 实现轮播图 CRUD
- [ ] 支持图片上传（OSS）
- [ ] 支持排序和启用/禁用

**前端任务**:

- [ ] 轮播图管理页面
- [ ] 拖拽排序功能
- [ ] 预览效果展示

---

### 模块五：系统日志模块 📋 —— ❌ 未开始（仅占位）

> **当前状态**：后端无 `log` 模块；PC 端 `log` 两个页面为空占位。建议在所有业务模块稳定后最后补齐。

#### 5.1 操作日志

**后端任务**:

- [ ] 创建 `AdminLog` Entity
- [ ] 创建 `@LogOperation()` 装饰器（自动记录管理员操作）
- [ ] 实现日志查询 API（支持时间范围、操作人、操作类型筛选）

**前端任务**:

- [ ] 操作日志页面
- [ ] 日志详情查看
- [ ] 日志导出功能

#### 5.2 违规日志

**后端任务**:

- [ ] 创建 `ViolationLog` Entity
- [ ] 在黑名单、举报处理等操作时自动记录
- [ ] 实现日志查询 API

**前端任务**:

- [ ] 违规日志页面
- [ ] 按用户/时间筛选

---

## 📈 第三阶段：优化与完善（持续进行）

### 6.1 性能优化

- [ ] 数据库索引优化
- [ ] Redis 缓存策略
  - [ ] 缓存热门商品列表（5分钟过期）
  - [ ] 缓存分类树结构（1小时过期）
  - [ ] 缓存板块配置（1小时过期）
- [ ] 接口响应时间监控
  - [ ] 集成 APM 工具（如 Sentry）
  - [ ] 设置告警阈值（响应时间 > 500ms）

### 6.2 安全性增强

- [ ] SQL 注入防护审查
- [ ] XSS 攻击防护（前端转义 + 后端过滤）
- [ ] CSRF Token 验证
- [ ] 敏感操作二次验证（删除、批量操作）

### 6.3 测试覆盖

- [ ] 后端单元测试（Jest）
  - [ ] Service 层核心逻辑测试覆盖率 > 80%
  - [ ] Controller 层接口测试

- [ ] 前端组件测试（Vitest）
  - [ ] 关键表单组件测试
  - [ ] 工具函数测试

- [ ] E2E 测试（Playwright）
  - [ ] 核心业务流程端到端测试

### 6.4 文档完善

- [ ] API 接口文档（Swagger 自动生成）
- [ ] 数据库 ER 图
- [ ] 部署文档（Docker + Nginx 配置）
- [ ] 运维手册（常见问题排查）

---

## 📅 推荐开发顺序

```
0. 二手商品管理收尾（小程序详情/分类/收藏占位页补全）
   ↓
1. 系统设置 - 敏感词管理（校园墙发布的前置依赖，需优先）
   ↓
2. 校园墙管理（依赖敏感词检测）
   ↓
3. 举报工单（依赖用户/商品/帖子模块）
   ↓
4. 系统设置 - 轮播公告（独立模块，可并行）
   ↓
5. 系统日志（最后完善，记录前面所有操作）
```

---

## 🎯 里程碑规划

| 里程碑               | 完成内容              | 预计时间 |
| -------------------- | --------------------- | -------- |
| **M1: 核心业务上线** | 商品管理 + 校园墙管理 | 第 6 周  |
| **M2: 治理体系完善** | 举报工单 + 敏感词管理 | 第 8 周  |
| **M3: 运营支撑就绪** | 系统设置 + 日志模块   | 第 10 周 |
| **M4: 质量保障**     | 测试覆盖 + 性能优化   | 第 12 周 |

---

## 💡 开发建议

### 技术债务预防

1. **DTO 验证完整性**: 每个字段都必须有验证装饰器（参考用户编辑问题教训）
2. **错误处理分级**: 参数错误返回 400，服务器错误返回 500
3. **事务隔离**: 每个业务操作在独立事务中，失败回滚
4. **日志记录**: 关键操作必须记录日志，便于问题排查

### 代码规范遵循

1. **命名一致性**: 实体、DTO、VO 命名遵循项目规范
2. **类型共享**: 所有类型定义放在 `packages/types` 中
3. **注释完整**: 复杂逻辑必须添加注释说明
4. **提交规范**: 遵循 Conventional Commits 规范

### 协作建议

1. **前后端同步**: 先定义 API 接口契约（types），再并行开发
2. **Code Review**: 每个 PR 至少一人审查
3. **每日站会**: 同步进度，及时解决阻塞问题
4. **文档先行**: 复杂功能先写设计文档，再编码

---

**祝开发顺利！🚀**
