"use client";

import React from "react";
import { Users, Link2, UserRound } from "lucide-react";
import { Parent, Child } from "../types";

interface PhuHuynhStatsProps {
  parents: Parent[];
  childrenMap: Record<string, Child[]>;
}

export default function PhuHuynhStats({
  parents,
  childrenMap,
}: PhuHuynhStatsProps) {
  const total = parents.length;
  const linked = parents.filter((item) => item.taiKhoanId).length;
  const withChildren = parents.filter(
    (item) => (childrenMap[item.id] || []).length > 0
  ).length;

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng phụ huynh</p>
            <p className="mt-1 text-2xl font-black">{total}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Link2 size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Đã có tài khoản</p>
            <p className="mt-1 text-2xl font-black">{linked}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <UserRound size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Có con liên kết</p>
            <p className="mt-1 text-2xl font-black">{withChildren}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
