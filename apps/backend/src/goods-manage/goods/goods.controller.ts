import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common'
import { GoodsService } from './goods.service'
import { CreateGoodDto } from './dto/create-good.dto'
import { UpdateGoodDto } from './dto/update-good.dto'
import type { GoodFilterGet } from '@campus/types'

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  /**
   * 发布商品（小程序端）
   */
  @Post()
  create(@Body() createGoodDto: CreateGoodDto, @Req() request: Request) {
    const userId = request['user']?.id
    if (!userId) {
      throw new Error('未找到用户信息')
    }
    return this.goodsService.create(createGoodDto, userId)
  }

  /**
   * 查询商品列表（支持分页+筛选）
   */
  @Get()
  findAll(@Query() query: GoodFilterGet): Promise<any> {
    return this.goodsService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.goodsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
    return this.goodsService.update(+id, updateGoodDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsService.remove(+id)
  }
}
