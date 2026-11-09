"use client";

import React from "react";
import { Search, TrendingUp, AlertTriangle, Eye } from "lucide-react";
import { ChildFCM, ClassBreakdown, CLUSTER_CONFIG } from "../types";

interface FcmChildrenTableProps {
  classBreakdown: ClassBreakdown[];
  filteredChildren: ChildFCM[];
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  selectedCluster: string;
  setSelectedCluster: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  onSelectChild: (child: ChildFCM) => void;
}

export function FcmChildrenTable({
  classBreakdown,
  filteredChildren,
  selectedClass,
  setSelectedClass,
  selectedCluster,
  setSelectedCluster,
  searchQuery,
  setSearchQuery,
  onSelectChild,
}: FcmChildrenTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">
            Tra cứu chi tiết hồ sơ phát triển trẻ
          </h3>
          <p className="text-[11px] text-slate-400">
            Xem vị trí cụm, xác suất phân loại (membership) và tiến trình phát
            triển của từng bé
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by class */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả các lớp</option>
            {classBreakdown.map((c) => (
              <option key={c.ClassId} value={c.TenLop}>
                {c.TenLop}
              </option>
            ))}
          </select>

          {/* Filter by cluster */}
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả các cụm</option>
            <option value="1">Cụm 1: Chuẩn & Nổi trội</option>
            <option value="2">Cụm 2: Mức khá</option>
            <option value="3">Cụm 3: Mức trung bình</option>
            <option value="4">Cụm 4: Cần theo dõi</option>
          </select>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-2.5 text-slate-400"
            />
            <input
              type="text"
              placeholder="Tìm tên bé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Children Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400">
              <th className="pb-3 font-bold">Họ tên học sinh</th>
              <th className="pb-3 font-bold">Lớp</th>
              <th className="pb-3 font-bold">Cụm phân loại</th>
              <th className="pb-3 text-center font-bold">Xu hướng</th>
              <th className="pb-3 text-center font-bold">
                Độ thuộc cụm cao nhất
              </th>
              <th className="pb-3 text-right font-bold">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChildren.map((child) => {
              const cfg =
                CLUSTER_CONFIG[child.ClusterId] || CLUSTER_CONFIG[2];
              const maxMem = child.Memberships
                ? Math.round(
                    Math.max(
                      ...Object.values(child.Memberships).map(
                        (v) => Number(v) || 0
                      )
                    ) * 100
                  )
                : 0;

              let trendBadge = (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  Duy trì
                </span>
              );
              if (child.Trend === "IMPROVED") {
                trendBadge = (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <TrendingUp size={11} /> Tiến bộ
                  </span>
                );
              } else if (child.Trend === "ATTENTION") {
                trendBadge = (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    <AlertTriangle size={11} /> Cần lưu ý
                  </span>
                );
              }

              return (
                <tr
                  key={child.ChildId}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="py-3 font-bold text-slate-800">
                    {child.TenHocSinh}
                  </td>
                  <td className="py-3 text-slate-600">{child.TenLop}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${cfg.bg} ${cfg.border} border`}
                      style={{ color: cfg.color }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: cfg.color }}
                      />
                      {cfg.shortName}
                    </span>
                  </td>
                  <td className="py-3 text-center">{trendBadge}</td>
                  <td className="py-3 text-center font-bold text-slate-700">
                    {maxMem}%
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectChild(child)}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                    >
                      <Eye size={12} /> Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredChildren.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Không tìm thấy học sinh phù hợp với bộ lọc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
