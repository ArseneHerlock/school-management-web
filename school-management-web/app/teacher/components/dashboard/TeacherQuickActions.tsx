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
  BookOpenCheck,
  Flower2,
} from 'lucide-react'

interface ActionItem {
  icon: React.ElementType
  label: string
  description: string
  path: string
  colorClass: string
  bgClass: string
}

const ACTION_ITEMS: ActionItem[] = [
  {
    icon: ClipboardCheck,
    label: 'Điểm danh',
    description: 'Chấm có mặt, đi muộn, vắng',
    path: '/teacher/attendance',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-100',
  },
  {
    icon: CalendarDays,
    label: 'Lịch dạy',
    description: 'Thời khóa biểu & môn học',
    path: '/teacher/schedule',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50 hover:bg-blue-100/80 border-blue-100',
  },
  {
    icon: FileCheck2,
    label: 'Duyệt nghỉ học',
    description: 'Xác nhận đơn phụ huynh gửi',
    path: '/teacher/leave',
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-50 hover:bg-orange-100/80 border-orange-100',
  },
  {
    icon: Sparkles,
    label: 'Đánh giá trẻ',
    description: 'Theo dõi 5 lĩnh vực phát triển',
    path: '/teacher/assessment',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 hover:bg-purple-100/80 border-purple-100',
  },
  {
    icon: Flower2,
    label: 'Tặng hoa',
    description: 'Khen thưởng hoa bé ngoan',
    path: '/teacher/flower-awards',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 hover:bg-rose-100/80 border-rose-100',
  },
  {
    icon: HeartPulse,
    label: 'Khám sức khỏe',
    description: 'Cân đo chiều cao, cân nặng',
    path: '/teacher/health',
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 hover:bg-teal-100/80 border-teal-100',
  },
  {
    icon: Images,
    label: 'Album ảnh',
    description: 'Đăng khoảnh khắc hoạt động',
    path: '/teacher/album',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 hover:bg-amber-100/80 border-amber-100',
  },
  {
    icon: MessageSquare,
    label: 'Nhắn phụ huynh',
    description: 'Trao đổi tin nhắn trực tiếp',
    path: '/teacher/messages',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50 hover:bg-indigo-100/80 border-indigo-100',
  },
]

interface TeacherQuickActionsProps {
  onNavigate: (path: string) => void
}

export const TeacherQuickActions: React.FC<TeacherQuickActionsProps> = ({ onNavigate }) => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">
            Thao tác nhanh cho giáo viên
          </h3>
          <p className="text-xs text-slate-400">
            Các tiện ích thường dùng trong ngày
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ACTION_ITEMS.map((action) => {
          const IconComponent = action.icon
          return (
            <button
              key={action.label}
              onClick={() => onNavigate(action.path)}
              className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all duration-150 text-left hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${action.bgClass}`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs ${action.colorClass}`}
              >
                <IconComponent size={20} />
              </div>
              <p className="mt-2.5 text-xs font-bold text-slate-800 line-clamp-1">
                {action.label}
              </p>
              <p className="text-[10px] text-slate-500 line-clamp-1">
                {action.description}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
