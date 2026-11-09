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
  const isUrgent = item.severity === "danger" || item.severity === "warning";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative flex items-start gap-3 px-3.5 py-2.5 transition-colors cursor-pointer select-none focus:outline-none focus:bg-slate-100 ${
        item.read
          ? "bg-white hover:bg-slate-50/80"
          : isUrgent
          ? "bg-rose-50/40 hover:bg-rose-50/70 border-l-[3px] border-rose-500"
          : "bg-indigo-50/30 hover:bg-indigo-50/60 border-l-[3px] border-indigo-600"
      }`}
    >
      {/* Category Icon */}
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs ${styles.iconBg}`}
      >
        {getCategoryIcon(item.category, item.severity)}
      </div>

      {/* Main Body */}
      <div className="min-w-0 flex-1">
        {/* Top Badges & Timestamp */}
        <div className="flex items-center justify-between gap-1.5 mb-1">
          <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden flex-wrap">
            {item.badgeText && (
              <span
                className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tight shrink-0 ${styles.badge}`}
              >
                {item.badgeText}
              </span>
            )}
            {item.childName && (
              <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-slate-700 truncate max-w-[90px] sm:max-w-[140px]">
                {item.childName}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-slate-400 shrink-0 whitespace-nowrap ml-auto">
            {formatRelativeTime(item.timestamp)}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-1.5">
          <p
            className={`text-xs sm:text-[13px] leading-snug flex-1 line-clamp-2 ${
              item.read
                ? "font-semibold text-slate-700"
                : "font-black text-slate-900 group-hover:text-indigo-600"
            }`}
          >
            {item.title}
          </p>
          {!item.read && (
            <span
              className={`h-2 w-2 rounded-full shrink-0 mt-0.5 ${styles.dot}`}
              title="Chưa đọc"
            />
          )}
        </div>

        {/* Message preview */}
        <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-2 mt-0.5">
          {item.message}
        </p>
      </div>

      {/* Right Hover Affordance */}
      <div className="self-center pl-1 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0">
        <ChevronRight size={14} />
      </div>
    </div>
  );
}

export { NotificationItemCard };
