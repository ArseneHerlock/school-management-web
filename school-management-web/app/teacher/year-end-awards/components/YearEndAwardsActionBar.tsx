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
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        {isApproved ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
            <ShieldCheck size={14} /> Ban Giám Hiệu Đã Phê Duyệt Cấp Giấy Khen
          </span>
        ) : isSubmitted ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800">
            <Clock size={14} /> Đã Trình Duyệt - Chờ Ban Giám Hiệu Phê Duyệt
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
            <AlertCircle size={14} /> Bản Lưu Nháp - Chưa Trình Duyệt ({unassignedCount > 0 ? `Còn ${unassignedCount} bé chưa chọn danh hiệu` : 'Đã chọn đủ'})
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!isApproved && unassignedCount > 0 && (
          <button
            type="button"
            disabled={saving}
            onClick={() => onApplyAllSuggestions(false)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition cursor-pointer"
            title="Áp dụng hệ thống gợi ý cho các bé chưa có danh hiệu"
          >
            <Sparkles size={13} />
            <span>Áp dụng gợi ý cho bé chưa chọn</span>
          </button>
        )}

        <button
          type="button"
          disabled={saving || isApproved}
          onClick={() => onSave(false)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          <span>Lưu Nháp</span>
        </button>

        <button
          type="button"
          disabled={saving || isApproved}
          onClick={() => onSave(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          <span>Trình Ban Giám Hiệu</span>
        </button>
      </div>
    </div>
  );
}
