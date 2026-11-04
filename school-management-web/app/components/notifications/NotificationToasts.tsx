"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { AppNotification } from "@/services/notifications";
import {
  formatRelativeTime,
  getCategoryIcon,
  getSeverityStyles,
} from "./notificationTypes";

interface NotificationToastsProps {
  toasts: AppNotification[];
  onSelect: (item: AppNotification) => void;
  onDismiss: (id: string) => void;
}

export default function NotificationToasts({
  toasts,
  onSelect,
  onDismiss,
}: NotificationToastsProps) {
  // Tự động ẩn toast sau 4 giây để không che khuất màn hình điện thoại
  useEffect(() => {
    if (toasts.length === 0) return;
    const latestToast = toasts[0];
    const timer = setTimeout(() => {
      onDismiss(latestToast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  // Trên mobile chỉ hiển thị tối đa 1 toast gần nhất, trên desktop hiển thị tối đa 2
  const visibleToasts = toasts.slice(0, 1);

  return (
    <div className="fixed bottom-20 sm:bottom-auto sm:top-18 left-3 right-3 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {visibleToasts.map((toast) => {
        const styles = getSeverityStyles(toast.severity);
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-white/98 p-3 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${styles.iconBg}`}
            >
              {getCategoryIcon(toast.category, toast.severity)}
            </div>
            <div
              onClick={() => onSelect(toast)}
              className="min-w-0 flex-1 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                {toast.badgeText && (
                  <span
                    className={`inline-flex items-center rounded-md border px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${styles.badge}`}
                  >
                    {toast.badgeText}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 font-medium">
                  {formatRelativeTime(toast.timestamp)}
                </span>
              </div>
              <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                {toast.title}
              </p>
              <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
export { NotificationToasts };
