import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PERMISSION_KEY } from '../decorator/permission.decorator'
import { PermissionCode, UserRole } from '@campus/types'
import { hasPermission } from '@campus/utils'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const permission = this.reflector.getAllAndOverride<PermissionCode[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    //如果没有权限要求，则直接通过
    if (!permission || permission.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request['user']

    if (!user) {
      throw new ForbiddenException('未认证用户')
    }

    const role: UserRole = user.role

    //管理员拥有全部权限直接放行
    if (role === UserRole.ADMIN) {
      return true
    }
    //检查当前角色是否拥有指定权限
    const hasPermissionResult = hasPermission(role, permission)

    if (!hasPermissionResult) {
      throw new ForbiddenException('权限不足')
    }

    return true
  }
}
