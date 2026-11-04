'use client';

import React from 'react';
import { Flower2, Star } from 'lucide-react';
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
    <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/90 via-orange-50/60 to-amber-50/50 p-6 shadow-xs space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-rose-500/20">
            <Flower2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-800">
                PHIẾU BÉ NGOAN THỨ SÁU
              </span>
              {fridayAward?.hasAwardedToday ? (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                  ✓ Đã nhận phiếu tuần này
                </span>
              ) : fridayAward?.isQualified ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                  Chờ cô giáo phát chiều nay
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  Đang rèn luyện nề nếp
                </span>
              )}
              {(fridayAward?.hasMonthlyStar || monthProgress >= 4) && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-black text-amber-900">
                  <Star size={11} className="fill-amber-500 text-amber-500" /> Ngôi Sao Bé Ngoan Tháng
                </span>
              )}
            </div>
            <h3 className="mt-1 text-lg font-black text-slate-800">
              Tiến độ tích lũy phiếu hoa của bé {child.hoTen || 'con'}
            </h3>
            <p className="text-xs text-slate-500">
              {fridayAward?.reasonText ||
                'Ghi nhận chuyên cần và nề nếp đi học mỗi tuần của trẻ'}
            </p>
          </div>
        </div>

        <div className="text-right sm:self-center shrink-0">
          <span className="text-2xl font-black text-rose-600">
            {monthProgress}/4
          </span>
          <span className="text-xs font-bold text-slate-500 ml-1">phiếu tháng</span>
        </div>
      </div>

      {/* Thanh tích lũy hoa (Progress Bar) */}
      <div className="space-y-2.5 bg-white/80 rounded-2xl p-4 border border-rose-100 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <span>Thanh tích lũy hoa tháng:</span>
            <strong className="text-rose-600">
              {Math.round((monthProgress / 4) * 100)}%
            </strong>
          </span>
          <span className="text-slate-500">
            {monthProgress >= 4
              ? '🎉 Đã hoàn thành xuất sắc 4/4 tuần'
              : `Cần thêm ${4 - monthProgress} phiếu để nhận Ngôi Sao Tháng`}
          </span>
        </div>

        {/* Thanh chạy tiến độ */}
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 transition-all duration-500"
            style={{ width: `${Math.min(100, (monthProgress / 4) * 100)}%` }}
          />
        </div>

        {/* 4 nấc tích lũy tuần */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {[1, 2, 3, 4].map((slot) => {
            const earned = monthProgress >= slot;
            return (
              <div
                key={slot}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                  earned
                    ? 'border-pink-200 bg-pink-50 text-pink-700 font-extrabold shadow-2xs'
                    : 'border-slate-200/80 bg-slate-50 text-slate-400'
                }`}
              >
                <span className="text-sm">{earned ? '🌸' : '○'}</span>
                <span className="text-[10px] mt-0.5 font-bold">Tuần {slot}</span>
                <span className="text-[9px] text-slate-400 font-medium">
                  {earned ? 'Đã nhận' : 'Chưa có'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Lịch sử các phiếu hoa đã nhận trong tháng */}
        {fridayAward?.monthFlowers && fridayAward.monthFlowers.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            <span className="font-bold text-slate-700">Chi tiết ngày nhận:</span>
            {fridayAward.monthFlowers.map((f: any, idx: number) => (
              <span
                key={f.id || idx}
                className="inline-flex items-center gap-1 text-[11px] bg-rose-50 px-2 py-0.5 rounded-md text-rose-700 font-semibold"
              >
                🌸 {f.date.slice(5).replace('-', '/')}: {f.reason || 'Phiếu Bé Ngoan'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
