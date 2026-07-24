import { Module } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { BlacksController } from './blacks.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Black } from './entities/black.entity'

@Module({
  imports: [MikroOrmModule.forFeature([Black])],
  controllers: [BlacksController],
  providers: [BlacksService],
})
export class BlacksModule {}
