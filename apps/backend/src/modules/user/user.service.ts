import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World!'
  }

  getList(id: string): string {
    return 'getList'
  }

  create(body: any): string {
    return 'create'
  }

  updata(body: any): string {
    return 'updata'
  }
}
