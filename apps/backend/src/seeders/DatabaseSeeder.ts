import type { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { UserFactory } from './UserFactory'
import { User } from '../users/entities/user.entity'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // ⚠️ 注意: 以下操作会删除现有数据,仅用于开发/测试环境
    // await em.nativeDelete(Todo, {})
    // await em.nativeDelete(User, {})
    //创建模拟数据，现用现加
    // new UserFactory(em).make(10)
  }
}
