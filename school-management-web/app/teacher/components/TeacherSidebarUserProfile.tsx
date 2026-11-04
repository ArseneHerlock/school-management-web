import React from 'react';
import { LogOut } from 'lucide-react';
import { logout } from '@/services/client';

interface TeacherSidebarUserProfileProps {
  collapsed: boolean;
  mobileOpen: boolean;
  activeUserName?: string;
}

export function TeacherSidebarUserProfile({
  collapsed,
  mobileOpen,
  activeUserName,
}: TeacherSidebarUserProfileProps) {
  const initials = (activeUserName || 'GV')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(-2)
    .toUpperCase();

  return (
    <div className="shrink-0 border-t border-slate-100 p-3 bg-slate-50/50">
      <div
        className={`flex items-center gap-3 rounded-2xl bg-white p-2.5 border border-slate-200/80 shadow-2xs ${
          collapsed ? 'justify-center p-2' : ''
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700 text-xs font-black">
          {initials}
        </div>

        {(!collapsed || mobileOpen) && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-800">
              {activeUserName || 'Giáo viên phụ trách'}
            </p>
            <p className="text-[10px] font-semibold text-emerald-600">Trực tuyến</p>
          </div>
        )}

        {(!collapsed || mobileOpen) && (
          <button
            onClick={() => logout()}
            title="Đăng xuất khỏi hệ thống"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
