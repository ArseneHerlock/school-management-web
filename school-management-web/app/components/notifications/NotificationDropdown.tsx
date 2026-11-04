"use client";

import React from "react";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  X,
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
  const themeAccent =
    role === "teacher"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div className="fixed inset-x-2 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 z-50 w-auto sm:w-[420px] max-h-[82vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800">
              Thông báo & Cảnh báo
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                liveConnected
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
              title={
                liveConnected
                  ? "Đang kết nối trực tuyến thời gian thực (SSE + SignalR)"
                  : "Đang đồng bộ định kỳ"
              }
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  liveConnected ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                }`}
              />
              <span>{liveConnected ? "Trực tuyến" : "Đồng bộ"}</span>
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                {unreadCount} mới
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {role === "teacher"
              ? "Tin nhắn PH, đơn xin nghỉ, lịch dạy & thông báo trường"
              : "Điểm danh, sức khỏe, đánh giá hoạt động, học phí & tin tức"}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck size={13} />
              <span>Đã đọc hết</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 sm:hidden cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 overflow-x-auto no-scrollbar bg-white">
        <button
          onClick={() => setActiveFilter("all")}
          className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
            activeFilter === "all"
              ? themeAccent
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả ({totalNotifications})
        </button>
        <button
          onClick={() => setActiveFilter("urgent")}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
            activeFilter === "urgent"
              ? "bg-rose-600 text-white"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
          }`}
        >
          <AlertTriangle size={12} />
          <span>Cần chú ý ({urgentCount})</span>
        </button>
        {role === "parent" && (
          <button
            onClick={() => setActiveFilter("activity")}
            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
              activeFilter === "activity"
                ? themeAccent
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Điểm danh • Đánh giá • Sức khỏe
          </button>
        )}
        <button
          onClick={() => setActiveFilter("contact")}
          className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
            activeFilter === "contact"
              ? themeAccent
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tin nhắn • Lịch • Trường
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[60vh]">
        {loading && totalNotifications === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <RefreshCw size={24} className="animate-spin mb-2 text-slate-400" />
            <p className="text-xs font-bold">Đang đồng bộ thông báo từ hệ thống...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2.5">
              <Bell size={22} />
            </div>
            <p className="text-xs font-bold text-slate-600">
              Không có thông báo nào trong mục này
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Khi có thay đổi về điểm danh, tin nhắn, lịch học hoặc đánh giá, hệ
              thống sẽ hiển thị ngay tại đây.
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
