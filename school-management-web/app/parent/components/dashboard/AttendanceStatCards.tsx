'use client'

import React from 'react'
import { CalendarDays, ArrowRight, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface AttendanceStats {
  rate: number
  present: number
  late: number
  absent: number
  totalScheduled: number
  monthLabel?: string
}

interface AttendanceStatCardsProps {
  stats: AttendanceStats
  childName?: string
  className?: string
  onNavigateDetail: () => void
}

export const AttendanceStatCards: React.FC<AttendanceStatCardsProps> = ({
  stats,
  childName,
  className,
  onNavigateDetail,
}) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white p-3 sm:p-5 lg:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 pb-2.5 sm:pb-4 border-b border-blue-50">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            <CalendarDays size={11} /> CHUYÊN CẦN {stats.monthLabel ? `· ${stats.monthLabel.toUpperCase()}` : ''}
          </span>
          <h3 className="mt-0.5 sm:mt-1 text-xs sm:text-base font-black text-slate-800">
            Đi học của {childName} · Lớp {className}
          </h3>
        </div>

        <button
          onClick={onNavigateDetail}
          className="text-[11px] sm:text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Xem sổ chi tiết</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-2.5 sm:mt-5 grid gap-2 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-blue-50/40 p-2.5 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Chuyên cần</p>
            <TrendingUp size={15} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-black text-blue-600">{stats.rate}%</p>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">
            {stats.totalScheduled} buổi học
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-emerald-100 bg-emerald-50/40 p-2.5 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Đi học đủ</p>
            <CheckCircle2 size={15} className="text-emerald-600 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-black text-emerald-600">{stats.present}</p>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">Buổi tại lớp</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-amber-100 bg-amber-50/40 p-2.5 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Đến muộn</p>
            <Clock size={15} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-black text-amber-500">{stats.late}</p>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">Sau 08:30</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/40 p-2.5 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Nghỉ học</p>
            <XCircle size={15} className="text-rose-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-0.5 sm:mt-2 text-xl sm:text-3xl font-black text-rose-500">{stats.absent}</p>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-400">Có phép / K.phép</p>
        </div>
      </div>
    </div>
  )
}
