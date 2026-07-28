import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

/**
 * Redis 缓存服务
 * 提供统一的缓存操作接口，封装常用的 Redis 命令
 */
@Injectable()
export class RedisService {
  /**
   * 注入 Redis 客户端实例
   */
  constructor(@InjectRedis() private readonly redis: Redis) {}

  /**
   * 设置缓存（带过期时间）
   * @param key - 缓存键名
   * @param value - 缓存值（任意类型，自动序列化）
   * @param ttl - 过期时间（秒），默认 3600 秒（1小时）
   */
  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }

  /**
   * 获取缓存
   * @param key - 缓存键名
   * @returns 解析后的数据，未命中返回 null
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key)
    return data ? JSON.parse(data) : null
  }

  /**
   * 删除缓存
   * @param key - 缓存键名
   * @returns 删除的键数量
   */
  async del(key: string): Promise<number> {
    return await this.redis.del(key)
  }

  /**
   * 检查键是否存在
   * @param key - 缓存键名
   * @returns 是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key)
    return result === 1
  }

  /**
   * 设置哈希表字段
   * @param key - 哈希表键名
   * @param field - 字段名
   * @param value - 字段值
   */
  async hset(key: string, field: string, value: any): Promise<void> {
    await this.redis.hset(key, field, JSON.stringify(value))
  }

  /**
   * 获取哈希表字段值
   * @param key - 哈希表键名
   * @param field - 字段名
   * @returns 字段值，不存在返回 null
   */
  async hget<T>(key: string, field: string): Promise<T | null> {
    const data = await this.redis.hget(key, field)
    return data ? JSON.parse(data) : null
  }

  /**
   * 获取整个哈希表
   * @param key - 哈希表键名
   * @returns 哈希表对象
   */
  async hgetall<T>(key: string): Promise<Record<string, T>> {
    const data = await this.redis.hgetall(key)
    const result: Record<string, T> = {}

    for (const [field, value] of Object.entries(data)) {
      result[field] = JSON.parse(value)
    }

    return result
  }
}
