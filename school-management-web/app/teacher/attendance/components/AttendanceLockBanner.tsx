'use client';

import React from 'react';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

interface AttendanceLockBannerProps {
  isLocked: boolean;
}

export function AttendanceLockBanner({ isLocked }: AttendanceLockBannerProps) {
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-2xl p-4 text-xs shadow-2xs border ${
        isLocked
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : 'bg-amber-50/80 border-amber-200 text-amber-950'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {isLocked ? (
          <Lock size={18} className="text-emerald-700 shrink-0 mt-0.5" />
        ) : (
          <Unlock size={18} className="text-amber-600 shrink-0 mt-0.5" />
        )}
        <div>
          <p className="font-extrabold text-sm mb-0.5">
            {isLocked
              ? 'Sổ điểm danh sáng ĐÃ ĐƯỢC CHỐT & KHÓA AN TOÀN'
              : 'Sổ điểm danh sáng ĐANG MỞ (Khung giờ 7h00 - 8h30)'}
          </p>
          <p className="leading-relaxed">
            {isLocked
              ? 'Các nút điểm danh thường đã bị khóa để bảo toàn số liệu suất ăn với Nhà Bếp. Nếu có bé đến muộn hoặc phụ huynh đón về sớm giữa ngày, cô sử dụng nút "Đến muộn" hoặc "Đón về sớm" ngay trên thẻ của bé.'
              : 'Cô giáo điểm danh các bé có mặt/vắng/trễ. Sau khi kiểm đếm chính xác, nhấn nút "Chốt sổ điểm danh sáng" bên dưới để khóa dữ liệu và chốt suất ăn bán trú.'}
          </p>
        </div>
      </div>

      {isLocked && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[11px]">
            <ShieldCheck size={13} /> Đã khóa số liệu
          </span>
        </div>
      )}
    </div>
  );
}
