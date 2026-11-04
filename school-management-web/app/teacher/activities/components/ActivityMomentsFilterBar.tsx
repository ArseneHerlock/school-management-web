import React from 'react';
import { School, User } from 'lucide-react';

interface ActivityMomentsFilterBarProps {
  selectedMonth: string;
  setSelectedMonth: (val: string) => void;
  selectedScope: 'ALL' | 'class' | 'child';
  setSelectedScope: (scope: 'ALL' | 'class' | 'child') => void;
  availableMonths: Array<{ key: string; label: string; count: number }>;
  totalCount: number;
}

export function ActivityMomentsFilterBar({
  selectedMonth,
  setSelectedMonth,
  selectedScope,
  setSelectedScope,
  availableMonths,
  totalCount,
}: ActivityMomentsFilterBarProps) {
  return (
    <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500">Bộ lọc:</span>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
        >
          <option value="ALL">📅 Tất cả các tháng ({totalCount} tệp)</option>
          {availableMonths.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label} ({m.count} ảnh)
            </option>
          ))}
        </select>
      </div>

      <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs">
        <button
          onClick={() => setSelectedScope('ALL')}
          className={`rounded-lg px-3 py-1 text-xs font-black transition cursor-pointer ${
            selectedScope === 'ALL'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất cả ({totalCount})
        </button>
        <button
          onClick={() => setSelectedScope('class')}
          className={`rounded-lg px-3 py-1 text-xs font-black transition cursor-pointer flex items-center gap-1 ${
            selectedScope === 'class'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <School size={12} /> Cả lớp
        </button>
        <button
          onClick={() => setSelectedScope('child')}
          className={`rounded-lg px-3 py-1 text-xs font-black transition cursor-pointer flex items-center gap-1 ${
            selectedScope === 'child'
              ? 'bg-orange-500 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User size={12} /> Từng bé
        </button>
      </div>
    </div>
  );
}
