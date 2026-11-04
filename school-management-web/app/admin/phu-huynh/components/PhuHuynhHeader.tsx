"use client";

import React from "react";
import { Search, Plus, RefreshCw, X } from "lucide-react";
import { Cls, Grade } from "../types";

interface PhuHuynhHeaderProps {
  onRefresh: () => void;
  onOpenCreate: () => void;
  notificationMessage: string;
  onClearNotification: () => void;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  classFilter: string;
  onClassFilterChange: (val: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (val: string) => void;
  accountFilter: string;
  onAccountFilterChange: (val: string) => void;
  classesList: Cls[];
  gradesList: Grade[];
}

export function PhuHuynhHeader({
  onRefresh,
  onOpenCreate,
  notificationMessage,
  onClearNotification,
  searchKeyword,
  onSearchChange,
  classFilter,
  onClassFilterChange,
  gradeFilter,
  onGradeFilterChange,
  accountFilter,
  onAccountFilterChange,
  classesList,
  gradesList,
}: PhuHuynhHeaderProps) {
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="admin-eyebrow">GIA ĐÌNH & LIÊN KẾT</p>
          <h1 className="admin-title">Quản lý phụ huynh</h1>
          <p className="admin-subtitle">
            Hồ sơ đầy đủ, tài khoản, con đang học, lớp hiện tại và giáo viên phụ trách lớp.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onRefresh} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={onOpenCreate} className="admin-btn admin-btn-primary">
            <Plus size={17} /> Thêm phụ huynh
          </button>
        </div>
      </header>

      {notificationMessage && (
        <div className="admin-alert">
          {notificationMessage}
          <button onClick={onClearNotification}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px_180px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm phụ huynh, điện thoại, email, CCCD..."
            />
          </div>

          <select
            className="admin-input"
            value={classFilter}
            onChange={(e) => onClassFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả lớp</option>
            {classesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>

          <select
            className="admin-input"
            value={gradeFilter}
            onChange={(e) => onGradeFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả khối</option>
            {gradesList.map((g) => (
              <option key={g.id} value={g.id}>
                {g.tenKhoi}
              </option>
            ))}
          </select>

          <select
            className="admin-input"
            value={accountFilter}
            onChange={(e) => onAccountFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả tài khoản</option>
            <option value="LINKED">Đã có tài khoản</option>
            <option value="UNLINKED">Chưa có tài khoản</option>
          </select>
        </div>
      </div>
    </div>
  );
}
