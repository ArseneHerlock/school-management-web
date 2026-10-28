'use client'

import React from 'react'
import { Users, Sparkles } from 'lucide-react'

interface LearningScopeCardsProps {
  activeTab: 'class' | 'child'
  setActiveTab: (t: 'class' | 'child') => void
  classMomentsCount: number
  childMomentsCount: number
  className: string
}

export const LearningScopeCards: React.FC<LearningScopeCardsProps> = ({
  activeTab,
  setActiveTab,
  classMomentsCount,
  childMomentsCount,
  className,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => setActiveTab('class')}
        className={`p-5 rounded-3xl text-left transition-all border-2 flex items-start gap-4 cursor-pointer relative overflow-hidden ${
          activeTab === 'class'
            ? 'bg-gradient-to-br from-orange-50 via-amber-50 to-white border-orange-500 shadow-lg shadow-orange-100 ring-2 ring-orange-200'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
        }`}
      >
        <div
          className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
            activeTab === 'class' ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Users size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
              CHIA SẺ TOÀN LỚP
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-black transition-colors ${
                activeTab === 'class' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {classMomentsCount} khoảnh khắc
            </span>
          </div>
          <h3 className="mt-1 text-lg font-black text-slate-800 truncate">
            Khoảnh khắc lớp ({className})
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Đăng cho <b>toàn thể phụ huynh</b> trong lớp xem chung hoạt động tập thể
          </p>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('child')}
        className={`p-5 rounded-3xl text-left transition-all border-2 flex items-start gap-4 cursor-pointer relative overflow-hidden ${
          activeTab === 'child'
            ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-white border-indigo-500 shadow-lg shadow-indigo-100 ring-2 ring-indigo-200'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
        }`}
      >
        <div
          className={`p-3.5 rounded-2xl shrink-0 transition-colors ${
            activeTab === 'child' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Sparkles size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
              GỬI RIÊNG PHỤ HUYNH
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-black transition-colors ${
                activeTab === 'child' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {childMomentsCount} khoảnh khắc
            </span>
          </div>
          <h3 className="mt-1 text-lg font-black text-slate-800 truncate">
            Khoảnh khắc của bé
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Khoảnh khắc riêng biệt — <b>chỉ phụ huynh của bé ấy</b> mới xem được
          </p>
        </div>
      </button>
    </div>
  )
}
