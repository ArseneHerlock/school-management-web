"use client";

import React, { ElementType, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Building2,
  BookOpen,
  Sparkles,
  UserCog,
  Bell,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import { currentUser } from "@/services";

export type MenuItem = {
  id: string;
  label: string;
  icon: ElementType;
  group?: string;
  badge?: number;
};

interface AdminSidebarProps {
  menu: MenuItem[];
  groups: string[];
  page?: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onNavigate?: (id: string) => void;
  user: ReturnType<typeof currentUser>;
  mounted: boolean;
}

const GROUP_ICONS: Record<string, ElementType> = {
  "Trường học": Building2,
  "Học vụ": BookOpen,
  "Phát triển": Sparkles,
  "Nhân sự": UserCog,
  "Truyền thông": Bell,
  "Tài chính": Receipt,
  "Quản trị": ShieldCheck,
};

export default function AdminSidebar({
  menu,
  groups,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  user,
  mounted,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const userInitials = (mounted ? user?.name || "AD" : "AD")
    .split(/\s+/)
    .map((x: string) => x[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  const getItemHref = (id: string) => (id === "dashboard" ? "/admin" : `/admin/${id}`);

  const checkIsActive = (id: string) => {
    const href = getItemHref(id);
    if (id === "dashboard") return pathname === "/admin";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    groups.forEach((g) => {
      initial[g] = true;
    });
    return initial;
  });

  useEffect(() => {
    groups.forEach((group) => {
      const hasActive = menu.some((item) => item.group === group && checkIsActive(item.id));
      if (hasActive) {
        setOpenGroups((prev) => ({ ...prev, [group]: true }));
      }
    });
  }, [pathname, menu, groups]);

  const toggleGroup = (groupName: string) => {
    if (collapsed) onToggleCollapse();
    setOpenGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-slate-900/30 backdrop-blur-xs transition lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] flex h-screen w-[276px] shrink-0 flex-col border-r border-emerald-100 bg-white shadow-xl transition-all duration-200 lg:static lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-[276px]"} font-sans`}
      >
        {/* Brand / Logo */}
        <div className="flex h-[72px] items-center border-b border-emerald-100/60 px-4">
          <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 font-extrabold text-white shadow-sm shadow-emerald-600/30 text-sm">
              MN
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-800">
                  Mầm Non Tuổi Thơ
                </p>
                <p className="mt-0.5 truncate text-[11px] font-bold text-emerald-600">
                  Cổng Quản Trị Hệ Thống
                </p>
              </div>
            )}
          </Link>
          <button className="p-2 text-slate-400 lg:hidden cursor-pointer" onClick={onCloseMobile}>
            <X size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 admin-scroll">
          {menu
            .filter((x) => !x.group)
            .map((item) => {
              const Icon = item.icon;
              const isActive = checkIsActive(item.id);
              return (
                <Link
                  key={item.id}
                  href={getItemHref(item.id)}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-xs font-bold transition ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs font-bold"
                      : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  } ${collapsed ? "justify-center px-0 h-10" : ""}`}
                >
                  <Icon size={17} className={`shrink-0 ${isActive ? "text-white" : "text-emerald-600/70"}`} />
                  {!collapsed && (
                    <>
                      <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                      {Boolean(item.badge) && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}

          {/* Group Accordions */}
          {groups.map((group) => {
            const GroupIcon = GROUP_ICONS[group] || Building2;
            const isOpen = Boolean(openGroups[group]);
            const groupItems = menu.filter((x) => x.group === group);
            const hasActiveChild = groupItems.some((item) => checkIsActive(item.id));

            return (
              <div key={group} className="space-y-1 pt-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  title={collapsed ? group : undefined}
                  className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-bold transition cursor-pointer select-none ${
                    hasActiveChild
                      ? "bg-emerald-50 text-emerald-900 font-extrabold"
                      : "text-slate-700 hover:bg-emerald-50/60"
                  } ${collapsed ? "justify-center px-0 h-10" : ""}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GroupIcon
                      size={16}
                      className={`shrink-0 ${hasActiveChild ? "text-emerald-600" : "text-slate-400"}`}
                    />
                    {!collapsed && <span className="truncate text-left">{group}</span>}
                  </div>

                  {!collapsed && (
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-emerald-600" : ""
                      }`}
                    />
                  )}
                </button>

                {isOpen && !collapsed && (
                  <div className="ml-4 pl-3 border-l-2 border-emerald-100 space-y-0.5 pt-0.5">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = checkIsActive(item.id);
                      return (
                        <Link
                          key={item.id}
                          href={getItemHref(item.id)}
                          onClick={onCloseMobile}
                          className={`group flex w-full items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition ${
                            isActive
                              ? "bg-emerald-600 text-white font-bold shadow-2xs"
                              : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 font-medium"
                          }`}
                        >
                          <Icon size={14} className={`shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-emerald-600"}`} />
                          <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                          {Boolean(item.badge) && (
                            <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                              isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-emerald-100/60 p-2">
          <button
            onClick={onToggleCollapse}
            className="hidden w-full items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-400 hover:bg-emerald-50 lg:flex cursor-pointer"
          >
            {collapsed ? <ChevronRight size={17} /> : (<><ChevronLeft size={17} /><span>Thu gọn menu</span></>)}
          </button>

          <div className="mt-1 flex items-center gap-3 rounded-2xl bg-emerald-50/50 p-2.5 border border-emerald-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-700">
                  {mounted ? user?.name || "Quản trị viên" : "Quản trị viên"}
                </p>
                <p className="truncate text-[10px] text-emerald-700 font-medium">
                  {mounted ? user?.username || "Admin" : "Admin"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
