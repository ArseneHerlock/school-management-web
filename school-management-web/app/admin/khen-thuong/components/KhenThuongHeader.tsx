"use client";

import React from "react";
import { Award, Calendar, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

interface KhenThuongHeaderProps {
  schoolYear: string;
  setSchoolYear: (val: string) => void;
  semester: number;
  setSemester: (val: number) => void;
  loading: boolean;
  onRefresh: () => void;
  error?: string;
  successMsg?: string;
}

export function KhenThuongHeader({
  schoolYear,
  setSchoolYear,
  semester,
  setSemester,
  loading,
  onRefresh,
  error,
  successMsg,
}: KhenThuongHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Khen thưởng cuối năm
          </h1>
        </div>

        {/* School Year & Semester Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <Calendar size={15} className="text-slate-400" />
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none"
            >
              <option value="2026-2027">Năm học 2026-2027</option>
              <option value="2025-2026">Năm học 2025-2026</option>
              <option value="2024-2025">Năm học 2024-2025</option>
            </select>
            <span className="text-xs text-slate-300">|</span>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none"
            >
              <option value={0}>Cả năm học</option>
              <option value={1}>Học kỳ 1</option>
              <option value={2}>Học kỳ 2</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-amber-600" : ""} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}
    </div>
  );
}
