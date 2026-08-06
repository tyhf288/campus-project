import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common'
import { GoodsService } from './goods.service'
import { CreateGoodDto } from './dto/create-good.dto'
import { UpdateGoodDto } from './dto/update-good.dto'

@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  //发布商品
  @Post()
  create(@Body() createGoodDto: CreateGoodDto, @Req() request: Request) {
    // 手动从 request['user'] 提取
    const userId = request['user']?.id

    if (!userId) {
      throw new Error('未找到用户信息')
    }

    return this.goodsService.create(createGoodDto, userId)
  }

  @Get()
  findAll() {
    return this.goodsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
