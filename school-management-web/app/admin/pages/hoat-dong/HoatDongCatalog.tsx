'use client'

import React from 'react'
import {
  Sparkles,
  CalendarPlus,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Tag,
  Search,
} from 'lucide-react'
import { ActivityItem, CriterionItem } from '@/lib/development'

interface HoatDongCatalogProps {
  activities: ActivityItem[]
  criteria: CriterionItem[]
  search: string
  setSearch: (val: string) => void
  statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE'
  setStatusFilter: (val: 'ALL' | 'ACTIVE' | 'INACTIVE') => void
  onToggleActive: (act: ActivityItem) => void
  onOpenSchedule: (act: ActivityItem) => void
  onOpenLinkModal: (act: ActivityItem) => void
  onOpenEdit: (act: ActivityItem) => void
  onDelete: (act: ActivityItem) => void
}

export default function HoatDongCatalog({
  activities,
  criteria,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onToggleActive,
  onOpenSchedule,
  onOpenLinkModal,
  onOpenEdit,
  onDelete,
}: HoatDongCatalogProps) {
  const filtered = React.useMemo(() => {
    return activities.filter((act) => {
      if (statusFilter === 'ACTIVE' && !act.isActive) return false
      if (statusFilter === 'INACTIVE' && act.isActive) return false
      if (search) {
        const q = search.toLowerCase()
        if (!act.name.toLowerCase().includes(q) && !act.code.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [activities, statusFilter, search])

  return (
    <div className="space-y-4">
      {/* Search & Status filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Tìm tên hoạt động, mã..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-2xl border border-rose-200 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-rose-400 w-52 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-lg px-2.5 py-1 font-bold ${statusFilter === 'ALL' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500'}`}
            >
              Tất cả ({activities.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`rounded-lg px-2.5 py-1 font-bold ${statusFilter === 'ACTIVE' ? 'bg-white shadow-xs text-emerald-600' : 'text-slate-500'}`}
            >
              Đang áp dụng
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`rounded-lg px-2.5 py-1 font-bold ${statusFilter === 'INACTIVE' ? 'bg-white shadow-xs text-rose-600' : 'text-slate-500'}`}
            >
              Tạm ngừng
            </button>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Hiển thị: <b className="text-rose-600">{filtered.length}</b> hoạt động
        </span>
      </div>

      {/* Grid hoạt động */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((act) => {
          const linkedCount = act.developmentCriteria?.length || 0
          return (
            <div
              key={act.id}
              className="rounded-3xl border border-rose-100 bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-600">
                    {act.code}
                  </span>
                  <button
                    onClick={() => onToggleActive(act)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      act.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {act.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {act.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </button>
                </div>

                <h3 className="mt-2 text-base font-extrabold text-slate-800 line-clamp-1">{act.name}</h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{act.description || 'Chưa có mô tả'}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <Users size={13} />
                  <span>Độ tuổi: {act.minAgeMonths || 18} - {act.maxAgeMonths || 72} tháng</span>
                </div>

                {/* Tiêu chí gắn liền */}
                <div className="mt-3.5 pt-3 border-t border-rose-50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-600">Tiêu chí phát triển ({linkedCount})</span>
                    <button
                      onClick={() => onOpenLinkModal(act)}
                      className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Tag size={11} /> Gắn tiêu chí
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    {(act.developmentCriteria || []).map((dc) => {
                      const found = criteria.find((c) => c.id === dc.developmentCriterionId)
                      return (
                        <span key={dc.id} className="rounded-lg bg-rose-50/60 px-2 py-0.5 text-[10px] font-semibold text-rose-700 truncate max-w-[140px]">
                          {found?.name || 'Tiêu chí'}
                        </span>
                      )
                    })}
                    {linkedCount === 0 && (
                      <span className="text-[10px] text-slate-400 italic">Chưa gắn tiêu chí rèn luyện</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenSchedule(act)}
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-amber-600 transition"
                >
                  <CalendarPlus size={13} /> Lên lịch
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => onOpenEdit(act)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Sửa">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => onDelete(act)} className="p-1.5 text-slate-400 hover:text-rose-600" title="Xóa">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center text-slate-400">
            <Sparkles size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold">Chưa có hoạt động nào trong ngân hàng</p>
            <p className="text-xs text-slate-400 mt-1">Bấm "Thêm hoạt động mới" để bắt đầu xây dựng ngân hàng hoạt động.</p>
          </div>
        )}
      </div>
    </div>
  )
}
