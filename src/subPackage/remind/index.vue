<template>
  <view class="min-h-screen bg-white pb-16">
    <view class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <view class="text-lg font-semibold">
        {{ curYear }}年{{ curMonth }}月
      </view>
      <view class="flex items-center gap-2">
        <picker mode="date" :value="pickerValue" fields="month" @change="onPickerChange">
          <view class="rounded-md bg-slate-100 px-2 py-1 text-sm">
            选择年月
          </view>
        </picker>
        <view class="rounded-md bg-blue-500 px-3 py-1 text-sm text-white" @click="onCreate">
          新建
        </view>
      </view>
    </view>

    <view class="flex items-start gap-2 p-3">
      <view class="w-9 select-none text-center text-xl text-gray-600" @click="prevMonth">
        ‹
      </view>
      <view class="flex-1">
        <view class="flex">
          <view v-for="(w, i) in weeks" :key="i" class="flex-1 py-1 text-center text-xs text-gray-500">
            {{ w }}
          </view>
        </view>
        <view class="flex flex-wrap">
          <view
            v-for="(d, idx) in calendarGrid"
            :key="idx"
            class="w-1/7 p-1 text-center"
          >
            <view
              class="mx-auto h-9 w-9 flex items-center justify-center rounded-full"
              :class="{
                'text-gray-300': !d,
                'bg-blue-500 text-white': isToday(d),
                'ring-2 ring-blue-200': d === curDay,
              }"
              @click="onDayClick(idx)"
            >
              <text v-if="d">
                {{ d }}
              </text>
            </view>
            <view
              v-if="d && hasEventOn(d)"
              class="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"
            />
          </view>
        </view>
      </view>
      <view
        class="w-9 select-none text-center text-xl text-gray-600"
        @click="nextMonth"
      >
        ›
      </view>
    </view>

    <view class="px-4">
      <view v-if="filteredList.length === 0" class="py-6 text-center text-gray-500">
        今天没有日程
      </view>
      <view
        v-for="(item) in filteredList"
        :key="item.id"
        class="mb-3 flex rounded-lg bg-white p-3 shadow-sm"
      >
        <view class="w-14 text-center text-gray-600">
          <view class="font-bold">
            {{ shortMonthDay(item.beginDate) }}
          </view>
          <view class="text-xs">
            {{ item.beginTime }}
          </view>
        </view>
        <view class="flex-1 pl-3">
          <view class="flex items-center justify-between">
            <view class="font-bold" :class="{ 'line-through text-gray-400': item.finish }">
              {{ item.title }}
            </view>
            <view class="text-sm text-gray-600">
              {{ item.finish ? '已完成' : '待完成' }}
            </view>
          </view>
          <view class="mt-1 text-xs text-gray-500">
            {{ item.description }}
          </view>
          <navigator :url="detailUrl(item)">
            <view class="mt-2 text-sm text-blue-500">
              查看
            </view>
          </navigator>
        </view>
      </view>
    </view>

    <!-- 返回顶部按钮已移除：未使用的状态与方法 -->
  </view>
</template>

<script setup lang="ts">
import type { ReminderTypeConfigItem } from '@/types/remind'
import { onShow } from '@dcloudio/uni-app'
import { computed, onMounted, ref } from 'vue'
import { getReminders, getReminderTypeConfigs } from '@/api/remind'

// ------------------------
// 基础状态与常量
// ------------------------
const today = new Date()
const curYear = ref<number>(today.getFullYear())
const curMonth = ref<number>(today.getMonth() + 1)
const curDay = ref<number>(today.getDate())

const weeks = ['日', '一', '二', '三', '四', '五', '六']

const calendarGrid = ref<number[]>([])

// 远程类型配置映射（key 为后端返回的 type）
const typeConfigMap = ref<Record<string, ReminderTypeConfigItem>>({})
async function ensureTypeConfigs() {
  if (Object.keys(typeConfigMap.value).length > 0) {
    return
  }
  try {
    const res = await getReminderTypeConfigs()
    let list: any[] = []
    if (Array.isArray(res)) {
      list = res
    } else if (res && Array.isArray((res as any).data)) {
      list = (res as any).data
    } else if (res && typeof res === 'object') {
      const found = Object.values(res).find(v => Array.isArray(v)) as any[] | undefined
      if (found) {
        list = found
      }
    }
    const map: Record<string, ReminderTypeConfigItem> = {}
    for (const item of list) {
      if (item && item.type) {
        const { type, ...rest } = item
        map[type] = rest as ReminderTypeConfigItem
      }
    }
    typeConfigMap.value = map
  } catch {
    // 忽略错误，使用回退显示
    typeConfigMap.value = {}
  }
}

function typeName(type: string) {
  return typeConfigMap.value[type]?.name || '提醒'
}

// 生成回退描述：custom 不拼接“提前XX分钟”
function buildFallbackDesc(type: string, advance?: number) {
  return `${typeName(type)}${
    type === 'custom'
      ? ''
      : (typeof advance === 'number' && !Number.isNaN(advance) ? ` - 提前${advance}分钟` : '')
  }`
}

function buildCalendar(year: number, month: number) {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const days = last.getDate()
  const startWeek = first.getDay()
  const grid: number[] = []
  for (let i = 0; i < startWeek; i++) grid.push(0)
  for (let d = 1; d <= days; d++) grid.push(d)
  while (grid.length % 7 !== 0) grid.push(0)
  calendarGrid.value = grid
}

buildCalendar(curYear.value, curMonth.value)

function prevMonth() {
  if (curMonth.value === 1) {
    curYear.value--
    curMonth.value = 12
  } else {
    curMonth.value--
  }
  buildCalendar(curYear.value, curMonth.value)
}
function nextMonth() {
  if (curMonth.value === 12) {
    curYear.value++
    curMonth.value = 1
  } else {
    curMonth.value++
  }
  buildCalendar(curYear.value, curMonth.value)
}

const pickerValue = computed(() => `${curYear.value}-${String(curMonth.value).padStart(2, '0')}`)
function onPickerChange(e: any) {
  const v = e.detail.value
  if (!v) {
    return
  }
  const [y, m] = v.split('-').map((s: string) => Number(s))
  curYear.value = y
  curMonth.value = m
  buildCalendar(y, m)
}

const events = ref<any[]>([])

// ISO -> 简单日期时间（不做时区换算，保持后端语义原样显示）
function isoToDateTime(iso: string) {
  if (!iso) {
    return { date: '', time: '' }
  }
  // 直接按 ISO 文本截取，不进行时区换算，保持后端语义原样显示
  // 期望格式：YYYY-MM-DDTHH:MM:SS(.sss)Z
  const date = iso.slice(0, 10)
  const time = iso.slice(11, 16)
  return { date, time }
}

function mapReminderToEvent(reminder: any) {
  // 描述：优先后端传入，其次按类型生成回退文案
  const fallback = buildFallbackDesc(reminder.type, reminder.advance_minutes)
  const description = (reminder.description && String(reminder.description).trim()) || fallback
  // 开始/结束时间
  const start = isoToDateTime(reminder.remind_start_time)
  const end = isoToDateTime(reminder.remind_end_time)
  return {
    id: reminder.reminder_id,
    title: (reminder.activity?.title) || reminder.title || '提醒',
    beginDate: start.date,
    endDate: end.date || start.date,
    beginTime: start.time,
    endTime: end.time || start.time,
    description,
    advanceMinutes: reminder.advance_minutes,
    finish: !!reminder.sent,
    raw: reminder,
    activity_id: reminder.activity_id
  }
}

async function loadReminders() {
  try {
    const res = await getReminders()
    let list: any[] = []
    if (Array.isArray(res)) {
      list = res
    } else if (res && Array.isArray((res as any).data)) {
      list = (res as any).data
    } else if (res && typeof res === 'object') {
      // 兜底：查找对象里首个数组字段
      const found = Object.values(res).find(v => Array.isArray(v)) as any[] | undefined
      if (found) {
        list = found
      }
    }
    events.value = list.map(mapReminderToEvent)
  } catch (e) {
    // 接口失败时使用本地占位数据，避免页面空白
    const y = curYear.value
    const m = String(curMonth.value).padStart(2, '0')
    events.value = [
      { id: 1, title: '本地占位提醒 A', beginDate: `${y}-${m}-07`, endDate: `${y}-${m}-07`, beginTime: '10:00', endTime: '10:00', finish: false },
      { id: 2, title: '本地占位提醒 B', beginDate: `${y}-${m}-08`, endDate: `${y}-${m}-08`, beginTime: '14:00', endTime: '14:00', finish: true }
    ]
  }
}

onMounted(() => {
  ensureTypeConfigs().finally(() => {
    loadReminders()
  })
})

onShow(() => {
  // 从创建页返回时触发，确保类型配置与列表刷新
  ensureTypeConfigs().finally(() => {
    loadReminders()
  })
})

function hasEventOn(day: number) {
  if (!day) {
    return false
  }
  const mm = String(curMonth.value).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  const date = `${curYear.value}-${mm}-${dd}`
  return events.value.some((it: any) => it.beginDate === date || it.endDate === date)
}

function isToday(d: number) {
  return d === today.getDate() && curMonth.value === (today.getMonth() + 1) && curYear.value === today.getFullYear()
}

function onDayClick(idx: number) {
  const d = calendarGrid.value[idx]
  if (!d) {
    return
  }
  curDay.value = d
}

const filteredList = computed(() => {
  const mm = String(curMonth.value).padStart(2, '0')
  const dd = String(curDay.value).padStart(2, '0')
  const date = `${curYear.value}-${mm}-${dd}`
  return events.value.filter((it: any) => it.beginDate === date || it.endDate === date)
})

function detailUrl(item: any) {
  const rawType = item.raw?.type || 'custom'
  const adv = item.advanceMinutes
  const baseDesc = (item.raw?.description && String(item.raw?.description).trim()) || ''
  const fallbackDesc = buildFallbackDesc(rawType, adv)
  const desc = baseDesc || fallbackDesc
  const params: string[] = []
  // 对参数进行编码，避免特殊字符破坏路由
  params.push(`title=${encodeURIComponent(item.title || '')}`)
  params.push(`description=${encodeURIComponent(desc)}`)
  params.push(`beginDate=${encodeURIComponent(item.beginDate || '')}`)
  params.push(`beginTime=${encodeURIComponent(item.beginTime || '')}`)
  if (item.activity_id) {
    params.push(`id=${encodeURIComponent(String(item.activity_id))}`)
  }
  if (item.id) {
    params.push(`reminder_id=${encodeURIComponent(String(item.id))}`)
  }
  params.push(`advance_minutes=${encodeURIComponent(String(item.advanceMinutes ?? 30))}`)
  params.push(`type=${encodeURIComponent(item.raw?.type || 'custom')}`)
  return `/subPackage/remind-edit/index?${params.join('&')}`
}

// compareDateRange 已废弃

function shortMonthDay(d: string) {
  if (!d) {
    return ''
  }
  const parts = d.split('-')
  return `${Number(parts[1])}.${Number(parts[2])}`
}

function onCreate() {
  uni.navigateTo({ url: '/subPackage/remind-create/index' })
}
</script>
