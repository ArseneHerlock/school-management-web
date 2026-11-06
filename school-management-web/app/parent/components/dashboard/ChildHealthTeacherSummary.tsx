'use client'

import React from 'react'
import { HeartPulse, UserRound } from 'lucide-react'
import { evaluateWhoMetrics } from '@/app/teacher/health/components/whoStandards'

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
  const who = healthRecord?.canNang && healthRecord?.chieuCao
    ? evaluateWhoMetrics(
        healthRecord.canNang,
        healthRecord.chieuCao,
        healthRecord.ngaySinh,
        healthRecord.gioiTinh,
        healthRecord.ngayDo || healthRecord.ngayKham
      )
    : null;

  const displayStatus = healthRecord?.ketLuanTongThe || who?.trangThaiTongThe || (healthRecord?.canNang ? 'Bình thường' : 'Chưa có số đo');
  const isAlert = who?.canCanThiep || (healthRecord?.haz && healthRecord.haz < -2) || (healthRecord?.waz && healthRecord.waz < -2) || (healthRecord?.whz && (healthRecord.whz < -2 || healthRecord.whz > 2));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <HeartPulse size={16} className="text-rose-500" />
              <span>Kết quả theo dõi thể lực & sức khỏe</span>
            </h4>
            {healthRecord?.canNang ? (
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                  isAlert
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                Chuẩn WHO 2006
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

        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 text-center min-w-0">
          <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Chiều cao</p>
            <p className="mt-1 text-base sm:text-lg font-black text-slate-800 truncate">
              {healthRecord?.chieuCao ? `${healthRecord.chieuCao} cm` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Cân nặng</p>
            <p className="mt-1 text-base sm:text-lg font-black text-slate-800 truncate">
              {healthRecord?.canNang ? `${healthRecord.canNang} kg` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase truncate">Đánh giá thể trạng</p>
            <p
              className={`mt-1 text-xs font-black truncate ${
                isAlert ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {displayStatus}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-50">
          <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <UserRound size={16} className="text-blue-600" />
            <span>Giáo viên chủ nhiệm lớp</span>
          </h4>
          <button
            onClick={onNavigateMessages}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            Trao đổi với giáo viên
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
