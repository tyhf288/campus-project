import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/updata-user-dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  getHello(): string {
    return 'user'
  }
  @Get(':id')
  getList(@Param('id') id: string) {
    return this.userService.getList(id)
  }

  @Post('/create')
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body)
  }

  @Post('/update')
  updata(@Body() body: UpdateUserDto) {
    return this.userService.updata(body)
  }
}
