import type {
  CreateActivityCheckinReminderRequest,
  CreateActivityCheckinReminderResponse,
  CreateActivityEndReminderRequest,
  CreateActivityEndReminderResponse,
  CreateActivityRegistrationReminderRequest,
  CreateActivityRegistrationReminderResponse,
  CreateActivityStartReminderRequest,
  CreateActivityStartReminderResponse,
  CreateCustomReminderRequest,
  CreateCustomReminderResponse,
  ListRemindersResponse,
  ReminderTypeConfigWithType
} from '@/types/remind'
import { del, get, post } from '@/utils/request'

// 统一的 ISO 构建：按本地日期/时间生成 UTC ISO，避免受本地时区影响
export function buildISO(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) {
    return ''
  }
  const [y, m, d] = dateStr.split('-').map(n => Number(n))
  const [hh, mm] = timeStr.split(':').map(n => Number(n))
  if ([y, m, d, hh, mm].some(v => Number.isNaN(v))) {
    return ''
  }
  return new Date(Date.UTC(y, m - 1, d, hh, mm, 0, 0)).toISOString()
}

/**
 * 创建活动签到提醒
 * POST /api/reminders/activity/checkin
 */
export function createActivityCheckinReminder(params: CreateActivityCheckinReminderRequest) {
  return post<CreateActivityCheckinReminderResponse>('/reminders/activity/checkin', params, true)
}

/**
 * 创建活动报名提醒
 * POST /api/reminders/activity/registration
 */
export function createActivityRegistrationReminder(params: CreateActivityRegistrationReminderRequest) {
  return post<CreateActivityRegistrationReminderResponse>('/reminders/activity/registration', params, true)
}

/**
 * 创建活动开始提醒
 * POST /api/reminders/activity/start
 */
export function createActivityStartReminder(params: CreateActivityStartReminderRequest) {
  return post<CreateActivityStartReminderResponse>('/reminders/activity/start', params, true)
}

/**
 * 创建活动结束提醒
 * POST /api/reminders/activity/end
 */
export function createActivityEndReminder(params: CreateActivityEndReminderRequest) {
  return post<CreateActivityEndReminderResponse>('/reminders/activity/end', params, true)
}

/**
 * 创建自定义提醒
 * POST /api/reminders/custom
 */
export function createCustomReminder(params: CreateCustomReminderRequest) {
  return post<CreateCustomReminderResponse>('/reminders/custom', params, true)
}

/**
 * 获取提醒列表
 * GET /api/reminders
 */
export function getReminders() {
  return get<ListRemindersResponse>('/reminders', undefined, true)
}

/**
 * 根据 ID 删除提醒
 * DELETE /api/reminders/{id}
 */
export function deleteRemindersById(id: number) {
  return del(`/reminders/${id}`, undefined, true)
}

/**
 * 获取提醒类型配置
 * GET /api/reminders/types
 * 返回结构：{ data: ReminderTypeConfigWithType[] }
 */
export function getReminderTypeConfigs() {
  return get<{ data: ReminderTypeConfigWithType[] }>(
    '/reminders/types',
    undefined,
    true
  )
}

/**
 * 将页面表单数据转换并创建“活动签到提醒”
 * 说明：页面可能包含接口不需要的字段（如 title/link/remindType），本方法会忽略它们；
 * 若缺少 advance_minutes，则默认使用 30；
 * activity_id 若缺失则填 0（后端可按需校验并返回错误提示）。
 */
export function createCheckinReminderFromForm(form: {
  activity_id?: number
  beginDate: string
  beginTime: string
  advance_minutes?: number
  title?: string
  link?: string
  remindType?: string
}) {
  const advance = typeof form.advance_minutes === 'number' ? form.advance_minutes : 30
  // 使用统一的 UTC ISO 构建，避免与页面/后端解析不一致
  const iso = buildISO(form.beginDate, form.beginTime)
  const payload: CreateActivityCheckinReminderRequest = {
    activity_id: form.activity_id ?? 0,
    checkin_time: iso,
    advance_minutes: advance
  }
  return createActivityCheckinReminder(payload)
}
