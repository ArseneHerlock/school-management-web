'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface DevelopmentProgressWidgetProps {
  activitiesCount: number;
  criteriaCount: number;
  assessmentsCount: number;
  assessedStudentsCount: number;
  totalStudentsCount: number;
  onOpenEvaluation: () => void;
}

export const DevelopmentProgressWidget: React.FC<DevelopmentProgressWidgetProps> = ({
  activitiesCount,
  criteriaCount,
  assessmentsCount,
  assessedStudentsCount,
  totalStudentsCount,
  onOpenEvaluation,
}) => {
  const completionRate =
    totalStudentsCount > 0
      ? Math.round((assessedStudentsCount / totalStudentsCount) * 100)
      : 0;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-rose-50/40 p-4 sm:p-6 shadow-sm max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
        <div className="min-w-0">
          <span className="admin-chip bg-rose-100 text-rose-700 font-extrabold text-[10px]">
            <Sparkles size={11} className="mr-1 shrink-0" /> PHÁT TRIỂN & ĐÁNH GIÁ
          </span>
          <h3 className="mt-1 text-base sm:text-lg font-black text-slate-800 truncate">
            Tiến độ Đánh giá Phát triển Trẻ em
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
            Dữ liệu thời gian thực từ Hoạt động và Đánh giá phát triển
          </p>
        </div>
        <button
          onClick={onOpenEvaluation}
          className="admin-btn admin-btn-primary self-start sm:self-auto text-xs py-2 px-3 sm:px-4 cursor-pointer shrink-0"
        >
          <span>Sổ đánh giá</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* 2x2 Clean Balanced Grid on Mobile */}
      <div className="mt-3.5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 border border-rose-100 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Hoạt động GD</p>
          <p className="mt-1 text-xl sm:text-2xl font-black text-slate-800">{activitiesCount}</p>
          <p className="mt-0.5 text-[10px] text-slate-400 truncate">Danh mục hoạt động</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 border border-rose-100 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Tiêu chí chuẩn</p>
          <p className="mt-1 text-xl sm:text-2xl font-black text-slate-800">{criteriaCount}</p>
          <p className="mt-0.5 text-[10px] text-slate-400 truncate">Ngân hàng tiêu chí</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 border border-rose-100 shadow-2xs">
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Lượt đánh giá</p>
          <p className="mt-1 text-xl sm:text-2xl font-black text-slate-800">{assessmentsCount}</p>
          <p className="mt-0.5 text-[10px] text-slate-400 truncate">Ghi nhận từ GV</p>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 border border-rose-100 shadow-2xs">
          <div className="flex justify-between items-center">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase truncate">Đã đánh giá</p>
            <span className="text-[11px] font-black text-rose-600">{completionRate}%</span>
          </div>
          <p className="mt-1 text-lg sm:text-2xl font-black text-rose-600 truncate">
            {assessedStudentsCount}/{totalStudentsCount}
          </p>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-rose-600 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
