import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import config from '../mikro-orm.config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TodosModule } from './todos/todos.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [TodosModule, UsersModule, MikroOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
