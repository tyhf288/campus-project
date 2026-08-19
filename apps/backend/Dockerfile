# ============ 阶段一：构建 ============
FROM node:24-alpine AS builder
# 启用 corepack 并固定 pnpm 版本
RUN corepack enable && corepack prepare pnpm@11.9.0 --activate
WORKDIR /app

# ① 只复制依赖清单 → 利用分层缓存（依赖不变则跳过重装）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/
COPY packages/eslint-config/package.json packages/eslint-config/

# ② 全量安装（含 devDependencies，保证 pino-pretty、swc 等构建/运行工具可用）
# 使用国内镜像加速
RUN pnpm config set registry https://registry.npmmirror.com
RUN pnpm install --frozen-lockfile

# ③ 复制全部源码
COPY . .

# ④ 构建后端（turbo 会先构建依赖包 types/utils）
RUN pnpm turbo build --filter=@campus/backend

# ============ 阶段二：运行 ============
FROM node:24-alpine

WORKDIR /app

# 本地部署优先求稳：直接复制整个产物（含 node_modules，保留 pnpm 软链结构）
COPY --from=builder /app ./

WORKDIR /app/apps/backend

EXPOSE 3000

CMD [ "node", "dist/src/main.js" ]