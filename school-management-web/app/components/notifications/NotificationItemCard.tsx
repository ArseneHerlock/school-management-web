"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { AppNotification } from "@/services/notifications";
import {
  formatRelativeTime,
  getCategoryIcon,
  getSeverityStyles,
} from "./notificationTypes";

interface NotificationItemCardProps {
  item: AppNotification;
  onClick: () => void;
}

export default function NotificationItemCard({
  item,
  onClick,
}: NotificationItemCardProps) {
  const styles = getSeverityStyles(item.severity);

  return (
    <div
      onClick={onClick}
      className={`group flex items-start gap-3 p-3.5 transition cursor-pointer ${
        item.read ? "bg-white hover:bg-slate-50" : styles.cardUnread
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${styles.iconBg}`}
      >
        {getCategoryIcon(item.category, item.severity)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.badgeText && (
              <span
                className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-tight ${styles.badge}`}
              >
                {item.badgeText}
              </span>
            )}
            {item.childName && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                {item.childName}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-slate-400 shrink-0">
            {formatRelativeTime(item.timestamp)}
          </span>
        </div>

        <p
          className={`text-xs leading-snug ${
            item.read
              ? "font-bold text-slate-700"
              : "font-extrabold text-slate-900"
          }`}
        >
          {item.title}
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-3">
          {item.message}
        </p>

        <div className="mt-1.5 flex items-center justify-between">
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition">
            <span>Xem chi tiết</span>
            <ChevronRight size={12} />
          </span>
          {!item.read && <span className={`h-2 w-2 rounded-full ${styles.dot}`} />}
        </div>
      </div>
    </div>
  );
}
export { NotificationItemCard };
