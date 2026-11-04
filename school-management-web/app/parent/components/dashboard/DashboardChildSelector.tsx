'use client';

import React from 'react';
import { ChildInfo } from '../../types';

interface DashboardChildSelectorProps {
  childrenData: ChildInfo[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
}

export function DashboardChildSelector({
  childrenData,
  selectedChildId,
  onSelectChild,
}: DashboardChildSelectorProps) {
  if (childrenData.length <= 1) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-blue-100 shadow-xs overflow-x-auto">
      <span className="text-xs font-bold text-slate-500 shrink-0 ml-1">
        Chọn bé theo dõi:
      </span>
      <div className="flex gap-2">
        {childrenData.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectChild(c.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
              c.id === selectedChildId
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                c.id === selectedChildId
                  ? 'bg-white text-blue-600'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {c.avatar}
            </div>
            <span>{c.hoTen}</span>
            <span className="text-[10px] opacity-80">({c.lop})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
