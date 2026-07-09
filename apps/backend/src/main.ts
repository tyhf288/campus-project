import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { DbExceptionFilter } from './filter/db-exception.filter'
import { UserBaseDto } from './users/dto/user.base.dto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 参数转换
      whitelist: true, // 去除非白名单属性
      forbidNonWhitelisted: true, // 非白名单属性抛出异常,太严格了影响接口联调
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
    })
  )
  app.useGlobalFilters(new DbExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('user example')
    .setDescription('The user API description')
    .setVersion('1.0')
    .addTag('users')
    .build()
  const document = SwaggerModule.createDocument(app, config, {
    // 重点：把所有被继承的基类全部注册！
    extraModels: [UserBaseDto],
  })
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
