export interface ScheduleItem {
  id: string
  activityId?: string
  activityCode?: string
  title: string
  description?: string
  type: number // 0: Học tập, 1: Ăn ngủ, 2: Vui chơi / Hoạt động, 3: Ngoài trời, 4: Sự kiện, 5: Khác
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  location?: string
  className?: string
  isSchoolWide?: boolean
  teacherName?: string
  status?: string
  isActivity?: boolean
  criteria?: { id: string; name: string }[]
  evaluationCount?: number
}

export const TYPE_NAMES = [
  'Học tập',
  'Ăn ngủ',
  'Hoạt động & Vui chơi',
  'Ngoài trời',
  'Sự kiện toàn trường',
  'Khác',
]

export const TYPE_COLORS: Record<number, { bg: string; border: string; badge: string; text: string }> = {
  0: { bg: 'bg-sky-50 hover:bg-sky-100', border: 'border-sky-200', badge: 'bg-sky-500 text-white', text: 'text-sky-950' },
  1: { bg: 'bg-amber-50 hover:bg-amber-100', border: 'border-amber-200', badge: 'bg-amber-500 text-white', text: 'text-amber-950' },
  2: { bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-300', badge: 'bg-purple-600 text-white', text: 'text-purple-950' },
  3: { bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-200', badge: 'bg-emerald-600 text-white', text: 'text-emerald-950' },
  4: { bg: 'bg-rose-50 hover:bg-rose-100', border: 'border-rose-300', badge: 'bg-rose-600 text-white', text: 'text-rose-950' },
  5: { bg: 'bg-slate-50 hover:bg-slate-100', border: 'border-slate-200', badge: 'bg-slate-600 text-white', text: 'text-slate-900' },
}

export interface TeacherDayColumn {
  dayName: string
  isoDate: string
  formattedDate: string
  isToday: boolean
}
