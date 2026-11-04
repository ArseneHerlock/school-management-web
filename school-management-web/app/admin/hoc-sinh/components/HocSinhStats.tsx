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
    <div className="grid gap-3 md:grid-cols-3">
      <div className="admin-card p-5">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Users size={19} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Tổng học sinh</p>
            <p className="text-2xl font-black text-slate-900">{total}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-5">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Link2 size={19} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Đang học</p>
            <p className="text-2xl font-black text-slate-900">{active}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-5">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <UserRound size={19} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Chưa xếp lớp</p>
            <p className="text-2xl font-black text-slate-900">{unassigned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
