import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserVO } from '@campus/types'

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto as any)
    await this.em.flush()
    return user
  }

  async findAll(userFilterGet): Promise<{ list: UserVO[]; total: number }> {
    // 从请求参数中提取 UserVO 字段进行过滤
    const {
      page = 1,
      pageSize = 10,
      loginKey,
      nickname,
      email,
      status,
      role,
      terminal,
    } = userFilterGet

    // 构建查询条件
    const where: any = {}

    if (loginKey) {
      where.loginKey = { $like: `%${loginKey}%` }
    }

    if (nickname) {
      where.nickname = { $like: `%${nickname}%` }
    }

    if (email) {
      where.email = { $like: `%${email}%` }
    }

    if (status) {
      where.status = status
    }

    if (role) {
      where.role = role
    }

    if (terminal) {
      where.terminal = terminal
    }

    // 查询总数和数据
    const [users, total] = await this.userRepository.findAndCount(where, {
      orderBy: { createdAt: 'DESC' },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })

    // 转换为 VO
    const list = users.map((user) => ({
      id: user.id,
      loginKey: user.loginKey,
      nickname: user.nickname,
      avatar: user.avatar ?? null,
      email: user.email ?? null,
      status: user.status,
      role: user.role,
      terminal: user.terminal ?? null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    }))

    return { list, total }
  }

  async findOne(loginKey: string) {
    return await this.userRepository.findOne({ loginKey: loginKey })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id)
    if (!user) {
      throw new Error('用户不存在')
    }
    this.em.assign(user, updateUserDto)
    await this.em.flush()
    return user
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
