"use client";

import React from "react";
import { Users, Link2, UserRound } from "lucide-react";
import { Student } from "../types";

interface HocSinhStatsProps {
  students: Student[];
}

export default function HocSinhStats({ students }: HocSinhStatsProps) {
  const total = students.length;
  const active = students.filter((item) => item.trangThaiHoc === "Đang học").length;
  const unassigned = students.filter((item) => !item.lopId).length;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="admin-card p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
          <div className="admin-icon shrink-0">
            <Users size={17} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Tổng học sinh</p>
            <p className="text-base sm:text-2xl font-black text-slate-900">{total}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
          <div className="admin-icon shrink-0">
            <Link2 size={17} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Đang học</p>
            <p className="text-base sm:text-2xl font-black text-emerald-700">{active}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-1.5 sm:gap-3">
          <div className="admin-icon shrink-0">
            <UserRound size={17} />
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500">Chưa xếp lớp</p>
            <p className="text-base sm:text-2xl font-black text-amber-600">{unassigned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
