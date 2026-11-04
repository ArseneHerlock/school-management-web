"use client";

import React from "react";
import {
  CalendarCheck,
  Users,
  UserCog,
  Wallet,
} from "lucide-react";
import { DashboardStatsData } from "@/services/adminDashboardTypes";

interface DashboardKpisProps {
  stats: DashboardStatsData;
  onNavigate: (id: string) => void;
}

export function DashboardKpis({ stats, onNavigate }: DashboardKpisProps) {
  const assignedCount = Math.max(
    0,
    stats.activeStudentsCount - stats.unassignedStudentsCount
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 max-w-full min-w-0">
      {/* KPI 1: Chuyên cần hôm nay */}
      <div
        onClick={() => onNavigate("diem-danh")}
        className="admin-card p-3 sm:p-4.5 cursor-pointer hover:-translate-y-0.5 hover:border-emerald-300 transition flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Chuyên cần</span>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CalendarCheck size={14} />
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-slate-800">
            {stats.attendanceToday.present}
          </span>
          <span className="text-[11px] text-slate-400">
            /{stats.activeStudentsCount}
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px]">
          <span className="text-emerald-600 font-extrabold">
            {stats.attendanceToday.attendanceRate}% có mặt
          </span>
          <span className="text-slate-400 truncate hidden sm:inline">
            Vắng: {stats.attendanceToday.absentWithNotice}
          </span>
        </div>
      </div>

      {/* KPI 2: Quy mô Học sinh & Lớp */}
      <div
        onClick={() => onNavigate("hoc-sinh")}
        className="admin-card p-3 sm:p-4.5 cursor-pointer hover:-translate-y-0.5 hover:border-rose-300 transition flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Học sinh</span>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <Users size={14} />
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-slate-800">
            {stats.activeStudentsCount}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-rose-600 truncate">
            {stats.classesCount} Lớp
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span>Xếp lớp: {assignedCount}</span>
          <span className="text-amber-600 font-bold">{stats.unassignedStudentsCount > 0 ? `Chưa: ${stats.unassignedStudentsCount}` : "Đủ"}</span>
        </div>
      </div>

      {/* KPI 3: Cán bộ & Giáo viên */}
      <div
        onClick={() => onNavigate("nhan-su")}
        className="admin-card p-3 sm:p-4.5 cursor-pointer hover:-translate-y-0.5 hover:border-blue-300 transition flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Cán bộ - GV</span>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <UserCog size={14} />
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-slate-800">
            {stats.staffCount}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400">nhân sự</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span className="truncate">{stats.parentsCount} PH</span>
          <span className="text-blue-600 font-bold shrink-0">100% chuẩn</span>
        </div>
      </div>

      {/* KPI 4: Tiến độ thu học phí */}
      <div
        onClick={() => onNavigate("hoc-phi")}
        className="admin-card p-3 sm:p-4.5 cursor-pointer hover:-translate-y-0.5 hover:border-amber-300 transition flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 truncate">Thu học phí</span>
          <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Wallet size={14} />
          </span>
        </div>
        <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-amber-600">
            {stats.tuitionLedger.collectionRate}%
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 truncate">hoàn tất</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
          <span className="truncate">{stats.tuitionLedger.periodLabel}</span>
          <span className="text-emerald-600 font-bold shrink-0">Sổ quỹ ➜</span>
        </div>
      </div>
    </div>
  );
}
