'use client';

import React from 'react';
import { Camera } from 'lucide-react';

interface MomentsHeaderBannerProps {
  childName?: string;
  classNameProp?: string;
}

export function MomentsHeaderBanner({
  childName,
  classNameProp,
}: MomentsHeaderBannerProps) {
  return (
    <div className="card-frame p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-sky-100 rounded-2xl sm:rounded-3xl">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 bg-sky-100/80 px-2 py-0.5 rounded-full">
          NHẬT KÝ HÌNH ẢNH HOẠT ĐỘNG
        </span>
        <h2 className="text-base sm:text-xl font-black text-slate-800 mt-1">
          Album Ảnh & Nhật Ký Hoạt Động Của Lớp
        </h2>
        <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
          Lưu giữ những khoảnh khắc học tập, sinh hoạt và vui chơi của bé{' '}
          {childName ? `(${childName})` : ''} - {classNameProp || 'Lớp của bé'}
        </p>
      </div>
      <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sky-600 shadow-xs border border-sky-100 shrink-0">
        <Camera size={22} />
      </div>
    </div>
  );
}
