"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  Sparkles,
  CalendarPlus,
  FileCheck2,
  HeartPulse,
  Award,
  Flower2,
  MessageSquare,
  Images,
  BookOpenCheck,
  Bell,
  UserCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  X,
} from "lucide-react";
import { logout, currentUser } from "@/services/client";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface SidebarGroup {
  groupName: string;
  items: SidebarItem[];
}

export default function TeacherSidebar({
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const activeUser = currentUser();

  const navigationGroups: SidebarGroup[] = [
    {
      groupName: "Tổng quan",
      items: [
        {
          label: "Bàn làm việc",
          href: "/teacher",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupName: "Giảng dạy & Điểm danh",
      items: [
        {
          label: "Điểm danh lớp",
          href: "/teacher/attendance",
          icon: ClipboardCheck,
        },
        {
          label: "Thời khóa biểu",
          href: "/teacher/schedule",
          icon: CalendarDays,
        },
        {
          label: "Đánh giá phát triển",
          href: "/teacher/assessment",
          icon: Sparkles,
        },
        {
          label: "Hoạt động sự kiện",
          href: "/teacher/activities",
          icon: CalendarPlus,
        },
      ],
    },
    {
      groupName: "Chăm sóc & Nề nếp",
      items: [
        {
          label: "Duyệt đơn nghỉ học",
          href: "/teacher/leave",
          icon: FileCheck2,
        },
        {
          label: "Sức khỏe định kỳ",
          href: "/teacher/health",
          icon: HeartPulse,
        },
        {
          label: "Sổ bé ngoan",
          href: "/teacher/good-child",
          icon: Award,
        },
        {
          label: "Tặng hoa bé ngoan",
          href: "/teacher/flower-awards",
          icon: Flower2,
        },
      ],
    },
    {
      groupName: "Tương tác & Học tập",
      items: [
        {
          label: "Tin nhắn phụ huynh",
          href: "/teacher/messages",
          icon: MessageSquare,
        },
        {
          label: "Album ảnh lớp",
          href: "/teacher/album",
          icon: Images,
        },
        {
          label: "Sản phẩm của bé",
          href: "/teacher/learning",
          icon: BookOpenCheck,
        },
        {
          label: "Bảng tin thông báo",
          href: "/teacher/news",
          icon: Bell,
        },
      ],
    },
    {
      groupName: "Tài khoản",
      items: [
        {
          label: "Hồ sơ giáo viên",
          href: "/teacher/profile",
          icon: UserCircle,
        },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop overlay on mobile */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen?.(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } w-72 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <span className="block truncate text-sm font-black tracking-tight text-slate-800">
                  School Management
                </span>
                <span className="block text-[11px] font-bold text-orange-600">
                  Cổng Giáo Viên
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen?.(false)}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

      {/* Menu danh mục chuyển trang */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {navigationGroups.map(function (group) {
          return (
            <div key={group.groupName} className="space-y-1">
              {!collapsed && (
                <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  {group.groupName}
                </p>
              )}
              {group.items.map(function (item) {
                const isExactActive = pathname === item.href;
                const isSubActive =
                  item.href !== "/teacher" && pathname.startsWith(item.href);
                const isActive = isExactActive || isSubActive;
                const IconComponent = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen?.(false)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-sm shadow-orange-500/30"
                        : "text-slate-600 hover:bg-orange-50/80 hover:text-orange-600"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                  >
                    <IconComponent
                      size={18}
                      className={`shrink-0 transition-transform duration-150 ${
                        isActive
                          ? "text-white scale-105"
                          : "text-slate-400 group-hover:text-orange-600 group-hover:scale-105"
                      }`}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile & Đăng xuất */}
      <div className="shrink-0 border-t border-slate-100 p-3 bg-slate-50/50">
        <div
          className={`flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-xs border border-slate-200/60 ${
            collapsed ? "justify-center p-2" : ""
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-xs font-black text-white shadow-xs">
            {(activeUser?.name || "GV")
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(-2)
              .toUpperCase()}
          </div>

          {(!collapsed || mobileOpen) && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-800">
                {activeUser?.name || "Giáo viên phụ trách"}
              </p>
              <p className="text-[10px] font-semibold text-emerald-600">
                Trực tuyến
              </p>
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
    </aside>
    </>
  );
}
