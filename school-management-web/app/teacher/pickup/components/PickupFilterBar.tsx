import React from 'react';
import { Search } from 'lucide-react';

interface PickupFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filterType: 'ALL' | 'WAITING' | 'PICKED_UP';
  setFilterType: (f: 'ALL' | 'WAITING' | 'PICKED_UP') => void;
  totalCount: number;
  waitingCount: number;
  pickedUpCount: number;
}

export function PickupFilterBar({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  totalCount,
  waitingCount,
  pickedUpCount,
}: PickupFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Tìm tên bé, tên người đón, SĐT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 focus:outline-orange-500 bg-slate-50/60"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === 'ALL'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tất cả ({totalCount})
        </button>
        <button
          onClick={() => setFilterType('WAITING')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === 'WAITING'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          Chưa đón ({waitingCount})
        </button>
        <button
          onClick={() => setFilterType('PICKED_UP')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterType === 'PICKED_UP'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
          }`}
        >
          Đã đón ({pickedUpCount})
        </button>
      </div>
    </div>
  );
}
