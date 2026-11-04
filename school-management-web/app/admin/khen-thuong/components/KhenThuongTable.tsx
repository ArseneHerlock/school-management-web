"use client";

import React from "react";
import {
  Search,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import { SchoolAward } from "../types";

interface KhenThuongTableProps {
  awards: SchoolAward[];
  filteredAwards: SchoolAward[];
  classList: string[];
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  submitting: boolean;
  onApproveAll: () => void;
  onBatchPrint: () => void;
  onPreview: (award: SchoolAward) => void;
}

export function KhenThuongTable({
  awards,
  filteredAwards,
  classList,
  selectedClass,
  setSelectedClass,
  selectedStatus,
  setSelectedStatus,
  searchQuery,
  setSearchQuery,
  submitting,
  onApproveAll,
  onBatchPrint,
  onPreview,
}: KhenThuongTableProps) {
  const approvedFilteredCount = filteredAwards.filter(
    (a) => a.Status === "APPROVED"
  ).length;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      {/* Action & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter by class */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả lớp học</option>
            {classList.map((c) => (
              <option key={c} value={c}>
                Lớp {c}
              </option>
            ))}
          </select>

          {/* Filter by status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="APPROVED">Đã phê duyệt</option>
            <option value="SUBMITTED">Chờ duyệt</option>
            <option value="DRAFT">Dự thảo</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm bé, lớp, danh hiệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Admin Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBatchPrint}
            disabled={approvedFilteredCount === 0}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
          >
            <Printer size={14} className="text-slate-600" />
            In Giấy Khen đã duyệt ({approvedFilteredCount})
          </button>

          <button
            onClick={onApproveAll}
            disabled={submitting || awards.length === 0}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50"
          >
            <ShieldCheck size={15} />
            {submitting ? "Đang phê duyệt..." : "Phê duyệt khen thưởng toàn trường"}
          </button>
        </div>
      </div>

      {/* Awards Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400">
              <th className="pb-3 font-bold">Học sinh</th>
              <th className="pb-3 font-bold">Lớp</th>
              <th className="pb-3 text-center font-bold">1. Chuyên cần</th>
              <th className="pb-3 font-bold">2. Sức khỏe Quý</th>
              <th className="pb-3 text-center font-bold">3. Hoạt động</th>
              <th className="pb-3 font-bold">Danh hiệu thi đua</th>
              <th className="pb-3 text-center font-bold">Mã số giấy khen</th>
              <th className="pb-3 text-center font-bold">Trạng thái</th>
              <th className="pb-3 text-right font-bold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAwards.map((item) => {
              const isApproved = item.Status === "APPROVED";
              return (
                <tr key={item.Id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-800">{item.TenHocSinh}</td>
                  <td className="py-3 text-slate-600">{item.TenLop}</td>
                  <td className="py-3 text-center font-semibold text-slate-700">
                    {item.AttendanceRate ? `${item.AttendanceRate}%` : "95%"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.HealthStatus?.includes("chuẩn")
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.HealthStatus || "Đạt chuẩn"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="font-bold text-purple-700 text-[11px]">
                      {item.ActivityPassRate ? `${item.ActivityPassRate}%` : "85%"}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-bold text-amber-700">{item.AwardTitle}</span>
                  </td>
                  <td className="py-3 text-center">
                    {item.CertificateCode ? (
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                        {item.CertificateCode}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        <CheckCircle2 size={11} /> Đã phê duyệt
                      </span>
                    ) : item.Status === "SUBMITTED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Clock size={11} /> Chờ duyệt
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        Dự thảo
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onPreview(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                    >
                      <Eye size={12} /> Xem Giấy Khen
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredAwards.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Không có danh sách khen thưởng nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
