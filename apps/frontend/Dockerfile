# ============ 阶段一：构建 ============
FROM node:24-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/

# 使用国内镜像加速
RUN pnpm config set registry https://registry.npmmirror.com

RUN pnpm install --frozen-lockfile

COPY . .

# 构建前端（vite build 产物在 apps/frontend/dist）
RUN pnpm turbo build --filter=campus-frontend

# ============ 阶段二：运行 ============
FROM nginx:alpine

# 用自定义配置覆盖 nginx 默认配置
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 把构建产物拷贝到 nginx 静态目录
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80