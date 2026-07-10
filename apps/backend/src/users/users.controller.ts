import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SkipThrottle, Throttle } from '@nestjs/throttler'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  //自定义接口访问限制，覆盖全局配置
  @Throttle({ default: { ttl: 60, limit: 10 } })
  findAll() {
    return this.usersService.findAll()
  }

  @Get()
  //跳过接口访问限制
  @SkipThrottle()
  findOne(nickname: string) {
    return this.usersService.findOne(nickname)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
