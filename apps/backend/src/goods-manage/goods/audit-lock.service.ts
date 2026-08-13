import { Injectable, Logger } from '@nestjs/common'
import { RedisService } from '../../common/services/redis.service'
import { AuditLockVO } from '@campus/types'

/**
 * 审核锁信息
 */
interface LockInfo {
  adminId: number
  adminName: string
  acquiredAt: string
}
@Injectable()
export class AuditLockService {
  private readonly logger = new Logger(AuditLockService.name)

  /** Redis key 前缀 */
  private readonly LOCK_PREFIX = 'goods:audit:lock:'

  /** 锁的 TTL（秒），5分钟兜底防止死锁 */
  private readonly LOCK_TTL = 300
  constructor(private readonly redisService: RedisService) {}
  /**
   * 尝试获取审核锁
   *
   * 使用 Redis SET key value NX EX ttl 实现互斥
   * NX = 仅当 key 不存在时才设置（互斥）
   * EX = 设置过期时间（防死锁）
   *
   * @param goodsId - 商品 ID
   * @param adminId - 审核员 ID
   * @param adminName - 审核员名称
   * @returns 锁获取结果
   */
  async acquireLock(goodId: string, adminId: number, adminName: string): Promise<AuditLockVO> {
    const key = this.getLockKey(goodId)
    // ----- 核心：SET NX EX（原子操作）-----
    // 如果 key 已存在，返回 null（锁冲突）
    // 如果 key 不存在，设置值并返回 'OK'（获取成功）

    const lockInfo: LockInfo = {
      adminId,
      adminName,
      acquiredAt: new Date().toISOString(),
    }

    // ioredis 的 set 方法：set(key, value, 'EX', ttl, 'NX')
    const result = await this.redisService['redis'].set(
      key,
      JSON.stringify(lockInfo),
      'EX',
      this.LOCK_TTL,
      'NX'
    )

    if (result === 'OK') {
      this.logger.log(`审核锁获取成功: goodId=${goodId}, adminId=${adminId}`)
      return {
        acquired: true,
        ...lockInfo,
      }
    }

    // ----- 获取失败：返回当前持有者信息 -----
    const currentLock = await this.getLockInfo(goodId)
    this.logger.warn(
      `审核锁冲突: goodsId=${goodId}, 请求者=${adminId}, 持有者=${currentLock?.adminId}`
    )

    return {
      acquired: false,
      acquiredBy: currentLock?.adminId,
      acquiredByName: currentLock?.adminName,
      acquiredAt: currentLock?.acquiredAt,
      message: `商品正在被 ${currentLock?.adminName || '其他审核员'} 审核中`,
    }
  }

  /**
   * 拼接审核锁 Redis Key
   * @param goodId 商品id
   */
  private getLockKey(goodId: string): string {
    return `${this.LOCK_PREFIX}${goodId}`
  }
  /**
   * 查询锁信息
   *
   * @param goodId - 商品 ID
   * @returns 锁信息，未锁定返回 null
   */
  async getLockInfo(goodId: string): Promise<LockInfo | null> {
    const key = this.getLockKey(goodId)
    return this.redisService.get<LockInfo>(key)
  }
  /**
   * 释放审核锁
   *
   * 只有锁持有者本人才能释放（防止误释放他人的锁）
   *
   * @param goodId - 商品 ID
   * @param adminId - 审核员 ID（校验是否为持有者）
   */
  async releaseLock(goodId: string, adminId: number): Promise<boolean> {
    const key = this.getLockKey(goodId)
    const currentLock = await this.getLockInfo(goodId)

    if (!currentLock) {
      this.logger.log(`审核锁不存在，无需释放: goodsId=${goodId}`)
      return true // 锁已不存在，视为释放成功（幂等）
    }

    // ----- 只允许锁持有者释放 -----
    if (currentLock.adminId !== adminId) {
      this.logger.warn(
        `非锁持有者尝试释放锁: goodsId=${goodId}, 请求者=${adminId}, 持有者=${currentLock.adminId}`
      )
      return false
    }

    await this.redisService.del(key)
    this.logger.log(`审核锁已释放: goodsId=${goodId}, adminId=${adminId}`)
    return true
  }
}
