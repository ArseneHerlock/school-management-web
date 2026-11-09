'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardCheck,
  UserCheck,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { currentUser } from '@/services/client';
import TeacherSidebar from './components/TeacherSidebar';
import TeacherTopBar from './components/TeacherTopBar';
import LoadingScreen from '@/app/components/LoadingScreen';
import { triggerHaptic } from '@/app/components/ui/haptic';
import { TeacherProvider } from './TeacherContext';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);

  // Prefetch các tab cốt lõi của giáo viên ngay khi nạp trang (0ms delay)
  useEffect(() => {
    router.prefetch('/teacher');
    router.prefetch('/teacher/attendance');
    router.prefetch('/teacher/pickup');
    router.prefetch('/teacher/messages');
  }, [router]);

  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  const activeTeacherPath = optimisticPath ?? pathname ?? '';

  const navigateTo = (href: string) => {
    triggerHaptic();
    setOptimisticPath(href);
    router.push(href);
  };

  useEffect(() => {
    const activeUser = currentUser();
    if (!activeUser) {
      window.location.href = '/login';
      return;
    }

    const hasTeacherRole =
      activeUser.roles.includes('GIAO_VIEN') || activeUser.roles.includes('ADMIN');

    if (!hasTeacherRole) {
      if (activeUser.roles.includes('PHU_HUYNH')) {
        window.location.href = '/parent';
      } else {
        window.location.href = '/login';
      }
      return;
    }

    setAuthorized(true);
  }, []);

  if (!authorized) {
    return (
      <LoadingScreen
        message="Đang xác thực quyền truy cập..."
        subMessage="Kiểm tra phân quyền giáo viên và dữ liệu trường học"
        theme="orange"
      />
    );
  }

  const activeTeacher = currentUser();

  return (
    <TeacherProvider>
      <div className="min-h-screen bg-slate-50/60 font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* Sidebar điều hướng */}
      <TeacherSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Vùng nội dung chính */}
      <div
        className={`min-h-screen transition-all duration-300 ease-in-out flex flex-col ml-0 min-w-0 max-w-full overflow-x-hidden ${
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        } pb-20 lg:pb-6`}
      >
        <TeacherTopBar
          teacher={{
            name: activeTeacher?.name || 'Giáo viên',
            avatar: 'GV',
            color: '#f97316',
          }}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-2 sm:p-5 md:p-7 max-w-7xl w-full mx-auto min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - Trải nghiệm chuẩn ứng dụng di động cho giáo viên */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] lg:hidden grid grid-cols-5 h-[62px] pb-[max(env(safe-area-inset-bottom,0px),4px)] font-sans select-none pointer-events-auto mobile-nav-bar">
        {/* Tab 1: Tổng quan */}
        {(() => {
          const isActive = activeTeacherPath === '/teacher';
          return (
            <Link
              href="/teacher"
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/teacher');
              }}
              onPointerDown={() => {
                setOptimisticPath('/teacher');
                triggerHaptic();
              }}
              className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-orange-50/70 rounded-2xl cursor-pointer"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-600 shadow-[0_2px_6px_rgba(234,88,12,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                  isActive
                    ? 'bg-orange-100/90 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                } group-active:bg-orange-200/90`}
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
                    ? 'font-black text-orange-600'
                    : 'font-semibold text-slate-500'
                } group-active:text-orange-700`}
              >
                Tổng quan
              </span>
            </Link>
          );
        })()}

        {/* Tab 2: Chuyên cần */}
        {(() => {
          const isActive = Boolean(activeTeacherPath?.startsWith('/teacher/attendance'));
          return (
            <Link
              href="/teacher/attendance"
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/teacher/attendance');
              }}
              onPointerDown={() => {
                setOptimisticPath('/teacher/attendance');
                triggerHaptic();
              }}
              className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-orange-50/70 rounded-2xl cursor-pointer"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-600 shadow-[0_2px_6px_rgba(234,88,12,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                  isActive
                    ? 'bg-orange-100/90 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                } group-active:bg-orange-200/90`}
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
                    ? 'font-black text-orange-600'
                    : 'font-semibold text-slate-500'
                } group-active:text-orange-700`}
              >
                Chuyên cần
              </span>
            </Link>
          );
        })()}

        {/* Tab 3: Đón trả */}
        {(() => {
          const isActive = Boolean(activeTeacherPath?.startsWith('/teacher/pickup'));
          return (
            <Link
              href="/teacher/pickup"
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/teacher/pickup');
              }}
              onPointerDown={() => {
                setOptimisticPath('/teacher/pickup');
                triggerHaptic();
              }}
              className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-orange-50/70 rounded-2xl cursor-pointer"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-600 shadow-[0_2px_6px_rgba(234,88,12,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                  isActive
                    ? 'bg-orange-100/90 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                } group-active:bg-orange-200/90`}
              >
                <UserCheck
                  size={19}
                  className={`pointer-events-none ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                  isActive
                    ? 'font-black text-orange-600'
                    : 'font-semibold text-slate-500'
                } group-active:text-orange-700`}
              >
                Đón trả
              </span>
            </Link>
          );
        })()}

        {/* Tab 4: Sổ liên lạc */}
        {(() => {
          const isActive = Boolean(activeTeacherPath?.startsWith('/teacher/messages'));
          return (
            <Link
              href="/teacher/messages"
              prefetch={true}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/teacher/messages');
              }}
              onPointerDown={() => {
                setOptimisticPath('/teacher/messages');
                triggerHaptic();
              }}
              className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-orange-50/70 rounded-2xl cursor-pointer"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-600 shadow-[0_2px_6px_rgba(234,88,12,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                  isActive
                    ? 'bg-orange-100/90 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                } group-active:bg-orange-200/90`}
              >
                <MessageSquare
                  size={19}
                  className={`pointer-events-none ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                  isActive
                    ? 'font-black text-orange-600'
                    : 'font-semibold text-slate-500'
                } group-active:text-orange-700`}
              >
                Sổ liên lạc
              </span>
            </Link>
          );
        })()}

        {/* Tab 5: Danh mục / Thực đơn */}
        {(() => {
          const isOther = ![
            '/teacher',
            '/teacher/attendance',
            '/teacher/pickup',
            '/teacher/messages',
          ].some((p) => p === activeTeacherPath || activeTeacherPath?.startsWith(p + '/'));
          return (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMobileOpen(true);
              }}
              className="group flex flex-col items-center justify-center h-full w-full py-0.5 px-0.5 nav-tab-btn select-none active:bg-orange-50/70 rounded-2xl cursor-pointer"
            >
              {isOther && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-600 shadow-[0_2px_6px_rgba(234,88,12,0.4)] animate-in fade-in zoom-in-75 duration-200" />
              )}
              <div
                className={`relative px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-100 ${
                  isOther
                    ? 'bg-orange-100/90 text-orange-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                } group-active:bg-orange-200/90`}
              >
                <Menu
                  size={19}
                  className={`pointer-events-none ${
                    isOther ? 'stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {isOther && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight pointer-events-none select-none transition-colors duration-100 ${
                  isOther
                    ? 'font-black text-orange-600'
                    : 'font-semibold text-slate-500'
                } group-active:text-orange-700`}
              >
                Danh mục
              </span>
            </button>
          );
        })()}
      </nav>
    </div>
    </TeacherProvider>
  );
}
