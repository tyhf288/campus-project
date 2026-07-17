import { Injectable, HttpException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class WechatService {
  private readonly appid: string
  private readonly secret: string
  private readonly wxUrl = 'https://api.weixin.qq.com/sns/jscode2session'

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.appid = this.configService.get<string>('WEAPP_APPID')!
    this.secret = this.configService.get<string>('WEAPP_SECRET')!
  }

  /** 通过code换取openid、session_key */
  async code2Session(code: string) {
    const params = {
      appid: this.appid,
      secret: this.secret,
      js_code: code,
      grant_type: 'authorization_code',
    }
    try {
      const res = await firstValueFrom(this.httpService.get(this.wxUrl, { params }))
      const data = res.data
      // 微信返回错误码
      if (data.errcode && data.errcode !== 0) {
        throw new HttpException(`code失效：${data.errmsg}`, 400)
      }
      return {
        openid: data.openid,
        sessionKey: data.session_key,
        unionid: data.unionid,
      }
    } catch (err) {
      throw new HttpException('调用微信登录接口失败', 502)
    }
  }
}
