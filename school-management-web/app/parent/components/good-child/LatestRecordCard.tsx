'use client';

import React from 'react';
import {
  CalendarDays,
  Circle,
  Flower2,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  Sparkles,
  Trophy,
  Clock,
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
      <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/70 p-7 text-center space-y-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
          <Lock size={26} />
        </div>
        <h3 className="text-base font-black text-slate-800">
          Sổ Bé Ngoan Tháng {latest?.month || new Date().getMonth() + 1}/
          {latest?.year || new Date().getFullYear()} đang được tổng hợp
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Cô giáo chủ nhiệm đang hoàn thiện các đánh giá hoạt động và nhận xét cho bé trong tháng này.
          Sổ sẽ tự động mở ra ngay khi cô giáo bấm bàn giao sổ.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold bg-amber-100/80 px-3 py-1 rounded-full">
          <Clock size={13} />
          <span>Trạng thái: Đang chờ giáo viên bàn giao sổ</span>
        </div>
      </div>
    );
  }

  if (!latest) return null;

  return (
    <div
      style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}
      className="grid min-w-0 gap-4 lg:grid-cols-2"
    >
      <article className="min-w-0 rounded-3xl border border-amber-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-black tracking-[.16em] text-amber-600">
              <CalendarDays size={15} /> KỲ GHI NHẬN MỚI NHẤT
            </div>
            <h3 className="mt-2 text-2xl font-black text-slate-800">
              Tháng {latest.month}/{latest.year}
            </h3>
            <p
              className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-700"
              style={{ overflowWrap: 'anywhere' }}
            >
              {latest.teacherComment ||
                'Giáo viên chưa thêm nhận xét cho tháng này.'}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              latest.teacherComment
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {latest.teacherComment ? 'Đã nhận xét' : 'Đang cập nhật'}
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-gradient-to-r from-rose-50 to-amber-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-slate-700">
                Tiến trình hoa thứ 6 trong tháng
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Đạt đủ 4/4 hoa nhỏ thứ 6 sẽ nhận danh hiệu Ngôi Sao Rèn Luyện Tháng.
              </p>
            </div>
            <span className="text-xl font-black text-rose-600">
              {monthProgress}/4
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`flex h-12 items-center justify-center rounded-2xl border ${
                  index < monthProgress
                    ? 'border-rose-200 bg-rose-100 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-300'
                }`}
              >
                {index < monthProgress ? (
                  <Flower2 size={22} fill="currentColor" />
                ) : (
                  <Circle size={18} />
                )}
              </div>
            ))}
          </div>
          {monthProgress >= 4 && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-900 animate-pulse">
              <Trophy size={16} className="text-amber-600" />
              Bé đã vinh dự đạt danh hiệu: GƯƠNG MẶT RÈN LUYỆN TIÊU BIỂU THÁNG {latest.month}!
            </div>
          )}
        </div>
      </article>

      <article className="min-w-0 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-2 text-indigo-600">
          <Sparkles size={18} />
          <h3 className="font-black">Lời nhắn dành cho cô giáo</h3>
        </div>
        <p
          className="mt-3 break-words whitespace-pre-wrap text-sm leading-6 text-slate-500"
          style={{ overflowWrap: 'anywhere' }}
        >
          Phụ huynh có thể gửi phản hồi sau khi đọc nhận xét và các lần ghi nhận của giáo viên.
        </p>
        <textarea
          value={feedback[latest.id] || ''}
          onChange={(event) =>
            setFeedback({
              ...feedback,
              [latest.id]: event.target.value,
            })
          }
          className="mt-5 min-h-28 min-w-0 max-w-full w-full resize-none rounded-2xl border border-indigo-100 bg-white p-3 text-sm outline-none focus:border-indigo-400"
          placeholder="Viết lời cảm ơn hoặc phản hồi cho cô giáo..."
        />
        <button
          disabled={saving === latest.id || !feedback[latest.id]?.trim()}
          onClick={() => onSaveFeedback(latest.id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 disabled:opacity-50 cursor-pointer"
        >
          {saving === latest.id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}{' '}
          Gửi phản hồi
        </button>
        {latest.parentFeedback && (
          <div className="mt-4 min-w-0 rounded-2xl bg-white p-3 text-xs text-indigo-700">
            <MessageCircle size={14} className="mr-1 inline" />
            <span>Phản hồi đã gửi:</span>
            <p
              className="mt-1 break-words whitespace-pre-wrap"
              style={{ overflowWrap: 'anywhere' }}
            >
              {latest.parentFeedback}
            </p>
          </div>
        )}
      </article>
    </div>
  );
}
