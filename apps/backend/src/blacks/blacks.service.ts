import { Injectable } from '@nestjs/common'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'
import type { BlackFilterGet, BlackVO } from '@campus/types'
import { Black } from './entities/black.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { formatDate } from '@campus/utils'

@Injectable()
export class BlacksService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Black)
    private readonly blackRepository: EntityRepository<Black>
  ) {}
  create(createBlackDto: CreateBlackDto) {
    return 'This action adds a new black'
  }
  //查询列表
  async findList(blackFilterGet: BlackFilterGet): Promise<{ list: BlackVO[]; total: number }> {
    const { page, pageSize, userId, operatorId, userNickname, userLoginKey, operatorLoginKey } =
      blackFilterGet

    // 边界保护
    const pageNum = Math.max(1, Number(page) || 1)
    const pageSizeNum = Math.max(1, Number(pageSize) || 10)
    const offset = (pageNum - 1) * pageSizeNum

    // 构建 WHERE 条件 使用 ? 占位符，不要手动写 $1 $2
    const conditions: string[] = []
    const queryParams: any[] = []

    if (userId) {
      conditions.push(`b."user_id" = ?`)
      queryParams.push(userId)
    }
    if (operatorId) {
      conditions.push(`b."operator_id" = ?`)
      queryParams.push(operatorId)
    }
    if (userNickname) {
      conditions.push(`u.nickname LIKE ?`)
      queryParams.push(`%${userNickname}%`)
    }
    if (userLoginKey) {
      conditions.push(`u."login_key" LIKE ?`)
      queryParams.push(`%${userLoginKey}%`)
    }
    if (operatorLoginKey) {
      conditions.push(`op."login_key" LIKE ?`)
      queryParams.push(`%${operatorLoginKey}%`)
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    // 总数查询，参数独立
    const countSql = `
    SELECT COUNT(*) as total 
    FROM "userManagement"."blacklist" b 
    LEFT JOIN "userManagement"."user" u ON b."user_id" = u.id 
    LEFT JOIN "userManagement"."user" op ON b."operator_id" = op.id 
    ${whereClause}
  `
    const countResult = await this.em.execute(countSql, [...queryParams])
    const total = parseInt(countResult[0].total, 10)

    // 列表查询：分页参数追加到最后
    const listParams = [...queryParams, pageSizeNum, offset]
    const dataSql = `
    SELECT
      b.id,
      u."login_key" as "userLoginKey",
      u.nickname as "userNickname",
      b.reason,
      op."login_key" as "operatorLoginKey",
      op.nickname as "operatorNickname",
      b."created_at" as "createdAt",
      b."unbanned_at" as "unbannedAt",
      ub."login_key" as "unbannedByLoginKey",
      ub.nickname as "unbannedNickname",
      b."unbanned_date" as "unbannedDate"
    FROM "userManagement"."blacklist" b
    LEFT JOIN "userManagement"."user" u ON b."user_id" = u.id
    LEFT JOIN "userManagement"."user" op ON b."operator_id" = op.id
    LEFT JOIN "userManagement"."user" ub ON b."unbanned_by_id" = ub.id
    ${whereClause}
    ORDER BY b."created_at" DESC
    LIMIT ? OFFSET ?
  `
    const rawData = await this.em.execute(dataSql, listParams)

    const list: BlackVO[] = rawData.map((item) => ({
      id: item.id,
      userLoginKey: item.userLoginKey,
      userNickname: item.userNickname,
      reason: item.reason,
      operatorLoginKey: item.operatorLoginKey,
      operatorNickname: item.operatorNickname,
      createdAt: formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss'),
      unbannedAt: item.unbannedAt ? formatDate(item.unbannedAt, 'YYYY-MM-DD HH:mm:ss') : null,
      unbannedByLoginKey: item.unbannedByLoginKey,
      unbannedNickname: item.unbannedNickname,
      unbannedDate: item.unbannedDate ? formatDate(item.unbannedDate, 'YYYY-MM-DD HH:mm:ss') : null,
    }))

    return {
      list,
      total,
    }
  }

  update(id: number, updateBlackDto: UpdateBlackDto) {
    return `This action updates a #${id} black`
  }

  remove(id: number) {
    return `This action removes a #${id} black`
  }
}
