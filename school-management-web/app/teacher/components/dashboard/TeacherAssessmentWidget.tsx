'use client'

import React from 'react'
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Layers } from 'lucide-react'

interface AssessmentStats {
  totalAssessments: number
  passCount: number
  failCount: number
  totalCriteria: number
  totalActivities: number
}

interface TeacherAssessmentWidgetProps {
  stats: AssessmentStats
  onNavigate: (path: string) => void
}

export const TeacherAssessmentWidget: React.FC<TeacherAssessmentWidgetProps> = ({
  stats,
  onNavigate,
}) => {
  const passRate =
    stats.totalAssessments > 0
      ? Math.round((stats.passCount / stats.totalAssessments) * 100)
      : 0

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">
              Đánh giá sự phát triển của trẻ
            </h4>
            <p className="text-xs text-slate-400">
              Theo dõi 5 lĩnh vực phát triển mầm non
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/teacher/assessment')}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Chi tiết</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Chỉ số nhanh */}
      <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-slate-100">
        <div className="rounded-2xl bg-slate-50 p-2.5 text-center">
          <p className="text-[10px] uppercase font-bold text-slate-400">Tổng đánh giá</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">{stats.totalAssessments}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-2.5 text-center border border-emerald-100">
          <p className="text-[10px] uppercase font-bold text-emerald-600">Đạt tiêu chí</p>
          <p className="text-lg font-black text-emerald-700 mt-0.5">{stats.passCount}</p>
        </div>
        <div className="rounded-2xl bg-rose-50 p-2.5 text-center border border-rose-100">
          <p className="text-[10px] uppercase font-bold text-rose-500">Chưa đạt</p>
          <p className="text-lg font-black text-rose-600 mt-0.5">{stats.failCount}</p>
        </div>
      </div>

      {/* Thanh tiến độ */}
      <div className="mt-3.5 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Tỷ lệ đạt tiêu chí</span>
          <span className="font-extrabold text-purple-700">{passRate}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${passRate}%` }}
          />
        </div>
      </div>
    </div>
  )
}
