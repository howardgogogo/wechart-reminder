import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
})

export interface Reminder {
  id: string
  mode: 'BIRTHDAY' | 'MEETING' | 'CLASS' | 'SCHEDULE' | 'CUSTOM'
  title: string
  content?: string
  location?: string
  remindTime: string
  isLunar: boolean
  repeatType: 'ONCE' | 'YEARLY' | 'MONTHLY' | 'WEEKLY'
  isEnabled: boolean
  lastRemindAt?: string
  createdAt: string
}

export interface CreateReminderDto {
  mode: Reminder['mode']
  title: string
  content?: string
  location?: string
  remindTime: string
  isLunar?: boolean
  repeatType?: Reminder['repeatType']
  relation?: string
  birthdayMessage?: string
}

export interface BatchCreateResult {
  success: number
  failed: number
  results: any[]
}

export interface ParseResult {
  valid: any[]
  invalid: any[]
  totalLines: number
}

const userId = 'default-user' // 简化版，实际应从企业微信获取

export const reminderApi = {
  list: () => api.get<Reminder[]>(`/reminders?userId=${userId}`).then(r => r.data),

  get: (id: string) => api.get<Reminder>(`/reminders/${id}?userId=${userId}`).then(r => r.data),

  create: (data: CreateReminderDto) =>
    api.post<Reminder>(`/reminders?userId=${userId}`, data).then(r => r.data),

  update: (id: string, data: Partial<CreateReminderDto>) =>
    api.put<Reminder>(`/reminders/${id}?userId=${userId}`, data).then(r => r.data),

  delete: (id: string) =>
    api.delete(`/reminders/${id}?userId=${userId}`).then(r => r.data),

  batchCreate: (dtos: CreateReminderDto[]) =>
    api.post<Reminder[]>(`/reminders/batch?userId=${userId}`, dtos).then(r => r.data),

  batchCreateFromText: (text: string) =>
    api.post<BatchCreateResult>(`/reminders/batch-text?userId=${userId}`, { text }).then(r => r.data),

  parseBatchText: (text: string) =>
    api.post<ParseResult>(`/reminders/parse-batch?userId=${userId}`, { text }).then(r => r.data),
}

export const modeConfig: Record<Reminder['mode'], { label: string; icon: string; color: string }> = {
  BIRTHDAY: { label: '生日', icon: '🎂', color: '#ff6b81' },
  MEETING: { label: '会议', icon: '📅', color: '#4ecdc4' },
  CLASS: { label: '上课', icon: '📚', color: '#ffe66d' },
  SCHEDULE: { label: '日程', icon: '📝', color: '#95e1d3' },
  CUSTOM: { label: '自定义', icon: '🔔', color: '#dfe6e9' },
}

export const repeatTypeLabels: Record<Reminder['repeatType'], string> = {
  ONCE: '仅一次',
  YEARLY: '每年',
  MONTHLY: '每月',
  WEEKLY: '每周',
}
