"use client";

import React from "react";
import { Search, Unlock, Lock, RotateCcw } from "lucide-react";

interface TaiKhoanToolbarProps {
  q: string;
  setQ: (q: string) => void;
  role: string;
  setRole: (r: string) => void;
  status: string;
  setStatus: (s: string) => void;
  filteredCount: number;
  selectedCount: number;
  onBulkUnlock: () => void;
  onBulkLock: () => void;
  onBulkReset: () => void;
}

export const TaiKhoanToolbar: React.FC<TaiKhoanToolbarProps> = ({
  q,
  setQ,
  role,
  setRole,
  status,
  setStatus,
  filteredCount,
  selectedCount,
  onBulkUnlock,
  onBulkLock,
  onBulkReset,
}) => {
  return (
    <div className="admin-card p-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="admin-input pl-10"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm tên người dùng, SĐT, Username, email, vai trò..."
          />
        </div>
        <select
          className="admin-input cursor-pointer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="ADMIN">Quản trị viên</option>
          <option value="GIAO_VIEN">Giáo viên</option>
          <option value="PHU_HUYNH">Phụ huynh</option>
        </select>
        <select
          className="admin-input cursor-pointer"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="Active">Đang hoạt động</option>
          <option value="Locked">Đang khóa</option>
          <option value="Inactive">Ngừng kích hoạt</option>
        </select>
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500 lg:justify-end">
          <span>
            Kết quả: <b>{filteredCount}</b> tài khoản
          </span>
          {selectedCount > 0 && (
            <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
              <span className="font-bold text-rose-600">
                Đã chọn ({selectedCount})
              </span>
              <button
                onClick={onBulkUnlock}
                title="Mở khóa tài khoản đã chọn"
                className="rounded-lg bg-emerald-50 p-1.5 text-emerald-600 hover:bg-emerald-100 transition cursor-pointer"
              >
                <Unlock size={14} />
              </button>
              <button
                onClick={onBulkLock}
                title="Khóa tài khoản đã chọn"
                className="rounded-lg bg-amber-50 p-1.5 text-amber-600 hover:bg-amber-100 transition cursor-pointer"
              >
                <Lock size={14} />
              </button>
              <button
                onClick={onBulkReset}
                title="Đặt lại mật khẩu cho các tài khoản đã chọn"
                className="rounded-lg bg-blue-50 p-1.5 text-blue-600 hover:bg-blue-100 transition cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
