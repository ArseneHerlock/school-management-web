'use client'

import React from 'react'
import { HeartPulse, UserRound } from 'lucide-react'
import { calculateBmi, classifyWhoBmi } from '@/app/teacher/health/components/whoStandards'

interface ChildHealthTeacherSummaryProps {
  healthRecord: any
  teacherName?: string
  teacherPhone?: string
  className?: string
  onNavigateHealth: () => void
  onNavigateMessages: () => void
}

export const ChildHealthTeacherSummary: React.FC<ChildHealthTeacherSummaryProps> = ({
  healthRecord,
  teacherName,
  teacherPhone,
  className,
  onNavigateHealth,
  onNavigateMessages,
}) => {
  const computedBmi =
    healthRecord?.bmi ?? calculateBmi(healthRecord?.canNang, healthRecord?.chieuCao)
  const whoClass = classifyWhoBmi(computedBmi)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <HeartPulse size={16} className="text-rose-500" />
              <span>Sức khỏe thể chất gần nhất</span>
            </h4>
            {computedBmi ? (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${whoClass.badgeBg} ${whoClass.textClass} ${whoClass.borderClass}`}
              >
                {whoClass.shortLabel}
              </span>
            ) : null}
          </div>
          <button
            onClick={onNavigateHealth}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Xem sổ sức khỏe
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Chiều cao</p>
            <p className="mt-1 text-lg font-black text-slate-800">
              {healthRecord?.chieuCao ? `${healthRecord.chieuCao} cm` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Cân nặng</p>
            <p className="mt-1 text-lg font-black text-slate-800">
              {healthRecord?.canNang ? `${healthRecord.canNang} kg` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Chỉ số BMI</p>
            <p
              className={`mt-1 text-lg font-black ${
                whoClass.code === 'BINH_THUONG'
                  ? 'text-emerald-600'
                  : whoClass.code === 'CAN_NANG_THAP'
                  ? 'text-amber-600'
                  : whoClass.code === 'TIEN_BEO_PHI'
                  ? 'text-orange-600'
                  : 'text-rose-600'
              }`}
            >
              {computedBmi ? Number(computedBmi).toFixed(1) : '—'}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <UserRound size={16} className="text-blue-600" />
            <span>Giáo viên phụ trách lớp</span>
          </h4>
          <button
            onClick={onNavigateMessages}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Nhắn tin cho cô
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-sm">
            {(teacherName || 'GV').slice(-2).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-sm">{teacherName || 'Giáo viên lớp'}</p>
            <p className="text-xs text-slate-400">Giáo viên chủ nhiệm · Lớp {className}</p>
            {teacherPhone && (
              <p className="text-xs font-mono text-blue-600 mt-0.5">SĐT: {teacherPhone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
