'use client'

import React from 'react'
import { TrendingUp, CheckCircle2, Clock, XCircle, Info } from 'lucide-react'

interface AttendanceKPICardsProps {
  attendanceRate: number
  totalScheduledDays: number
  presentCount: number
  lateCount: number
  absentCount: number
}

export const AttendanceKPICards: React.FC<AttendanceKPICardsProps> = ({
  attendanceRate,
  totalScheduledDays,
  presentCount,
  lateCount,
  absentCount,
}) => {
  return (
    <div className="grid gap-2.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Tỷ lệ chuyên cần</p>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-blue-600">{attendanceRate}%</p>
          </div>
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-blue-50 text-blue-600 shrink-0">
            <TrendingUp size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500">
          <Info size={11} className="text-blue-500 shrink-0" />
          <span className="truncate">{totalScheduledDays} buổi học</span>
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Đi học đủ</p>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-600">{presentCount}</p>
          </div>
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
            <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
        <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] text-slate-400 truncate">Ghi nhận tại lớp</p>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Đến muộn</p>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-amber-500">{lateCount}</p>
          </div>
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-50 text-amber-500 shrink-0">
            <Clock size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
        <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] text-slate-400 truncate">Sau 08:30 sáng</p>
      </div>

      <div className="rounded-xl sm:rounded-2xl border border-blue-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Nghỉ học</p>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-rose-500">{absentCount}</p>
          </div>
          <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-500 shrink-0">
            <XCircle size={20} className="sm:w-6 sm:h-6" />
          </div>
        </div>
        <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] text-slate-400 truncate">Buổi có phép / không phép</p>
      </div>
    </div>
  )
}
