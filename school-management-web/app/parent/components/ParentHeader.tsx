"use client";
import { Menu, Phone, Search } from "lucide-react";
import { ChildInfo, ParentProfile } from "../types";
import NotificationCenter from "@/app/components/NotificationCenter";

export default function ParentHeader({
  title,
  subtitle,
  onToggleSidebar,
  onOpenCall,
  onNavigateNotificationTab,
  onOpenProfile,
  parent,
  childrenData = [],
  onNotificationCountsChange,
}: {
  title: string;
  subtitle: string;
  onToggleSidebar: () => void;
  onOpenCall: () => void;
  onNavigateNotificationTab: (tab: string, childId?: string) => void;
  onOpenProfile: () => void;
  parent: ParentProfile;
  childrenData?: ChildInfo[];
  onNotificationCountsChange?: (counts: {
    unreadTotal: number;
    urgentUnread: number;
    unreadMessages: number;
    pendingLeaves: number;
  }) => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/95 px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur-xl shadow-xs pt-[calc(env(safe-area-inset-top,0px)+6px)]">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button 
          onClick={onToggleSidebar} 
          className="rounded-xl p-1.5 sm:p-2 lg:hidden bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Mở danh mục menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 tracking-tight truncate leading-tight">{title}</h2>
          <p className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 truncate">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-2">
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
          <Search size={14} className="text-slate-400 mr-2" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="bg-transparent border-none outline-none text-xs w-36 text-slate-700 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Trung tâm thông báo & Cảnh báo thông minh cho Phụ huynh */}
        <NotificationCenter
          role="parent"
          childrenList={childrenData}
          onNavigateParentTab={onNavigateNotificationTab}
          onCountsChange={onNotificationCountsChange}
        />

        <button
          onClick={onOpenCall}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-white font-bold text-xs shadow-xs hover:from-emerald-600 hover:to-emerald-700 transition-all active:scale-95 shrink-0 cursor-pointer"
          title="Gọi giáo viên"
        >
          <Phone size={14} />
          <span className="hidden sm:inline">Gọi GV</span>
        </button>
        <button
          onClick={onOpenProfile}
          className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 font-bold text-xs text-indigo-700 border border-indigo-200 hover:shadow-xs transition-all active:scale-95 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
          title="Thiết lập tài khoản"
        >
          {parent.avatar ? (
            <img src={parent.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            parent.hoTen.split(" ").slice(-1)[0]?.slice(0, 2).toUpperCase() || "PH"
          )}
        </button>
      </div>
    </header>
  );
}
