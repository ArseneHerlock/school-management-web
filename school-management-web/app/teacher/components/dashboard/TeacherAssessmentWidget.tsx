'use client'

import React from 'react'
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, Layers, HeartPulse } from 'lucide-react'

interface AssessmentStats {
  totalAssessments: number
  passCount: number
  failCount: number
  totalCriteria: number
  totalActivities: number
}

interface TeacherAssessmentWidgetProps {
  stats: AssessmentStats
  healthStats?: {
    totalStudents: number
    normalCount: number
    attentionCount: number
    measuredCount: number
  }
  onNavigate: (path: string) => void
}

export const TeacherAssessmentWidget: React.FC<TeacherAssessmentWidgetProps> = ({
  stats,
  healthStats,
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
              Đánh giá Phát triển & Sức khỏe của Lớp
            </h4>
            <p className="text-xs text-slate-400">
              Tiến độ 5 lĩnh vực mầm non và thể trạng dinh dưỡng WHO
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/teacher/assessment')}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Xem chi tiết</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2 Khối Chỉ số Trực quan: Đánh giá & Sức khỏe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Khối 1: Tiến độ Đánh giá Trẻ */}
        <div className="rounded-2xl border border-purple-100 bg-purple-50/40 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-purple-900">5 Lĩnh vực phát triển</span>
              <span className="font-black text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-md">
                Đạt {passRate}%
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 py-2 text-center">
              <div className="rounded-xl bg-white p-1.5 border border-purple-100/80">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Tổng đánh giá</p>
                <p className="text-base font-black text-slate-800">{stats.totalAssessments}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-1.5 border border-emerald-100">
                <p className="text-[10px] text-emerald-600 uppercase font-bold">Đạt tiêu chí</p>
                <p className="text-base font-black text-emerald-700">{stats.passCount}</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-1.5 border border-rose-100">
                <p className="text-[10px] text-rose-500 uppercase font-bold">Chưa đạt</p>
                <p className="text-base font-black text-rose-600">{stats.failCount}</p>
              </div>
            </div>
          </div>

          {/* Thanh tỷ lệ đạt */}
          <div className="mt-2 space-y-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${passRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Khối 2: Tình trạng Thể trạng WHO của Lớp */}
        <div
          onClick={() => onNavigate('/teacher/health')}
          className="rounded-2xl border border-rose-100 bg-rose-50/40 p-3.5 flex flex-col justify-between cursor-pointer hover:border-rose-200 transition"
        >
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5">
                <HeartPulse size={14} className="text-rose-600" />
                <span className="font-bold text-rose-900">Thể trạng WHO của Lớp</span>
              </div>
              <span className="text-[11px] font-bold text-rose-600 hover:underline">
                Vào đo khám ➜
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-2">
              Theo dõi định kỳ chiều cao, cân nặng và chỉ số HAZ/WAZ/WHZ
            </p>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-white p-2 border border-emerald-100">
                <p className="text-[10px] text-emerald-700 uppercase font-bold">Chuẩn dinh dưỡng</p>
                <p className="text-base font-black text-emerald-800">
                  {healthStats?.normalCount ?? '--'} bé
                </p>
              </div>
              <div className="rounded-xl bg-white p-2 border border-amber-100">
                <p className="text-[10px] text-amber-700 uppercase font-bold">Cần can thiệp</p>
                <p className="text-base font-black text-amber-800">
                  {healthStats?.attentionCount ?? '--'} bé
                </p>
              </div>
            </div>
          </div>

          <p className="mt-2 text-[10px] text-slate-400 text-center">
            Bấm để cập nhật số đo mới nhất của cả lớp
          </p>
        </div>
      </div>
    </div>
  )
}
