import type { MenuItem, UserRole } from '@campus/types'

/**
 * 根据角色过滤菜单
 * @param menu - 菜单数组
 * @param role - 用户角色
 * @returns 过滤后的菜单数组
 */
export const filterMenuByRoute = (menu: MenuItem[], role: UserRole): MenuItem[] => {
  const filteredMenu: MenuItem[] = []

  menu.forEach((item) => {
    if (item.children && item.children.length > 0) {
      const childMenu = filterMenuByRoute(item.children, role)
      filteredMenu.push({
        ...item,
        children: childMenu,
      })
    } else {
      if (item.meta.roles.includes(role)) {
        filteredMenu.push(item)
      }
    }
  })

  return filteredMenu
}
