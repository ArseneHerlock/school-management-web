'use client';

import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

interface MonthlyHistoryListProps {
  monthlySummary: Array<{
    record: any;
    daily: any[];
    bonus: any[];
  }>;
  totalPeriods: number;
  isRecordDelivered: (record: any) => boolean;
}

export function MonthlyHistoryList({
  monthlySummary,
  totalPeriods,
  isRecordDelivered,
}: MonthlyHistoryListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!monthlySummary || monthlySummary.length === 0) return null;

  return (
    <div className="space-y-3 min-w-0 max-w-full">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Nhật ký các tháng trước ({totalPeriods} kỳ)
        </h3>
      </div>

      <div className="space-y-2">
        {monthlySummary.map(({ record, daily, bonus }) => {
          const isDelivered = isRecordDelivered(record);
          const isExpanded = expandedId === record.id;
          const flowerCount = record.dailyFlowerCount || daily.length || 0;

          return (
            <div
              key={record.id}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Star size={16} className="fill-amber-400 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-800">
                        Tháng {record.month}/{record.year}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isDelivered ? 'Đã bàn giao' : 'Đang cập nhật'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      🌸 {flowerCount} phiếu tuần {bonus.length > 0 ? '• ⭐ Đạt sao tháng' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
                  {record.teacherComment && (
                    <span title="Đã có nhận xét">
                      <MessageSquare size={13} className="text-indigo-500" />
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/60 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Nhận xét của cô giáo:
                    </span>
                    <p className="text-slate-700 mt-0.5 text-[11px] leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                      {record.teacherComment || 'Không có nhận xét chi tiết cho kỳ này.'}
                    </p>
                  </div>
                  {record.parentFeedback && (
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 uppercase">
                        Ý kiến phản hồi của gia đình:
                      </span>
                      <p className="text-slate-700 mt-0.5 text-[11px] leading-relaxed bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                        {record.parentFeedback}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
