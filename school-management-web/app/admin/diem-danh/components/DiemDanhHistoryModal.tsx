'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { Student, HistoryRecord } from '../types'
import { Calendar, Clock, CheckCircle2, UserX, Loader2 } from 'lucide-react'

interface DiemDanhHistoryModalProps {
  student: Student | null
  onClose: () => void
  logs: HistoryRecord[]
  loading: boolean
}

export default function DiemDanhHistoryModal({
  student,
  onClose,
  logs,
  loading,
}: DiemDanhHistoryModalProps) {
  return (
    <Modal
      isOpen={Boolean(student)}
      onClose={onClose}
      title={`Lịch sử điểm danh: ${student?.tenHocSinh || ''}`}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="flex h-36 flex-col items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="animate-spin text-emerald-500" size={24} />
            Đang tải dữ liệu điểm danh...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Chưa có bản ghi điểm danh nào trong hệ thống cho bé này.
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
            {logs.map((log) => {
              const isPresent = String(log.trangThai).toLowerCase().includes('có mặt')
              const isLate = String(log.trangThai).toLowerCase().includes('muộn')
              const isAbsent = String(log.trangThai).toLowerCase().includes('vắng') || String(log.trangThai).toLowerCase().includes('nghỉ')

              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-white text-slate-600 shadow-2xs">
                      <Calendar size={14} />
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">{log.ngay}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <Clock size={11} />
                        <span>Đón: {log.gioDen || '--:--'}</span>
                        <span>•</span>
                        <span>Trả: {log.gioVe || '--:--'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isPresent
                        ? 'bg-emerald-50 text-emerald-700'
                        : isLate
                        ? 'bg-amber-50 text-amber-700'
                        : isAbsent
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {log.trangThai}
                    </span>
                    {log.ghiChu && <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate">{log.ghiChu}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Modal>
  )
}
