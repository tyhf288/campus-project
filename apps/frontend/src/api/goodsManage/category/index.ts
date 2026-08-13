import http from '@/api/http/index'
import type { CategoryCreate, CategoryUpdate, CategoryVO } from '@campus/types'

/**
 * 获取全部分类列表
 */
export const getCategoryList = () => http.get<CategoryVO[]>('/category')

/**
 * 新增分类
 */
export const createCategory = (data: CategoryCreate) => http.post('/category', data)

/**
 * 更新分类
 */
export const updateCategory = (id: number, data: CategoryUpdate) =>
  http.patch(`/category/${id}`, data)

/**
 * 删除分类
 */
export const deleteCategory = (id: number) => http.delete(`/category/${id}`)
