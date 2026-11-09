'use client';

import React from 'react';
import {
  CalendarDays,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LatestRecordCardProps {
  latest: any;
  isLatestDelivered: boolean;
  monthProgress: number;
  feedback: Record<string, string>;
  setFeedback: (val: Record<string, string>) => void;
  saving: string;
  onSaveFeedback: (id: string) => void;
}

export function LatestRecordCard({
  latest,
  isLatestDelivered,
  monthProgress,
  feedback,
  setFeedback,
  saving,
  onSaveFeedback,
}: LatestRecordCardProps) {
  if (!isLatestDelivered) {
    return (
      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-4 text-center space-y-2 min-w-0 max-w-full">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <Lock size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
          Sổ Bé Ngoan Tháng {latest?.month || new Date().getMonth() + 1}/{latest?.year || new Date().getFullYear()} đang cập nhật
        </h3>
        <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-normal">
          Cô giáo đang hoàn thiện đánh giá rèn luyện. Sổ sẽ tự động hiển thị ngay khi cô giáo bàn giao.
        </p>
        <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-100/70 px-2.5 py-0.5 rounded-full">
          <Clock size={11} /> Đang chờ giáo viên bàn giao
        </span>
      </div>
    );
  }

  if (!latest) return null;

  const currentFeedback = feedback[latest.id] || '';

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 gap-3 min-w-0 max-w-full">
      {/* 1. Nhận xét của cô giáo */}
      <article className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5 min-w-0">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <CalendarDays size={14} />
            <span>Kỳ ghi nhận Tháng {latest.month}/{latest.year}</span>
          </div>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            Đã bàn giao sổ
          </span>
        </div>

        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Nhận xét của giáo viên
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-slate-700 leading-relaxed min-h-[64px]">
            {latest.teacherComment || 'Bé đi học đều, chăm ngoan và tham gia tích cực các hoạt động nề nếp của lớp.'}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Khen thưởng: <strong>{latest.dailyFlowerCount || monthProgress} phiếu tuần</strong></span>
          {latest.bonusFlowerCount > 0 && (
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <Sparkles size={11} /> Đạt Ngôi sao tháng
            </span>
          )}
        </div>
      </article>

      {/* 2. Phản hồi của Phụ huynh */}
      <article className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs space-y-2.5 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 border-b border-slate-100 pb-2">
          <MessageCircle size={14} />
          <span>Ý kiến phản hồi từ gia đình</span>
        </div>

        <div>
          <textarea
            rows={2}
            value={currentFeedback}
            onChange={(e) =>
              setFeedback({ ...feedback, [latest.id]: e.target.value })
            }
            placeholder="Viết lời nhắn gửi cô giáo (VD: Cảm ơn cô, ở nhà bé rất ngoan...)"
            className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            disabled={saving === latest.id || !currentFeedback.trim()}
            onClick={() => onSaveFeedback(latest.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition cursor-pointer disabled:opacity-40"
          >
            {saving === latest.id ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} />
            )}
            <span>Gửi phản hồi</span>
          </button>
        </div>
      </article>
    </div>
  );
}
