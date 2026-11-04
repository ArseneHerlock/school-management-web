"use client";

import React from "react";
import { Users, UserCheck, Briefcase, GraduationCap } from "lucide-react";
import { Staff, Assignment } from "../types";

interface NhanSuStatsProps {
  staffList: Staff[];
  assignmentsMap: Record<string, Assignment[]>;
}

export default function NhanSuStats({
  staffList,
  assignmentsMap,
}: NhanSuStatsProps) {
  const activeCount = staffList.filter(function (staffItem) {
    const statusText = String(staffItem.status).toLowerCase();
    return statusText.includes("active") || statusText === "1";
  }).length;

  const assignedCount = staffList.filter(function (staffItem) {
    return (assignmentsMap[staffItem.staffId] || []).length > 0;
  }).length;

  const totalAssignCount = Object.values(assignmentsMap).reduce(function (
    accumulator,
    list
  ) {
    return accumulator + list.length;
  }, 0);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng nhân sự</p>
            <p className="mt-1 text-2xl font-black">{staffList.length}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <UserCheck size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Đang hoạt động</p>
            <p className="mt-1 text-2xl font-black">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <GraduationCap size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Có phân công</p>
            <p className="mt-1 text-2xl font-black">{assignedCount}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Briefcase size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng phân công</p>
            <p className="mt-1 text-2xl font-black">{totalAssignCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
