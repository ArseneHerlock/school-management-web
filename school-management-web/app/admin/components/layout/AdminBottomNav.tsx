'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Receipt,
  Menu as MenuIcon,
} from 'lucide-react';
import { triggerHaptic } from '@/app/components/ui/haptic';

interface AdminBottomNavProps {
  pathname: string | null;
  onOpenMenu: () => void;
}

export default function AdminBottomNav({ pathname, onOpenMenu }: AdminBottomNavProps) {
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    router.prefetch('/admin');
    router.prefetch('/admin/hoc-sinh');
    router.prefetch('/admin/diem-danh');
    router.prefetch('/admin/thu-chi');
  }, [router]);

  React.useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const activeAdminPath = optimisticPath ?? pathname ?? '';
  const isDashboard = activeAdminPath === '/admin';
  const isHocSinh = activeAdminPath.startsWith('/admin/hoc-sinh');
  const isDiemDanh = activeAdminPath.startsWith('/admin/diem-danh');
  const isThuChi = activeAdminPath.startsWith('/admin/thu-chi');
  const isOther = !isDashboard && !isHocSinh && !isDiemDanh && !isThuChi;

  const navigateTo = (href: string) => {
    triggerHaptic();
    setOptimisticPath(href);
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-emerald-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden grid grid-cols-5 h-[62px] pb-[max(env(safe-area-inset-bottom,0px),4px)] font-sans select-none pointer-events-auto mobile-nav-bar">
      {/* Tab 1: Tổng quan */}
      <Link
        href="/admin"
        prefetch={true}
        onClick={(e) => {
          e.preventDefault();
          navigateTo('/admin');
        }}
        onPointerDown={() => {
          setOptimisticPath('/admin');
          triggerHaptic();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-emerald-50/70 rounded-2xl cursor-pointer"
      >
        {isDashboard && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-600 shadow-[0_2px_6px_rgba(5,150,105,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isDashboard
              ? 'bg-emerald-100/90 text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-emerald-200/90`}
        >
          <LayoutDashboard
            size={19}
            className={`pointer-events-none ${
              isDashboard ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isDashboard
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-500'
          } group-active:text-emerald-800`}
        >
          Tổng quan
        </span>
      </Link>

      {/* Tab 2: Học sinh */}
      <Link
        href="/admin/hoc-sinh"
        prefetch={true}
        onClick={(e) => {
          e.preventDefault();
          navigateTo('/admin/hoc-sinh');
        }}
        onPointerDown={() => {
          setOptimisticPath('/admin/hoc-sinh');
          triggerHaptic();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-emerald-50/70 rounded-2xl cursor-pointer"
      >
        {isHocSinh && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-600 shadow-[0_2px_6px_rgba(5,150,105,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isHocSinh
              ? 'bg-emerald-100/90 text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-emerald-200/90`}
        >
          <Users
            size={19}
            className={`pointer-events-none ${
              isHocSinh ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isHocSinh
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-500'
          } group-active:text-emerald-800`}
        >
          Học sinh
        </span>
      </Link>

      {/* Tab 3: Chuyên cần */}
      <Link
        href="/admin/diem-danh"
        prefetch={true}
        onClick={(e) => {
          e.preventDefault();
          navigateTo('/admin/diem-danh');
        }}
        onPointerDown={() => {
          setOptimisticPath('/admin/diem-danh');
          triggerHaptic();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-emerald-50/70 rounded-2xl cursor-pointer"
      >
        {isDiemDanh && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-600 shadow-[0_2px_6px_rgba(5,150,105,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isDiemDanh
              ? 'bg-emerald-100/90 text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-emerald-200/90`}
        >
          <ClipboardCheck
            size={19}
            className={`pointer-events-none ${
              isDiemDanh ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isDiemDanh
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-500'
          } group-active:text-emerald-800`}
        >
          Chuyên cần
        </span>
      </Link>

      {/* Tab 4: Thu chi */}
      <Link
        href="/admin/thu-chi"
        prefetch={true}
        onClick={(e) => {
          e.preventDefault();
          navigateTo('/admin/thu-chi');
        }}
        onPointerDown={() => {
          setOptimisticPath('/admin/thu-chi');
          triggerHaptic();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-emerald-50/70 rounded-2xl cursor-pointer"
      >
        {isThuChi && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-600 shadow-[0_2px_6px_rgba(5,150,105,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isThuChi
              ? 'bg-emerald-100/90 text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-emerald-200/90`}
        >
          <Receipt
            size={19}
            className={`pointer-events-none ${
              isThuChi ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isThuChi
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-500'
          } group-active:text-emerald-800`}
        >
          Thu chi
        </span>
      </Link>

      {/* Tab 5: Danh mục */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenMenu();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-emerald-50/70 rounded-2xl cursor-pointer"
      >
        {isOther && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-emerald-600 shadow-[0_2px_6px_rgba(5,150,105,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isOther
              ? 'bg-emerald-100/90 text-emerald-700 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-emerald-200/90`}
        >
          <MenuIcon
            size={19}
            className={`pointer-events-none ${
              isOther ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          {isOther && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          )}
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isOther
              ? 'font-black text-emerald-700'
              : 'font-semibold text-slate-500'
          } group-active:text-emerald-800`}
        >
          Danh mục
        </span>
      </button>
    </nav>
  );
}
