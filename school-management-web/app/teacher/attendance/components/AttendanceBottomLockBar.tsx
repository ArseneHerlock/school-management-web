'use client';

import React from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface AttendanceBottomLockBarProps {
  selectedDateLabel: string;
  presentCount: number;
  lateCount: number;
  absentCount: number;
  saving: boolean;
  onSubmitAndLock: () => void;
}

export function AttendanceBottomLockBar({
  selectedDateLabel,
  presentCount,
  lateCount,
  absentCount,
  saving,
  onSubmitAndLock,
}: AttendanceBottomLockBarProps) {
  return (
    <div className="sticky bottom-6 z-20 rounded-3xl bg-white/95 p-4 shadow-xl border border-orange-200 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-xs">
        <p className="font-black text-slate-900 text-sm">
          Sẵn sàng chốt sổ điểm danh đón trẻ · {selectedDateLabel}
        </p>
        <p className="text-slate-500 font-medium">
          Hiện có <strong className="text-emerald-700">{presentCount} có mặt</strong>,{' '}
          <strong className="text-amber-600">{lateCount} trễ</strong>,{' '}
          <strong className="text-rose-600">{absentCount} vắng</strong>.
        </p>
      </div>

      <button
        onClick={onSubmitAndLock}
        disabled={saving}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition shadow-md shadow-orange-600/30 disabled:opacity-60 cursor-pointer"
      >
        {saving ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Đang chốt sổ & lưu...</span>
          </>
        ) : (
          <>
            <Lock size={18} />
            <span>Chốt sổ & Khóa điểm danh sáng</span>
          </>
        )}
      </button>
    </div>
  );
}
