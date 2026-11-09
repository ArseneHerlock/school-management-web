'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  CalendarDays,
  Menu as MenuIcon,
} from 'lucide-react';
import { triggerHaptic } from '@/app/components/ui/haptic';

interface ParentBottomNavProps {
  pathname: string | null;
  onOpenMenu: () => void;
}

export function ParentBottomNav({
  pathname,
  onOpenMenu,
}: ParentBottomNavProps) {
  const router = useRouter();
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);

  // Prefetch các tab cốt lõi ngay khi mount để chuyển trang tức thì (0ms)
  useEffect(() => {
    router.prefetch('/parent');
    router.prefetch('/parent/attendance');
    router.prefetch('/parent/assessment');
    router.prefetch('/parent/schedule');
  }, [router]);

  // Đồng bộ lại khi pathname thực tế đã thay đổi
  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const activePath = optimisticPath ?? pathname ?? '';
  const isCustomTab = !['/parent', '/parent/attendance', '/parent/assessment', '/parent/schedule'].includes(
    activePath
  );

  const navigateTo = (href: string) => {
    triggerHaptic();
    setOptimisticPath(href);
    router.push(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden grid grid-cols-5 h-[62px] pb-[max(env(safe-area-inset-bottom,0px),4px)] font-sans select-none pointer-events-auto mobile-nav-bar">
      {/* Tab 1: Sổ liên lạc */}
      {(() => {
        const isActive = activePath === '/parent';
        return (
          <Link
            href="/parent"
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/parent');
            }}
            onPointerDown={() => {
              setOptimisticPath('/parent');
              triggerHaptic();
            }}
            className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-indigo-50/70 rounded-2xl cursor-pointer"
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.4)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <div
              className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                isActive
                  ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              } group-active:bg-indigo-200/90`}
            >
              <LayoutDashboard
                size={19}
                className={`pointer-events-none ${
                  isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                isActive
                  ? 'font-black text-indigo-600'
                  : 'font-semibold text-slate-500'
              } group-active:text-indigo-700`}
            >
              Sổ liên lạc
            </span>
          </Link>
        );
      })()}

      {/* Tab 2: Chuyên cần */}
      {(() => {
        const isActive = Boolean(activePath?.startsWith('/parent/attendance'));
        return (
          <Link
            href="/parent/attendance"
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/parent/attendance');
            }}
            onPointerDown={() => {
              setOptimisticPath('/parent/attendance');
              triggerHaptic();
            }}
            className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-indigo-50/70 rounded-2xl cursor-pointer"
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.4)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <div
              className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                isActive
                  ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              } group-active:bg-indigo-200/90`}
            >
              <ClipboardCheck
                size={19}
                className={`pointer-events-none ${
                  isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                isActive
                  ? 'font-black text-indigo-600'
                  : 'font-semibold text-slate-500'
              } group-active:text-indigo-700`}
            >
              Chuyên cần
            </span>
          </Link>
        );
      })()}

      {/* Tab 3: Đánh giá */}
      {(() => {
        const isActive = Boolean(activePath?.startsWith('/parent/assessment'));
        return (
          <Link
            href="/parent/assessment"
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/parent/assessment');
            }}
            onPointerDown={() => {
              setOptimisticPath('/parent/assessment');
              triggerHaptic();
            }}
            className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-indigo-50/70 rounded-2xl cursor-pointer"
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.4)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <div
              className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                isActive
                  ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              } group-active:bg-indigo-200/90`}
            >
              <Sparkles
                size={19}
                className={`pointer-events-none ${
                  isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                isActive
                  ? 'font-black text-indigo-600'
                  : 'font-semibold text-slate-500'
              } group-active:text-indigo-700`}
            >
              Đánh giá
            </span>
          </Link>
        );
      })()}

      {/* Tab 4: Lịch sinh hoạt */}
      {(() => {
        const isActive = Boolean(activePath?.startsWith('/parent/schedule'));
        return (
          <Link
            href="/parent/schedule"
            prefetch={true}
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/parent/schedule');
            }}
            onPointerDown={() => {
              setOptimisticPath('/parent/schedule');
              triggerHaptic();
            }}
            className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-indigo-50/70 rounded-2xl cursor-pointer"
          >
            {isActive && (
              <span className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.4)] animate-in fade-in zoom-in-75 duration-200" />
            )}
            <div
              className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                isActive
                  ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              } group-active:bg-indigo-200/90`}
            >
              <CalendarDays
                size={19}
                className={`pointer-events-none ${
                  isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                isActive
                  ? 'font-black text-indigo-600'
                  : 'font-semibold text-slate-500'
              } group-active:text-indigo-700`}
            >
              Lịch sinh hoạt
            </span>
          </Link>
        );
      })()}

      {/* Tab 5: Danh mục */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerHaptic();
          onOpenMenu();
        }}
        onPointerDown={() => {
          triggerHaptic();
        }}
        className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-indigo-50/70 rounded-2xl cursor-pointer"
      >
        {isCustomTab && (
          <span className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 shadow-[0_2px_6px_rgba(79,70,229,0.4)] animate-in fade-in zoom-in-75 duration-200" />
        )}
        <div
          className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
            isCustomTab
              ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-700'
          } group-active:bg-indigo-200/90`}
        >
          <MenuIcon
            size={19}
            className={`pointer-events-none ${
              isCustomTab ? 'stroke-[2.5]' : 'stroke-[1.8]'
            }`}
          />
          {isCustomTab && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          )}
        </div>
        <span
          className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
            isCustomTab
              ? 'font-black text-indigo-600'
              : 'font-semibold text-slate-500'
          } group-active:text-indigo-700`}
        >
          Danh mục
        </span>
      </button>
    </nav>
  );
}
