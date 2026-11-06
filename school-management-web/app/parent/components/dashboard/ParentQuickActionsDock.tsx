'use client'

import React from 'react'
import {
  FileText,
  Pill,
  UserCheck,
  Camera,
  MessageCircle,
  CreditCard,
  CalendarDays,
  HeartPulse,
} from 'lucide-react'

interface ParentQuickActionsDockProps {
  onNavigateTab: (tab: string) => void
  onOpenMedicationModal?: () => void
  onOpenPickupModal?: () => void
}

const PARENT_APPS = [
  { label: 'Đơn xin nghỉ', icon: FileText, path: 'absence', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: 'Dặn thuốc y tế', icon: Pill, path: 'medications', color: 'bg-rose-50 text-rose-600 border-rose-200' },
  { label: 'Người đón hộ', icon: UserCheck, path: 'pickup', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: 'Học phí & Tiền ăn', icon: CreditCard, path: 'tuition', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { label: 'Nhật ký đến lớp', icon: CalendarDays, path: 'attendance', color: 'bg-teal-50 text-teal-600 border-teal-200' },
  { label: 'Sức khỏe & Y tế', icon: HeartPulse, path: 'health', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { label: 'Ảnh hoạt động', icon: Camera, path: 'moments', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { label: 'Trao đổi cô giáo', icon: MessageCircle, path: 'messages', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
];

export const ParentQuickActionsDock: React.FC<ParentQuickActionsDockProps> = ({
  onNavigateTab,
}) => {
  return (
    <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-blue-50 shadow-xs max-w-full min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
          Chức năng thường dùng
        </span>
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
          Phím tắt nhanh
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-3 text-center">
        {PARENT_APPS.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => onNavigateTab(item.path)}
              className="flex flex-col items-center gap-1 sm:gap-1.5 p-1 sm:p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition cursor-pointer group min-w-0"
            >
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition shrink-0 ${item.color}`}
              >
                <Icon size={18} className="sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 leading-tight truncate w-full px-0.5">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
