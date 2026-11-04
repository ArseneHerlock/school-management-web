'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { currentUser, logout } from '@/services';

interface ParentAccountTabProps {
  parentName: string;
  onClose: () => void;
}

export function ParentAccountTab({
  parentName,
  onClose,
}: ParentAccountTabProps) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="space-y-4 max-w-md mx-auto py-4 text-center">
      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
        <LogOut size={26} />
      </div>
      <div>
        <h4 className="font-extrabold text-slate-800 text-base">Thiết lập & Đăng xuất</h4>
        <p className="text-xs text-slate-500 mt-1">
          Bạn có muốn đăng xuất khỏi cổng Sổ liên lạc điện tử của trường?
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">Tên đăng nhập:</span>
          <span className="font-bold text-slate-700">
            {currentUser()?.username || 'phuhuynh'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Phụ huynh:</span>
          <span className="font-bold text-slate-700">{parentName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Trạng thái:</span>
          <span className="font-bold text-emerald-600">Đang hoạt động</span>
        </div>
      </div>

      <div className="pt-2 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
        >
          Ở lại phiên làm việc
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <LogOut size={14} />
          Đăng xuất ngay
        </button>
      </div>
    </div>
  );
}
