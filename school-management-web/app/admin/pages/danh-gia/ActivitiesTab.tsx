'use client'

import React from 'react'
import { Plus, Edit2, Trash2, Check, Calendar, Unlink, ListTodo } from 'lucide-react'
import { ActivityItem } from '@/lib/development'

interface ActivitiesTabProps {
  activities: ActivityItem[]
  getCriterionName: (id: string) => string
  onToggleStatus: (act: ActivityItem) => void
  onOpenEdit: (act: ActivityItem) => void
  onOpenLinkModal: (act: ActivityItem) => void
  onUnlinkCriterion: (activityId: string, criterionId: string) => void
  onDeleteClick: (act: ActivityItem) => void
}

export default function ActivitiesTab({
  activities,
  getCriterionName,
  onToggleStatus,
  onOpenEdit,
  onOpenLinkModal,
  onUnlinkCriterion,
  onDeleteClick,
}: ActivitiesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((act) => (
          <div key={act.id} className="rounded-3xl border border-rose-100 bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {act.code}
                  </span>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 text-base">{act.name}</h4>
                </div>
                <button
                  onClick={() => onToggleStatus(act)}
                  title={act.isActive ? 'Bấm để tạm dừng' : 'Bấm để kích hoạt'}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    act.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {act.isActive && <Check size={12} />}
                  {act.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                {act.description || 'Chưa có mô tả cho hoạt động này.'}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Calendar size={13} />
                <span>
                  Độ tuổi: {act.minAgeMonths ?? 36} - {act.maxAgeMonths ?? 72} tháng
                </span>
              </div>

              {/* Danh sách tiêu chí đã liên kết */}
              <div className="mt-4 pt-3 border-t border-rose-100">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-600">
                    Tiêu chí liên kết ({act.developmentCriteria?.length || 0})
                  </span>
                  <button
                    onClick={() => onOpenLinkModal(act)}
                    className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Plus size={12} /> Gán tiêu chí
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {act.developmentCriteria && act.developmentCriteria.length > 0 ? (
                    act.developmentCriteria.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-xl bg-rose-50/50 p-2 text-xs"
                      >
                        <span className="font-semibold text-slate-700 truncate pr-2">
                          {getCriterionName(c.developmentCriterionId)}
                        </span>
                        <button
                          onClick={() => onUnlinkCriterion(act.id, c.developmentCriterionId)}
                          className="text-slate-400 hover:text-rose-600 shrink-0"
                          title="Hủy liên kết tiêu chí"
                        >
                          <Unlink size={13} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">Chưa liên kết tiêu chí nào</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onOpenEdit(act)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-100 bg-white text-xs font-semibold text-slate-600 hover:bg-rose-50"
              >
                <Edit2 size={13} /> Sửa
              </button>
              <button
                onClick={() => onDeleteClick(act)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-100 bg-white text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={13} /> Xóa
              </button>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center text-slate-400">
            <ListTodo size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold">Chưa có hoạt động phát triển nào</p>
            <p className="text-xs text-slate-400 mt-1">Hãy bấm "Thêm Hoạt động" để bắt đầu thiết lập.</p>
          </div>
        )}
      </div>
    </div>
  )
}
