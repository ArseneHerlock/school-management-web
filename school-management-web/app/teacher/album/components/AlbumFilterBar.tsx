'use client';

import React from 'react';
import { Search, Filter, School, User } from 'lucide-react';
import { MOMENT_CATEGORIES } from '@/lib/moments';

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

interface AlbumFilterBarProps {
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  selectedActivityId: string;
  onActivityChange: (val: string) => void;
  availableActivities: ActivityOption[];
  selectedMonth: string;
  onMonthChange: (val: string) => void;
  availableMonths: MonthOption[];
  totalPhotosCount: number;
  selectedScope: 'ALL' | 'class' | 'child';
  onScopeChange: (scope: 'ALL' | 'class' | 'child') => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  hasActiveFilter: boolean;
  onResetFilters: () => void;
}

export function AlbumFilterBar({
  searchKeyword,
  onSearchChange,
  selectedActivityId,
  onActivityChange,
  availableActivities,
  selectedMonth,
  onMonthChange,
  availableMonths,
  totalPhotosCount,
  selectedScope,
  onScopeChange,
  selectedCategory,
  onCategoryChange,
  hasActiveFilter,
  onResetFilters,
}: AlbumFilterBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
      {/* Hàng 1: Tìm kiếm + Lọc Hoạt động + Lọc Tháng + Lọc Phạm vi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Ô Tìm kiếm */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Tìm theo hoạt động, tên bé..."
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
          />
        </div>

        {/* Lọc theo Hoạt động */}
        <div className="relative">
          <select
            value={selectedActivityId}
            onChange={(e) => onActivityChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white cursor-pointer transition truncate"
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
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white cursor-pointer transition"
          >
            <option value="ALL">
              📅 Tất cả các tháng ({totalPhotosCount} ảnh)
            </option>
            {availableMonths.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.count} ảnh)
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Phạm vi */}
        <div className="flex rounded-2xl border border-slate-200 bg-slate-100/80 p-1">
          <button
            onClick={() => onScopeChange('ALL')}
            className={`flex-1 rounded-xl py-1 text-[11px] font-black transition cursor-pointer ${
              selectedScope === 'ALL'
                ? 'bg-white text-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => onScopeChange('class')}
            className={`flex-1 rounded-xl py-1 text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
              selectedScope === 'class'
                ? 'bg-white text-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <School size={12} /> Cả lớp
          </button>
          <button
            onClick={() => onScopeChange('child')}
            className={`flex-1 rounded-xl py-1 text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1 ${
              selectedScope === 'child'
                ? 'bg-white text-orange-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User size={12} /> Từng bé
          </button>
        </div>
      </div>

      {/* Hàng 2: Chuyên mục dạng Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
        <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
        {MOMENT_CATEGORIES.map((categoryName) => (
          <button
            key={categoryName}
            onClick={() => onCategoryChange(categoryName)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-black transition cursor-pointer ${
              selectedCategory === categoryName
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700'
            }`}
          >
            {categoryName}
          </button>
        ))}

        {hasActiveFilter && (
          <button
            onClick={onResetFilters}
            className="whitespace-nowrap text-xs font-bold text-rose-500 hover:text-rose-700 underline ml-auto cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
