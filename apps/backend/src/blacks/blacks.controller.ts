import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'
import type { BlackFilterGet } from '@campus/types'

@Controller('blacks')
export class BlacksController {
  constructor(private readonly blacksService: BlacksService) {}

  @Post()
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
