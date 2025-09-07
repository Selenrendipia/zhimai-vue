import { get, post } from '@/utils/request'

/**
 * 用户信息接口返回类型
 */
interface UserInfo {
  id: string
  username: string
  avatar: string
  [key: string]: any
}

/**
 * 登录参数类型
 */
interface LoginParams {
  code: string
  nickname: string
  avatarUrl: string
}

/**
 * 登录响应类型
 */
interface LoginResponse {
  token: string
  user: UserInfo
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return get<UserInfo>('/user/info')
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function loginApi(params: LoginParams) {
  return post<any>('/user/wx-login', params)
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
  return post<{ success: boolean }>('/user/logout')
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export function getUserList(params?: { page?: number, pageSize?: number }) {
  return get<{ list: UserInfo[], total: number }>('/user/list', params)
}
