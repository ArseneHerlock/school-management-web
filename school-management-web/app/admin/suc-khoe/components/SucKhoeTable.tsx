"use client";

import React from "react";
import { Calendar, Search, LineChart as ChartIcon, Filter, RotateCcw } from "lucide-react";
import Pagination from "@/app/admin/components/shared/Pagination";
import { ClassRow, HealthCategoryFilter, CATEGORY_NAMES, WHO_9_CATEGORIES } from "../types";
import { HealthStudentRow } from "../healthAggregations";

interface SucKhoeTableProps {
  filtered: HealthStudentRow[];
  paginated: HealthStudentRow[];
  classes: ClassRow[];
  availableQuarters?: string[];
  q: string;
  setQ: (val: string) => void;
  quarterFilter: string;
  setQuarterFilter: (val: string) => void;
  classFilter: string;
  setClassFilter: (val: string) => void;
  categoryFilter?: HealthCategoryFilter;
  setCategoryFilter?: (val: HealthCategoryFilter) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  onOpen: (row: any) => void;
}

export const SucKhoeTable: React.FC<SucKhoeTableProps> = ({
  filtered,
  paginated,
  classes,
  availableQuarters = [],
  q,
  setQ,
  quarterFilter,
  setQuarterFilter,
  classFilter,
  setClassFilter,
  categoryFilter = "ALL",
  setCategoryFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onOpen,
}) => {
  function getCategoryBadge(s: HealthStudentRow) {
    if (!s.health?.canNang) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Chưa có số đo
        </span>
      );
    }
    if (!s.canCanThiep) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✓ Đạt chuẩn WHO
        </span>
      );
    }
    if (s.haz != null && s.haz < -3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          Thấp còi nặng
        </span>
      );
    }
    if (s.haz != null && s.haz < -2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Thấp còi
        </span>
      );
    }
    if (s.waz != null && s.waz < -3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          Nhẹ cân nặng
        </span>
      );
    }
    if (s.waz != null && s.waz < -2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Nhẹ cân
        </span>
      );
    }
    if (s.whz != null && s.whz < -3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
          Gầy còm nặng
        </span>
      );
    }
    if (s.whz != null && s.whz < -2) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
          Gầy còm
        </span>
      );
    }
    if ((s.whz != null && s.whz > 3) || (s.waz != null && s.waz > 3)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-800 border border-pink-200">
          Béo phì
        </span>
      );
    }
    if ((s.whz != null && s.whz > 2) || (s.waz != null && s.waz > 2)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
          Thừa cân
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        {s.trangThaiTheTrang}
      </span>
    );
  }

  function handleResetFilters() {
    setQ("");
    setQuarterFilter("");
    setClassFilter("");
    setCategoryFilter?.("ALL");
  }

  const hasActiveFilters = Boolean(
    q || quarterFilter || classFilter || categoryFilter !== "ALL"
  );

  return (
    <div className="space-y-4">
      {/* Banner đang lọc theo nhóm thể trạng */}
      {categoryFilter !== "ALL" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs text-indigo-900 shadow-2xs">
          <span className="font-bold flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse" />
            Đang lọc danh sách học sinh:{" "}
            <strong className="text-indigo-950 font-black text-sm">
              {CATEGORY_NAMES[categoryFilter]}
            </strong>{" "}
            ({filtered.length} bé)
          </span>
          <button
            type="button"
            onClick={() => setCategoryFilter?.("ALL")}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-950 bg-white border border-indigo-200 px-3 py-1 rounded-xl shadow-2xs hover:bg-indigo-50 transition cursor-pointer"
          >
            ✕ Bỏ lọc nhóm thể trạng
          </button>
        </div>
      )}

      {/* Toolbar bộ lọc tìm kiếm */}
      <div className="admin-card p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_210px_200px_200px]">
          {/* Ô tìm kiếm */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10 w-full"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm theo tên học sinh, lớp, khối..."
            />
          </div>

          {/* Chọn 9 Phân loại Thể trạng */}
          <select
            className="admin-input font-bold"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter?.(e.target.value as HealthCategoryFilter)}
          >
            <option value="ALL">Tất cả thể trạng (9 nhóm)</option>
            {WHO_9_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
            <option value="CHUA_DO">Chưa có số đo</option>
          </select>

          {/* Chọn Đợt / Quý Khám */}
          <select
            className="admin-input font-semibold"
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
          >
            <option value="">Tất cả đợt khám (Số đo mới nhất)</option>
            {availableQuarters.map((qVal) => (
              <option key={qVal} value={qVal}>
                Đợt khám {qVal}
              </option>
            ))}
          </select>

          {/* Chọn Lớp học */}
          <select
            className="admin-input"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">Tất cả lớp học</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-indigo-700 hover:text-indigo-950 underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} />
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Bảng danh sách học sinh */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Khối / Lớp</th>
                <th>Chiều cao / Cân nặng</th>
                <th>Chiều cao / Tuổi</th>
                <th>Cân nặng / Tuổi</th>
                <th>Thể trạng</th>
                <th>Kết luận thể trạng</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="text-sm font-bold text-slate-700">
                        Không tìm thấy học sinh phù hợp với bộ lọc hiện tại.
                      </p>
                      {categoryFilter !== "ALL" && (
                        <p className="text-xs text-slate-500">
                          Nhóm thể trạng <b>{CATEGORY_NAMES[categoryFilter]}</b> hiện không có học sinh nào.
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        <RotateCcw size={13} />
                        Xem tất cả học sinh
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td>
                      <b>{s.tenHocSinh}</b>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} /> {s.quarterLabel}
                      </div>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-700">
                        {s.className}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {s.gradeName}
                      </div>
                    </td>
                    <td>
                      {s.health?.chieuCao && s.health?.canNang ? (
                        <span className="font-semibold text-slate-800">
                          {s.health.chieuCao} cm · {s.health.canNang} kg
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">
                          Chưa có số đo
                        </span>
                      )}
                    </td>
                    <td>
                      {s.haz != null ? (
                        <span className={`font-semibold ${s.haz < -2 ? "text-blue-700 font-bold" : "text-slate-700"}`}>
                          {s.hazLabel}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td>
                      {s.waz != null ? (
                        <span className={`font-semibold ${s.waz < -2 || s.waz > 2 ? "text-amber-700 font-bold" : "text-slate-700"}`}>
                          {s.wazLabel}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td>
                      {s.whz != null ? (
                        <span className={`font-semibold ${s.whz < -2 || s.whz > 2 ? "text-rose-700 font-bold" : "text-slate-700"}`}>
                          {s.whzLabel}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td>
                      {getCategoryBadge(s)}
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => onOpen(s)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition shadow-2xs cursor-pointer"
                      >
                        <ChartIcon size={13} />
                        Biểu đồ & Khám
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Hiển thị{" "}
            <b>
              {filtered.length > 0
                ? (currentPage - 1) * itemsPerPage + 1
                : 0}
            </b>{" "}
            -{" "}
            <b>
              {Math.min(currentPage * itemsPerPage, filtered.length)}
            </b>{" "}
            trong tổng số <b>{filtered.length}</b> học sinh
          </span>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filtered.length / itemsPerPage))}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default SucKhoeTable;
