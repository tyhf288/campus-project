import { Module } from '@nestjs/common'
import { CategoryModule } from './category/category.module'
import { CollectModule } from './collect/collect.module'
import { MessageModule } from './message/message.module'
import { GoodsModule } from './goods/goods.module'

/**
 * 商品管理总模块
 * 整合所有商品相关的子模块：
 * - GoodsAllModule: 商品主体管理
 * - AuditModule: 商品审核管理
 * - CategoryModule: 商品分类管理
 * - CollectModule: 商品收藏管理
 * - MessageModule: 商品留言管理
 */
@Module({
  imports: [CategoryModule, CollectModule, MessageModule, GoodsModule],
  controllers: [],
  providers: [],
})
export class GoodsManageModule {}
