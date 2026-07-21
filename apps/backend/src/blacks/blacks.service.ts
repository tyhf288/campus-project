import { Injectable } from '@nestjs/common'
import { CreateBlackDto } from './dto/create-black.dto'
import { UpdateBlackDto } from './dto/update-black.dto'

@Injectable()
export class BlacksService {
  create(createBlackDto: CreateBlackDto) {
    return 'This action adds a new black'
  }

  findAll() {
    return `This action returns all blacks`
  }

  findOne(id: number) {
    return `This action returns a #${id} black`
  }

  update(id: number, updateBlackDto: UpdateBlackDto) {
    return `This action updates a #${id} black`
  }

  remove(id: number) {
    return `This action removes a #${id} black`
  }
}
