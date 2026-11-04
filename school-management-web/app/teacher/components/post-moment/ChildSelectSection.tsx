import React from 'react';
import { Search, Check } from 'lucide-react';
import { Child } from '../../data';

interface ChildSelectSectionProps {
  childrenList: Child[];
  filteredChildren: Child[];
  selectedChildIds: string[];
  studentSearch: string;
  setStudentSearch: (value: string) => void;
  toggleSelectChild: (childId: string) => void;
  selectAllChildren: () => void;
  clearAllChildren: () => void;
}

export function ChildSelectSection({
  childrenList,
  filteredChildren,
  selectedChildIds,
  studentSearch,
  setStudentSearch,
  toggleSelectChild,
  selectAllChildren,
  clearAllChildren,
}: ChildSelectSectionProps) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/40 p-3.5 space-y-3 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 text-xs">
            Chọn học sinh được gắn ảnh:
          </span>
          <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {selectedChildIds.length}/{childrenList.length} bé
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAllChildren}
            className="text-[11px] font-bold text-orange-600 hover:text-orange-800 underline cursor-pointer"
          >
            Chọn tất cả
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={clearAllChildren}
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Bỏ chọn
          </button>
        </div>
      </div>

      <div className="relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Tìm tên bé..."
          value={studentSearch}
          onChange={(e) => setStudentSearch(e.target.value)}
          className="w-full rounded-xl border border-orange-200 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold outline-none focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
        {filteredChildren.map((kid) => {
          const kidId = String(kid.apiId || kid.id);
          const isSelected = selectedChildIds.includes(kidId);

          return (
            <button
              key={kidId}
              type="button"
              onClick={() => toggleSelectChild(kidId)}
              className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition cursor-pointer ${
                isSelected
                  ? 'border-orange-500 bg-orange-500 text-white font-black shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-orange-300'
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isSelected
                    ? 'bg-white text-orange-600'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {isSelected ? (
                  <Check size={12} strokeWidth={3} />
                ) : (
                  kid.avatar || kid.name.charAt(0)
                )}
              </div>
              <span className="truncate text-[11px]">
                {kid.name} {kid.nickname ? `(${kid.nickname})` : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
