'use client';

import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface AttendanceLockBannerProps {
  isLocked: boolean;
}

export function AttendanceLockBanner({ isLocked }: AttendanceLockBannerProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border ${
        isLocked
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
    >
      {isLocked ? (
        <Lock size={14} className="text-emerald-600 shrink-0" />
      ) : (
        <Unlock size={14} className="text-amber-600 shrink-0" />
      )}
      <span>
        {isLocked ? 'Đã chốt sổ điểm danh' : 'Đang mở điểm danh'}
      </span>
    </div>
  );
}
