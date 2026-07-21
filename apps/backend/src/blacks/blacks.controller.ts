import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'

@Controller('blacks')
export class BlacksController {
  constructor(private readonly blacksService: BlacksService) {}

  @Post()
  create(@Body() createBlackDto: CreateBlackDto) {
    return this.blacksService.create(createBlackDto)
  }

  @Get()
  findAll() {
    return this.blacksService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blacksService.findOne(+id)
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
