'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { Student, HistoryRecord } from './types'
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
      subtitle="Nhật ký đến lớp và ra về của bé theo từng ngày"
      maxWidth="md"
    >
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 flex justify-center text-rose-500">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {logs.map((log) => {
              const isPresent = String(log.trangThai).toLowerCase().includes('có mặt')
              return (
                <div key={log.id} className="rounded-2xl border border-rose-100 bg-rose-50/20 p-3 text-xs flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Calendar size={12} className="text-rose-500" />
                      <span>{log.ngay?.slice(0, 10)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-500">
                      <span>Vào: <b>{log.gioDen || '--:--'}</b></span>
                      <span>Về: <b>{log.gioVe || '--:--'}</b></span>
                    </div>
                    {log.ghiChu && <p className="mt-1 text-[10px] text-slate-400 italic">{log.ghiChu}</p>}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    isPresent ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {log.trangThai}
                  </span>
                </div>
              )
            })}
            {logs.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-400 italic">
                Chưa có nhật ký điểm danh cho học sinh này
              </p>
            )}
          </div>
        )}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button onClick={onClose} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  )
}
