'use client';

import React from 'react';
import { Sparkles, Calendar, School, X } from 'lucide-react';

interface PostMomentHeaderProps {
  activityTitle: string;
  activityDate: string;
  currentClassNameResolved: string;
  onClose: () => void;
  isUploading: boolean;
}

export function PostMomentHeader({
  activityTitle,
  activityDate,
  currentClassNameResolved,
  onClose,
  isUploading,
}: PostMomentHeaderProps) {
  return (
    <div className="relative border-b border-orange-100 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="inline-block text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
              KHOẢNH KHẮC MẦM NON 2026
            </span>
            <h2 className="text-xl font-black tracking-tight text-white mt-0.5">
              Đăng Khoảnh Khắc Hoạt Động
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={isUploading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer disabled:opacity-50"
        >
          <X size={18} />
        </button>
      </div>

      {/* Activity Badge Strip */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-orange-50 bg-black/10 rounded-2xl p-2.5">
        <span className="flex items-center gap-1.5 text-white font-bold bg-white/20 px-2.5 py-1 rounded-xl">
          <Sparkles size={13} className="text-amber-200" />
          {activityTitle || 'Hoạt động mầm non'}
        </span>
        <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl">
          <Calendar size={13} />
          {activityDate}
        </span>
        <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl">
          <School size={13} />
          {currentClassNameResolved}
        </span>
      </div>
    </div>
  );
}
