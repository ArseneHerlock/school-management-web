'use client'

import React from 'react'
import {
  ClipboardCheck,
  Award,
  Sparkles,
  HeartPulse,
  Images,
  CalendarDays,
  MessageSquare,
  FileCheck2,
  Flower2,
  Soup,
  Pill,
  Moon,
  ChevronRight,
} from 'lucide-react'

interface ActionItem {
  icon: React.ElementType
  label: string
  sublabel: string
  path: string
  colorClass: string
  bgClass: string
  badgeText?: string
}

const ACTION_ITEMS: ActionItem[] = [
  {
    icon: ClipboardCheck,
    label: 'Điểm danh lớp',
    sublabel: 'Đón trẻ, vắng mặt, đi muộn',
    path: '/teacher/attendance',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100/90 border-emerald-200/80',
    badgeText: 'Đầu giờ',
  },
  {
    icon: Soup,
    label: 'Báo ăn bán trú',
    sublabel: 'Chốt số lượng suất ăn nhà bếp',
    path: '/teacher/attendance',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50 hover:bg-amber-100/90 border-amber-200/80',
    badgeText: 'Trước 08:30',
  },
  {
    icon: Pill,
    label: 'Sổ dặn thuốc uống',
    sublabel: 'Đơn dặn thuốc phụ huynh gửi',
    path: '/teacher/leave',
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50 hover:bg-rose-100/90 border-rose-200/80',
    badgeText: 'An toàn y tế',
  },
  {
    icon: Moon,
    label: 'Nề nếp ngủ trưa',
    sublabel: 'Ghi nhận giờ ngủ & nề nếp',
    path: '/teacher/attendance',
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100/90 border-indigo-200/80',
    badgeText: '11:30 - 14:00',
  },
  {
    icon: Flower2,
    label: 'Bình cờ bé ngoan',
    sublabel: 'Khen thưởng chuyên cần & nề nếp',
    path: '/teacher/flower-awards',
    colorClass: 'text-pink-700',
    bgClass: 'bg-pink-50 hover:bg-pink-100/90 border-pink-200/80',
    badgeText: 'Thứ 6 hàng tuần',
  },
  {
    icon: FileCheck2,
    label: 'Duyệt đơn nghỉ',
    sublabel: 'Xác nhận đơn xin phép từ phụ huynh',
    path: '/teacher/leave',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50 hover:bg-orange-100/90 border-orange-200/80',
  },
  {
    icon: Images,
    label: 'Album ảnh lớp',
    sublabel: 'Hình ảnh hoạt động học & vui chơi',
    path: '/teacher/album',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50 hover:bg-sky-100/90 border-sky-200/80',
  },
  {
    icon: MessageSquare,
    label: 'Liên lạc phụ huynh',
    sublabel: 'Sổ liên lạc & trao đổi trực tuyến',
    path: '/teacher/messages',
    colorClass: 'text-purple-700',
    bgClass: 'bg-purple-50 hover:bg-purple-100/90 border-purple-200/80',
  },
]

interface TeacherQuickActionsProps {
  onNavigate: (path: string) => void
}

export const TeacherQuickActions: React.FC<TeacherQuickActionsProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-slate-100 shadow-xs max-w-full min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          Nghiệp vụ sư phạm hàng ngày
        </span>
        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
          Thao tác nhanh
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 text-center">
        {ACTION_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.path)}
              className="flex flex-col items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition cursor-pointer group min-w-0"
            >
              <div
                className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition shrink-0 ${item.bgClass}`}
              >
                <Icon size={20} className={item.colorClass} />
              </div>
              <span className="text-[11px] font-bold text-slate-700 leading-tight truncate w-full">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}