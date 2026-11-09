import React from 'react';
import { ShieldCheck, Clock, AlertCircle, Sparkles, Save, Send, Loader2 } from 'lucide-react';

interface YearEndAwardsActionBarProps {
  isApproved: boolean;
  isSubmitted: boolean;
  unassignedCount: number;
  saving: boolean;
  onApplyAllSuggestions: (force?: boolean) => void;
  onSave: (isSubmit: boolean) => void;
}

export function YearEndAwardsActionBar({
  isApproved,
  isSubmitted,
  unassignedCount,
  saving,
  onApplyAllSuggestions,
  onSave,
}: YearEndAwardsActionBarProps) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 max-w-full overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 min-w-0 max-w-full">
        {isApproved ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
            <ShieldCheck size={13} /> Ban Giám Hiệu Đã Phê Duyệt
          </span>
        ) : isSubmitted ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800">
            <Clock size={13} /> Đã Trình Duyệt — Chờ Phê Duyệt
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
            <AlertCircle size={13} /> Bản Lưu Nháp ({unassignedCount > 0 ? `Còn ${unassignedCount} bé chưa chọn` : 'Đủ'})
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 w-full sm:w-auto">
        {!isApproved && unassignedCount > 0 && (
          <button
            type="button"
            disabled={saving}
            onClick={() => onApplyAllSuggestions(false)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition cursor-pointer"
            title="Áp dụng danh hiệu tiêu chuẩn cho các bé chưa có danh hiệu"
          >
            <Sparkles size={12} />
            <span>Áp dụng gợi ý</span>
          </button>
        )}

        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            disabled={saving || isApproved}
            onClick={() => onSave(false)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Lưu Nháp</span>
          </button>

          <button
            type="button"
            disabled={saving || isApproved}
            onClick={() => onSave(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            <span>Trình BGH</span>
          </button>
        </div>
      </div>
    </div>
  );
}
