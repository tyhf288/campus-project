import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest()

    // 判断异常类型
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    // 记录错误日志
    this.logger.error(
      `Request ${request.method} ${request.url} failed with status ${status}`,
      exception instanceof Error ? exception.stack : undefined
    )

    // 构建统一的错误响应格式
    const errorResponse = {
      code: status,
      message: typeof message === 'string' ? message : (message as any).message || 'Unknown error',
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    // 在生产环境中不暴露详细错误信息
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      Object.assign(errorResponse, {
        error: exception.name,
        stack: exception.stack,
      })
    }

    response.status(status).json(errorResponse)
  }
}
