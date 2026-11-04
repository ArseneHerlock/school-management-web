"use client";

import React from "react";
import { CheckSquare, Square, RotateCcw, Lock, Unlock } from "lucide-react";
import { UserAccount } from "../types";
import Pagination from "@/app/admin/components/shared/Pagination";

interface TaiKhoanTableProps {
  rows: UserAccount[];
  totalItems: number;
  selected: string[];
  allOnPage: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onChangeRole: (id: string, role: string) => void;
  onChangeStatus: (id: string, status: string) => void;
  onResetPassword: (id: string) => void;
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
      case "ADMIN":
        return (
          <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
            Quản trị viên
          </span>
        );
      case "GIAO_VIEN":
        return (
          <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
            Giáo viên
          </span>
        );
      case "PHU_HUYNH":
        return (
          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            Phụ huynh
          </span>
        );
      default:
        return (
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
            {roleName}
          </span>
        );
    }
  };

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <button
                  onClick={onToggleAll}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {allOnPage && rows.length > 0 ? (
                    <CheckSquare size={16} className="text-rose-600" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th>Người dùng</th>
              <th>Tên đăng nhập (Username)</th>
              <th>Số điện thoại / Email</th>
              <th>Vai trò (Roles)</th>
              <th>Trạng thái</th>
              <th>Mật khẩu ban đầu</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const isChecked = selected.includes(u.id);
              return (
                <tr
                  key={u.id}
                  className={isChecked ? "bg-rose-50/30" : undefined}
                >
                  <td className="text-center">
                    <button
                      onClick={() => onToggle(u.id)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {isChecked ? (
                        <CheckSquare size={16} className="text-rose-600" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="font-bold text-slate-900">
                      {u.displayName}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      ID: {u.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {u.userName}
                    </span>
                  </td>
                  <td>
                    <div className="text-xs font-semibold text-slate-700">
                      {u.phone || "—"}
                    </div>
                    <div className="text-xs text-slate-400">{u.email || "—"}</div>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1 items-center">
                      {u.roles.map((r) => (
                        <React.Fragment key={r}>{getRoleBadge(r)}</React.Fragment>
                      ))}
                      <select
                        className="text-xs border border-slate-200 rounded px-1 py-0.5 text-slate-500 bg-white hover:border-slate-300"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            onChangeRole(u.id, e.target.value);
                          }
                        }}
                      >
                        <option value="">+ Đổi quyền</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="GIAO_VIEN">Giáo viên</option>
                        <option value="PHU_HUYNH">Phụ huynh</option>
                      </select>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        u.status === "Active" ? "status-ok" : "status-bad"
                      }`}
                    >
                      {u.status === "Active" ? "Hoạt động" : "Bị khóa"}
                    </span>
                  </td>
                  <td>
                    {u.mustChangePassword ? (
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        Chưa đổi mật khẩu
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Đã kích hoạt</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {u.status === "Active" ? (
                        <button
                          onClick={() => onChangeStatus(u.id, "Locked")}
                          className="icon-btn"
                          title="Khóa tài khoản"
                        >
                          <Lock size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onChangeStatus(u.id, "Active")}
                          className="icon-btn"
                          title="Mở khóa tài khoản"
                        >
                          <Unlock size={15} className="text-emerald-600" />
                        </button>
                      )}
                      <button
                        onClick={() => onResetPassword(u.id)}
                        className="icon-btn"
                        title="Đặt lại mật khẩu"
                      >
                        <RotateCcw size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  Không tìm thấy tài khoản người dùng nào phù hợp.
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
        pageSizeOptions={[5, 10, 20, 50]}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
