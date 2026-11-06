'use client'

import React from 'react'
import {
  Clock,
  Sun,
  Utensils,
  BookOpen,
  Moon,
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
  LogOut,
} from 'lucide-react'

export interface StoryMoment {
  id: string
  time: string
  title: string
  description: string
  tag: string
  icon: React.ElementType
  bgClass: string
}

interface ChildDailyStoryFeedProps {
  childName: string
  className?: string
  todayAttendance?: any
  todaySchedules?: any[]
}

export const ChildDailyStoryFeed: React.FC<ChildDailyStoryFeedProps> = ({
  childName,
  className,
  todayAttendance,
  todaySchedules = [],
}) => {
  const moments: StoryMoment[] = []

  // 1. Điểm danh đón trẻ thực tế
  if (todayAttendance) {
    const timeStr = todayAttendance.gioDen ? String(todayAttendance.gioDen).slice(0, 5) : 'Đầu giờ'
    const statusStr = todayAttendance.trangThai || 'Đã ghi nhận'
    const noteStr = todayAttendance.ghiChu ? ` • Ghi chú: ${todayAttendance.ghiChu}` : ''

    moments.push({
      id: 'att-checkin',
      time: timeStr,
      title: 'Đón trẻ & Điểm danh buổi sáng',
      description: `Bé ${childName} ghi nhận trạng thái: "${statusStr}" tại lớp ${className || ''}.${noteStr}`,
      tag: 'Điểm danh đến',
      icon: Sun,
      bgClass: 'bg-emerald-500',
    })

    // Nếu đã có giờ về
    if (todayAttendance.gioVe) {
      moments.push({
        id: 'att-checkout',
        time: String(todayAttendance.gioVe).slice(0, 5),
        title: 'Bàn giao & Trả trẻ ra về',
        description: `Bé ${childName} đã hoàn tất ngày học tại lớp ${className || ''} và được phụ huynh/người thân đón về an toàn.`,
        tag: 'Điểm danh về',
        icon: LogOut,
        bgClass: 'bg-blue-500',
      })
    }
  }

  // 2. Lịch trình hoạt động học thực tế trong ngày (Chỉ lấy các hoạt động của ngày hôm nay, tối đa 5 hoạt động)
  const todayStr = new Date().toISOString().slice(0, 10);
  const filteredTodaySchedules = Array.isArray(todaySchedules)
    ? todaySchedules
        .filter((sch: any) => {
          const d = String(sch.date || sch.ngay || '').slice(0, 10);
          return !d || d === todayStr;
        })
        .slice(0, 5)
    : [];

  if (filteredTodaySchedules.length > 0) {
    filteredTodaySchedules.forEach((sch: any, idx: number) => {
      const timeStr = sch.startTime || sch.gioBatDau ? String(sch.startTime || sch.gioBatDau).slice(0, 5) : 'Tiết học'
      const titleStr = sch.title || sch.tieuDe || sch.tenSuKien || 'Hoạt động học tập'
      const roomStr = sch.room || sch.phongHoc ? ` tại ${sch.room || sch.phongHoc}` : ''

      moments.push({
        id: `sch-${idx}`,
        time: timeStr,
        title: titleStr,
        description: `Tiết học theo thời khóa biểu của lớp ${className || ''}${roomStr}.`,
        tag: 'Hoạt động học',
        icon: BookOpen,
        bgClass: 'bg-indigo-500',
      })
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Heart size={16} />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Lịch sinh hoạt & Nhật ký trong ngày của bé ({childName})
            </h3>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tiến trình đón trẻ, hoạt động học tập và trả trẻ được giáo viên cập nhật theo thời gian thực
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck size={13} className="text-emerald-600" />
          <span>Lớp {className || 'Mầm non'}</span>
        </span>
      </div>

      {moments.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          Chưa có lượt điểm danh hoặc hoạt động nào được ghi nhận cho bé trong ngày hôm nay.
        </div>
      ) : (
        <div className="mt-5 relative border-l-2 border-slate-100 ml-3.5 sm:ml-4 pl-4 sm:pl-6 space-y-5">
          {moments.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.id} className="relative group">
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-1 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-white shadow-xs ${item.bgClass}`}
                >
                  <Icon size={13} />
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-white hover:shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-xs font-bold text-slate-500">
                        <Clock size={12} className="text-slate-400" />
                        <span>{item.time}</span>
                      </span>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-black uppercase text-slate-700 border border-slate-200">
                        {item.tag}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <CheckCircle2 size={12} />
                      <span>Đã ghi nhận</span>
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-black text-slate-800">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}