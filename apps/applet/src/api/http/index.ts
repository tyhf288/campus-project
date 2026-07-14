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

  get(url: string, config?: Config, options?: RequestOptions) {
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
    })
  }
  post(url: string, data: any, options?: RequestOptions) {
    return uni.request({
      ...options,
      url,
      data,
      method: 'POST',
    })
  }
  patch(url: string, params: Params, data: any, options?: RequestOptions) {
    url = this.replaceParams(url, params)

    return uni.request({
      ...options,
      url,
      data,
      method: 'PATCH' as any,
    })
  }
  del(url: string, params: Params, data: any, options?: RequestOptions) {
    url = this.replaceParams(url, params)
    return uni.request({
      ...options,
      url,
      data,
      method: 'DELETE',
    })
  }
}
const http = new Http()
export default http
