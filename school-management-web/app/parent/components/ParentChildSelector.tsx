'use client';

import React from 'react';
import { ChildInfo } from '../types';

interface ParentChildSelectorProps {
  childrenData: ChildInfo[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
}

export function ParentChildSelector({
  childrenData,
  selectedChildId,
  onSelectChild,
}: ParentChildSelectorProps) {
  if (childrenData.length <= 1) return null;

  return (
    <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-2xl border border-slate-200 shadow-xs w-max max-w-full overflow-x-auto no-scrollbar">
      {childrenData.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelectChild(c.id)}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            c.id === selectedChildId
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div
            className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] ${
              c.id === selectedChildId
                ? 'bg-white text-indigo-600'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {c.avatar}
          </div>
          <span>{c.hoTen}</span>
        </button>
      ))}
    </div>
  );
}
