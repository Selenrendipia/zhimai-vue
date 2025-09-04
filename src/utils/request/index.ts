import type { MethodType } from 'alova'
// import { Method } from 'alova'
import alovaInst from './alova'
import AppConfig from '../../config.ts'
// 请求超时时间(默认5s)
const globalTimeout = 5000
// 从存储中获取token
const token = uni.getStorageSync('token')

/**
 * 请求方法封装
 * @param url 请求地址
 * @param method 请求方法，默认为GET
 * @param data 请求参数
 * @param headers 请求头
 * @returns Promise
 */
export function request<T = any>(
  url: string,
  method: MethodType,
  data?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, string>,
  timeout?: number
) {
  return alovaInst.Request<ApiResponse<T>>({
    url: AppConfig.baseURL + url,
    method,
    data,
    params,
    headers: headers || { token },
    timeout: timeout || globalTimeout
  })
}

/**
 * GET请求方法
 * @param url 请求地址
 * @param params 请求参数
 * @param headers 请求头
 * @returns Promise
 */
export function get<T = any>(
  url: string,
  params?: Record<string, any>,
  headers?: Record<string, string>,
  timeout?: number
) {
  return request<T>(url, 'GET', undefined, params, headers, timeout)
}

/**
 * POST请求方法
 * @param url 请求地址
 * @param data 请求参数
 * @param headers 请求头
 * @returns Promise
 */
export function post<T = any>(
  url: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
  timeout?: number
) {
  return request<T>(url, 'POST', data, undefined, headers, timeout)
}

/**
 * PUT请求方法
 * @param url 请求地址
 * @param data 请求参数
 * @param headers 请求头
 * @returns Promise
 */
export function put<T = any>(
  url: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
  timeout?: number
) {
  return request<T>(url, 'PUT', data, undefined, headers, timeout)
}

/**
 * DELETE请求方法
 * @param url 请求地址
 * @param data 请求参数
 * @param headers 请求头
 * @returns Promise
 */
export function del<T = any>(
  url: string,
  data?: Record<string, any>,
  headers?: Record<string, string>,
  timeout?: number
) {
  return request<T>(url, 'DELETE', data, undefined, headers, timeout)
}
