"use client";

import React from "react";
import { Users, TrendingUp } from "lucide-react";

interface FcmKpisProps {
  totalEvaluated: number;
  clusterCounts: Record<number, number>;
  improvedCount: number;
}

export function FcmKpis({
  totalEvaluated,
  clusterCounts,
  improvedCount,
}: FcmKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-slate-400">
          Tổng trẻ phân cụm
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-800">
            {totalEvaluated}
          </span>
          <Users size={18} className="text-slate-400" />
        </div>
        <p className="mt-1 text-[11px] text-slate-500">Toàn trường</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-emerald-700">
          Cụm 1: Nổi trội
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-emerald-600">
            {clusterCounts[1]}
          </span>
          <span className="text-xs font-bold text-emerald-700">
            {totalEvaluated > 0
              ? `${Math.round((clusterCounts[1] / totalEvaluated) * 100)}%`
              : "0%"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-emerald-600/80">
          Vượt chuẩn 5 lĩnh vực
        </p>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-blue-700">
          Cụm 2: Mức khá
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-blue-600">
            {clusterCounts[2]}
          </span>
          <span className="text-xs font-bold text-blue-700">
            {totalEvaluated > 0
              ? `${Math.round((clusterCounts[2] / totalEvaluated) * 100)}%`
              : "0%"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-blue-600/80">Đạt chuẩn độ tuổi</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-amber-700">
          Cụm 3: Trung bình
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-amber-600">
            {clusterCounts[3]}
          </span>
          <span className="text-xs font-bold text-amber-700">
            {totalEvaluated > 0
              ? `${Math.round((clusterCounts[3] / totalEvaluated) * 100)}%`
              : "0%"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-amber-600/80">Tiệm cận chuẩn</p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-rose-700">
          Cụm 4: Cần theo dõi
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-rose-600">
            {clusterCounts[4]}
          </span>
          <span className="text-xs font-bold text-rose-700">
            {totalEvaluated > 0
              ? `${Math.round((clusterCounts[4] / totalEvaluated) * 100)}%`
              : "0%"}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-rose-600/80">Cần GV đồng hành</p>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 shadow-sm">
        <p className="text-[11px] font-bold uppercase text-indigo-700">
          Trẻ có tiến bộ
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-2xl font-black text-indigo-600">
            {improvedCount}
          </span>
          <TrendingUp size={18} className="text-indigo-600" />
        </div>
        <p className="mt-1 text-[11px] text-indigo-600/80">Thăng hạng cụm</p>
      </div>
    </div>
  );
}
