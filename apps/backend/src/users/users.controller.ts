import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { UserFilterGet, PermissionCode } from '@campus/types'
import { Permission } from '../auth/decorator/permission.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 创建用户
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  //查询过滤
  @Get()
  @Throttle({ default: { ttl: 60, limit: 10 } })
  findAll(@Query() userFilterGet: UserFilterGet) {
    return this.usersService.findAll(userFilterGet)
  }

  @Get()
  //登录查询
  @SkipThrottle()
  findOne(nickname: string) {
    return this.usersService.findOne(nickname)
  }

  //更新用户
  @Permission([PermissionCode.USER_CREATE])
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
