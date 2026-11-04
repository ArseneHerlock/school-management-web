'use client';

import React from 'react';
import { Search, CheckCheck } from 'lucide-react';
import { FilterTab } from '../useAttendanceManager';

interface AttendanceActionBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilterTab: FilterTab;
  setActiveFilterTab: (tab: FilterTab) => void;
  totalCount: number;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  mode: 'DEN' | 'VE';
  isLocked: boolean;
  onMarkAllPresent: () => void;
}

export function AttendanceActionBar({
  searchQuery,
  setSearchQuery,
  activeFilterTab,
  setActiveFilterTab,
  totalCount,
  presentCount,
  lateCount,
  absentCount,
  mode,
  isLocked,
  onMarkAllPresent,
}: AttendanceActionBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-3xl border border-orange-100 bg-white p-4 shadow-xs">
      <div className="relative min-w-[240px] flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên bé hoặc tên gọi ở nhà..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:bg-white transition"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveFilterTab('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFilterTab === 'ALL'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả ({totalCount})
        </button>
        <button
          onClick={() => setActiveFilterTab('PRESENT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFilterTab === 'PRESENT'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Có mặt ({presentCount})
        </button>
        <button
          onClick={() => setActiveFilterTab('LATE')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFilterTab === 'LATE'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Trễ ({lateCount})
        </button>
        <button
          onClick={() => setActiveFilterTab('ABSENT')}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
            activeFilterTab === 'ABSENT'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          Vắng ({absentCount})
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {mode === 'DEN' && !isLocked && (
          <button
            onClick={onMarkAllPresent}
            className="flex items-center gap-1.5 rounded-2xl border border-orange-200 bg-orange-50/70 px-3.5 py-2 text-xs font-black text-orange-700 hover:bg-orange-100 transition cursor-pointer shrink-0"
          >
            <CheckCheck size={15} />
            <span>Đánh dấu cả lớp có mặt</span>
          </button>
        )}
      </div>
    </div>
  );
}
