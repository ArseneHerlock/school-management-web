"use client";

import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  theme?: "emerald" | "orange" | "sky" | "indigo" | "rose";
}

const THEMES = {
  emerald: {
    bg: "bg-emerald-50/80",
    spinner: "text-emerald-500",
    title: "text-emerald-900",
    sub: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
  },
  orange: {
    bg: "bg-orange-50/80",
    spinner: "text-orange-500",
    title: "text-orange-900",
    sub: "text-orange-600",
    badge: "bg-orange-100 text-orange-800",
  },
  sky: {
    bg: "bg-sky-50/80",
    spinner: "text-sky-500",
    title: "text-sky-900",
    sub: "text-sky-600",
    badge: "bg-sky-100 text-sky-800",
  },
  indigo: {
    bg: "bg-indigo-50/80",
    spinner: "text-indigo-500",
    title: "text-indigo-900",
    sub: "text-indigo-600",
    badge: "bg-indigo-100 text-indigo-800",
  },
  rose: {
    bg: "bg-rose-50/80",
    spinner: "text-rose-500",
    title: "text-rose-900",
    sub: "text-rose-600",
    badge: "bg-rose-100 text-rose-800",
  },
};

export default function LoadingScreen({
  message = "Đang tải dữ liệu...",
  subMessage = "Hệ thống đang đồng bộ dữ liệu",
  theme = "emerald",
}: LoadingScreenProps) {
  const t = THEMES[theme] || THEMES.emerald;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${t.bg} backdrop-blur-md transition-all duration-300`}
    >
      <div className="flex flex-col items-center p-6 text-center max-w-xs rounded-3xl bg-white/95 shadow-xl border border-slate-100">
        <div className="relative mb-4 flex items-center justify-center">
          <Loader2 className={`h-10 w-10 animate-spin ${t.spinner}`} />
        </div>
        <h3 className={`text-sm font-black tracking-tight ${t.title}`}>
          {message}
        </h3>
      </div>
    </div>
  );
}
