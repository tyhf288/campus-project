import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common'
import { GoodsService } from './goods.service'
import { UpdateGoodDto } from './dto/update-good.dto'
import type { GoodFilterGet, GoodAudit } from '@campus/types'
import { AuditLockService } from './audit-lock.service'

@Controller('goods-all')
export class GoodsAuditController {
  constructor(
    private readonly goodsService: GoodsService,
    private readonly auditLockService: AuditLockService
  ) {}

  /**
   * 管理端：分页查询全部商品
   */
  @Get()
  findAll(@Query() query: GoodFilterGet): Promise<any> {
    return this.goodsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.goodsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(+id, updateGoodDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsService.remove(+id)
  }

  /**
   * 审核商品（通过/驳回）
   */
  @Patch(':id/audit')
  audit(@Param('id') id: string, @Body() dto: GoodAudit) {
    return this.goodsService.audit(+id, dto)
  }

  // ==================== 审核锁端点（新增） ====================

  /**
   * 获取审核锁（打开审核弹窗时调用）
   */
  @Post(':id/lock')
  async acquireLock(@Param('id') id: string, @Req() req: Request) {
    const adminId = req['user']?.id
    const adminName = req['user']?.nickname || `审核员#${adminId}`

    if (!adminId) {
      return { acquired: false, message: '未登录' }
    }

    return this.auditLockService.acquireLock(id, adminId, adminName)
  }

  /**
   * 释放审核锁（关闭弹窗时调用）
   */
  @Delete(':id/lock')
  async releaseLock(@Param('id') id: string, @Req() req: Request) {
    const adminId = req['user']?.id

    if (!adminId) {
      return { released: false }
    }

    const released = await this.auditLockService.releaseLock(id, adminId)
    return { released }
  }
}
