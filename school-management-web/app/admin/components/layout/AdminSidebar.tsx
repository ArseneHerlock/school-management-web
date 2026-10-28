"use client";

import React, { ElementType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { currentUser } from "@/lib/api";

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
    if (id === "dashboard") {
      return pathname === "/admin";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[276px] shrink-0 flex-col border-r border-rose-200/70 bg-white/95 backdrop-blur shadow-xl transition-transform lg:static lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-[276px]"}`}
      >
        {/* Brand / Logo */}
        <div className="flex h-[72px] items-center border-b border-rose-100 px-4">
          <Link href="/admin" className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 font-extrabold text-white shadow-md shadow-rose-500/20">
              MN
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-slate-800">
                  Mầm Non Tuổi Thơ
                </p>
                <p className="mt-0.5 truncate text-[11px] font-medium text-rose-500">
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
        <div className="flex-1 overflow-y-auto px-2.5 py-3">
          <div className="px-2.5 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Không gian quản lý
          </div>

          {/* Ungrouped items (e.g. Tổng quan) */}
          <div className="space-y-1">
            {menu
              .filter((x) => !x.group)
              .map((item) => {
                const Icon = item.icon;
                const isActive = checkIsActive(item.id);
                const href = getItemHref(item.id);
                return (
                  <Link
                    key={item.id}
                    href={href}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/20 font-bold"
                        : "text-slate-600 hover:bg-rose-50/70 hover:text-rose-700"
                    }`}
                  >
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="min-w-0 flex-1 truncate text-left">
                          {item.label}
                        </span>
                        {Boolean(item.badge) && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
          </div>

          {groups.map((group) => (
            <div key={group} className="mt-3">
              <div
                className={`mb-1 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 ${
                  collapsed ? "text-center" : ""
                }`}
              >
                {collapsed ? "•" : group}
              </div>
              {menu
                .filter((x) => x.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = checkIsActive(item.id);
                  const href = getItemHref(item.id);
                  return (
                    <Link
                      key={item.id}
                      href={href}
                      onClick={onCloseMobile}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                        isActive
                          ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/20 font-bold"
                          : "text-slate-600 hover:bg-rose-50/70 hover:text-rose-700"
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="min-w-0 flex-1 truncate text-left">
                            {item.label}
                          </span>
                          {Boolean(item.badge) && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-rose-100 text-rose-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </div>

        {/* User / Collapse footer */}
        <div className="border-t border-rose-100 p-2">
          <button
            onClick={onToggleCollapse}
            className="hidden w-full items-center justify-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-50 lg:flex cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <>
                <ChevronLeft size={17} />
                Thu gọn
              </>
            )}
          </button>
          <div className="mt-1 flex items-center gap-3 rounded-2xl bg-rose-50/50 p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-400 to-amber-400 text-xs font-bold text-white shadow-xs">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-700">
                  {mounted ? user?.name || "Quản trị viên" : "Quản trị viên"}
                </p>
                <p className="truncate text-[10px] text-rose-500 font-medium">
                  Ban Giám Hiệu
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
