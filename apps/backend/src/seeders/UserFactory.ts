import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { User } from '../users/entities/user.entity'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'

export class UserFactory extends Factory<User> {
  model = User

  definition(): Partial<User> {
    return {
      loginKey: `${faker.word.noun()}${faker.number.int({ min: 100, max: 999 })}`,
      nickname: faker.internet.username(),
      // 正式环境务必修改密码！
      password: faker.internet.password(),
      email: faker.internet.email(),
      status: UserStatus.ACTIVE,
      role: UserRole.STUDENT,
      terminal: UserTerminal.MINI_PROGRAM,
    }
  }
}
