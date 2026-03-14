<template>
  <view class="min-h-screen bg-white">
    <!-- top -->
    <view class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <view
        class="text-sm text-gray-600"
        @click="goBack"
      >
        取消
      </view>
      <view class="text-base font-semibold">
        新建活动
      </view>
      <view
        class="text-sm text-blue-500"
        @click="onSave"
      >
        保存
      </view>
    </view>

    <!-- form -->
    <view class="p-4">
      <view v-if="showLink" class="mb-3 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          链接
        </view>
        <input v-model="link" :disabled="disableLink" class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
        <view v-if="disableLink" class="shrink-0">
          <button
            class="border border-gray-200 rounded px-2 py-1 text-xs text-blue-600"
            @click="copyLink"
          >
            复制
          </button>
        </view>
      </view>
      <view class="mb-3 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          标题
        </view>
        <template v-if="isCustom">
          <input
            v-model="title"
            class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2"
            placeholder="请输入标题"
          >
        </template>
        <template v-else>
          <view
            class="flex-1 whitespace-pre-wrap break-words border border-gray-100 rounded bg-gray-100 px-3 py-2 text-gray-900"
          >
            {{ title || '（无标题）' }}
          </view>
        </template>
      </view>
      <view class="mb-3 flex items-start gap-3">
        <view class="w-14 pt-2 text-sm text-gray-600">
          描述
        </view>
        <textarea
          v-model="description"
          class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2 leading-6 outline-none"
          placeholder="请输入描述（可选）"
          :auto-height="true"
          :maxlength="200"
          show-confirm-bar="false"
        />
      </view>

      <view class="mb-2 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          提醒时间
        </view>
        <view class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
          <view class="grid grid-cols-10 gap-2">
            <picker class="col-span-5" mode="date" :value="beginDate" :disabled="disableRemindTime" @change="onBeginDateChange">
              <view class="w-full text-center">
                {{ beginDate }}
              </view>
            </picker>
            <view class="col-span-1 text-center">
              |
            </view>
            <picker class="col-span-4" mode="time" :value="beginTime" :disabled="disableRemindTime" @change="onBeginTimeChange">
              <view class="w-full text-center">
                {{ beginTime }}
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view v-if="showAdvance" class="mb-3 flex items-start gap-3">
        <view class="w-14 pt-2 text-sm text-gray-600">
          提前时间
        </view>
        <view class="flex-1">
          <radio-group :value="String(advance_minutes)" @change="onAdvanceChange">
            <view class="grid grid-cols-3 gap-2">
              <label
                class="flex items-center gap-2 border rounded px-3 py-2 text-sm"
                :class="advance_minutes === 30 ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700'"
              >
                <radio value="30" :checked="advance_minutes === 30" />
                <text>提前30分钟</text>
              </label>
              <label
                class="flex items-center gap-2 border rounded px-3 py-2 text-sm"
                :class="advance_minutes === 60 ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700'"
              >
                <radio value="60" :checked="advance_minutes === 60" />
                <text>提前60分钟</text>
              </label>
              <label
                class="flex items-center gap-2 border rounded px-3 py-2 text-sm"
                :class="advance_minutes === 120 ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700'"
              >
                <radio value="120" :checked="advance_minutes === 120" />
                <text>提前120分钟</text>
              </label>
            </view>
          </radio-group>
        </view>
      </view>

      <view v-if="reminder_id" class="mt-6">
        <view class="border border-red-100 rounded px-3 py-2 text-center text-red-500" @click="onDelete">
          删除
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ReminderType } from '@/types/remind'
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import { buildISO, createActivityCheckinReminder, createActivityEndReminder, createActivityRegistrationReminder, createActivityStartReminder, createCustomReminder, deleteRemindersById } from '@/api/remind'
import { get } from '@/utils/request'

// ------- 基础状态（仅与模板交互的必要字段） -------
const allowedTypes = new Set<ReminderType>(['activity_registration', 'activity_start', 'activity_end', 'activity_checkin', 'custom'])

const title = ref('')
const link = ref('')
const description = ref('')
const type = ref<ReminderType>('custom')
const beginDate = ref('')
const beginTime = ref('')
const activity_id = ref<number | null>(null)
const reminder_id = ref<number | null>(null)
const advance_minutes = ref(30)
// 记录上一次的提前分钟数，用于在切换选项时保持事件时间不变
const lastAdvance = ref(30)
// 事件时间（本地时区 Date）：
// - activity_checkin：由提醒时间 + 提前分钟实时推导
// - activity_registration/activity_start/activity_end：来自活动数据（报名/开始/结束时间）
const eventLocal = ref<Date | null>(null)

// ------- 派生 UI 状态：由 type 计算，避免 onLoad 中重复赋值 -------
const isActivityBasic = computed(() => ['activity_registration', 'activity_start', 'activity_end'].includes(type.value))
const isCheckin = computed(() => type.value === 'activity_checkin')
const isCustom = computed(() => type.value === 'custom')

const showLink = computed(() => isActivityBasic.value || isCheckin.value)
const disableLink = computed(() => !isCustom.value && showLink.value)
const disableRemindTime = computed(() => isActivityBasic.value)
const showAdvance = computed(() => !isCustom.value)

// ISO 构建已统一由 '@/api/remind' 的 buildISO 提供

function TimeFormat(num: number | string) {
  const s = String(num)
  return s.length === 1 ? `0${s}` : s
}

function DateFormatString() {
  // 统一补零，确保与 picker 的 YYYY-MM-DD、HH:mm 兼容
  const d = new Date()
  const year = d.getFullYear()
  const month = TimeFormat(d.getMonth() + 1)
  const day = TimeFormat(d.getDate())
  const hour = TimeFormat(d.getHours())
  const minute = TimeFormat(d.getMinutes())
  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`
  }
}

// 将本地日期/时间字符串解析为 Date（本地时区），失败返回 null
function parseLocalDateTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) {
    return null
  }
  const d = new Date(`${dateStr}T${timeStr}:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

function formatDate(d: Date) {
  return `${d.getFullYear()}-${TimeFormat(d.getMonth() + 1)}-${TimeFormat(d.getDate())}`
}
function formatTime(d: Date) {
  return `${TimeFormat(d.getHours())}:${TimeFormat(d.getMinutes())}`
}

// 安全解码路由参数，遇到非法编码时返回原始字符串
function safeDecode(v: any) {
  try {
    return decodeURIComponent(String(v))
  } catch {
    return String(v ?? '')
  }
}

// 在小程序/uni-app 中通过 onLoad 获取路由参数
onLoad(async (params?: Record<string, any>) => {
  params = params ?? {}
  // 读取并校正类型，默认 custom
  const incomingType = safeDecode(params.type)
  type.value = allowedTypes.has(incomingType as ReminderType) ? (incomingType as ReminderType) : 'custom'
  if (params.title) {
    title.value = safeDecode(params.title)
  }
  if (params.description) {
    description.value = safeDecode(params.description)
  }
  if (params.id) {
    activity_id.value = Number(safeDecode(params.id))
    const activity = await get(`/activities/${activity_id.value}`, undefined, true)
    if (activity)
      link.value = activity.link || ''
    // 设定事件时间（用于联动计算提醒时间）
    try {
      if (activity) {
        if (type.value === 'activity_registration' || type.value === 'activity_start') {
          // 使用活动开始时间作为事件时间
          const iso: string | undefined = activity.start_time || activity.activity?.start_time
          if (iso) {
            const d = new Date(iso)
            if (!Number.isNaN(d.getTime())) {
              eventLocal.value = d
            }
          }
        } else if (type.value === 'activity_end') {
          const iso: string | undefined = activity.end_time || activity.activity?.end_time
          if (iso) {
            const d = new Date(iso)
            if (!Number.isNaN(d.getTime())) {
              eventLocal.value = d
            }
          }
        }
      }
    } catch {}
  }
  // 仅在有效数字且大于 0 时设置 reminder_id，避免空字符串被转成 0 造成误判
  if (params.reminder_id !== undefined && params.reminder_id !== null) {
    const rid = Number(safeDecode(params.reminder_id))
    if (!Number.isNaN(rid) && rid > 0) {
      reminder_id.value = rid
    }
  }
  if (params.beginDate) {
    beginDate.value = safeDecode(params.beginDate)
  }
  if (params.beginTime) {
    beginTime.value = safeDecode(params.beginTime)
  }
  if (params.advance_minutes) {
    advance_minutes.value = Number(safeDecode(params.advance_minutes))
  }
  // 初始化 lastAdvance 与 advance_minutes 同步
  lastAdvance.value = advance_minutes.value
  if (eventLocal.value) {
    // 若有事件时间，则按“事件时间 - 提前分钟”计算提醒时间
    const reminder = new Date(eventLocal.value.getTime() - advance_minutes.value * 60 * 1000)
    beginDate.value = formatDate(reminder)
    beginTime.value = formatTime(reminder)
  } else {
    // 无事件时间按当前时间初始化
    if (!beginDate.value) {
      const t = DateFormatString()
      beginDate.value = t.date
      beginTime.value = t.time
    }
  }
})

function goBack() {
  // 使用 uni.navigateBack 保持与小程序一致
  uni.navigateBack({ delta: 1 })
}

function onBeginDateChange(e: any) {
  beginDate.value = e.detail.value
}
function onBeginTimeChange(e: any) {
  beginTime.value = e.detail.value
}

function copyLink() {
  const text = link.value || ''
  if (!text) {
    uni.showToast({ title: '链接为空', icon: 'none' })
    return
  }
  uni.setClipboardData({ data: text, success: () => {
    uni.showToast({ title: '已复制', icon: 'success', duration: 700 })
  } })
}

function onAdvanceChange(e: any) {
  const v = Number(e.detail.value)
  if (!Number.isNaN(v)) {
    // 根据是否有“事件时间”决定联动方案
    if (eventLocal.value) {
      // 有事件时间：提醒时间 = 事件时间 - 新提前分钟
      const reminder = new Date(eventLocal.value.getTime() - v * 60 * 1000)
      beginDate.value = formatDate(reminder)
      beginTime.value = formatTime(reminder)
    } else if (!disableRemindTime.value) {
      const cur = parseLocalDateTime(beginDate.value, beginTime.value)
      if (cur) {
        // 认为事件时间 = 当前提醒时间 + 上一次提前分钟数
        const eventTime = new Date(cur.getTime() + lastAdvance.value * 60 * 1000)
        // 新提醒时间 = 事件时间 - 新的提前分钟数
        const newReminder = new Date(eventTime.getTime() - v * 60 * 1000)
        beginDate.value = formatDate(newReminder)
        beginTime.value = formatTime(newReminder)
      }
    }
    advance_minutes.value = v
    lastAdvance.value = v
  }
}

// 静默删除旧提醒（用于保存后替换场景，不打断用户体验）
async function deleteOldReminderSilently() {
  if (!reminder_id.value) {
    return
  }
  try {
    await deleteRemindersById(reminder_id.value)
  } catch {
    // 忽略删除失败，不影响主要保存流程
  }
}

async function onSave() {
  if (!title.value || title.value.trim() === '') {
    uni.showModal({ title: '提示', content: '标题不能为空，请重新设置', showCancel: false })
    return
  }
  try {
    let iso = ''
    // 仅在需要时间的类型上做 ISO 校验
    if (type.value === 'activity_checkin' || type.value === 'custom') {
      iso = buildISO(beginDate.value, beginTime.value)
      if (!iso) {
        uni.showModal({ title: '提示', content: '时间格式不正确，请重新选择', showCancel: false })
        return
      }
    }

    // 统一的保存分发逻辑
    let savePromise: Promise<any>
    switch (type.value) {
      case 'activity_checkin':
        {
          // 对于签到：UI 中的“提醒时间”表示实际提醒触发点
          // 后端需要的是签到发生时间 = 提醒时间 + 提前分钟数
          const reminderLocal = parseLocalDateTime(beginDate.value, beginTime.value)
          if (!reminderLocal) {
            uni.showModal({ title: '提示', content: '时间格式不正确，请重新选择', showCancel: false })
            return
          }
          const eventLocal = new Date(reminderLocal.getTime() + advance_minutes.value * 60 * 1000)
          const eventDateStr = formatDate(eventLocal)
          const eventTimeStr = formatTime(eventLocal)
          const eventISO = buildISO(eventDateStr, eventTimeStr)
          savePromise = createActivityCheckinReminder({
            activity_id: activity_id.value ?? 0,
            checkin_time: eventISO,
            advance_minutes: advance_minutes.value
          })
        }
        break
      case 'activity_registration':
        savePromise = createActivityRegistrationReminder({
          activity_id: activity_id.value ?? 0,
          advance_minutes: advance_minutes.value
        })
        break
      case 'activity_start':
        savePromise = createActivityStartReminder({
          activity_id: activity_id.value ?? 0,
          remind_minutes: advance_minutes.value
        })
        break
      case 'activity_end':
        savePromise = createActivityEndReminder({
          activity_id: activity_id.value ?? 0,
          remind_minutes: advance_minutes.value
        })
        break
      default:
        // custom
        savePromise = createCustomReminder({
          title: title.value,
          description: description.value,
          remind_start_time: iso,
          advance_minutes: advance_minutes.value
        })
        break
    }

    await savePromise
    // 若传入旧提醒 ID，保存成功后静默删除旧提醒（避免重复 toast 与返回）
    await deleteOldReminderSilently()
    // 返回提醒页
    uni.showToast({ title: '保存成功', icon: 'success', duration: 700, mask: true })
    setTimeout(goBack, 100)
  } catch (error: any) {
    const msg = error?.message || '保存失败，请稍后重试'
    uni.showToast({ title: msg, icon: 'none' })
  }
}

async function onDelete() {
  if (!reminder_id.value) {
    uni.showModal({ title: '提示', content: '无效的提醒ID，无法删除', showCancel: false })
    return
  }
  await deleteRemindersById(reminder_id.value)
  uni.showToast({ title: '删除成功', icon: 'success', duration: 700, mask: true })
  setTimeout(goBack, 100)
}
</script>
