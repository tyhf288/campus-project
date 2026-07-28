import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'
import { BlackFilterGet, BlackVO, UserRole, PermissionCode, UserStatus } from '@campus/types'
import { Black } from './entities/black.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { hasPermission } from '@campus/utils'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class BlacksService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Black)
    private readonly blackRepository: EntityRepository<Black>,
    //通过id查用户数据
    private readonly usersService: UsersService
  ) {}
  //拉黑创建
  async create(createBlackDto: CreateBlackDto, role: UserRole) {
    const user = await this.usersService.findOneById(createBlackDto.userId)

    if (!user) {
      throw new NotFoundException('用户不存在')
    } else if (user.status === UserStatus.DISABLED) {
      throw new ConflictException('用户已拉黑')
    }

    //获取拉黑目标角色
    const userRole = user.role
    //配置使用权限-拉黑审核员
    const permissionCode: PermissionCode[] = [PermissionCode.BLACKLIST_CREATE_AUDITOR]
    const bool = hasPermission(role, permissionCode)
    if (userRole === UserRole.ADMIN) {
      throw new ForbiddenException('无法拉黑管理员')
    } else if (userRole === UserRole.AUDITOR && !bool) {
      throw new ForbiddenException('没有权限拉黑审核员')
    }

    const black = this.blackRepository.create(createBlackDto as any)
    // 更新用户状态
    user.status = UserStatus.DISABLED
    await this.em.flush()
    return black
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
      b."unbanned_date" as "unbannedDate",
      b."unbanned_reason" as "unbannedReason"
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
      createdAt: new Date(item.createdAt).toISOString(),
      unbannedAt: item.unbannedAt ? new Date(item.unbannedAt).toISOString() : null,
      unbannedByLoginKey: item.unbannedByLoginKey,
      unbannedNickname: item.unbannedNickname,
      unbannedDate: item.unbannedDate ? new Date(item.unbannedDate).toISOString() : null,
      unbannedReason: item.unbannedReason,
    }))

    return {
      list,
      total,
    }
  }

  async update(updateBlackDto: UpdateBlackDto, role: UserRole) {
    await this.em.transactional(async (em) => {
      const black = await this.blackRepository.findOne({ id: updateBlackDto.id })
      const bool = hasPermission(role, [PermissionCode.BLACKLIST_CREATE_AUDITOR])

      if (!black) {
        throw new NotFoundException('黑名单记录不存在')
      }
      const user = await em.findOne(User, black.userId)
      if (!user) {
        throw new NotFoundException('用户不存在')
      }
      if (user?.status === UserStatus.ACTIVE) {
        throw new NotFoundException('用户已解封')
      } else if (user?.role === UserRole.AUDITOR && !bool) {
        throw new ForbiddenException('没有权限更新审核员记录')
      }

      // 更新解封相关字段
      if (updateBlackDto.unbannedReason !== undefined) {
        black.unbannedReason = updateBlackDto.unbannedReason
      }
      if (updateBlackDto.unbannedById !== undefined) {
        black.unbannedById = updateBlackDto.unbannedById
      }
      user.status = UserStatus.ACTIVE
      em.persist(user)
      black.unbannedDate = new Date()

      await this.em.flush()
      return black
    })
  }

  remove(id: number) {
    return `This action removes a #${id} black`
  }
}
