'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'

interface DevelopmentStats {
  activitiesCount: number
  passCount: number
  failCount: number
  unassessedCount: number
  totalCrit: number
  passRate: number
}

interface DevelopmentProgressCardProps {
  stats: DevelopmentStats
  childName?: string
  onNavigateDetail: () => void
}

export const DevelopmentProgressCard: React.FC<DevelopmentProgressCardProps> = ({
  stats,
  childName,
  onNavigateDetail,
}) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-indigo-100 bg-white p-3.5 sm:p-5 lg:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-indigo-50">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            <Sparkles size={12} /> KẾT QUẢ ĐÁNH GIÁ PHÁT TRIỂN
          </span>
          <h3 className="mt-0.5 sm:mt-1 text-sm sm:text-lg font-black text-slate-800">
            Hoạt động & Tiêu chí đạt của bé {childName}
          </h3>
        </div>

        <button
          onClick={onNavigateDetail}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Xem chi tiết nhận xét & minh chứng</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-3.5 sm:mt-5 grid gap-2.5 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Hoạt động tham gia</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-indigo-600">{stats.activitiesCount}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Hoạt động trải nghiệm</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-emerald-50/30 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Tiêu chí Đạt</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-emerald-600">{stats.passCount}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-emerald-600 font-semibold">Tỷ lệ: {stats.passRate}%</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-rose-50/30 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Tiêu chí Chưa đạt</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-rose-500">{stats.failCount}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Đang tiếp tục rèn luyện</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl border border-slate-100 bg-slate-50/30 p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Chưa đánh giá</p>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-black text-slate-600">{stats.unassessedCount}</p>
          <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-[11px] text-slate-400">Trên {stats.totalCrit} tiêu chí chuẩn</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-600">Phân bố chỉ số phát triển</span>
          <span className="text-indigo-600">
            {stats.passCount + stats.failCount} / {stats.totalCrit} đã chấm
          </span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{
              width: `${stats.totalCrit > 0 ? (stats.passCount / stats.totalCrit) * 100 : 0}%`,
            }}
            title={`Đạt: ${stats.passCount}`}
          />
          <div
            className="bg-rose-500 h-full transition-all"
            style={{
              width: `${stats.totalCrit > 0 ? (stats.failCount / stats.totalCrit) * 100 : 0}%`,
            }}
            title={`Chưa đạt: ${stats.failCount}`}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Đạt ({stats.passCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> Chưa đạt ({stats.failCount})
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-300 inline-block" /> Chưa đánh giá ({stats.unassessedCount})
          </span>
        </div>
      </div>
    </div>
  )
}
