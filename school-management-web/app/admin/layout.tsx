"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  ShieldAlert,
} from "lucide-react";
import { getAccessToken, currentUser } from "@/services";
import LoadingScreen from "@/app/components/LoadingScreen";
import AdminSidebar, { MenuItem } from "./components/layout/AdminSidebar";
import AdminHeader from "./components/layout/AdminHeader";
import AdminBottomNav from "./components/layout/AdminBottomNav";
import "./admin.css";

const ADMIN_MENU: MenuItem[] = [
  { id: "dashboard", label: "Tổng quan hệ thống", icon: LayoutDashboard },
  { id: "khoi", label: "Quản lý khối lớp", icon: Layers3, group: "Quản lý nhà trường" },
  { id: "lop", label: "Danh sách lớp học", icon: DoorOpen, group: "Quản lý nhà trường" },
  { id: "hoat-dong", label: "Kế hoạch & Sự kiện", icon: Sparkles, group: "Quản lý nhà trường" },
  { id: "tuyen-sinh", label: "Hồ sơ tuyển sinh", icon: UserPlus, group: "Quản lý nhà trường" },
  { id: "hoc-sinh", label: "Hồ sơ học sinh", icon: Users, group: "Quản lý nhà trường" },
  { id: "suc-khoe", label: "Sức khỏe & Dinh dưỡng", icon: Activity, group: "Chăm sóc & Y tế" },
  { id: "y-te-dac-biet", label: "Sổ theo dõi y tế đặc biệt", icon: ShieldAlert, group: "Chăm sóc & Y tế" },
  { id: "phu-huynh", label: "Hồ sơ phụ huynh", icon: UserRoundCheck, group: "Cán bộ & Phụ huynh" },
  { id: "nhan-su", label: "Quản lý cán bộ - giáo viên", icon: UserCog, group: "Cán bộ & Phụ huynh" },
  { id: "diem-danh", label: "Giám sát chuyên cần toàn trường", icon: ClipboardCheck, group: "Nghiệp vụ sư phạm" },
  { id: "lich-hoc", label: "Thời khóa biểu & Lịch sinh hoạt", icon: CalendarDays, group: "Nghiệp vụ sư phạm" },
  { id: "good-child", label: "Theo dõi thi đua bé ngoan", icon: Award, group: "Nghiệp vụ sư phạm" },
  { id: "khen-thuong", label: "Tổng kết & Khen thưởng cuối năm", icon: Award, group: "Nghiệp vụ sư phạm" },
  { id: "danh-gia", label: "Đánh giá sự phát triển của trẻ", icon: Award, group: "Chuyên môn & Đánh giá" },
  { id: "fcm-overview", label: "Phân loại năng lực trẻ", icon: BarChart3, group: "Chuyên môn & Đánh giá" },
  { id: "tin-tuc", label: "Bản tin & Thông báo", icon: Bell, group: "Thông tin & Truyền thông" },
  { id: "lien-lac", label: "Sổ liên lạc & Danh bạ", icon: MessageCircle, group: "Thông tin & Truyền thông" },
  { id: "thu-chi", label: "Quản lý thu chi học phí", icon: Receipt, group: "Tài chính - Kế toán" },
  { id: "bao-cao", label: "Báo cáo chuyên môn & Thống kê", icon: BarChart3, group: "Quản trị hệ thống" },
  { id: "tai-khoan", label: "Quản trị tài khoản & Phân quyền", icon: KeyRound, group: "Quản trị hệ thống" },
  { id: "don-nghi", label: "Giám sát đơn xin nghỉ học", icon: ClipboardList, group: "Quản trị hệ thống" },
];

const TITLES: Record<string, string> = {
  ...Object.fromEntries(ADMIN_MENU.map((x) => [x.id, x.label])),
  "good-child": "Theo dõi thi đua bé ngoan",
  learning: "Góc sản phẩm của bé",
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
      window.location.href = "/login";
      return;
    }

    if (!activeUser.roles.includes("ADMIN")) {
      if (activeUser.roles.includes("GIAO_VIEN")) {
        window.location.href = "/teacher";
      } else if (activeUser.roles.includes("PHU_HUYNH")) {
        window.location.href = "/parent";
      } else {
        window.location.href = "/login";
      }
      return;
    }

    setUser(activeUser);
    setAuthorized(true);
  }, []);

  const activeId = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[1] || "dashboard";
  }, [pathname]);

  const pageTitle = TITLES[activeId] || "Quản trị hệ thống";

  if (!mounted || !authorized) {
    return (
      <LoadingScreen
        message="Đang xác thực quyền quản trị..."
        subMessage="Hệ thống đang kiểm tra danh mục quản trị trường học"
      />
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-slate-50 font-sans antialiased text-slate-800 lg:overflow-hidden">
      <AdminSidebar
        menu={ADMIN_MENU}
        groups={GROUPS}
        page={activeId}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        user={user}
        mounted={mounted}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          pageTitle={pageTitle}
          menu={ADMIN_MENU}
          onOpenMobile={() => setMobileOpen(true)}
          user={user}
          mounted={mounted}
        />

        <main className="flex-1 lg:overflow-y-auto p-3 sm:p-5 md:p-6 pb-24 lg:pb-6 font-sans">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      <AdminBottomNav
        pathname={pathname}
        onOpenMenu={() => setMobileOpen(true)}
      />
    </div>
  );
}
