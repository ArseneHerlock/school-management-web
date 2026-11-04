'use client';

import React from 'react';
import { Search, Filter } from 'lucide-react';

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

interface ChildProductFiltersProps {
  productSearch: string;
  onProductSearchChange: (val: string) => void;
  selectedActivityFilter: string;
  onActivityFilterChange: (val: string) => void;
  availableChildActivities: ActivityOption[];
  selectedMonthFilter: string;
  onMonthFilterChange: (val: string) => void;
  availableChildMonths: MonthOption[];
  totalChildProductsCount: number;
  availableChildCategories: string[];
  selectedCategoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  selectedChildProducts: any[];
  hasChildActiveFilter: boolean;
  onResetChildFilters: () => void;
}

export function ChildProductFilters({
  productSearch,
  onProductSearchChange,
  selectedActivityFilter,
  onActivityFilterChange,
  availableChildActivities,
  selectedMonthFilter,
  onMonthFilterChange,
  availableChildMonths,
  totalChildProductsCount,
  availableChildCategories,
  selectedCategoryFilter,
  onCategoryFilterChange,
  selectedChildProducts,
  hasChildActiveFilter,
  onResetChildFilters,
}: ChildProductFiltersProps) {
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
            placeholder="Tìm theo tên sản phẩm, hoạt động, nhận xét..."
            value={productSearch}
            onChange={(e) => onProductSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white transition"
          />
        </div>

        {/* Lọc theo Hoạt động */}
        <div className="relative">
          <select
            value={selectedActivityFilter}
            onChange={(e) => onActivityFilterChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white cursor-pointer transition truncate"
          >
            <option value="ALL">
              🎯 Tất cả hoạt động ({availableChildActivities.length})
            </option>
            {availableChildActivities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.title} {act.count > 0 ? `(${act.count} sản phẩm)` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo Tháng */}
        <div className="relative">
          <select
            value={selectedMonthFilter}
            onChange={(e) => onMonthFilterChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 focus:bg-white cursor-pointer transition"
          >
            <option value="ALL">
              📅 Tất cả các tháng ({totalChildProductsCount} sản phẩm)
            </option>
            {availableChildMonths.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.count} sản phẩm)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lĩnh vực dạng Pills + Đặt lại bộ lọc */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
        <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
        {availableChildCategories.map((cat) => {
          const count =
            cat === 'Tất cả'
              ? selectedChildProducts.length
              : selectedChildProducts.filter((p) => p.category === cat).length;
          const isSelected = selectedCategoryFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryFilterChange(cat)}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/70 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}

        {hasChildActiveFilter && (
          <button
            type="button"
            onClick={onResetChildFilters}
            className="whitespace-nowrap text-xs font-bold text-rose-500 hover:text-rose-700 underline ml-auto pl-2 cursor-pointer"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>
    </div>
  );
}
