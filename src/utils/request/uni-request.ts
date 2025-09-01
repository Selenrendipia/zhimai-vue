export function http<T>(options: CustomRequestOptions) {
  return new Promise<ApiResponse<T>>((resolve, reject) => {
    uni.request({
      ...options,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      success(res: UniApp.RequestSuccessCallbackResult) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as ApiResponse<T>)
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          reject(res)
        } else {
          !options.hideToast
          && uni.showToast({
            icon: 'none',
            title: (res.data as ApiResponse<T>).msg || '请求失败'
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err: any) {
        uni.showToast({
          icon: 'none',
          title: '请求失败'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpGet<T>(url: string, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    method: 'GET',
    header,
    ...options
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @param header 请求头，默认为json格式
 * @returns
 */
export function httpPost<T>(url: string, data?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
    header,
    ...options
  })
}
/**
 * PUT 请求
 */
export function httpPut<T>(url: string, data?: Record<string, any>, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    data,
    query,
    method: 'PUT',
    header,
    ...options
  })
}

/**
 * DELETE 请求（无请求体，仅 query）
 */
export function httpDelete<T>(url: string, query?: Record<string, any>, header?: Record<string, any>, options?: Partial<CustomRequestOptions>) {
  return http<T>({
    url,
    query,
    method: 'DELETE',
    header,
    ...options
  })
}

http.get = httpGet
http.post = httpPost
http.put = httpPut
http.delete = httpDelete
