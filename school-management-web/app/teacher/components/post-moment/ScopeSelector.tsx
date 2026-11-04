'use client';

import React from 'react';
import { Users, School, User } from 'lucide-react';

interface ScopeSelectorProps {
  scope: 'class' | 'child';
  onSelectScope: (scope: 'class' | 'child') => void;
}

export function ScopeSelector({ scope, onSelectScope }: ScopeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
        <Users size={14} className="text-orange-500" />
        Phạm vi hiển thị khoảnh khắc
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectScope('class')}
          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
            scope === 'class'
              ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-400/30 font-bold'
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
              scope === 'class'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <School size={18} />
          </div>
          <div>
            <div className="font-black text-xs text-slate-900">
              Khoảnh khắc cả lớp
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Đăng vào Album chung của lớp, toàn bộ phụ huynh đều xem được.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectScope('child')}
          className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
            scope === 'child'
              ? 'border-orange-500 bg-orange-50/70 text-orange-950 ring-2 ring-orange-400/30 font-bold'
              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
          }`}
        >
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
              scope === 'child'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            <User size={18} />
          </div>
          <div>
            <div className="font-black text-xs text-slate-900">
              Khoảnh khắc riêng của bé
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Lưu vào hồ sơ riêng của bé, chỉ phụ huynh bé đó mới xem được.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
