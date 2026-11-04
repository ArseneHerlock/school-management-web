import React from "react";
import {
  AlertTriangle,
  Calendar,
  ClipboardCheck,
  CreditCard,
  FileCheck2,
  HeartPulse,
  MessageSquare,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { AppNotification, ParentChildSummary } from "@/services/notifications";

export interface NotificationCenterProps {
  role: "teacher" | "parent";
  childrenList?: ParentChildSummary[];
  onNavigateParentTab?: (tab: string, childId?: string) => void;
  onCountsChange?: (counts: {
    unreadTotal: number;
    urgentUnread: number;
    unreadMessages: number;
    pendingLeaves: number;
  }) => void;
}

export function formatRelativeTime(timestamp: string): string {
  if (!timestamp) return "Vừa xong";
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return String(timestamp).slice(0, 10);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function getCategoryIcon(
  category: AppNotification["category"],
  severity: AppNotification["severity"]
) {
  switch (category) {
    case "attendance":
      return <ClipboardCheck size={16} />;
    case "assessment":
      return severity === "danger" ? (
        <AlertTriangle size={16} />
      ) : (
        <Sparkles size={16} />
      );
    case "health":
      return <HeartPulse size={16} />;
    case "tuition":
      return <CreditCard size={16} />;
    case "message":
      return <MessageSquare size={16} />;
    case "schedule":
      return <Calendar size={16} />;
    case "leave":
      return <FileCheck2 size={16} />;
    case "news":
    default:
      return <Newspaper size={16} />;
  }
}

export function getSeverityStyles(severity: AppNotification["severity"]) {
  switch (severity) {
    case "danger":
      return {
        iconBg: "bg-rose-100 text-rose-600 border-rose-200",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        cardUnread: "bg-rose-50/60 border-rose-200/80 hover:bg-rose-50",
        dot: "bg-rose-500",
      };
    case "warning":
      return {
        iconBg: "bg-amber-100 text-amber-700 border-amber-200",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        cardUnread: "bg-amber-50/50 border-amber-200/80 hover:bg-amber-50",
        dot: "bg-amber-500",
      };
    case "success":
      return {
        iconBg: "bg-emerald-100 text-emerald-600 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cardUnread:
          "bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50/70",
        dot: "bg-emerald-500",
      };
    case "info":
    default:
      return {
        iconBg: "bg-blue-100 text-blue-600 border-blue-200",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        cardUnread: "bg-blue-50/40 border-blue-200/70 hover:bg-blue-50/70",
        dot: "bg-blue-500",
      };
  }
}
