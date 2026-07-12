import { UserRole } from '../enum/user.enum'
interface MenuItem {
  path: string
  name: string
  component?: string
  meta: {
    title: string
    icon?: string
    roles: UserRole[]
  }
  children?: MenuItem[]
}

export type { MenuItem }
