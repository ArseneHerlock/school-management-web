"use client";

import { Flower2, Star, TrendingUp, Users } from "lucide-react";

interface GoodChildStatsProps {
  totalRecords: number;
  totalDailyFlowers: number;
  totalBonusStars: number;
  completionRate: number;
  fourFlowersCount: number;
}

export default function GoodChildStats({
  totalRecords,
  totalDailyFlowers,
  totalBonusStars,
  completionRate,
  fourFlowersCount,
}: GoodChildStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-slate-400">Tổng trẻ có sổ tháng</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-800">{totalRecords}</span>
          <Users size={18} className="text-slate-400" />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">Được lập sổ theo dõi</p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-rose-700">Tổng hoa nhỏ thứ 6</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-rose-600">{totalDailyFlowers}</span>
          <Flower2 size={18} className="text-rose-500" />
        </div>
        <p className="mt-1 text-[11px] text-rose-600/80">Phát định kỳ mỗi thứ Sáu</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-amber-700">Ngôi sao bé ngoan tháng</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-amber-600">{totalBonusStars}</span>
          <Star size={18} className="text-amber-500" fill="currentColor" />
        </div>
        <p className="mt-1 text-[11px] text-amber-600/80">Đạt mốc 4/4 hoa nhỏ</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-emerald-700">Tỷ lệ xuất sắc tháng</p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-600">{completionRate}%</span>
          <TrendingUp size={18} className="text-emerald-500" />
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/80">
          {fourFlowersCount}/{totalRecords} bé trọn vẹn 4 tuần
        </p>
      </div>
    </div>
  );
}
