import { PartialType } from '@nestjs/swagger'
import { CreateBlackDto } from './create-black.dto'

export class UpdateBlackDto extends PartialType(CreateBlackDto) {}
