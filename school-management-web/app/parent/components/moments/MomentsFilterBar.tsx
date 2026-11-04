'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { CATEGORIES } from './types';

interface ActivityOption {
  id: string;
  title: string;
  count: number;
}

interface MonthOption {
  key: string;
  label: string;
  count: number;
}

interface MomentsFilterBarProps {
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  selectedActivityId: string;
  onActivityChange: (val: string) => void;
  availableActivities: ActivityOption[];
  selectedMonth: string;
  onMonthChange: (val: string) => void;
  availableMonths: MonthOption[];
  totalMomentsCount: number;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  currentMoments: any[];
  activeScope: 'class' | 'child';
  hasActiveFilter: boolean;
  onResetFilters: () => void;
}

export function MomentsFilterBar({
  searchKeyword,
  onSearchChange,
  selectedActivityId,
  onActivityChange,
  availableActivities,
  selectedMonth,
  onMonthChange,
  availableMonths,
  totalMomentsCount,
  selectedCategory,
  onCategoryChange,
  currentMoments,
  activeScope,
  hasActiveFilter,
  onResetFilters,
}: MomentsFilterBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Ô Tìm kiếm */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm theo hoạt động, tiêu đề, lời nhắn..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Lọc theo Hoạt động */}
        <div className="relative">
          <select
            value={selectedActivityId}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition truncate"
          >
            <option value="ALL">
              🎯 Tất cả hoạt động ({availableActivities.length})
            </option>
            {availableActivities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.title} {act.count > 0 ? `(${act.count} ảnh)` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Tháng */}
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer transition"
          >
            <option value="ALL">📅 Tất cả các tháng ({totalMomentsCount} ảnh)</option>
            {availableMonths.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.count} ảnh)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chuyên mục dạng Pills + Đặt lại bộ lọc */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 no-scrollbar">
        <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
        {CATEGORIES.map((cat) => {
          const count =
            cat === 'Tất cả'
              ? currentMoments.length
              : currentMoments.filter((m) => m.category === cat).length;
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? activeScope === 'class'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-slate-100'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}

        {hasActiveFilter && (
          <button
            type="button"
            onClick={onResetFilters}
            className="whitespace-nowrap text-xs font-bold text-rose-500 hover:text-rose-700 underline ml-auto pl-2 cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
