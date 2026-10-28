'use client'

import React from 'react'
import { School, Clock, Users, Sparkles, MapPin, CheckCircle } from 'lucide-react'

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

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 md:p-8 text-white shadow-lg shadow-orange-500/20">
      {/* Background Decorative Blobs */}
      <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* Bên trái: Thông tin lớp học và ngày giảng dạy */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md">
            <Sparkles size={14} className="text-amber-200" />
            <span suppressHydrationWarning>{today}</span>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-xs">
              {className}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-orange-50">
              <span className="flex items-center gap-1.5 rounded-lg bg-black/15 px-2.5 py-1 backdrop-blur-xs">
                <MapPin size={13} className="text-amber-200" />
                {roomName}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-black/15 px-2.5 py-1 backdrop-blur-xs">
                <School size={13} className="text-amber-200" />
                {schoolYear}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-black/15 px-2.5 py-1 backdrop-blur-xs">
                <Users size={13} className="text-amber-200" />
                Sĩ số: <strong className="text-white">{totalStudents} trẻ</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Bên phải: Đồng hồ điện tử và trạng thái trực tuyến */}
        <div className="flex flex-col items-start md:items-end justify-center rounded-2xl bg-black/15 p-4 backdrop-blur-md border border-white/15">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
            <Clock size={14} />
            <span>Thời gian hiện tại</span>
          </div>
          <div
            className="mt-1 font-mono text-3xl md:text-4xl font-black tracking-wider text-white"
            suppressHydrationWarning
          >
            {time.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-200 border border-emerald-400/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span>Hệ thống giảng dạy trực tuyến</span>
          </div>
        </div>
      </div>

      {/* Danh sách giáo viên phụ trách */}
      {teachersList.length > 0 && (
        <div className="mt-6 border-t border-white/15 pt-4">
          <p className="text-xs font-bold text-orange-100 uppercase tracking-wider mb-2">
            Giáo viên phụ trách lớp:
          </p>
          <div className="flex flex-wrap gap-3">
            {teachersList.map((teacherItem) => (
              <div
                key={teacherItem.id}
                className="flex items-center gap-2.5 rounded-xl bg-white/20 px-3 py-1.5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/30 text-xs font-black text-white">
                  {teacherItem.avatar || 'GV'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{teacherItem.name}</p>
                  <p className="text-[10px] text-orange-100">{teacherItem.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
