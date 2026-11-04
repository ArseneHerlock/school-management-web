import React from 'react';
import { Search } from 'lucide-react';

interface LeaveFilterBarProps {
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  statusFilter: 'ALL' | 'pending' | 'approved' | 'rejected';
  setStatusFilter: (f: 'ALL' | 'pending' | 'approved' | 'rejected') => void;
}

export function LeaveFilterBar({
  searchKeyword,
  setSearchKeyword,
  statusFilter,
  setStatusFilter,
}: LeaveFilterBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          placeholder="Tìm theo tên học sinh, lý do nghỉ học..."
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1 rounded-2xl">
        {[
          { key: 'ALL', label: 'Tất cả đơn' },
          { key: 'pending', label: 'Chờ duyệt' },
          { key: 'approved', label: 'Đã duyệt' },
          { key: 'rejected', label: 'Từ chối' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
