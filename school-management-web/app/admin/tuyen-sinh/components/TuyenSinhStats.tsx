"use client";

import React from "react";
import { EnrollmentApp } from "../types";

interface TuyenSinhStatsProps {
  apps: EnrollmentApp[];
}

export function TuyenSinhStats({ apps }: TuyenSinhStatsProps) {
  const pendingCount = apps.filter(
    (a) => a.TrangThai === "ChoDuyet" || !a.TrangThai
  ).length;
  const enrolledCount = apps.filter((a) => a.TrangThai === "DaNhapHoc").length;
  const rejectedCount = apps.filter((a) => a.TrangThai === "TuChoi").length;

  return (
    <div className="grid gap-4 sm:grid-cols-4">
      <div className="admin-card p-4">
        <p className="text-xs font-medium text-slate-400">Tổng số hồ sơ</p>
        <p className="mt-1 text-2xl font-black text-slate-800">{apps.length}</p>
      </div>
      <div className="admin-card p-4">
        <p className="text-xs font-bold text-amber-500">Chờ xét duyệt</p>
        <p className="mt-1 text-2xl font-black text-amber-600">{pendingCount}</p>
      </div>
      <div className="admin-card p-4">
        <p className="text-xs font-bold text-emerald-500">
          Đã trúng tuyển / Nhập học
        </p>
        <p className="mt-1 text-2xl font-black text-emerald-600">{enrolledCount}</p>
      </div>
      <div className="admin-card p-4">
        <p className="text-xs font-bold text-rose-500">Từ chối</p>
        <p className="mt-1 text-2xl font-black text-rose-600">{rejectedCount}</p>
      </div>
    </div>
  );
}
