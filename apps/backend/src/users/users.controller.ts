import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { SkipThrottle, Throttle } from '@nestjs/throttler'
import { UserFilterGet } from '@campus/types'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id)
  }
}
