'use client'

import React from 'react'
import { CalendarDays, ArrowRight, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react'

interface AttendanceStats {
  rate: number
  present: number
  late: number
  absent: number
  totalScheduled: number
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
    <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white p-3.5 sm:p-5 lg:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-blue-50">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            <CalendarDays size={12} /> THEO DÕI CHUYÊN CẦN
          </span>
          <h3 className="mt-0.5 sm:mt-1 text-sm sm:text-lg font-black text-slate-800">
            Tình hình đi học của bé {childName} · Lớp {className}
          </h3>
        </div>

        <button
          onClick={onNavigateDetail}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Xem sổ điểm danh chi tiết</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-3.5 sm:mt-5 grid gap-2.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-blue-50/40 p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Tỷ lệ chuyên cần</p>
            <TrendingUp size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-blue-600">{stats.rate}%</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">
            {stats.totalScheduled} buổi theo lịch
          </p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Đi học đủ</p>
            <CheckCircle2 size={16} className="text-emerald-600 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-emerald-600">{stats.present}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Buổi tại lớp</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-amber-100 bg-amber-50/40 p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Đến muộn</p>
            <Clock size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-amber-500">{stats.late}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Sau 08:30 sáng</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/40 p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase">Nghỉ học</p>
            <XCircle size={16} className="text-rose-500 sm:w-[18px] sm:h-[18px]" />
          </div>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-rose-500">{stats.absent}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Buổi có phép / không phép</p>
        </div>
      </div>
    </div>
  )
}
