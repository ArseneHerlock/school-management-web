'use client';

import React from 'react';
import { RefreshCw, Star, Sparkles } from 'lucide-react';
import { ChildInfo } from '../../types';

interface GoodChildBannerProps {
  child: ChildInfo;
  loading: boolean;
  onRefresh: () => void;
  monthLabel: string;
  totalDaily: number;
  totalBonus: number;
}

export function GoodChildBanner({
  child,
  loading,
  onRefresh,
  monthLabel,
  totalDaily,
  totalBonus,
}: GoodChildBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 p-4 sm:p-5 text-white shadow-xs min-w-0 max-w-full">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-100">
          <Sparkles size={13} className="text-amber-300" />
          <span>Theo dõi bé ngoan hàng tuần</span>
        </div>
        <button
          onClick={onRefresh}
          title="Làm mới dữ liệu"
          className="rounded-xl bg-white/15 p-1.5 text-white hover:bg-white/25 transition cursor-pointer shrink-0"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black leading-tight text-white">
            {child.hoTen ? `Bé ${child.hoTen}` : 'Bé yêu'}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-indigo-100">
            <span className="bg-white/15 px-2.5 py-0.5 rounded-full font-semibold">
              {child.lop || 'Lớp chưa cập nhật'}
            </span>
            <span className="bg-white/15 px-2.5 py-0.5 rounded-full font-semibold">
              {monthLabel}
            </span>
          </div>
        </div>

        {/* 2 chỉ số tích lũy dạng thẻ gọn nhẹ */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 min-w-[110px]">
            <span className="text-xl">🌸</span>
            <div>
              <div className="text-[10px] text-indigo-100 uppercase font-bold">Cờ tuần</div>
              <div className="text-base font-black text-white leading-none">{totalDaily}</div>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl px-3 py-2 flex items-center gap-2 min-w-[110px]">
            <Star size={18} className="text-amber-300 fill-amber-300" />
            <div>
              <div className="text-[10px] text-indigo-100 uppercase font-bold">Sao tháng</div>
              <div className="text-base font-black text-amber-200 leading-none">{totalBonus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
