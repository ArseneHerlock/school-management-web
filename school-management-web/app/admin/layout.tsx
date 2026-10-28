"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Activity,
  Layers3,
  DoorOpen,
  Users,
  UserRoundCheck,
  ClipboardCheck,
  CalendarDays,
  Bell,
  Receipt,
  MessageCircle,
  BarChart3,
  UserPlus,
  UserCog,
  KeyRound,
  ClipboardList,
  Award,
  Sparkles,
  Menu,
} from "lucide-react";
import { getAccessToken, currentUser } from "@/services";
import LoadingScreen from "@/app/components/LoadingScreen";
import AdminSidebar, { MenuItem } from "./components/layout/AdminSidebar";
import AdminHeader from "./components/layout/AdminHeader";
import "./admin.css";

const ADMIN_MENU: MenuItem[] = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "khoi", label: "Quản lý khối", icon: Layers3, group: "Trường học" },
  { id: "lop", label: "Quản lý lớp", icon: DoorOpen, group: "Trường học" },
  { id: "hoat-dong", label: "Hoạt động toàn trường", icon: Sparkles, group: "Trường học" },
  { id: "tuyen-sinh", label: "Tuyển sinh", icon: UserPlus, group: "Trường học" },
  { id: "hoc-sinh", label: "Quản lý học sinh", icon: Users, group: "Trường học" },
  { id: "suc-khoe", label: "Sức khỏe mầm non", icon: Activity, group: "Trường học" },
  { id: "phu-huynh", label: "Quản lý phụ huynh", icon: UserRoundCheck, group: "Trường học" },
  { id: "nhan-su", label: "Quản lý nhân sự", icon: UserCog, group: "Nhân sự" },
  { id: "diem-danh", label: "Điểm danh (Giám sát)", icon: ClipboardCheck, group: "Học vụ" },
  { id: "lich-hoc", label: "Thời khóa biểu", icon: CalendarDays, group: "Học vụ" },
  { id: "danh-gia", label: "Quản lý sự phát triển", icon: Award, group: "Phát triển" },
  { id: "tin-tuc", label: "Tin tức", icon: Bell, group: "Truyền thông" },
  { id: "lien-lac", label: "Danh bạ liên lạc", icon: MessageCircle, group: "Truyền thông" },
  { id: "thu-chi", label: "Thu chi & Công nợ", icon: Receipt, group: "Tài chính" },
  { id: "bao-cao", label: "Báo cáo thống kê", icon: BarChart3, group: "Quản trị" },
  { id: "tai-khoan", label: "Quản lý tài khoản", icon: KeyRound, group: "Quản trị" },
  { id: "don-nghi", label: "Đơn xin nghỉ học", icon: ClipboardList, group: "Quản trị" },
];

const TITLES: Record<string, string> = {
  ...Object.fromEntries(ADMIN_MENU.map((x) => [x.id, x.label])),
  "good-child": "Sổ bé ngoan",
  learning: "Sản phẩm học tập",
};

const GROUPS = [...new Set(ADMIN_MENU.map((x) => x.group).filter(Boolean))] as string[];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof currentUser>>(null);
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    const activeToken = getAccessToken();
    const activeUser = currentUser();

    if (!activeToken || !activeUser) {
      router.replace("/login");
      return;
    }

    if (!activeUser.roles.includes("ADMIN")) {
      alert("Bạn không có quyền truy cập trang Quản trị viên!");
      if (activeUser.roles.includes("GIAO_VIEN")) {
        router.replace("/teacher");
      } else if (activeUser.roles.includes("PHU_HUYNH")) {
        router.replace("/parent");
      } else {
        router.replace("/login");
      }
      return;
    }

    setUser(activeUser);
    setAuthorized(true);
  }, [router]);

  const currentSegment = useMemo(() => {
    const seg = pathname?.split("/")[2] || "dashboard";
    return seg in TITLES ? seg : "dashboard";
  }, [pathname]);

  if (!mounted || !authorized) {
    return (
      <LoadingScreen
        message="Đang tải dữ liệu Quản trị"
        subMessage="Hệ thống đang kiểm tra quyền truy cập và đồng bộ dữ liệu"
        theme="rose"
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf8f6] text-slate-800">
      <AdminSidebar
        menu={ADMIN_MENU}
        groups={GROUPS}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onCloseMobile={() => setMobileOpen(false)}
        user={user}
        mounted={mounted}
      />
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <AdminHeader
          pageTitle={TITLES[currentSegment] || "Quản trị nhà trường"}
          menu={ADMIN_MENU}
          onOpenMobile={() => setMobileOpen(true)}
          user={user}
          mounted={mounted}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar with Next.js Link prefetching */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 px-1 py-1 flex items-center justify-around lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === "/admin"
              ? "text-rose-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <LayoutDashboard
            size={20}
            className={pathname === "/admin" ? "stroke-[2.5]" : "stroke-[1.8]"}
          />
          <span className="text-[10px] mt-0.5">Tổng quan</span>
        </Link>

        <Link
          href="/admin/hoc-sinh"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith("/admin/hoc-sinh")
              ? "text-rose-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <Users
            size={20}
            className={pathname?.startsWith("/admin/hoc-sinh") ? "stroke-[2.5]" : "stroke-[1.8]"}
          />
          <span className="text-[10px] mt-0.5">Học sinh</span>
        </Link>

        <Link
          href="/admin/diem-danh"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith("/admin/diem-danh")
              ? "text-rose-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <ClipboardCheck
            size={20}
            className={pathname?.startsWith("/admin/diem-danh") ? "stroke-[2.5]" : "stroke-[1.8]"}
          />
          <span className="text-[10px] mt-0.5">Điểm danh</span>
        </Link>

        <Link
          href="/admin/bao-cao"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname?.startsWith("/admin/bao-cao")
              ? "text-rose-600 font-extrabold"
              : "text-slate-500 hover:text-slate-800 font-medium"
          }`}
        >
          <BarChart3
            size={20}
            className={pathname?.startsWith("/admin/bao-cao") ? "stroke-[2.5]" : "stroke-[1.8]"}
          />
          <span className="text-[10px] mt-0.5">Báo cáo</span>
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
