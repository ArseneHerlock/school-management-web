"use client";

import React from "react";
import { Users, ShieldCheck, Lock, KeyRound } from "lucide-react";
import { UserAccount } from "../types";

interface TaiKhoanStatsProps {
  accounts: UserAccount[];
}

export default function TaiKhoanStats({ accounts }: TaiKhoanStatsProps) {
  const total = accounts.length;
  const active = accounts.filter((item) => item.status === "Active").length;
  const locked = accounts.filter((item) => item.status !== "Active").length;
  const mustChange = accounts.filter((item) => item.mustChangePassword).length;

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Tổng tài khoản</p>
            <p className="mt-1 text-2xl font-black">{total}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Đang hoạt động</p>
            <p className="mt-1 text-2xl font-black">{active}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <Lock size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Đang khóa</p>
            <p className="mt-1 text-2xl font-black">{locked}</p>
          </div>
        </div>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3">
          <div className="admin-icon">
            <KeyRound size={18} />
          </div>
          <div>
            <p className="text-xs text-slate-400">Yêu cầu đổi mật khẩu</p>
            <p className="mt-1 text-2xl font-black">{mustChange}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
