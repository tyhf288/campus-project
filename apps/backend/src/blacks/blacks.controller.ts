import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'
import type { BlackFilterGet } from '@campus/types'
import { PermissionCode } from '@campus/types'
import { Permission } from '../auth/decorator/permission.decorator'

@Controller('blacks')
export class BlacksController {
  constructor(private readonly blacksService: BlacksService) {}

  //用户拉黑
  @Post()
  @Permission([PermissionCode.BLACKLIST_CREATE_STUDENT]) //权限控制,管理人员统一，对于审核员在业务层单独处理权限
  create(@Body() createBlackDto: CreateBlackDto, @Req() req) {
    const { user } = req
    const role = user.role
    return this.blacksService.create(createBlackDto, role)
  }

  //查询列表
  @Get()
  findList(@Query() blackFilterGet: BlackFilterGet) {
    return this.blacksService.findList(blackFilterGet)
  }

  @Patch()
  @Permission([PermissionCode.BLACKLIST_CREATE_STUDENT])
  update(@Body() updateBlackDto: UpdateBlackDto, @Req() req) {
    const { user } = req
    const role = user.role
    return this.blacksService.update(updateBlackDto, role)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blacksService.remove(+id)
  }
}
