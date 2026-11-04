'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  CalendarDays,
  Menu as MenuIcon,
} from 'lucide-react';

interface ParentBottomNavProps {
  pathname: string | null;
  onOpenMenu: () => void;
}

export function ParentBottomNav({
  pathname,
  onOpenMenu,
}: ParentBottomNavProps) {
  const isCustomTab = !['/parent', '/parent/attendance', '/parent/assessment', '/parent/schedule'].includes(
    pathname || ''
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
      <Link
        href="/parent"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          pathname === '/parent'
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <LayoutDashboard
          size={20}
          className={pathname === '/parent' ? 'stroke-[2.5]' : 'stroke-[1.8]'}
        />
        <span className="text-[10px] mt-0.5">Tổng quan</span>
      </Link>

      <Link
        href="/parent/attendance"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          pathname?.startsWith('/parent/attendance')
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <ClipboardCheck
          size={20}
          className={
            pathname?.startsWith('/parent/attendance')
              ? 'stroke-[2.5]'
              : 'stroke-[1.8]'
          }
        />
        <span className="text-[10px] mt-0.5">Điểm danh</span>
      </Link>

      <Link
        href="/parent/assessment"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          pathname?.startsWith('/parent/assessment')
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <Sparkles
          size={20}
          className={
            pathname?.startsWith('/parent/assessment')
              ? 'stroke-[2.5]'
              : 'stroke-[1.8]'
          }
        />
        <span className="text-[10px] mt-0.5">Đánh giá</span>
      </Link>

      <Link
        href="/parent/schedule"
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
          pathname?.startsWith('/parent/schedule')
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <CalendarDays
          size={20}
          className={
            pathname?.startsWith('/parent/schedule')
              ? 'stroke-[2.5]'
              : 'stroke-[1.8]'
          }
        />
        <span className="text-[10px] mt-0.5">Lịch học</span>
      </Link>

      <button
        onClick={onOpenMenu}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
          isCustomTab
            ? 'text-indigo-600 font-extrabold'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <div className="relative">
          <MenuIcon
            size={20}
            className={isCustomTab ? 'stroke-[2.5]' : 'stroke-[1.8]'}
          />
          {isCustomTab && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600" />
          )}
        </div>
        <span className="text-[10px] mt-0.5">Menu</span>
      </button>
    </nav>
  );
}
