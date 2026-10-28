"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  FileCheck2,
  Calendar,
  Menu,
  LogOut,
} from "lucide-react";
import { currentUser, logout } from "@/services/client";
import NotificationCenter from "@/app/components/NotificationCenter";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/teacher": "Bàn làm việc tổng quan",
  "/teacher/attendance": "Điểm danh học sinh",
  "/teacher/schedule": "Lịch dạy & Hoạt động",
  "/teacher/assessment": "Đánh giá sự phát triển",
  "/teacher/activities": "Hoạt động sự kiện trường",
  "/teacher/leave": "Duyệt đơn xin nghỉ học",
  "/teacher/health": "Sức khỏe & Thể chất định kỳ",
  "/teacher/good-child": "Sổ theo dõi Bé ngoan",
  "/teacher/flower-awards": "Tặng hoa bé ngoan",
  "/teacher/messages": "Tin nhắn phụ huynh",
  "/teacher/album": "Album hình ảnh hoạt động lớp",
  "/teacher/learning": "Sản phẩm & Tác phẩm của bé",
  "/teacher/news": "Bảng tin nhà trường",
  "/teacher/profile": "Hồ sơ cá nhân giáo viên",
};

interface TeacherTopBarProps {
  teacher?: {
    name?: string;
    avatar?: string;
    color?: string;
  } | null;
  onOpenMobile?: () => void;
}

export default function TeacherTopBar({ teacher, onOpenMobile }: TeacherTopBarProps) {
  const pathname = usePathname();
  const activeUser = currentUser();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  const [badgeCounts, setBadgeCounts] = useState({
    unreadTotal: 0,
    urgentUnread: 0,
    unreadMessages: 0,
    pendingLeaves: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = ROUTE_TITLE_MAP[pathname] || "Cổng giáo viên";
  const teacherDisplayName = teacher?.name || activeUser?.name || "Giáo viên";

  const dateString = currentDateTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const timeString = currentDateTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const initials = teacherDisplayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-3 sm:px-6 backdrop-blur-md transition-all gap-2 pt-[calc(env(safe-area-inset-top,0px)+2px)]">
      {/* Tiêu đề trang & Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          onClick={onOpenMobile}
          className="rounded-xl p-2 text-slate-600 hover:bg-orange-50 hover:text-orange-600 lg:hidden border border-slate-200/60 bg-white transition cursor-pointer shrink-0"
          title="Mở menu"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <h1 className="text-xs sm:text-base font-extrabold text-slate-800 tracking-tight truncate">
              {pageTitle}
            </h1>
          </div>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 hidden sm:block truncate">
            Xin chào, <span className="font-semibold text-slate-600">{teacherDisplayName}</span> • Chúc bạn một ngày dạy học tràn đầy năng lượng!
          </p>
        </div>
      </div>

      {/* Hành động nhanh bên phải */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Đồng hồ số thời gian thực */}
        <div className="hidden items-center gap-2 rounded-xl bg-orange-50/80 px-3 py-1.5 text-xs font-bold text-orange-800 border border-orange-200/60 md:flex">
          <Calendar size={14} className="text-orange-600" />
          <span className="capitalize">{dateString}</span>
          <span className="font-mono text-orange-600 font-black ml-1">{timeString}</span>
        </div>

        {/* Trung tâm Thông báo & Cảnh báo giáo viên */}
        <NotificationCenter
          role="teacher"
          onCountsChange={setBadgeCounts}
        />

        {/* Nút tắt tới Đơn xin nghỉ */}
        <Link
          href="/teacher/leave"
          title="Duyệt đơn xin nghỉ của học sinh"
          className="relative hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition"
        >
          <FileCheck2 size={17} />
          {badgeCounts.pendingLeaves > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex min-w-[16px] h-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-black text-white">
              {badgeCounts.pendingLeaves}
            </span>
          )}
        </Link>

        {/* Nút tắt tới Tin nhắn */}
        <Link
          href="/teacher/messages"
          title="Hộp thư tin nhắn phụ huynh"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition"
        >
          <MessageSquare size={17} />
          {badgeCounts.unreadMessages > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex min-w-[16px] h-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-black text-white">
              {badgeCounts.unreadMessages}
            </span>
          )}
        </Link>

        {/* Avatar giáo viên */}
        <Link
          href="/teacher/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1 sm:pl-2.5 shadow-2xs hover:border-orange-300 transition"
        >
          <span className="hidden text-xs font-bold text-slate-700 sm:inline truncate max-w-[120px]">
            {teacherDisplayName}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-xs font-black text-white shadow-xs">
            {initials}
          </div>
        </Link>

        {/* Nút Đăng xuất tiện lợi */}
        <button
          onClick={logout}
          title="Đăng xuất khỏi hệ thống"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
