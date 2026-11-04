"use client";

import React from "react";
import {
  FileCheck,
  Layers,
  FileSpreadsheet,
  RefreshCw,
  Eye,
  Download,
  Filter,
  School,
  Building,
  GraduationCap,
  History,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { ReportFilterState, ReportScope } from "../types";

export function ReportHeader({
  viewMode,
  onViewModeChange,
  loading,
  onRefresh,
  onOpenPreview,
  onDownloadPdf,
  selectedCount,
}: {
  viewMode: "class-reports" | "batch" | "detail";
  onViewModeChange: (m: "class-reports" | "batch" | "detail") => void;
  loading: boolean;
  onRefresh: () => void;
  onOpenPreview: () => void;
  onDownloadPdf: () => void;
  selectedCount: number;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase mb-1.5 border border-blue-100">
          <FileCheck size={13} />
          <span>Báo Cáo Nghiệp Vụ Mầm Non</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Trung Tâm Báo Cáo Định Kỳ & Bán Trú Học Đường
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tiếp nhận báo cáo các lớp, tổng hợp số liệu cấp trường và xuất in văn bản hành chính mầm non.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => onViewModeChange("class-reports")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "class-reports" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building size={13} />
            <span>Báo cáo từ Giáo viên</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("batch")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "batch" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers size={13} />
            <span>Báo cáo Toàn trường</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("detail")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === "detail" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet size={13} />
            <span>Chi tiết số liệu</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer"
        >
          <RefreshCw size={13} className={loading ? "animate-spin text-blue-600" : ""} />
          <span>Đồng bộ</span>
        </button>
        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 text-xs font-bold text-sky-700 shadow-2xs cursor-pointer"
        >
          <Eye size={14} />
          <span>Xem trước</span>
        </button>
        <button
          type="button"
          onClick={onDownloadPdf}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm cursor-pointer"
        >
          <Download size={14} />
          <span>Xuất PDF ({selectedCount})</span>
        </button>
      </div>
    </div>
  );
}

export function ReportFilters({
  filters,
  onChangeFilters,
  grades,
  classes,
  monthsWithData,
}: {
  filters: ReportFilterState;
  onChangeFilters: (u: (p: ReportFilterState) => ReportFilterState) => void;
  grades: any[];
  classes: any[];
  monthsWithData: Set<number>;
}) {
  const { scope, selectedGradeId, selectedClassId, selectedMonth, selectedYear, periodScope, searchKeyword } = filters;

  const setScope = (s: ReportScope) => {
    onChangeFilters((p) => ({
      ...p,
      scope: s,
      selectedGradeId: s === "school" ? "all" : p.selectedGradeId,
      selectedClassId: s !== "class" ? "all" : p.selectedClassId,
    }));
  };

  const stepMonth = (d: number) => {
    let m = selectedMonth + d;
    let y = selectedYear;
    if (m < 1) { m = 12; y -= 1; } else if (m > 12) { m = 1; y += 1; }
    onChangeFilters((p) => ({ ...p, selectedMonth: m, selectedYear: y, periodScope: "month" }));
  };

  const filteredClasses = classes.filter((c) => selectedGradeId === "all" || String(c.khoiId || c.gradeId) === String(selectedGradeId));

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Filter size={14} className="text-blue-600" /> Phạm vi:
          </span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setScope("school")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 ${
                scope === "school" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
              }`}
            >
              <School size={13} /> Toàn trường
            </button>
            <button
              type="button"
              onClick={() => setScope("grade")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 ${
                scope === "grade" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
              }`}
            >
              <Building size={13} /> Từng khối
            </button>
            <button
              type="button"
              onClick={() => setScope("class")}
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1 ${
                scope === "class" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
              }`}
            >
              <GraduationCap size={13} /> Từng lớp
            </button>
          </div>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => onChangeFilters((p) => ({ ...p, periodScope: "month" }))}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
              periodScope === "month" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
            }`}
          >
            Theo tháng (T{selectedMonth}/{selectedYear})
          </button>
          <button
            type="button"
            onClick={() => onChangeFilters((p) => ({ ...p, periodScope: "cumulative" }))}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
              periodScope === "cumulative" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-600"
            }`}
          >
            Lũy kế cả năm
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
          <History size={14} className="text-blue-600" />
          <span>Tháng ({selectedYear}):</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <button type="button" onClick={() => stepMonth(-1)} className="p-1 rounded bg-white border border-slate-200">
            <ChevronLeft size={13} />
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChangeFilters((p) => ({ ...p, selectedMonth: m, periodScope: "month" }))}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                selectedMonth === m && periodScope === "month"
                  ? "bg-blue-600 text-white"
                  : monthsWithData.has(m)
                    ? "bg-white text-slate-800 border border-emerald-300"
                    : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              T{m}
            </button>
          ))}
          <button type="button" onClick={() => stepMonth(1)} className="p-1 rounded bg-white border border-slate-200">
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-600">Khối mầm non</label>
          <select
            value={selectedGradeId}
            onChange={(e) => onChangeFilters((p) => ({ ...p, selectedGradeId: e.target.value, selectedClassId: "all" }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="all">Tất cả các khối</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.tenKhoi || g.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-600">Nhóm lớp</label>
          <select
            value={selectedClassId}
            onChange={(e) => onChangeFilters((p) => ({ ...p, selectedClassId: e.target.value }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="all">Tất cả nhóm lớp ({filteredClasses.length})</option>
            {filteredClasses.map((c) => <option key={c.id} value={c.id}>{c.tenLop || c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-600">Năm học</label>
          <select
            value={selectedYear}
            onChange={(e) => onChangeFilters((p) => ({ ...p, selectedYear: Number(e.target.value) }))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value={2025}>Năm 2025</option>
            <option value={2026}>Năm 2026</option>
            <option value={2027}>Năm 2027</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-600">Tìm kiếm nhanh</label>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Tên học sinh..."
              value={searchKeyword}
              onChange={(e) => onChangeFilters((p) => ({ ...p, searchKeyword: e.target.value }))}
              className="w-full bg-transparent text-xs text-slate-800 outline-none"
            />
            {searchKeyword && (
              <button type="button" onClick={() => onChangeFilters((p) => ({ ...p, searchKeyword: "" }))}>
                <X size={13} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
