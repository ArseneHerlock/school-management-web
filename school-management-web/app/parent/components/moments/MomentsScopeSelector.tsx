'use client'

import React from 'react'
import { Users, Sparkles } from 'lucide-react'

interface MomentsScopeSelectorProps {
  activeScope: 'class' | 'child'
  onSelectScope: (scope: 'class' | 'child') => void
  classMomentsCount: number
  childMomentsCount: number
  className?: string
  childName?: string
}

export const MomentsScopeSelector: React.FC<MomentsScopeSelectorProps> = ({
  activeScope,
  onSelectScope,
  classMomentsCount,
  childMomentsCount,
  className,
  childName,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {/* CARD 1: Album hoạt động chung của lớp */}
      <button
        type="button"
        onClick={() => onSelectScope('class')}
        className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-left transition-all border-2 flex items-start gap-3 sm:gap-4 cursor-pointer relative overflow-hidden ${
          activeScope === 'class'
            ? 'bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-white border-indigo-600 shadow-md shadow-indigo-100 ring-2 ring-indigo-200'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div
          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0 transition-colors ${
            activeScope === 'class' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Users size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              HOẠT ĐỘNG CHUNG CẢ LỚP
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-black transition-colors shrink-0 ${
                activeScope === 'class' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {classMomentsCount} ảnh
            </span>
          </div>
          <h3 className="mt-0.5 text-sm sm:text-base font-black text-slate-800 truncate">
            Album sinh hoạt chung của lớp
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 line-clamp-2">
            Hình ảnh, video hoạt động chung do giáo viên chia sẻ tới phụ huynh {className ? `lớp ${className}` : 'của lớp'}
          </p>
          {activeScope === 'class' && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] sm:text-xs font-bold text-indigo-600">
              <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              Đang hiển thị
            </span>
          )}
        </div>
      </button>

      {/* CARD 2: Hình ảnh riêng của bé */}
      <button
        type="button"
        onClick={() => onSelectScope('child')}
        className={`p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-left transition-all border-2 flex items-start gap-3 sm:gap-4 cursor-pointer relative overflow-hidden ${
          activeScope === 'child'
            ? 'bg-gradient-to-br from-purple-50/90 via-pink-50/60 to-white border-purple-600 shadow-md shadow-purple-100 ring-2 ring-purple-200'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div
          className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl shrink-0 transition-colors ${
            activeScope === 'child' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Sparkles size={20} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
              HÌNH ẢNH RIÊNG CỦA BÉ
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-black transition-colors shrink-0 ${
                activeScope === 'child' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {childMomentsCount} ảnh
            </span>
          </div>
          <h3 className="mt-0.5 text-sm sm:text-base font-black text-slate-800 truncate">
            Ảnh hoạt động riêng của bé {childName ? `(${childName})` : ''}
          </h3>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 line-clamp-2">
            Hình ảnh cá nhân, sản phẩm tạo hình và góc rèn luyện riêng của bé tại trường
          </p>
          {activeScope === 'child' && (
            <span className="inline-flex items-center gap-1.5 mt-2 text-[11px] sm:text-xs font-bold text-purple-600">
              <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              Đang hiển thị
            </span>
          )}
        </div>
      </button>
    </div>
  )
}
