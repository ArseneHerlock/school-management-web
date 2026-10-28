'use client'

import React from 'react'
import { Search, Unlock, Lock, RotateCcw } from 'lucide-react'

interface TaiKhoanToolbarProps {
  q: string
  setQ: (q: string) => void
  role: string
  setRole: (r: string) => void
  status: string
  setStatus: (s: string) => void
  filteredCount: number
  selectedCount: number
  onBulkUnlock: () => void
  onBulkLock: () => void
  onBulkReset: () => void
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
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
        </select>
        <span className="flex items-center justify-center rounded-xl bg-emerald-50 px-4 text-sm font-bold text-emerald-700">
          {filteredCount} tài khoản
        </span>
      </div>

      {selectedCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-emerald-50 p-3">
          <b className="text-sm text-emerald-800">Đã chọn {selectedCount} tài khoản:</b>
          <button onClick={onBulkUnlock} className="admin-btn-small cursor-pointer">
            <Unlock size={14} /> Mở khóa hàng loạt
          </button>
          <button onClick={onBulkLock} className="admin-btn-small cursor-pointer">
            <Lock size={14} /> Khóa hàng loạt
          </button>
          <button onClick={onBulkReset} className="admin-btn-small cursor-pointer">
            <RotateCcw size={14} /> Reset mật khẩu hàng loạt
          </button>
        </div>
      )}
    </div>
  )
}
