import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { DbExceptionFilter } from './common/filter/db-exception.filter'
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter'
import { UserBaseDto } from './users/dto/user.base.dto'
import { Logger } from 'nestjs-pino'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  //给请求头盖个保护帽
  app.use(helmet())
  //接收参数是通过pipe简单过滤转换
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 参数转换
      whitelist: true, // 去除非白名单属性
      forbidNonWhitelisted: false, // 关闭严格模式，允许额外字段（便于接口联调）
      transformOptions: {
        enableImplicitConversion: true, // 允许隐式转换
      },
      exceptionFactory: (errors) => {
        // 自定义验证错误响应格式
        const messages = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints,
        }))
        return new (require('@nestjs/common').BadRequestException)({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        })
      },
    })
  )

  //使用日志工具pino
  app.useLogger(app.get(Logger))

  //注册异常过滤器（顺序很重要：具体过滤器先注册，全局过滤器后注册）
  app.useGlobalFilters(new DbExceptionFilter(), new AllExceptionsFilter())

  //swagger文档的生成
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

  app.setGlobalPrefix('api')
  SwaggerModule.setup('swagger', app, document)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
