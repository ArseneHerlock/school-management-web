"use client";

import React from "react";
import { Search, Plus, RefreshCw, X } from "lucide-react";
import { Position, Cls } from "../types";

interface NhanSuHeaderProps {
  onRefresh: () => void;
  onOpenCreate: () => void;
  notificationMessage: string;
  onClearNotification: () => void;
  searchKeyword: string;
  onSearchChange: (val: string) => void;
  positionFilter: string;
  onPositionFilterChange: (val: string) => void;
  classFilter: string;
  onClassFilterChange: (val: string) => void;
  positionsList: Position[];
  classesList: Cls[];
}

export function NhanSuHeader({
  onRefresh,
  onOpenCreate,
  notificationMessage,
  onClearNotification,
  searchKeyword,
  onSearchChange,
  positionFilter,
  onPositionFilterChange,
  classFilter,
  onClassFilterChange,
  positionsList,
  classesList,
}: NhanSuHeaderProps) {
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="admin-title">Quản lý nhân sự</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={onRefresh} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} /> Làm mới
          </button>
          <button onClick={onOpenCreate} className="admin-btn admin-btn-primary">
            <Plus size={17} /> Thêm nhân sự
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
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="admin-input pl-10"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tên, mã nhân sự, điện thoại, email..."
            />
          </div>

          <select
            className="admin-input"
            value={positionFilter}
            onChange={(e) => onPositionFilterChange(e.target.value)}
          >
            <option value="ALL">Tất cả vị trí</option>
            {positionsList.map((p) => (
              <option key={p.positionId} value={p.positionId}>
                {p.positionName}
              </option>
            ))}
          </select>

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
        </div>
      </div>
    </div>
  );
}
