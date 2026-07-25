import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
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
  @Permission([PermissionCode.BLACKLIST_CREATE_STUDENT])
  create(@Body() createBlackDto: CreateBlackDto) {
    return this.blacksService.create(createBlackDto)
  }

  //查询列表
  @Get()
  findList(@Query() blackFilterGet: BlackFilterGet) {
    return this.blacksService.findList(blackFilterGet)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlackDto: UpdateBlackDto) {
    return this.blacksService.update(+id, updateBlackDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blacksService.remove(+id)
  }
}
