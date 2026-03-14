/**
 * 提醒类型（后端/前端统一枚举）
 * 注意：页面中如不支持某些类型（如 system_notification），保持类型完整但在 UI 层隐藏即可。
 */
export type ReminderType
  = | 'activity_registration'
    | 'activity_checkin'
    | 'activity_start'
    | 'activity_end'
    | 'custom'
    | 'system_notification'

/**
 * 创建“活动签到提醒”请求参数
 * 对应后端接口：POST /api/reminders/activity/checkin
 */
export interface CreateActivityCheckinReminderRequest {
  /** 活动ID */
  activity_id: number
  /** 签到时间（ISO 字符串，例如 2025-11-18T13:00:00.000Z） */
  checkin_time: string
  /** 提前提醒分钟数，例如 30 */
  advance_minutes: number
}

/**
 * 活动概要信息（列表内嵌）
 */
export interface ActivitySummary {
  activity_id: number
  title: string
  start_time: string
  end_time: string
  location: string
  /** 组织者（模板中有 {{activity.organizer}} 引用，后端可能提供） */
  organizer?: string
}

/**
 * 提醒实体（后端返回）
 */
export interface Reminder {
  /** 主键 ID */
  reminder_id: number
  /** 所属用户 */
  user_id: number
  /** 关联活动 ID（非活动类提醒可为 0 或缺失） */
  activity_id?: number
  /** 提醒类型 */
  type: ReminderType
  /** 事件发生/签到时间：仅 activity_checkin、可能也用于 start/end 类型 */
  checkin_time?: string
  /** 提醒开始时间（提前通知触发点） */
  remind_start_time: string
  /** 提醒结束时间（展示统一结构，签到类与事件时间相同） */
  remind_end_time: string
  /** 提前提醒分钟数（自定义或活动相关） */
  advance_minutes?: number
  /** 标题（后端已拼接“ - 提前X分钟”等） */
  title: string
  /** 描述文本 */
  description?: string
  /** 是否已发送（状态位） */
  sent: boolean
  /** 发送时间，未发送为 null */
  sent_at: string | null
  /** 创建时间 */
  created_at: string
  /** 软删除时间，未删除为 null */
  deleted_at: string | null
  /** 嵌套活动概要（活动类提醒存在） */
  activity?: ActivitySummary
  /** 其它后端可能动态附加的字段 */
  [key: string]: any
}

/**
 * 创建“活动签到提醒”响应 data（与 Reminder 保持一致）
 */
export type CreateActivityCheckinReminderResponse = Reminder

/**
 * 获取提醒列表响应 data
 */
export type ListRemindersResponse = Reminder[]

export interface ReminderTypeConfigItem {
  name: string
  description: string
  defaultTitle: string
  defaultAdvanceMinutes: number
  maxAdvanceMinutes: number
  minAdvanceMinutes: number
  templateId?: string
  messageTemplate: Record<string, { value: string }>
}
/**
 * 接口返回的类型配置项（包含 type 字段）
 */
export interface ReminderTypeConfigWithType extends ReminderTypeConfigItem {
  type: ReminderType
}

/**
 * 创建“自定义提醒”请求参数
 * 对应后端接口：POST /api/reminders/custom
 */
export interface CreateCustomReminderRequest {
  /** 标题 */
  title: string
  /** 描述文本（可选） */
  description?: string
  /** 提醒开始时间（ISO 字符串） */
  remind_start_time: string
  /** 提前提醒分钟数（可选） */
  advance_minutes?: number
}

/**
 * 创建“自定义提醒”响应 data
 */
export interface CreateCustomReminderResponse {
  sent: boolean
  reminder_id: number
  user_id: number
  type: 'custom'
  title: string
  description: string
  remind_start_time: string
  remind_end_time: string
  created_at: string
}

/**
 * 创建“活动报名提醒”请求参数
 * 对应后端接口：POST /api/reminders/activity/registration
 * 后端根据活动的报名时间范围生成 remind_start_time / remind_end_time
 */
export interface CreateActivityRegistrationReminderRequest {
  /** 活动ID */
  activity_id: number
  /** 提前提醒分钟数 */
  advance_minutes: number
}

/**
 * 创建“活动报名提醒”响应 data（与通用 Reminder 一致）
 */
export type CreateActivityRegistrationReminderResponse = Reminder

/**
 * 创建“活动开始提醒”请求/响应（与报名提醒一致）
 */
export interface CreateActivityStartReminderRequest {
  activity_id: number
  remind_minutes: number
}
export type CreateActivityStartReminderResponse = Reminder

/**
 * 创建“活动结束提醒”请求/响应（与报名提醒一致）
 */
export interface CreateActivityEndReminderRequest {
  activity_id: number
  remind_minutes: number
}
export type CreateActivityEndReminderResponse = Reminder
