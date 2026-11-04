'use client';

import React from 'react';
import { UserCheck, CheckCircle2, XCircle, HelpCircle, MessageSquare } from 'lucide-react';
import { ActivityChildEvaluation } from '@/services/schedule';

interface ChildEvaluationSectionProps {
  childEvaluations: ActivityChildEvaluation[];
  childName?: string;
  teacherComment?: string;
}

export function ChildEvaluationSection({
  childEvaluations,
  childName,
  teacherComment,
}: ChildEvaluationSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
          <UserCheck size={15} className="text-emerald-600" />
          Kết quả rèn luyện của bé: <span className="text-sky-700">{childName}</span>
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            childEvaluations.length > 0
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {childEvaluations.length > 0 ? 'Đã ghi nhận' : 'Đang tiến hành'}
        </span>
      </div>

      {childEvaluations.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Các chỉ số tiêu chí đã đánh giá:
          </p>
          <div className="grid gap-2">
            {childEvaluations.map((ev: ActivityChildEvaluation, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-100"
              >
                <span className="text-xs font-semibold text-slate-700">
                  {ev.criterionName ||
                    (ev.criterionId === 'crit_participate'
                      ? 'Tham gia & Tương tác'
                      : ev.criterionId === 'crit_skill'
                      ? 'Kỹ năng thực hiện'
                      : `Tiêu chí phát triển #${idx + 1}`)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    ev.result
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {ev.result ? (
                    <>
                      <CheckCircle2 size={13} /> Đạt
                    </>
                  ) : (
                    <>
                      <XCircle size={13} /> Cần rèn luyện
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 p-3.5 text-center text-xs text-slate-500 border border-dashed border-slate-200">
          <HelpCircle size={18} className="mx-auto text-slate-400 mb-1" />
          <p className="font-medium">Hoạt động đang diễn ra hoặc chưa có đánh giá riêng.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Cô giáo sẽ cập nhật đánh giá và nhận xét của bé sau khi hoàn thành hoạt động.
          </p>
        </div>
      )}

      {/* Teacher's comment for this activity */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
          <MessageSquare size={13} className="text-amber-500" />
          Nhận xét của cô về bé trong hoạt động:
        </span>
        {teacherComment ? (
          <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/70 text-xs text-amber-950 italic leading-relaxed">
            “{teacherComment}”
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">
            Chưa có nhận xét riêng từ cô giáo cho hoạt động này.
          </p>
        )}
      </div>
    </div>
  );
}
