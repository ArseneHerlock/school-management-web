'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { currentUser } from '@/services/client';
import TeacherSidebar from './components/TeacherSidebar';
import TeacherTopBar from './components/TeacherTopBar';
import LoadingScreen from '@/app/components/LoadingScreen';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const activeUser = currentUser();
    if (!activeUser) {
      router.replace('/login');
      return;
    }

    // Kiểm tra quyền: Bắt buộc phải có quyền GIAO_VIEN hoặc ADMIN
    const hasTeacherRole =
      activeUser.roles.includes('GIAO_VIEN') || activeUser.roles.includes('ADMIN');

    if (!hasTeacherRole) {
      alert('Bạn không có quyền truy cập trang Giáo viên!');
      if (activeUser.roles.includes('PHU_HUYNH')) {
        router.replace('/parent');
      } else {
        router.replace('/login');
      }
      return;
    }

    setAuthorized(true);
  }, [router]);

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
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
        <Link
          href="/teacher"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/teacher'
              ? 'text-orange-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <LayoutDashboard size={20} className={pathname === '/teacher' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Bàn làm việc</span>
        </Link>

        <Link
          href="/teacher/attendance"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/teacher/attendance'
              ? 'text-orange-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <ClipboardCheck size={20} className={pathname === '/teacher/attendance' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Điểm danh</span>
        </Link>

        <Link
          href="/teacher/assessment"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/teacher/assessment'
              ? 'text-orange-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Sparkles size={20} className={pathname === '/teacher/assessment' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Đánh giá</span>
        </Link>

        <Link
          href="/teacher/messages"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === '/teacher/messages'
              ? 'text-orange-600 font-extrabold'
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <MessageSquare size={20} className={pathname === '/teacher/messages' ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
          <span className="text-[10px] mt-0.5">Tin nhắn</span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          <Menu size={20} className="stroke-[1.8]" />
          <span className="text-[10px] mt-0.5">Menu</span>
        </button>
      </nav>
    </div>
  );
}
