import { ApiResponse } from '@campus/types'

type RequestOptions = Omit<UniNamespace.RequestOptions, 'url' | 'method' | 'data'>
type Params = Record<string, string | number>
type Query = Record<string, string | number>
type Config = {
  params?: Params
  query?: Query
}
class Http {
  constructor() {}

  //拼接params
  private replaceParams(url: string, params: Params) {
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, String(params[key]))
    })
    return url
  }

  //拼接query
  private replaceQuery(url: string, query: Query) {
    const queryString = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&')
    // 判断 url 已有 ?
    const separator = url.includes('?') ? '&' : '?'
    url += separator + queryString

    return url
  }

  get<T = any>(url: string, config?: Config, options?: RequestOptions): Promise<ApiResponse<T>> {
    //如果使用params
    if (config?.params) {
      url = this.replaceParams(url, config.params)
    }
    //如果使用query
    if (config?.query) {
      url = this.replaceQuery(url, config.query)
    }

    return uni.request({
      ...options,
      url,
      method: 'GET',
    }) as unknown as Promise<ApiResponse<T>>
  }
  post<T = any>(url: string, data: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return uni.request({
      ...options,
      url,
      data,
      method: 'POST',
    }) as unknown as Promise<ApiResponse<T>>
  }
  patch<T = any>(
    url: string,
    params: Params,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    url = this.replaceParams(url, params)

    return uni.request({
      ...options,
      url,
      data,
      method: 'PATCH' as any,
    }) as unknown as Promise<ApiResponse<T>>
  }
  del<T = any>(
    url: string,
    params: Params,
    data: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    url = this.replaceParams(url, params)
    return uni.request({
      ...options,
      url,
      data,
      method: 'DELETE',
    }) as unknown as Promise<ApiResponse<T>>
  }
}
const http = new Http()
export default http
