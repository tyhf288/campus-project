import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { OssService } from '../common/services/oss.service'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import type multer from 'multer'

@ApiTags('用户管理-文件上传')
@Controller('users')
export class UsersUploadController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 上传头像到 OSS（代理模式）
   * @param file - 上传的文件
   * @returns 文件 URL
   */
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '上传头像到 OSS' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // 1. 验证文件是否存在
    if (!file) {
      throw new BadRequestException('请选择要上传的文件')
    }

    // 2. 验证文件类型（只允许图片）
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('只支持图片文件（JPG/PNG/GIF）')
    }

    // 3. 验证文件大小（限制 5MB）
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new BadRequestException('图片大小不能超过 5MB')
    }

    // 4. 生成唯一文件名
    const fileName = this.ossService.generateFileName(file.originalname, 'avatars')

    // 5. 上传到 OSS
    const url = await this.ossService.uploadFile(file.buffer, fileName)

    // 6. 返回结果
    return {
      url,
      fileName,
      size: file.size,
    }
  }
}
