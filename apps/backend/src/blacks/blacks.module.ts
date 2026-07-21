import { Module } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { BlacksController } from './blacks.controller'

@Module({
  controllers: [BlacksController],
  providers: [BlacksService],
})
export class BlacksModule {}
