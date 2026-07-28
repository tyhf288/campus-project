import { registerAs } from '@nestjs/config'

/**
 * Redis 配置接口
 */
export interface RedisConfigOptions {
  /**
   * Redis 服务器主机地址
   */
  host: string

  /**
   * Redis 服务器端口
   */
  port: number

  /**
   * Redis 认证密码（可选）
   */
  password?: string

  /**
   * Redis 数据库编号
   */
  db: number
}

/**
 * Redis 配置注册函数
 * 从环境变量中读取 Redis 连接配置
 * @returns Redis 配置对象
 */
export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
}))
