'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, BarChart3, LayoutGrid } from 'lucide-react';
import TabsNav, { TabItem } from '@/app/components/ui/TabsNav';
import { TeacherViewTab } from '../useTeacherAssessment';

interface TeacherAssessmentHeaderProps {
  activeTab: TeacherViewTab;
  setActiveTab: (tab: TeacherViewTab) => void;
  loading: boolean;
  onRefresh: () => void;
  toast: { msg: string; type: 'success' | 'error' } | null;
  onCloseToast: () => void;
  dirtyCount: number;
  targetActivityTitle?: string;
  selectedActivityId?: string;
  focusedScheduleContext?: any;
  authorizedClasses: any[];
  selectedClassId: string;
  activities: any[];
  onClearFocusedContext: () => void;
}

export function TeacherAssessmentHeader({
  activeTab,
  setActiveTab,
  loading,
  onRefresh,
  toast,
  onCloseToast,
  dirtyCount,
  targetActivityTitle,
  selectedActivityId,
  focusedScheduleContext,
  authorizedClasses,
  selectedClassId,
  activities,
  onClearFocusedContext,
}: TeacherAssessmentHeaderProps) {
  const tabs: TabItem<TeacherViewTab>[] = [
    { id: 'dashboard', label: 'Tổng quan lớp', icon: BarChart3 },
    { id: 'matrix', label: 'Ma trận đánh giá', icon: LayoutGrid, badge: dirtyCount || undefined },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2.5 rounded-2xl border border-orange-200 bg-white text-slate-600 hover:bg-orange-50 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Đánh giá sự phát triển của trẻ</h1>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition shadow-2xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : ''} />
          <span>Đồng bộ dữ liệu</span>
        </button>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {toast && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex justify-between items-center shadow-xs ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{toast.msg}</span>
          <button
            onClick={onCloseToast}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {activeTab === 'matrix' && (targetActivityTitle || selectedActivityId) && (
        <div className="rounded-3xl border-2 border-rose-300 bg-linear-to-r from-rose-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-black text-2xl shadow-xs">
              🎯
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                  ĐANG ĐÁNH GIÁ CHO HOẠT ĐỘNG ĐÃ CHỌN
                </span>
                {focusedScheduleContext?.date && (
                  <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    Ngày: {focusedScheduleContext.date}
                  </span>
                )}
                {authorizedClasses.find((c: any) => c.id === selectedClassId)?.tenLop && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Lớp: {authorizedClasses.find((c: any) => c.id === selectedClassId)?.tenLop}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
                {targetActivityTitle || activities.find((a: any) => a.id === selectedActivityId)?.name || 'Hoạt động giáo dục'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hệ thống đã tự động liên kết các tiêu chuẩn rèn luyện của hoạt động này để bạn chấm điểm cho các học sinh.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClearFocusedContext}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              Xem tất cả hoạt động
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
