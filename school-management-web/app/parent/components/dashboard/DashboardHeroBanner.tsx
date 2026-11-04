'use client';

import React from 'react';
import { CalendarDays, Sparkles } from 'lucide-react';

interface DashboardHeroBannerProps {
  parentName?: string;
  onNavigateTab: (tab: string) => void;
}

export function DashboardHeroBanner({
  parentName,
  onNavigateTab,
}: DashboardHeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-4 sm:p-6 lg:p-8 text-white shadow-lg shadow-blue-500/15 max-w-full min-w-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
        <div>
          <p className="text-blue-200 font-bold tracking-wide uppercase text-[10px] sm:text-xs mb-1">
            CỔNG THÔNG TIN PHỤ HUYNH
          </p>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
            Xin chào, {parentName || 'Phụ huynh'}!
          </h2>
          <p className="text-blue-100 mt-1 sm:mt-2 text-xs sm:text-sm max-w-lg leading-relaxed">
            Theo dõi toàn diện quá trình điểm danh chuyên cần, lịch học và các đánh giá phát triển của con tại trường mầm non.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2.5 sm:px-4 sm:py-2.5 text-xs font-bold transition shadow-xs cursor-pointer text-center"
          >
            <CalendarDays size={15} className="shrink-0" />
            <span className="truncate">Xem Điểm danh</span>
          </button>
          <button
            onClick={() => onNavigateTab('assessment')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 sm:px-4 sm:py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-xs cursor-pointer text-center"
          >
            <Sparkles size={15} className="shrink-0" />
            <span className="truncate">Đánh giá của con</span>
          </button>
        </div>
      </div>
    </div>
  );
}
