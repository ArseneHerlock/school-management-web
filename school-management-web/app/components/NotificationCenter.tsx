"use client";

import React from "react";
import { Bell } from "lucide-react";
import {
  NotificationCenterProps,
  formatRelativeTime,
  getCategoryIcon,
  getSeverityStyles,
} from "./notifications/notificationTypes";
import { useNotificationCenter } from "./notifications/useNotificationCenter";
import NotificationToasts from "./notifications/NotificationToasts";
import NotificationDropdown from "./notifications/NotificationDropdown";

export type { NotificationCenterProps };
export { formatRelativeTime, getCategoryIcon, getSeverityStyles };

export default function NotificationCenter(props: NotificationCenterProps) {
  const { role } = props;
  const {
    open,
    setOpen,
    loading,
    notifications,
    activeFilter,
    setActiveFilter,
    toastAlerts,
    setToastAlerts,
    liveConnected,
    containerRef,
    unreadCount,
    urgentCount,
    filteredList,
    loadNotifications,
    handleSelectNotification,
    handleMarkAllRead,
  } = useNotificationCenter(props);

  return (
    <div ref={containerRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) void loadNotifications(true);
        }}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
          urgentCount > 0
            ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : open
            ? role === "teacher"
              ? "border-orange-300 bg-orange-50 text-orange-600"
              : "border-indigo-300 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
        title="Trung tâm thông báo & Cảnh báo"
      >
        <Bell size={17} className={urgentCount > 0 ? "animate-bounce" : ""} />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1.5 -right-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[10px] font-black text-white shadow-xs ${
              urgentCount > 0 ? "bg-rose-600 animate-pulse" : "bg-orange-500"
            }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Real-time Toasts */}
      {!open && (
        <NotificationToasts
          toasts={toastAlerts}
          onSelect={handleSelectNotification}
          onDismiss={(id) =>
            setToastAlerts((prev) => prev.filter((x) => x.id !== id))
          }
        />
      )}

      {/* Dropdown Menu */}
      {open && (
        <NotificationDropdown
          role={role}
          liveConnected={liveConnected}
          unreadCount={unreadCount}
          totalNotifications={notifications.length}
          urgentCount={urgentCount}
          loading={loading}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          filteredList={filteredList}
          onRefresh={() => void loadNotifications(false)}
          onMarkAllRead={handleMarkAllRead}
          onClose={() => setOpen(false)}
          onSelectNotification={handleSelectNotification}
        />
      )}
    </div>
  );
}
