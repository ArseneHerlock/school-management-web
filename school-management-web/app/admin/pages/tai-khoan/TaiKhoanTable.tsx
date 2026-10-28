'use client'

import React from 'react'
import { CheckSquare, Square, RotateCcw, Lock, Unlock } from 'lucide-react'
import { UserAccount } from './types'
import Pagination from '@/app/admin/components/shared/Pagination'

interface TaiKhoanTableProps {
  rows: UserAccount[]
  totalItems: number
  selected: string[]
  allOnPage: boolean
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  onToggle: (id: string) => void
  onToggleAll: () => void
  onChangeRole: (id: string, role: string) => void
  onChangeStatus: (id: string, status: string) => void
  onResetPassword: (id: string) => void
}

export const TaiKhoanTable: React.FC<TaiKhoanTableProps> = ({
  rows,
  totalItems,
  selected,
  allOnPage,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onToggle,
  onToggleAll,
  onChangeRole,
  onChangeStatus,
  onResetPassword,
}) => {
  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return (
          <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
            Quản trị viên
          </span>
        )
      case 'GIAO_VIEN':
        return (
          <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-700">
            Giáo viên
          </span>
        )
      case 'PHU_HUYNH':
        return (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
            Phụ huynh
          </span>
        )
      default:
        return (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
            {roleName}
          </span>
        )
    }
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10">
                <button onClick={onToggleAll} className="cursor-pointer">
                  {allOnPage ? <CheckSquare size={17} /> : <Square size={17} />}
                </button>
              </th>
              <th>Người sở hữu (Họ và tên)</th>
              <th>Tên đăng nhập (Username)</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Mật khẩu</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>
                  <button onClick={() => onToggle(x.id)} className="cursor-pointer">
                    {selected.includes(x.id) ? (
                      <CheckSquare size={17} className="text-emerald-600" />
                    ) : (
                      <Square size={17} className="text-slate-300" />
                    )}
                  </button>
                </td>

                <td>
                  <b className="text-slate-900 font-bold block text-sm">{x.displayName}</b>
                  {x.phone && <div className="text-xs text-slate-500 font-medium">SĐT: {x.phone}</div>}
                </td>

                <td>
                  <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-200">
                    {x.userName}
                  </span>
                  {x.phone && x.userName !== x.phone && (
                    <div className="text-[11px] text-slate-400 mt-0.5">Hoặc SĐT: {x.phone}</div>
                  )}
                </td>

                <td>{x.email || '—'}</td>

                <td>
                  <div className="flex items-center gap-2">
                    {getRoleBadge(x.roles[0] || 'PHU_HUYNH')}
                    <select
                      className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold outline-none"
                      value={x.roles[0] || 'PHU_HUYNH'}
                      onChange={(e) => onChangeRole(x.id, e.target.value)}
                    >
                      <option value="ADMIN">Quản trị viên</option>
                      <option value="GIAO_VIEN">Giáo viên</option>
                      <option value="PHU_HUYNH">Phụ huynh</option>
                    </select>
                  </div>
                </td>

                <td>
                  <span className={`status-pill ${x.status === 'Active' ? 'status-ok' : 'status-off'}`}>
                    {x.status === 'Active' ? 'Đang hoạt động' : 'Đang khóa'}
                  </span>
                </td>

                <td>
                  {x.mustChangePassword ? (
                    <span className="status-pill status-warn">Yêu cầu đổi</span>
                  ) : (
                    <span className="text-xs text-slate-400">Đã kích hoạt</span>
                  )}
                </td>

                <td>
                  <div className="flex justify-end gap-1.5">
                    <button
                      className="admin-btn-small cursor-pointer"
                      title="Reset mật khẩu"
                      onClick={() => onResetPassword(x.id)}
                    >
                      <RotateCcw size={14} /> Reset MK
                    </button>
                    <button
                      className={`admin-btn-small cursor-pointer ${
                        x.status === 'Active'
                          ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                          : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                      }`}
                      title={x.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      onClick={() =>
                        onChangeStatus(x.id, x.status === 'Active' ? 'Locked' : 'Active')
                      }
                    >
                      {x.status === 'Active' ? <Lock size={14} /> : <Unlock size={14} />}
                      <span>{x.status === 'Active' ? 'Khóa' : 'Mở'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={8} className="py-14 text-center text-slate-400">
                  Không tìm thấy tài khoản nào phù hợp với bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
