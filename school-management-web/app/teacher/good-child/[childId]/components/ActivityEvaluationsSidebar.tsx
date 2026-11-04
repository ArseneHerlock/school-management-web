'use client';

import React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Sparkles,
  Check,
  PlusCircle,
} from 'lucide-react';
import { ActivityChildEvaluation } from '@/services/schedule';

interface ActivityEvaluationsSidebarProps {
  activityEvals: ActivityChildEvaluation[];
  evalStats: {
    total: number;
    passed: number;
    failed: number;
    withCommentCount: number;
  };
  childDisplayName: string;
  month: number;
  year: number;
  copiedId: string | null;
  onSynthesize: () => void;
  onInsertEvaluation: (ev: ActivityChildEvaluation) => void;
}

export function ActivityEvaluationsSidebar({
  activityEvals,
  evalStats,
  childDisplayName,
  month,
  year,
  copiedId,
  onSynthesize,
  onInsertEvaluation,
}: ActivityEvaluationsSidebarProps) {
  return (
    <div className="lg:col-span-5 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            DỮ LIỆU ĐÁNH GIÁ HOẠT ĐỘNG THỰC TẾ
          </span>
          <h2 className="mt-1.5 text-base font-black text-slate-800 flex items-center gap-2">
            <ClipboardList size={18} className="text-indigo-600 shrink-0" />
            <span>Nhận xét của GV tại từng hoạt động ({activityEvals.length})</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Được tổng hợp trực tiếp từ các nhận xét và kết quả chấm của giáo viên cho bé ở mỗi hoạt động học tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-center">
          <p className="text-[11px] font-bold text-slate-500">Tổng lượt chấm</p>
          <p className="mt-0.5 text-xl font-black text-slate-800">{evalStats.total}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-center">
          <p className="text-[11px] font-bold text-emerald-700">Nội dung Đạt</p>
          <p className="mt-0.5 text-xl font-black text-emerald-700">{evalStats.passed}</p>
        </div>
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-3 text-center">
          <p className="text-[11px] font-bold text-rose-700">Cần rèn luyện</p>
          <p className="mt-0.5 text-xl font-black text-rose-700">{evalStats.failed}</p>
        </div>
      </div>

      {activityEvals.length > 0 && (
        <button
          type="button"
          onClick={onSynthesize}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-3 text-xs font-black text-indigo-700 transition active:scale-[0.99] cursor-pointer"
        >
          <Sparkles size={16} className="text-indigo-600 shrink-0" />
          <span>
            Tổng hợp tất cả {activityEvals.length} đánh giá & nhận xét hoạt động vào Sổ Bé Ngoan
          </span>
        </button>
      )}

      <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
        {activityEvals.length > 0 ? (
          activityEvals.map((ev, index) => {
            const itemKey = ev.id || `${ev.activityTitle}-${ev.criterionId}-${index}`;
            const isCopied = copiedId === itemKey;
            const hasTeacherRemark = Boolean(ev.comment && ev.comment.trim());

            return (
              <div
                key={itemKey}
                className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-amber-300 p-3.5 transition flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                          ev.result
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {ev.result ? '✓ Đạt' : '✕ Cần rèn luyện'}
                      </span>
                      {ev.date && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Ngày {ev.date}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs font-black text-slate-800">
                      {ev.activityTitle}
                    </p>
                    {ev.criterionName && ev.criterionName !== ev.activityTitle && (
                      <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                        Tiêu chí: {ev.criterionName}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onInsertEvaluation(ev)}
                    className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition shrink-0 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check size={12} />
                        <span>Đã đưa vào sổ</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle size={12} />
                        <span>Đưa vào sổ</span>
                      </>
                    )}
                  </button>
                </div>

                {hasTeacherRemark ? (
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-slate-700">
                    <span className="font-bold text-amber-900">Nhận xét của GV: </span>
                    <span className="italic">“{ev.comment}”</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    (Giáo viên chấm {ev.result ? 'Đạt' : 'Cần rèn luyện'} tiêu chí này, chưa ghi chú thêm)
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-3">
            <p className="text-xs font-bold text-slate-600">
              Chưa có nhận xét hoạt động nào của bé {childDisplayName} trong tháng {month}/{year}.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Hãy chấm điểm và ghi nhận xét cho bé tại trang Đánh giá hoạt động, hệ thống sẽ tự động tổng hợp các nhận xét đó về đây để làm gợi ý ghi Sổ Bé Ngoan.
            </p>
            <Link
              href="/teacher/assessment?tab=matrix"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
            >
              <span>Đi tới trang Đánh giá hoạt động</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
