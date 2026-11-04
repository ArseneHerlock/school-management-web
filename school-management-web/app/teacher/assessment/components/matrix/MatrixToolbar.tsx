'use client';

import React from 'react';
import { Search, Save, Loader2, Sparkles } from 'lucide-react';
import { ActivityItem, DomainItem } from '@/services/development';

interface MatrixToolbarProps {
  activities: ActivityItem[];
  selectedActivityId: string;
  targetActivityTitle?: string;
  onSelectActivity: (id: string) => void;
  searchCriterion: string;
  onSearchCriterionChange: (q: string) => void;
  auditMode: boolean;
  onToggleAuditMode: () => void;
  dirtyCount: number;
  isSaving: boolean;
  onOpenConfirmSave: () => void;
}

export function MatrixToolbar({
  activities,
  selectedActivityId,
  targetActivityTitle,
  onSelectActivity,
  searchCriterion,
  onSearchCriterionChange,
  auditMode,
  onToggleAuditMode,
  dirtyCount,
  isSaving,
  onOpenConfirmSave,
}: MatrixToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto min-w-0">
          <label className="text-xs font-black text-slate-700 whitespace-nowrap">
            Hoạt động giáo dục trên lớp:
          </label>
          <select
            value={selectedActivityId}
            onChange={(e) => onSelectActivity(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-orange-200 bg-orange-50/50 px-3 py-1.5 text-xs font-bold text-orange-950 outline-none focus:border-orange-500 cursor-pointer max-w-full sm:max-w-md truncate"
          >
            <option value="">-- Tất cả hoạt động giảng dạy trong kỳ --</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onToggleAuditMode}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border transition cursor-pointer text-center truncate ${
              auditMode
                ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {auditMode ? '✓ Đang bật kiểm toán' : 'Chế độ kiểm toán'}
          </button>

          <button
            onClick={onOpenConfirmSave}
            disabled={dirtyCount === 0 || isSaving}
            className={`flex items-center justify-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black transition shadow-xs cursor-pointer truncate ${
              dirtyCount > 0
                ? 'bg-orange-500 hover:bg-orange-600 text-white animate-pulse'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span>Lưu ({dirtyCount})</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 min-w-0">
        <div className="text-[11px] sm:text-xs text-slate-500 font-bold min-w-0">
          {selectedActivityId ? (
            <span className="text-orange-700 font-black truncate block">
              ★ Đang hiển thị các mục tiêu / tiêu chí riêng của bài dạy được chọn
            </span>
          ) : (
            <span className="truncate block">Hiển thị danh sách tiêu chí mục tiêu của các hoạt động giảng dạy</span>
          )}
        </div>

        <div className="relative w-full sm:w-auto min-w-0 sm:min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchCriterion}
            onChange={(e) => onSearchCriterionChange(e.target.value)}
            placeholder="Tìm theo mã hoặc tên tiêu chí..."
            className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-orange-500 font-medium"
          />
        </div>
      </div>
    </div>
  );
}
