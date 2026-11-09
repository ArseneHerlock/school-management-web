"use client";

import React from "react";
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  UserCheck,
  Trash2,
  Eye,
} from "lucide-react";
import { EnrollmentApp } from "../types";

interface TuyenSinhTableProps {
  filteredApps: EnrollmentApp[];
  totalAppsCount: number;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  selectedIds: Set<string>;
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onViewDetail: (app: EnrollmentApp) => void;
  onApprove: (app: EnrollmentApp) => void;
  onDelete: (app: EnrollmentApp) => void;
  onBulkApproveOpen: () => void;
  onBulkReject: () => void;
  onBulkDeleteOpen: () => void;
}

export function TuyenSinhTable({
  filteredApps,
  totalAppsCount,
  searchKeyword,
  setSearchKeyword,
  statusFilter,
  setStatusFilter,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onViewDetail,
  onApprove,
  onDelete,
  onBulkApproveOpen,
  onBulkReject,
  onBulkDeleteOpen,
}: TuyenSinhTableProps) {
  const isAllSelected =
    filteredApps.length > 0 && selectedIds.size === filteredApps.length;

  return (
    <div className="space-y-4">
      {/* Filter and Multi-select Actions Bar */}
      <div className="admin-card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative max-w-md flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-9 text-xs"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên trẻ, tên cha mẹ, số điện thoại..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Trạng thái:
            </span>
            <select
              className="admin-input py-2 text-xs font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">
                -- Tất cả trạng thái ({totalAppsCount}) --
              </option>
              <option value="ChoDuyet">Chờ xét duyệt</option>
              <option value="DaNhapHoc">Đã nhập học</option>
              <option value="TuChoi">Từ chối</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar when 1+ selected */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs">
            <span className="font-bold text-indigo-900">
              Đã chọn <b>{selectedIds.size}</b> hồ sơ:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onBulkApproveOpen}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Duyệt nhập học hàng loạt
              </button>
              <button
                type="button"
                onClick={onBulkReject}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition cursor-pointer"
              >
                Từ chối hàng loạt
              </button>
              <button
                type="button"
                onClick={onBulkDeleteOpen}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 size={13} /> Xóa đã chọn
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table View */}
      <div className="admin-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#2d3748] text-white font-serif uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 border-r border-slate-600 w-10 text-center">
                  <button
                    type="button"
                    onClick={onToggleSelectAll}
                    className="p-1 rounded text-white hover:text-sky-300 transition"
                  >
                    {isAllSelected ? (
                      <CheckSquare size={16} />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Tên Trẻ
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Ngày Sinh / GT
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Khối Đăng Ký
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Phụ Huynh
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600">
                  Điện Thoại
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Năm Học
                </th>
                <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">
                  Trạng Thái
                </th>
                <th className="py-3.5 px-4 font-bold text-center w-36">
                  Tùy Chọn
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-serif">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Filter className="mx-auto mb-2 text-slate-300" />
                    Chưa có hồ sơ đăng ký nào phù hợp. Hãy gửi link cho phụ
                    huynh điền đơn!
                  </td>
                </tr>
              ) : (
                filteredApps.map((a, idx) => {
                  const isChecked = selectedIds.has(a.Id);
                  const parentName = a.TenMe
                    ? `Mẹ: ${a.TenMe}`
                    : a.TenCha
                      ? `Cha: ${a.TenCha}`
                      : "—";
                  const phone =
                    a.DienThoaiLienHe || a.DienThoaiMe || a.DienThoaiCha || "—";

                  return (
                    <tr
                      key={a.Id}
                      className={`hover:bg-sky-50/60 transition-colors ${
                        isChecked
                          ? "bg-sky-50/80"
                          : idx % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-3 text-center border-r border-slate-100">
                        <button
                          type="button"
                          onClick={() => onToggleSelectOne(a.Id)}
                          className="p-1 rounded text-slate-500 hover:text-sky-600 transition"
                        >
                          {isChecked ? (
                            <CheckSquare size={16} className="text-sky-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                        {a.TenTre}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap font-sans">
                        {a.NgaySinh || "—"} ·{" "}
                        <span className="font-bold">{a.GioiTinh || "Nam"}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                        <span className="font-bold text-sky-800">
                          {a.KhoiMongMuon || "Khối Mầm"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                        {parentName}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap font-sans">
                        {phone}
                      </td>
                      <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap font-sans">
                        {a.NamHoc || "2026 - 2027"}
                      </td>
                      <td className="py-3 px-4 text-center border-r border-slate-100 whitespace-nowrap">
                        {a.TrangThai === "DaNhapHoc" ? (
                          <span className="status-pill status-ok text-[10px]">
                            Đã nhập học
                          </span>
                        ) : a.TrangThai === "TuChoi" ? (
                          <span className="status-pill status-error text-[10px]">
                            Từ chối
                          </span>
                        ) : (
                          <span className="status-pill status-warn text-[10px]">
                            Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewDetail(a)}
                            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            title="Xem đơn xin nhập học chi tiết"
                          >
                            <Eye size={13} />
                          </button>

                          {a.TrangThai !== "DaNhapHoc" && (
                            <button
                              type="button"
                              onClick={() => onApprove(a)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition shadow-xs cursor-pointer"
                              title="Duyệt cho bé nhập học"
                            >
                              Duyệt
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDelete(a)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
                            title="Xóa hồ sơ"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
