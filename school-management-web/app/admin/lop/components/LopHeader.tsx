"use client";

import React from "react";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { Grade } from "../types";

interface LopHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  selectedGradeFilter: string;
  onGradeFilterChange: (val: string) => void;
  gradesList: Grade[];
  successMessage: string;
  onClearSuccess: () => void;
  errorMessage: string;
  onClearError: () => void;
}

export function LopHeader({
  isLoading,
  onRefresh,
  onOpenCreateModal,
  searchKeyword,
  onSearchChange,
  selectedGradeFilter,
  onGradeFilterChange,
  gradesList,
  successMessage,
  onClearSuccess,
  errorMessage,
  onClearError,
}: LopHeaderProps) {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="admin-title">Quản lý lớp học</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="admin-btn admin-btn-secondary cursor-pointer"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Đang tải..." : "Làm mới"}</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="admin-btn admin-btn-primary cursor-pointer"
          >
            <Plus size={16} />
            <span>Thêm lớp mới</span>
          </button>
        </div>
      </header>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex justify-between items-center">
          <span>{successMessage}</span>
          <button onClick={onClearSuccess}>
            <X size={14} />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex justify-between items-center">
          <span>{errorMessage}</span>
          <button onClick={onClearError}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="admin-card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-9 text-xs"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm theo tên lớp, năm học, tên giáo viên..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Khối:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => onGradeFilterChange(e.target.value)}
              className="admin-input py-1.5 text-xs font-semibold w-auto bg-white"
            >
              <option value="ALL">Tất cả các khối</option>
              {gradesList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tenKhoi}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
