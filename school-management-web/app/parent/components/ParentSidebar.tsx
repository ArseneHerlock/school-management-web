"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChildInfo, ParentProfile } from "../types";
import { 
  LayoutDashboard, 
  GraduationCap, 
  CalendarDays,
  Award,
  HeartPulse, 
  MessageSquareText, 
  CalendarOff, 
  WalletCards,
  Image as ImageIcon,
  Newspaper,
  ClipboardCheck,
  Sparkles,
  X
} from "lucide-react";

interface ParentSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  child: ChildInfo;
  parent: ParentProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  unreadMessagesCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export default function ParentSidebar({
  child,
  parent,
  isOpen,
  onClose,
  onOpenProfile,
  unreadMessagesCount = 0,
}: ParentSidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Tổng quan",
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: "attendance",
      label: "Điểm danh & Chuyên cần",
      icon: <ClipboardCheck size={20} />,
    },
    {
      id: "assessment",
      label: "Đánh giá phát triển",
      icon: <Sparkles size={20} />,
    },
    {
      id: "learning",
      label: "Góc học tập của bé",
      icon: <GraduationCap size={20} />,
    },
    {
      id: "schedule",
      label: "Lịch học & Sinh hoạt",
      icon: <CalendarDays size={20} />,
    },
    {
      id: "good-child",
      label: "Sổ bé ngoan",
      icon: <Award size={20} />,
    },
    {
      id: "health",
      label: "Sức khoẻ",
      icon: <HeartPulse size={20} />,
    },
    {
      id: "messages",
      label: "Liên lạc",
      icon: <MessageSquareText size={20} />,
      badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined,
      badgeColor: "bg-rose-500",
    },
    {
      id: "absence",
      label: "Xin nghỉ học",
      icon: <CalendarOff size={20} />,
    },
    {
      id: "tuition",
      label: "Thanh toán",
      icon: <WalletCards size={20} />,
    },
    {
      id: "moments",
      label: "Khoảnh khắc",
      icon: <ImageIcon size={20} />,
    },
    {
      id: "news",
      label: "Tin tức",
      icon: <Newspaper size={20} />,
    },
  ];

  const getItemHref = (id: string) => (id === "dashboard" ? "/parent" : `/parent/${id}`);

  const checkIsActive = (id: string) => {
    const href = getItemHref(id);
    if (id === "dashboard") {
      return pathname === "/parent";
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 shadow-xl shadow-slate-200/50`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-6 flex items-center justify-between">
          <Link href="/parent" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-slate-800 leading-tight">
                Mầm Non Tuổi Thơ
              </h1>
              <p className="text-[11px] font-semibold text-indigo-600">
                Cổng thông tin Phụ Huynh
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Child Mini-Card */}
        <div className="px-4 pb-2">
          <div className="p-3 bg-gradient-to-r from-indigo-50 via-indigo-50/50 to-transparent border border-indigo-100 rounded-2xl flex items-center gap-3 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-xs relative z-10">
              {child.avatar || "BE"}
            </div>
            <div className="min-w-0 flex-1 relative z-10">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {child.hoTen || "Học sinh"}
                </p>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mb-0.5 flex items-center gap-1">
                Lớp <span className="font-bold text-indigo-600">{child.lop || "Chưa phân lớp"}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium font-mono bg-slate-100 inline-block px-1.5 py-0.5 rounded">
                ID: {child.maHocSinh ? child.maHocSinh.slice(0, 8).toUpperCase() : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation List with Next.js Link prefetching */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto parent-scroll">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">
            Chức năng chính
          </div>
          {navItems.map((item) => {
            const isActive = checkIsActive(item.id);
            const href = getItemHref(item.id);
            return (
              <Link
                key={item.id}
                href={href}
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-600 hover:text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="tracking-wide">{item.label}</span>
                {Boolean(item.badge) && (
                  <span
                    className={`ml-auto ${item.badgeColor || "bg-indigo-500"} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Parent Profile Mini-Card at Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 overflow-hidden">
              {parent.avatar ? (
                <img src={parent.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                parent.hoTen
                  .split(" ")
                  .slice(-1)[0]
                  ?.slice(0, 2)
                  .toUpperCase() || "PH"
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                {parent.hoTen || "Phụ huynh"}
              </p>
              <p className="text-[10px] font-medium text-slate-400 truncate">
                {parent.soDienThoai || parent.moiQuanHe || "Phụ huynh bé"}
              </p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
