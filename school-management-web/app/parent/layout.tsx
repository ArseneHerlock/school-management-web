"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardCheck,
  Sparkles,
  CalendarDays,
  Menu as MenuIcon,
} from "lucide-react";
import "./parent.css";
import {
  getNews,
  getFees,
  getStudentsByParent,
  getCurrentParentProfile,
  saveParentProfile,
} from "@/services";
import { getClassById } from "@/services/classes";
import { useApiQuery } from "@/lib/hooks/useApiQuery";
import {
  EMPTY_PARENT,
  ACTIVE_CHILD,
  ParentProfile,
  ChildInfo,
  MomentItem,
} from "./types";
import { ParentContext } from "./ParentContext";
import ParentSidebar from "./components/ParentSidebar";
import ParentHeader from "./components/ParentHeader";
import CallModal from "./components/CallModal";
import LightboxModal from "./components/LightboxModal";
import ParentProfileModal from "./components/ParentProfileModal";
import LoadingScreen from "@/app/components/LoadingScreen";

function formatNewsDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("vi-VN");
}

const HEADERS: Record<string, string> = {
  dashboard: "Tổng quan Phụ Huynh",
  attendance: "Điểm danh & Chuyên cần",
  assessment: "Đánh giá Phát triển Trẻ",
  learning: "Sản phẩm học tập của bé",
  schedule: "Lịch học & Sinh hoạt theo tuần",
  "good-child": "Sổ bé ngoan",
  health: "Sức khoẻ Thể chất",
  progress: "Tiến độ & Thể chất",
  messages: "Liên lạc & Thông báo",
  absence: "Quản lý Đơn nghỉ học",
  moments: "Khoảnh khắc lớp",
  news: "Tin tức nhà trường",
  tuition: "Thanh toán Học phí",
};

export default function ParentLayout({
  children: pageChildren,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState<MomentItem | null>(null);

  const [childId, setChildId] = useState("");
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const profileQuery = useApiQuery(["parent", "me"], getCurrentParentProfile);
  const childrenQuery = useApiQuery(
    ["parent", "children", profileQuery.data?.id],
    () => getStudentsByParent(profileQuery.data!.id),
    { enabled: Boolean(profileQuery.data?.id) }
  );
  const classIds = useMemo(
    () => [...new Set((childrenQuery.data ?? []).map((student: any) => student.lopId || student.LopId).filter(Boolean))] as string[],
    [childrenQuery.data]
  );
  const childClassesQuery = useApiQuery(
    ["parent", "child-classes", classIds],
    () => Promise.all(classIds.map(getClassById)),
    { enabled: classIds.length > 0 }
  );
  const currentYear = new Date().getFullYear();
  const newsQuery = useApiQuery(["news", "parent"], () => getNews({ trang: 1, soLuongMoiTrang: 20 }));
  const feesQuery = useApiQuery(["fees", `${currentYear}-${currentYear + 1}`], () => getFees(`${currentYear}-${currentYear + 1}`));

  const parent = useMemo<ParentProfile>(() => {
    const p: any = profileQuery.data;
    if (!p) return EMPTY_PARENT;
    return {
      ...EMPTY_PARENT,
      ...p,
      id: p.id || p.Id || "",
      hoTen: p.hoTen || p.HoTen || "",
      soDienThoai: p.soDienThoai || p.SoDienThoai || "",
      email: p.email || p.Email || "",
      diaChi: p.diaChi || p.DiaChi || "",
      moiQuanHe: p.moiQuanHe || p.MoiQuanHe || "Phụ huynh",
      ngheNghiep: p.ngheNghiep || p.NgheNghiep || "",
      noiLamViec: p.noiLamViec || p.NoiLamViec || "",
      cccd: p.cccd || p.CCCD || "",
      ngaySinh: p.ngaySinh ? String(p.ngaySinh).slice(0, 10) : "",
      gioiTinh: p.gioiTinh || p.GioiTinh || "Nữ",
      taiKhoanId: p.taiKhoanId || p.TaiKhoanId || "",
    };
  }, [profileQuery.data]);

  const children = useMemo<ChildInfo[]>(() => {
    const classesById = new Map((childClassesQuery.data ?? []).map((item: any) => [String(item.id || item.Id), item]));
    return (childrenQuery.data ?? []).map((student: any) => {
      const id = student.studentId || student.StudentId || student.id || student.Id || "";
      const classId = student.lopId || student.LopId || "";
      const schoolClass: any = classesById.get(String(classId));
      const hoTen = student.tenHocSinh || student.TenHocSinh || "";
      return {
        id,
        hoTen,
        lop: schoolClass?.tenLop || schoolClass?.TenLop || student.tenLop || student.TenLop || "",
        classId,
        khoi: schoolClass?.tenKhoi || schoolClass?.TenKhoi || "",
        giaoVienChuNhiem: schoolClass?.tenGiaoVienChuNhiem || schoolClass?.TenGiaoVienChuNhiem || "",
        giaoVienStaffId: schoolClass?.giaoVienChuNhiemId || schoolClass?.GiaoVienChuNhiemId || "",
        sdtGiaoVien: "",
        avatar: hoTen.split(" ").map((word: string) => word[0]).join("").slice(-2).toUpperCase(),
        ngaySinh: String(student.ngaySinh || student.NgaySinh || "").slice(0, 10),
        gioiTinh: student.gioiTinh || student.GioiTinh || "",
        maHocSinh: id,
      };
    });
  }, [childrenQuery.data, childClassesQuery.data]);
  const parentId = parent.id;
  const news = useMemo(() => {
    const payload: any = newsQuery.data;
    const items = Array.isArray(payload) ? payload : payload?.items || [];
    return items.map((item: any) => ({
      id: item.id || item.Id,
      title: item.tieuDe || item.TieuDe || "",
      category: Number(item.phamVi ?? item.PhamVi) === 0 ? "Toàn trường" : Number(item.phamVi ?? item.PhamVi) === 1 ? "Giáo viên" : "Phụ huynh",
      date: formatNewsDate(item.ngayXuatBan || item.NgayXuatBan || item.ngayTao || item.NgayTao),
      summary: item.tomTat || item.TomTat || "",
      content: "", icon: "", badge: "", isImportant: false,
    }));
  }, [newsQuery.data]);
  const fees = feesQuery.data ?? [];
  const loading = profileQuery.isLoading || childrenQuery.isLoading || childClassesQuery.isLoading;

  const tab = useMemo(() => {
    const seg = pathname?.split("/")[2];
    return seg && seg in HEADERS ? seg : "dashboard";
  }, [pathname]);

  const navigateTab = (targetTab: string) => {
    setOpen(false);
    router.push(targetTab === "dashboard" ? "/parent" : `/parent/${targetTab}`);
  };

  const child = useMemo(
    () => children.find((x) => x.id === childId) || children[0] || ACTIVE_CHILD,
    [children, childId]
  );


  const contextValue = useMemo(
    () => ({
      parent,
      parentId,
      childrenData: children,
      child,
      childId,
      setChildId,
      news,
      fees,
      navigateTab,
      openCallModal: () => setCall(true),
      selectMoment: setSelected,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parent, parentId, children, child, childId, news, fees]
  );

  if (loading) {
    return (
      <LoadingScreen
        message="Đang tải dữ liệu Phụ Huynh..."
        subMessage="Đang đồng bộ hồ sơ bé, lớp học và thông báo nhà trường"
        theme="sky"
      />
    );
  }

  return (
    <ParentContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans">
        <ParentSidebar
          activeTab={tab}
          setActiveTab={navigateTab}
          child={child}
          parent={parent}
          isOpen={open}
          onClose={() => setOpen(false)}
          onOpenProfile={() => setProfileOpen(true)}
          unreadMessagesCount={unreadMessagesCount}
        />
        <main className="min-h-screen lg:ml-64 flex flex-col transition-all duration-300 pb-20 lg:pb-6">
          <ParentHeader
            title={HEADERS[tab] || "Cổng phụ huynh"}
            subtitle={
              tab === "dashboard"
                ? "Thông tin chung"
                : `Đang xem: ${child.hoTen || "Chưa chọn trẻ"}`
            }
            onToggleSidebar={() => setOpen(true)}
            onOpenCall={() => setCall(true)}
            onNavigateNotificationTab={(targetTab, targetChildId) => {
              if (targetChildId) setChildId(targetChildId);
              navigateTab(targetTab);
            }}
            onOpenProfile={() => setProfileOpen(true)}
            parent={parent}
            childrenData={children}
            onNotificationCountsChange={(counts) =>
              setUnreadMessagesCount(counts.unreadMessages)
            }
          />
          <div className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto w-full">
            {tab !== "dashboard" && children.length > 0 && (
              <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-2xl border border-slate-200 shadow-xs w-max max-w-full overflow-x-auto no-scrollbar">
                {children.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setChildId(c.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      c.id === child.id
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-transparent text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] ${
                        c.id === child.id
                          ? "bg-white text-indigo-600"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {c.avatar}
                    </div>
                    <span>{c.hoTen}</span>
                  </button>
                ))}
              </div>
            )}

            {pageChildren}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar with Next.js Link prefetching */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1 flex items-center justify-around lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[calc(env(safe-area-inset-bottom,0px)+4px)]">
          <Link
            href="/parent"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              pathname === "/parent"
                ? "text-indigo-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <LayoutDashboard
              size={20}
              className={pathname === "/parent" ? "stroke-[2.5]" : "stroke-[1.8]"}
            />
            <span className="text-[10px] mt-0.5">Tổng quan</span>
          </Link>

          <Link
            href="/parent/attendance"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              pathname?.startsWith("/parent/attendance")
                ? "text-indigo-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <ClipboardCheck
              size={20}
              className={pathname?.startsWith("/parent/attendance") ? "stroke-[2.5]" : "stroke-[1.8]"}
            />
            <span className="text-[10px] mt-0.5">Điểm danh</span>
          </Link>

          <Link
            href="/parent/assessment"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              pathname?.startsWith("/parent/assessment")
                ? "text-indigo-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <Sparkles
              size={20}
              className={pathname?.startsWith("/parent/assessment") ? "stroke-[2.5]" : "stroke-[1.8]"}
            />
            <span className="text-[10px] mt-0.5">Đánh giá</span>
          </Link>

          <Link
            href="/parent/schedule"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              pathname?.startsWith("/parent/schedule")
                ? "text-indigo-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <CalendarDays
              size={20}
              className={pathname?.startsWith("/parent/schedule") ? "stroke-[2.5]" : "stroke-[1.8]"}
            />
            <span className="text-[10px] mt-0.5">Lịch học</span>
          </Link>

          <button
            onClick={() => setOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              !["/parent", "/parent/attendance", "/parent/assessment", "/parent/schedule"].includes(
                pathname || ""
              )
                ? "text-indigo-600 font-extrabold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <div className="relative">
              <MenuIcon
                size={20}
                className={
                  !["/parent", "/parent/attendance", "/parent/assessment", "/parent/schedule"].includes(
                    pathname || ""
                  )
                    ? "stroke-[2.5]"
                    : "stroke-[1.8]"
                }
              />
              {!["/parent", "/parent/attendance", "/parent/assessment", "/parent/schedule"].includes(
                pathname || ""
              ) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600" />
              )}
            </div>
            <span className="text-[10px] mt-0.5">Menu</span>
          </button>
        </nav>

        <CallModal
          isOpen={call}
          onClose={() => setCall(false)}
          teacherName={child.giaoVienChuNhiem}
          teacherRole={`Giáo viên · Lớp ${child.lop}`}
          teacherPhone={child.sdtGiaoVien}
        />
        <LightboxModal
          moment={selected}
          onClose={() => setSelected(null)}
          onToggleLike={() => setSelected(null)}
        />
        <ParentProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          parent={parent}
          onSave={async (p) => {
            await saveParentProfile(p);
            await profileQuery.refetch();
            setProfileOpen(false);
          }}
        />
      </div>
    </ParentContext.Provider>
  );
}
