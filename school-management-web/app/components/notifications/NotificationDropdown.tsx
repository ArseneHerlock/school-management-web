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
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Trung tâm thông báo"
      className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 z-50 w-auto sm:w-[450px] max-h-[85vh] flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Desktop Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-3 shrink-0">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
              Thông báo & Lời nhắc
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                liveConnected
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
              title={
                liveConnected
                  ? "Đang kết nối thời gian thực"
                  : "Đang đồng bộ định kỳ"
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  liveConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              <span>{liveConnected ? "Trực tuyến" : "Đồng bộ"}</span>
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700 border border-rose-200">
                {unreadCount} mới
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">
            {role === "teacher"
              ? "Tin nhắn PH, đơn nghỉ phép, hoạt động & lịch dạy"
              : "Điểm danh, sức khỏe, học phí & thông báo lớp học"}
          </p>
        </div>

        {/* Action Buttons for Mouse Users */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition cursor-pointer"
            title="Làm mới (F5)"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer shadow-2xs"
              title="Đánh dấu tất cả là đã đọc"
            >
              <CheckCheck size={13} className="text-emerald-600" />
              <span>Đã đọc hết</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer"
            title="Đóng (Phím Esc)"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Desktop Segmented Tab Controls (Zero horizontal scrolling!) */}
      <div className="p-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-200/70 p-1 text-xs">
          <button
            onClick={() => setActiveFilter("all")}
            className={`rounded-lg py-1 px-1 text-center font-bold transition-all cursor-pointer truncate ${
              activeFilter === "all"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tất cả thông báo"
          >
            Tất cả {totalNotifications > 0 ? `(${totalNotifications})` : ""}
          </button>

          <button
            onClick={() => setActiveFilter("urgent")}
            className={`flex items-center justify-center gap-1 rounded-lg py-1 px-1 font-bold transition-all cursor-pointer truncate ${
              activeFilter === "urgent"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-rose-600 hover:text-rose-700"
            }`}
            title="Cần chú ý / Khẩn cấp"
          >
            <AlertTriangle size={11} className="shrink-0" />
            <span className="truncate">Cần chú ý {urgentCount > 0 ? `(${urgentCount})` : ""}</span>
          </button>

          <button
            onClick={() => setActiveFilter("activity")}
            className={`rounded-lg py-1 px-1 text-center font-bold transition-all cursor-pointer truncate ${
              activeFilter === "activity"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title={role === "parent" ? "Điểm danh, Sức khỏe, Đánh giá, Bé ngoan" : "Hoạt động & Chuyên môn"}
          >
            Hoạt động
          </button>

          <button
            onClick={() => setActiveFilter("contact")}
            className={`rounded-lg py-1 px-1 text-center font-bold transition-all cursor-pointer truncate ${
              activeFilter === "contact"
                ? "bg-white text-slate-800 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Tin nhắn, Lịch sinh hoạt, Tin tức"
          >
            Tin tức & Lịch
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
  );
}

export { NotificationDropdown };
