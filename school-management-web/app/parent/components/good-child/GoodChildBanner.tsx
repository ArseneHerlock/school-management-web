'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-[30px] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-2xl" />
      <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 to-orange-500 text-3xl shadow-lg shadow-orange-900/40">
            🌟
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-black tracking-[.2em] text-amber-300 uppercase">
                BẢNG VÀNG BÉ NGOAN
              </p>
              <button
                onClick={onRefresh}
                title="Tải lại từ CSDL"
                className="rounded-full bg-white/10 p-1 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Sổ theo dõi thi đua & Phiếu bé ngoan của {child.hoTen || 'Bé'}
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Tổng hợp cờ bé ngoan tuần, cờ thi đua tháng và khen thưởng thi đua cuối năm học
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                {child.lop || 'Lớp chưa cập nhật'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">
                {monthLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-80">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-slate-300">Cờ bé ngoan tuần</p>
            <p className="mt-1 text-3xl font-black text-rose-300">{totalDaily}</p>
            <p className="mt-1 text-[11px] text-slate-400">Đạt được trong tháng</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs text-slate-300">Bé ngoan xuất sắc</p>
            <p className="mt-1 text-3xl font-black text-amber-300">{totalBonus}</p>
            <p className="mt-1 text-[11px] text-slate-400">Đạt trọn vẹn 4 tuần</p>
          </div>
        </div>
      </div>
    </div>
  );
}
