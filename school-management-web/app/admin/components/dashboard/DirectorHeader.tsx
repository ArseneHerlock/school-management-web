"use client";

import React from "react";
import {
  Building2,
  CalendarDays,
  Clock,
  Radio,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface DirectorHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  onNavigate: (route: string) => void;
  attendanceRate: number;
  totalPresent: number;
  totalEnrolled: number;
}

export const DirectorHeader: React.FC<DirectorHeaderProps> = ({
  onRefresh,
  isRefreshing,
  onNavigate,
  attendanceRate,
  totalPresent,
  totalEnrolled,
}) => {
  const todayStr = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-900 via-rose-950 to-slate-900 p-4 sm:p-6 md:p-7 text-white shadow-xl shadow-rose-950/20 max-w-full">
      {/* Decorative ambient background strictly contained */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 min-w-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-black tracking-wide text-rose-300 border border-rose-400/30">
              <Building2 size={12} className="text-rose-400 shrink-0" />
              <span className="truncate">HỆ THỐNG MẦM NON ÁNH SAO</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-semibold text-slate-200 backdrop-blur">
              <CalendarDays size={12} className="text-amber-400 shrink-0" />
              <span>Năm học 2026 - 2027</span>
            </span>
          </div>

          <h1 className="mt-2.5 text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            Trung tâm Điều hành Ban Giám Hiệu
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] sm:text-xs text-rose-100/90">
            <span className="flex items-center gap-1.5 shrink-0">
              <Clock size={12} className="text-rose-300" />
              <span className="capitalize">{todayStr}</span>
            </span>
            <span className="hidden sm:inline text-rose-300/40">•</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>
                {totalEnrolled > 0 && totalPresent > 0
                  ? `Ca sáng: Đang bán trú (${totalPresent}/${totalEnrolled} trẻ • ${attendanceRate}%)`
                  : totalEnrolled > 0
                  ? `Ca sáng: Đang nhận trẻ (${totalEnrolled} học sinh)`
                  : "Ca sáng: Đang tiếp nhận trẻ"}
              </span>
            </span>
          </div>
        </div>

        {/* Action Command Dock */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-1 lg:pt-0">
          <button
            onClick={() => onNavigate("tin-tuc")}
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white transition active:scale-98 cursor-pointer"
          >
            <Radio size={14} className="text-rose-300 shrink-0" />
            <span className="truncate">Phát tin tức</span>
          </button>

          <button
            onClick={() => onNavigate("bao-cao")}
            className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-amber-500 hover:bg-amber-400 px-2.5 py-2 sm:px-4 sm:py-2.5 text-xs font-black text-slate-950 transition active:scale-98 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <FileSpreadsheet size={14} className="shrink-0" />
            <span className="truncate">Báo cáo Sở</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 p-2 sm:p-2.5 text-xs font-bold text-rose-200 transition disabled:opacity-50 cursor-pointer"
            title="Đồng bộ số liệu thời gian thực"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-rose-300" : ""} />
            <span className="sm:hidden text-xs font-bold">Đồng bộ dữ liệu</span>
          </button>
        </div>
      </div>
    </header>
  );
};