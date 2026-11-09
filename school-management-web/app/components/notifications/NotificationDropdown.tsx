"use client";

import React, { useEffect } from "react";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  X,
  Sparkles,
} from "lucide-react";
import { AppNotification } from "@/services/notifications";
import NotificationItemCard from "./NotificationItemCard";

interface NotificationDropdownProps {
  role: "teacher" | "parent";
  liveConnected: boolean;
  unreadCount: number;
  totalNotifications: number;
  urgentCount: number;
  loading: boolean;
  activeFilter: "all" | "urgent" | "activity" | "contact";
  setActiveFilter: (filter: "all" | "urgent" | "activity" | "contact") => void;
  filteredList: AppNotification[];
  onRefresh: () => void;
  onMarkAllRead: () => void;
  onClose: () => void;
  onSelectNotification: (item: AppNotification) => void;
}

export default function NotificationDropdown({
  role,
  liveConnected,
  unreadCount,
  totalNotifications,
  urgentCount,
  loading,
  activeFilter,
  setActiveFilter,
  filteredList,
  onRefresh,
  onMarkAllRead,
  onClose,
  onSelectNotification,
}: NotificationDropdownProps) {
  // Desktop keyboard: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] z-40 sm:hidden animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Trung tâm thông báo"
        className="fixed inset-x-2 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 z-50 w-auto sm:w-[440px] max-h-[82vh] flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/95 px-3.5 py-2.5 sm:px-4 sm:py-3 shrink-0">
          {/* Row 1: Tiêu đề + Huy hiệu số lượng + Nhóm nút thao tác */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight whitespace-nowrap">
                Thông báo
                <span className="hidden sm:inline"> & Lời nhắc</span>
              </h3>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-rose-500 text-white px-2 py-0.5 text-[9px] sm:text-[10px] font-black shrink-0 shadow-2xs">
                  {unreadCount} mới
                </span>
              ) : (
                <span className="rounded-full bg-slate-200 text-slate-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold shrink-0">
                  0
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2 py-1 text-[10px] sm:text-[11px] font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer shadow-2xs active:scale-95"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck size={12} className="text-emerald-600 shrink-0" />
                  <span className="whitespace-nowrap">Đọc hết</span>
                </button>
              )}

              <button
                type="button"
                onClick={onRefresh}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition cursor-pointer active:scale-95"
                title="Làm mới"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer active:scale-95"
                title="Đóng"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Row 2: Mô tả phụ & Trạng thái kết nối Realtime */}
          <div className="flex items-center justify-between gap-2 mt-1.5 text-[10px] sm:text-[11px]">
            <p className="truncate text-slate-500 text-[10px] sm:text-[11px] font-medium">
              {role === "teacher"
                ? "Tin nhắn PH, đơn từ, hoạt động lớp"
                : "Điểm danh, sức khỏe, học phí & tin nhắn"}
            </p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase shrink-0 ${
                liveConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  liveConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{liveConnected ? "Trực tuyến" : "Đồng bộ"}</span>
            </span>
          </div>
        </div>

        {/* Filter Tabs: Cuộn ngang mượt mà trên mobile, tuyệt đối không bị co chữ thành '...' */}
        <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50/50 shrink-0 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1.5 min-w-max py-0.5">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              Tất cả {totalNotifications > 0 ? `(${totalNotifications})` : ""}
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("urgent")}
              className={`flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                activeFilter === "urgent"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/80"
              }`}
            >
              <AlertTriangle size={12} className="shrink-0" />
              <span>Cần chú ý {urgentCount > 0 ? `(${urgentCount})` : ""}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("activity")}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                activeFilter === "activity"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              Hoạt động
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("contact")}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-95 ${
                activeFilter === "contact"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              Tin tức & Liên lạc
            </button>
          </div>
        </div>

      {/* Notifications List - Desktop Scrollable */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[480px] [scrollbar-width:thin]">
        {loading && totalNotifications === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <RefreshCw size={22} className="animate-spin mb-2 text-indigo-500" />
            <p className="text-xs font-bold text-slate-600">Đang đồng bộ thông báo...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2">
              <Bell size={20} />
            </div>
            <p className="text-xs font-bold text-slate-700">
              Không có thông báo nào trong mục này
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Các thông tin cập nhật về điểm danh, sức khỏe, học phí và tin nhắn sẽ tự động xuất hiện tại đây.
            </p>
          </div>
        ) : (
          filteredList.map((item) => (
            <NotificationItemCard
              key={item.id}
              item={item}
              onClick={() => onSelectNotification(item)}
            />
          ))
        )}
      </div>
    </div>
    </>
  );
}

export { NotificationDropdown };
