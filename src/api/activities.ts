import { get } from '@/utils/request'

/**
 * 活动详情类型（与列表单项一致，增加 isFavorited 字段）
 */
export interface ActivityDetail {
  activity_id: number
  title: string
  start_time: string
  end_time: string
  location: string
  target_audience: string | null
  organizer: string | null
  description: string
  activity_type: string
  credit_type: string
  participation_channel: string | null
  image_url: string | null
  link: string | null
  status: string
  max_participants: number | null
  created_at: string
  updated_at: string
  statistics: {
    favoriteCount: number
  }
  isFavorited: boolean
}

export type ActivityItem = Omit<ActivityDetail, 'isFavorited'>
/**
 * 活动详情接口响应类型
 */
export interface ActivityDetailResponse {
  code: number
  message: string
  data: ActivityDetail
}

/**
 * 获取活动详情
 * @param id 活动ID
 * @returns 活动详情响应
 */
export function getActivityDetail(id: number) {
  return get<ActivityDetailResponse>(`/activities/${id}`)
}

/**
 * 活动列表接口响应类型
 */
export interface ActivitiesResponse {
  total: number
  page: number
  pageSize: number
  data: ActivityItem[]
}

/**
 * 获取活动列表
 * @param params 查询参数（可选）
 * @returns 活动列表响应
 */
export interface ActivitiesQuery {
  type?: string
  status?: string
  startDate?: string
  endDate?: string
  organizer?: string
  keyword?: string
  page?: number
  pageSize?: number
}

export function getActivities(params?: ActivitiesQuery) {
  return get<ActivitiesResponse>('/activities', params)
}
