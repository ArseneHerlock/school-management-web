'use client';

import React from 'react';
import { Flower2, Star, CheckCircle2, Clock } from 'lucide-react';
import { ChildInfo } from '../../types';

interface FridayAwardProgressCardProps {
  child: ChildInfo;
  fridayAward: any;
  monthProgress: number;
}

export function FridayAwardProgressCard({
  child,
  fridayAward,
  monthProgress,
}: FridayAwardProgressCardProps) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-3.5 sm:p-4 shadow-2xs space-y-3 min-w-0 max-w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
            <Flower2 size={18} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
              Tiến độ tuần này
            </span>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              Phiếu bé ngoan Thứ 6
            </h3>
          </div>
        </div>

        {/* Trạng thái tuần */}
        <div>
          {fridayAward?.hasAwardedToday ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
              <CheckCircle2 size={11} /> Đã nhận phiếu tuần này
            </span>
          ) : fridayAward?.isQualified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
              <Clock size={11} /> Chờ phát chiều nay
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
              Đang rèn luyện
            </span>
          )}
        </div>
      </div>

      {/* Thanh tiến độ tháng */}
      <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold text-[11px]">
            Tích lũy tháng: <strong className="text-rose-600 font-extrabold">{monthProgress}/4 tuần</strong>
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            {monthProgress >= 4
              ? '🎉 Xuất sắc đạt đủ 4 tuần!'
              : `Còn ${4 - monthProgress} tuần để đạt Ngôi sao tháng`}
          </span>
        </div>

        {/* 4 nấc tích lũy tuần gọn gàng */}
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 2, 3, 4].map((slot) => {
            const earned = monthProgress >= slot;
            return (
              <div
                key={slot}
                className={`py-1.5 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center ${
                  earned
                    ? 'border-pink-200 bg-pink-50/90 text-pink-700 font-bold shadow-2xs'
                    : 'border-slate-100 bg-white text-slate-400'
                }`}
              >
                <span className="text-xs">{earned ? '🌸' : '⚪'}</span>
                <span className="text-[9px] mt-0.5 leading-none font-semibold">
                  Tuần {slot}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
