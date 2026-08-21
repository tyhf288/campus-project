# campus-project

一个基于 **pnpm + Turborepo** 的校园综合服务平台（校园二手交易 + 校园墙 + 管理后台），采用 **Monorepo 三端架构**：NestJS 后端 + Vue3 Web 管理端 + uni-app 微信小程序。

![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

---

## ✨ 项目亮点

> 面向面试官 / 技术评审的核心能力总结

- **Monorepo 工程化**：pnpm workspace + Turborepo 统一编排三端，共享类型包（`@campus/types`）与工具包（`@campus/utils`），全仓 lint / type-check / build 一键执行；
- **RBAC 权限体系**：`admin` / `auditor` / `student` 三角色，后端 `@Permission()` 装饰器 + 前端 `v-permission` 指令实现接口级、按钮级双重权限控制；
- **并发安全**：商品审核使用 **Redis 分布式锁**（`SET NX EX`）防止并发审核冲突；
- **异步任务**：黑名单自动解封基于 **Bull 消息队列 + @nestjs/schedule 定时任务**，支持延迟任务与失败重试；
- **对象存储**：图片走阿里云 OSS **客户端直传**（后端只签发 STS 签名），减轻服务器压力；
- **容器化部署**：前后端**多阶段 Dockerfile** + docker-compose 四服务编排，实现一键本地全栈部署；
- **CI/CD 流水线**：GitHub Actions 自动执行 lint / 类型检查 / 构建，并构建 Docker 镜像推送 GHCR（`latest` + commit hash 双标签，支持版本回滚）；
- **生产级问题排查**：独立定位并修复 3 个仅在生产环境复现的前端路由 bug（模块级状态被 HMR 掩盖、`import.meta.glob` 误返回 Promise、无组件中间路由）。

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────┐
│                    前端三端                          │
│  Web 管理端(Vue3)  微信小程序(uni-app)                │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP / HTTPS
                   ▼
┌─────────────────────────────────────────────────────┐
│              Nginx（反向代理 / 静态托管）              │
│    /        → 前端静态资源                            │
│    /api/    → 转发到后端服务                          │
└──────────────────┬──────────────────────────────────┘
                   ▼
┌─────────────────────────────────────────────────────┐
│              后端 NestJS（REST API）                  │
│  auth 认证 │ users 用户 │ blacks 黑名单 │ goods 商品    │
└────────┬──────────────────────────────┬─────────────┘
         ▼                              ▼
┌─────────────────┐            ┌─────────────────┐
│   PostgreSQL     │            │      Redis       │
│  (MikroORM)      │            │ (缓存/队列/分布式锁)│
└─────────────────┘            └─────────────────┘
```

---

## 🛠️ 技术栈

| 层         | 技术                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------- |
| **工程化** | pnpm workspace · Turborepo · TypeScript · ESLint · Prettier · Husky · commitlint         |
| **后端**   | NestJS 11 · MikroORM 6 · PostgreSQL · ioredis · Bull · @nestjs/schedule · Swagger · Pino |
| **Web 端** | Vue 3 · Vite · Element Plus · Pinia · Vue Router · Axios                                 |
| **小程序** | uni-app 3 · Vue 3 · vue-i18n                                                             |
| **部署**   | Docker · docker-compose · Nginx · GitHub Actions · GHCR                                  |

---

## 📦 目录结构

```
campus-project/
├── apps/
│   ├── backend/          # NestJS 后端服务
│   ├── frontend/         # Vue3 Web 管理后台
│   └── applet/           # uni-app 微信小程序
├── packages/
│   ├── types/            # 共享 TypeScript 类型（VO / API / 枚举）
│   ├── utils/            # 共享工具函数（formatDate / hasPermission）
│   └── eslint-config/    # 统一 ESLint 配置
├── docs/                 # 项目文档（进度 / 规范 / 部署 / 踩坑记录）
├── docker-compose.yml    # 四服务编排
└── .github/workflows/    # CI/CD 流水线
```

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 20（推荐 24）
- pnpm ≥ 11
- PostgreSQL / Redis
- Docker Desktop（容器化部署）

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动全部服务（turbo 并行启动）
pnpm dev
```

各端也可单独启动：后端 `pnpm --filter @campus/backend dev`、前端 `pnpm --filter campus-frontend dev`、小程序 `pnpm --filter campus-applet dev`。

### Docker 一键部署

```bash
docker compose up -d --build
```

首次启动需初始化数据库（迁移 + 种子）：

```bash
pnpm --filter @campus/backend migration:up
pnpm --filter @campus/backend migration:seeder
```

详细步骤见「Docker 本地部署」相关文档。

---

## 🔄 CI/CD 流水线

| 阶段            | 触发条件               | 内容                                       |
| --------------- | ---------------------- | ------------------------------------------ |
| **CI 校验**     | push / PR 到 dev、main | lint → type-check → build                  |
| **CD 构建镜像** | push 到 main           | 多阶段构建前后端镜像 → 推送 GHCR（双标签） |

```
push main → CI 校验 → docker build → docker push → GHCR
```

镜像采用 `latest`（最新） + commit hash（精确回滚）双标签，实现版本可追溯。

---

## 📚 功能模块

| 模块                                  | 后端 | Web 管理端 | 小程序  | 状态   |
| ------------------------------------- | ---- | ---------- | ------- | ------ |
| 认证授权（微信登录 / JWT / RBAC）     | ✅   | ✅         | ✅      | 已完成 |
| 用户管理（含黑名单自动解封）          | ✅   | ✅         | -       | 已完成 |
| 二手商品（发布 / 审核 / 分类 / 收藏） | ✅   | ✅         | 🚧 部分 | 进行中 |
| 校园墙（帖子 / 评论 / 板块）          | ❌   | 占位       | 占位    | 待开发 |
| 举报工单 / 系统设置 / 日志            | ❌   | 占位       | -       | 待开发 |

> 完整进度见 [项目开发进度](docs/PROJECT_PROGRESS.md)。

---

## 📖 文档导航

- [项目开发进度排单](docs/PROJECT_PROGRESS.md) — 模块排期与完成度
- [前后端统一开发规范](docs/development-standards.md) — 日期 / API / 权限 / 数据库等规范
- [Git 提交规范与提交流程](docs/COMMIT_GUIDE.md) — Conventional Commits 与提交约束
