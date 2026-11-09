'use client'

import React from 'react'
import { School, Clock, Users, Sparkles, MapPin, CheckCircle, Sun, Moon, Utensils, BookOpen, Smile, LogOut } from 'lucide-react'

interface TeacherHeroCardProps {
  today: string
  time: Date
  classInfo: {
    name?: string
    room?: string
    ageGroup?: string
    totalStudents?: number
    currentTeacher?: string
    teachers?: Array<{
      id: string
      name: string
      role: string
      avatar: string
      color?: string
    }>
  }
}

interface RoutinePhase {
  id: string
  label: string
  timeRange: string
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
  icon: React.ElementType
}

const ROUTINE_PHASES: RoutinePhase[] = [
  { id: 'arrival', label: 'Đón trẻ & Thể dục sáng', timeRange: '07:00 - 08:30', startHour: 7, startMinute: 0, endHour: 8, endMinute: 30, icon: Sun },
  { id: 'breakfast', label: 'Bữa sáng & Hoạt động góc', timeRange: '08:30 - 09:15', startHour: 8, startMinute: 30, endHour: 9, endMinute: 15, icon: Utensils },
  { id: 'learning', label: 'Hoạt động học có chủ đích', timeRange: '09:15 - 10:30', startHour: 9, startMinute: 15, endHour: 10, endMinute: 30, icon: BookOpen },
  { id: 'lunch', label: 'Vệ sinh & Bữa trưa', timeRange: '10:30 - 11:30', startHour: 10, startMinute: 30, endHour: 11, endMinute: 30, icon: Utensils },
  { id: 'nap', label: 'Giờ ngủ trưa bán trú', timeRange: '11:30 - 14:00', startHour: 11, startMinute: 30, endHour: 14, endMinute: 0, icon: Moon },
  { id: 'snack', label: 'Thức dậy & Bữa xế', timeRange: '14:00 - 15:30', startHour: 14, startMinute: 0, endHour: 15, endMinute: 30, icon: Smile },
  { id: 'departure', label: 'Hoạt động chiều & Trả trẻ', timeRange: '15:30 - 17:30', startHour: 15, startMinute: 30, endHour: 17, endMinute: 30, icon: LogOut },
]

export const TeacherHeroCard: React.FC<TeacherHeroCardProps> = ({
  today,
  time,
  classInfo,
}) => {
  const className = classInfo.name || 'Lớp học chưa phân công'
  const roomName = classInfo.room || 'Phòng học'
  const schoolYear = classInfo.ageGroup || 'Năm học 2026 - 2027'
  const totalStudents = classInfo.totalStudents || 0
  const teachersList = classInfo.teachers || []

  // Xác định phase hiện tại theo giờ
  const currentTotalMinutes = time.getHours() * 60 + time.getMinutes()

  const activePhase = ROUTINE_PHASES.find((p) => {
    const start = p.startHour * 60 + p.startMinute
    const end = p.endHour * 60 + p.endMinute
    return currentTotalMinutes >= start && currentTotalMinutes < end
  }) || ROUTINE_PHASES[0]

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-3.5 sm:p-6 text-white shadow-lg shadow-orange-600/15 max-w-full min-w-0">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-amber-400/20 blur-xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-3 sm:gap-6 md:flex-row md:items-center md:justify-between">
        {/* Bên trái: Thông tin lớp học và ngày giảng dạy */}
        <div className="space-y-1.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-white backdrop-blur-md">
            <Sparkles size={13} className="text-amber-200" />
            <span suppressHydrationWarning>{today}</span>
          </div>

          <div>
            <h2 className="text-base sm:text-2xl md:text-3xl font-black tracking-tight drop-shadow-xs">
              Lớp {className}
            </h2>
            <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-xs font-medium text-orange-50">
              <span className="flex items-center gap-1 rounded-lg bg-black/15 px-2 py-0.5 backdrop-blur-xs">
                <MapPin size={11} className="text-amber-200" />
                {roomName}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-black/15 px-2 py-0.5 backdrop-blur-xs">
                <School size={11} className="text-amber-200" />
                {schoolYear}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-black/15 px-2 py-0.5 backdrop-blur-xs">
                <Users size={11} className="text-amber-200" />
                Sĩ số: <strong className="text-white">{totalStudents} trẻ</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bên phải: Đồng hồ điện tử & Giai đoạn nề nếp hiện tại */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end justify-center rounded-xl sm:rounded-2xl bg-black/20 p-2.5 sm:p-4 backdrop-blur-md border border-white/15">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-200">
            <Clock size={12} />
            <span className="hidden sm:inline">Chế độ sinh hoạt:</span>
            <span>{activePhase.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="rounded-md bg-amber-400 px-1.5 py-0.5 text-[10px] font-black text-slate-900">
              {activePhase.timeRange}
            </span>
            <span
              className="font-mono text-xs font-bold text-orange-200 hidden sm:inline"
              suppressHydrationWarning
            >
              Giờ: {time.toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>
      </div>

      {/* Routine Stepper Timeline - Vuốt ngang nhẹ nhàng */}
      <div className="mt-3 sm:mt-4 border-t border-white/15 pt-2 sm:pt-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROUTINE_PHASES.map((phase) => {
            const Icon = phase.icon
            const isCurrent = phase.id === activePhase.id

            return (
              <div
                key={phase.id}
                className={`flex items-center gap-1.5 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 text-center transition shrink-0 ${
                  isCurrent
                    ? 'bg-white text-orange-800 shadow-md ring-2 ring-amber-300'
                    : 'bg-black/15 text-orange-100 hover:bg-black/25'
                }`}
              >
                <div className={`p-0.5 sm:p-1 rounded-md ${isCurrent ? 'bg-orange-100 text-orange-600' : 'bg-white/10'}`}>
                  <Icon size={12} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap block">{phase.label}</span>
                  <span className={`text-[8px] sm:text-[9px] block ${isCurrent ? 'font-bold text-orange-700' : 'opacity-80'}`}>
                    {phase.timeRange}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Danh sách giáo viên phụ trách */}
      {teachersList.length > 0 && (
        <div className="mt-2.5 sm:mt-4 border-t border-white/15 pt-2 sm:pt-3 flex items-center justify-between text-[11px] sm:text-xs text-orange-100">
          <div className="flex items-center gap-1.5">
            <span className="font-bold">GV:</span>
            <div className="flex gap-1.5">
              {teachersList.map((t) => (
                <span key={t.id} className="rounded-md bg-black/15 px-2 py-0.5 font-semibold text-white">
                  {t.name}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] text-amber-200 hidden sm:inline">Đồng bộ nghiệp vụ thời gian thực</span>
        </div>
      )}
    </div>
  )
}