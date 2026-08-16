import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { GoodsFactory } from './GoodsFactory'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // 新增 100 条商品模拟数据（不删除任何现有数据）
    // ⚠️ 前置条件：
    //   1. user 表需存在 id 1~20 的用户
    //   2. category 表需存在 id 1~8 的分类
    await new GoodsFactory(em).create(100)
  }
}
