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
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-3 sm:p-5 text-white shadow-md shadow-blue-500/15 max-w-full min-w-0">
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-6">
        <div>
          <h2 className="text-base sm:text-2xl font-black tracking-tight leading-tight">
            Xin chào, {parentName || 'Phụ huynh'}!
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-2.5 py-1.5 text-xs font-bold transition cursor-pointer text-center"
          >
            <CalendarDays size={13} className="shrink-0" />
            <span className="truncate">Điểm danh</span>
          </button>
          <button
            onClick={() => onNavigateTab('assessment')}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition cursor-pointer text-center"
          >
            <Sparkles size={13} className="shrink-0" />
            <span className="truncate">Đánh giá</span>
          </button>
        </div>
      </div>
    </div>
  );
}
