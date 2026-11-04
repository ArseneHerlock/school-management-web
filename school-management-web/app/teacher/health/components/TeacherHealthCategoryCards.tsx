import React from 'react';

export interface WhoCategoryCardItem {
  key: string;
  label: string;
  sub: string;
  count: string;
  bg: string;
  activeBg: string;
  labelColor: string;
}

interface TeacherHealthCategoryCardsProps {
  cards: WhoCategoryCardItem[];
  statusFilter: string;
  setStatusFilter: (key: string) => void;
}

export function TeacherHealthCategoryCards({
  cards,
  statusFilter,
  setStatusFilter,
}: TeacherHealthCategoryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
      {cards.map((item) => {
        const isActive = statusFilter === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setStatusFilter(isActive && item.key !== 'ALL' ? 'ALL' : item.key)}
            className={`rounded-2xl p-3 border text-center shadow-xs transition cursor-pointer ${
              isActive ? item.activeBg : `${item.bg} hover:opacity-90`
            }`}
          >
            <span
              className={`text-[10px] font-black uppercase block tracking-wide ${
                isActive ? 'text-white/90' : item.labelColor
              }`}
            >
              {item.label}
            </span>
            <p className="text-lg sm:text-xl font-black mt-0.5">{item.count}</p>
            <span
              className={`text-[9px] font-semibold block mt-0.5 ${
                isActive ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              {item.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
