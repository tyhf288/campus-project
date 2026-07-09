import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql'
import { InjectRepository } from '@mikro-orm/nestjs'

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

  findAll() {
    return this.userRepository.findAll()
  }

  findOne(id: number) {
    return this.userRepository.findOne(id)
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
