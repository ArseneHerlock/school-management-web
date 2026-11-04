"use client";

import React from "react";
import { Award, Sparkles, ShieldCheck, CheckCircle2, FileCheck } from "lucide-react";
import { AwardStats } from "../types";

interface KhenThuongStatsProps {
  stats: AwardStats;
}

export function KhenThuongStats({ stats }: KhenThuongStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-slate-400">Tổng khen thưởng</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-slate-800">{stats.totalAwards || 0}</span>
          <Award size={16} className="text-amber-500" />
        </div>
        <p className="mt-1 text-[10px] text-slate-500">
          Đã duyệt: {stats.approvedCount || 0} | Chờ: {stats.pendingCount || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-amber-800">1. Bé Tài Năng</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-amber-700">{stats.beTaiNang || 0}</span>
          <Sparkles size={16} className="text-amber-600" />
        </div>
        <p className="mt-1 text-[10px] text-amber-700/80">≥90% CC • Chuẩn WHO • Cụm 1</p>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-rose-700">2. Bé Khỏe - Bé Ngoan</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-rose-600">{stats.beKhoeBeNgoan || 0}</span>
          <Sparkles size={16} className="text-rose-500" />
        </div>
        <p className="mt-1 text-[10px] text-rose-600/80">≥90% CC • Chuẩn WHO • Cụm 2</p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-emerald-700">3. Bé Chuyên Cần</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-emerald-600">{stats.beChuyenCan || 0}</span>
          <ShieldCheck size={16} className="text-emerald-600" />
        </div>
        <p className="mt-1 text-[10px] text-emerald-600/80">≥90% CC • Cần TD • Cụm 3</p>
      </div>

      <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-blue-700">4. Bé Chăm Ngoan</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-blue-600">{stats.beChamNgoan || 0}</span>
          <CheckCircle2 size={16} className="text-blue-500" />
        </div>
        <p className="mt-1 text-[10px] text-blue-600/80">≥80% &amp; &lt;90% • Cần TD • Cụm 1, 2</p>
      </div>

      <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-purple-700">5. Bé Có Nhiều Tiến Bộ</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-purple-600">{stats.beTienBo || 0}</span>
          <Award size={16} className="text-purple-500" />
        </div>
        <p className="mt-1 text-[10px] text-purple-600/80">&lt;80% CC hoặc Cụm 4 • Không GH</p>
      </div>

      <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-3.5 shadow-sm">
        <p className="text-[10px] font-bold uppercase text-teal-700">Đã cấp Giấy khen</p>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className="text-xl font-black text-teal-600">{stats.approvedCount || 0}</span>
          <FileCheck size={16} className="text-teal-600" />
        </div>
        <p className="mt-1 text-[10px] text-teal-600/80">Chờ duyệt: {stats.pendingCount || 0}</p>
      </div>
    </div>
  );
}
