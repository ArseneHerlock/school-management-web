export interface ScheduleItem {
  id: string
  title: string
  description?: string
  type: number // 1: Học tập/Tiết học, 2: Hoạt động/Trải nghiệm, 3: Họp/Sinh hoạt, 4: Đánh giá, 5: Sự kiện toàn trường, 6: Khác
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  location?: string
  classId?: string
  className?: string
  isSchoolWide?: boolean
  status?: string
  teacherName?: string
  activityId?: string
}

export const SCHEDULE_TYPES = [
  { value: 1, label: 'Tiết học / Bài giảng mầm non (Lesson)' },
  { value: 2, label: 'Hoạt động trải nghiệm / Vui chơi (Activity)' },
  { value: 3, label: 'Họp / Sinh hoạt chuyên môn (Meeting)' },
  { value: 4, label: 'Đánh giá & Rèn luyện kỹ năng (Assessment)' },
  { value: 5, label: 'Ngày hội / Sự kiện toàn trường (Holiday/Event)' },
  { value: 6, label: 'Nhắc nhở & Hoạt động khác (Reminder)' },
]

export const TYPE_NAMES: Record<number, string> = {
  1: 'Tiết học / Học tập',
  2: 'Hoạt động trải nghiệm / Vui chơi',
  3: 'Họp / Sinh hoạt',
  4: 'Đánh giá rèn luyện',
  5: 'Sự kiện / Ngày hội',
  6: 'Khác',
}

export const TYPE_COLORS: Record<number, { bg: string; border: string; text: string; badge: string }> = {
  1: { bg: 'bg-sky-50/90 hover:bg-sky-100/90', border: 'border-sky-200', text: 'text-sky-950', badge: 'bg-sky-500 text-white' },
  2: { bg: 'bg-purple-50/90 hover:bg-purple-100/90', border: 'border-purple-200', text: 'text-purple-950', badge: 'bg-purple-500 text-white' },
  3: { bg: 'bg-amber-50/90 hover:bg-amber-100/90', border: 'border-amber-200', text: 'text-amber-950', badge: 'bg-amber-500 text-white' },
  4: { bg: 'bg-emerald-50/90 hover:bg-emerald-100/90', border: 'border-emerald-200', text: 'text-emerald-950', badge: 'bg-emerald-600 text-white' },
  5: { bg: 'bg-rose-50/90 hover:bg-rose-100/90', border: 'border-rose-200', text: 'text-rose-950', badge: 'bg-rose-500 text-white' },
  6: { bg: 'bg-slate-50/90 hover:bg-slate-100/90', border: 'border-slate-200', text: 'text-slate-900', badge: 'bg-slate-600 text-white' },
}

export interface DayColumn {
  dayName: string
  isoDate: string
  formattedDate: string
  isToday: boolean
}
