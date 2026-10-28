"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronRight,
  Search,
  MessageSquare,
  BellRing,
  UserRound,
  UserCog,
  LogOut,
} from "lucide-react";
import { currentUser, logout } from "@/lib/api";
import { MenuItem } from "./AdminSidebar";

interface AdminHeaderProps {
  pageTitle: string;
  menu: MenuItem[];
  onOpenMobile: () => void;
  onNavigate?: (id: string) => void;
  user: ReturnType<typeof currentUser>;
  mounted: boolean;
}

export default function AdminHeader({
  pageTitle,
  menu,
  onOpenMobile,
  user,
  mounted,
}: AdminHeaderProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [userOpen, setUserOpen] = useState(false);

  const userInitials = (mounted ? user?.name || "AD" : "AD")
    .split(/\s+/)
    .map((x: string) => x[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      const q = search.trim().toLowerCase();
      const target = menu.find((x) => x.label.toLowerCase().includes(q));
      const targetId =
        target?.id ||
        (q.includes("lớp")
          ? "lop"
          : q.includes("giáo viên") || q.includes("nhân sự")
          ? "nhan-su"
          : "hoc-sinh");
      router.push(targetId === "dashboard" ? "/admin" : `/admin/${targetId}`);
      setSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-18 items-center gap-2 sm:gap-3 border-b border-rose-100 bg-white/95 px-3 sm:px-6 backdrop-blur-xl pt-[calc(env(safe-area-inset-top,0px)+2px)]">
      <button
        className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 lg:hidden shrink-0 cursor-pointer"
        onClick={onOpenMobile}
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumb & Mobile Title */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0 flex-1 sm:flex-initial">
        <span className="hidden md:inline font-medium text-slate-400">Quản trị</span>
        <ChevronRight size={14} className="hidden md:inline text-slate-300" />
        <span className="font-extrabold text-sm sm:text-base text-slate-800 truncate">{pageTitle}</span>
      </div>

      {/* Search Bar */}
      <div className="relative ml-auto hidden w-full max-w-md sm:block">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchSubmit}
          placeholder="Tìm học sinh, lớp, giáo viên, phòng ban... Nhấn Enter"
          className="h-10 w-full rounded-2xl border border-rose-200/80 bg-rose-50/30 pl-10 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
        />
      </div>

      {/* Quick chat & notification */}
      <Link
        href="/admin/lien-lac"
        className="rounded-xl p-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
        title="Tin nhắn trao đổi"
      >
        <MessageSquare size={18} />
      </Link>

      <Link
        href="/admin/tin-tuc"
        className="relative rounded-xl p-2.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition"
        title="Thông báo toàn trường"
      >
        <BellRing size={18} />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
      </Link>

      {/* User Dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-2 rounded-2xl p-1.5 hover:bg-rose-50/50 transition cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-xs font-bold text-white shadow-xs">
            {userInitials}
          </div>
          <span className="hidden text-left lg:block">
            <span className="block text-xs font-bold text-slate-800">
              {mounted ? user?.name || "Quản trị viên" : "Quản trị viên"}
            </span>
            <span className="block text-[10px] text-rose-500 font-semibold">
              Quản trị viên
            </span>
          </span>
        </button>

        {userOpen && (
          <div className="absolute right-0 top-12 w-52 rounded-2xl border border-rose-100 bg-white p-1.5 shadow-xl">
            <Link
              href="/admin/nhan-su"
              onClick={() => setUserOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition"
            >
              <UserRound size={15} />
              Hồ sơ nhân sự
            </Link>
            <Link
              href="/admin/tai-khoan"
              onClick={() => setUserOpen(false)}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition"
            >
              <UserCog size={15} />
              Quản lý tài khoản
            </Link>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut size={15} />
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
