import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { GoodsService } from './goods.service'
import { GoodsController } from './goods.controller'
import { GoodsAuditController } from './goods-audit.controller'
import { Good } from './entities/good.entity'
import { Image } from './entities/image.entity'
import { AuditLockService } from './audit-lock.service'
import { RedisService } from '../../common/services/redis.service'

@Module({
  imports: [MikroOrmModule.forFeature([Good, Image])],
  controllers: [GoodsController, GoodsAuditController],
  providers: [GoodsService, AuditLockService, RedisService],
})
export class GoodsModule {}
