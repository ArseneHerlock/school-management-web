'use client'

import React from 'react'
import { CalendarDays, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface ScheduleItem {
  time: string
  activity: string
  subject?: string
  room?: string
  done?: boolean
  current?: boolean
}

interface TeacherTodayScheduleProps {
  schedule: ScheduleItem[]
}

export const TeacherTodaySchedule: React.FC<TeacherTodayScheduleProps> = ({ schedule }) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 bg-white p-3.5 sm:p-5 shadow-xs flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
            <CalendarDays size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
              Lịch trình giảng dạy hôm nay
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Theo thời khóa biểu của lớp phụ trách
            </p>
          </div>
        </div>

        <Link
          href="/teacher/schedule"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
        >
          <span>Xem cả tuần</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[380px]">
        {schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <Sparkles size={28} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-600">
              Chưa có tiết học nào trong ngày
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Thời khóa biểu sẽ được hiển thị khi quản trị viên phân công
            </p>
          </div>
        ) : (
          schedule.map((scheduleItem, index) => {
            const isCurrent = scheduleItem.current
            const isDone = scheduleItem.done

            return (
              <div
                key={index}
                className={`relative flex items-center gap-3.5 rounded-2xl p-3.5 border transition-all ${
                  isCurrent
                    ? 'border-orange-300 bg-orange-50/70 shadow-xs'
                    : isDone
                    ? 'border-slate-100 bg-slate-50/60 opacity-60'
                    : 'border-slate-100 bg-white hover:border-orange-200 hover:bg-orange-50/20'
                }`}
              >
                {/* Icon trạng thái */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                    isCurrent
                      ? 'bg-orange-500 text-white shadow-xs animate-pulse'
                      : isDone
                      ? 'bg-slate-200 text-slate-500'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Chi tiết hoạt động */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`truncate text-xs font-bold ${
                        isDone
                          ? 'text-slate-400 line-through'
                          : isCurrent
                          ? 'text-orange-950 font-black'
                          : 'text-slate-800'
                      }`}
                    >
                      {scheduleItem.activity}
                    </p>
                    {isCurrent && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                        Đang học
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={11} className="text-slate-400" />
                    <span>{scheduleItem.time}</span>
                    {scheduleItem.room && <span>• Phòng {scheduleItem.room}</span>}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
