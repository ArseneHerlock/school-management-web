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
    <div className="rounded-3xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-rose-50/40 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-100">
        <div>
          <span className="admin-chip bg-rose-100 text-rose-700 font-extrabold text-[10px]">
            <Sparkles size={11} className="mr-1" /> PHÁT TRIỂN & ĐÁNH GIÁ TRẺ
          </span>
          <h3 className="mt-1 text-lg font-black text-slate-800">
            Tiến độ Đánh giá Phát triển Trẻ em
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu thời gian thực từ Hoạt động và Đánh giá phát triển
          </p>
        </div>
        <button
          onClick={onOpenEvaluation}
          className="admin-btn admin-btn-primary self-start md:self-auto"
        >
          <span>Mở Quản lý Đánh giá</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 border border-rose-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Hoạt động phát triển</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{activitiesCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Từ danh mục hoạt động</p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-rose-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Tiêu chí phát triển</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{criteriaCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Ngân hàng tiêu chí chuẩn</p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-rose-100 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase">Lượt đánh giá</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{assessmentsCount}</p>
          <p className="mt-1 text-[11px] text-slate-400">Ghi nhận từ giáo viên</p>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-rose-100 shadow-xs">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-slate-400 uppercase">Tỷ lệ trẻ đã đánh giá</p>
            <span className="text-xs font-black text-rose-600">{completionRate}%</span>
          </div>
          <p className="mt-1 text-2xl font-black text-rose-600">
            {assessedStudentsCount} / {totalStudentsCount}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
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
