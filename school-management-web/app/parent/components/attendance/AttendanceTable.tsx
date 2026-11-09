'use client'

import React from 'react'
import { CalendarDays, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface AttendanceRecord {
  id: string
  hocSinhId: string
  ngay: string
  trangThai: string
  gioDen?: string | null
  gioVe?: string | null
}

interface AttendanceTableProps {
  records: AttendanceRecord[]
  statusFilter: string
  setStatusFilter: (s: string) => void
  fromDate: string
  setFromDate: (d: string) => void
  toDate: string
  setToDate: (d: string) => void
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  statusFilter,
  setStatusFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
}) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white overflow-hidden shadow-xs">
      <div className="p-3.5 sm:p-5 border-b border-blue-50 bg-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800">Lịch sử điểm danh</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              Theo dõi thời gian đón trả trẻ và tình hình chuyên cần từng ngày
            </p>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500">
            Tổng số: <b className="text-blue-600">{records.length}</b> ngày
          </span>
        </div>

        <div className="grid gap-2 grid-cols-1 sm:grid-cols-3">
          <div>
            <select
              className="w-full h-8 sm:h-9 rounded-xl border border-blue-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-blue-400 font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="present">Có mặt</option>
              <option value="late">Đến muộn (sau 08:30)</option>
              <option value="absent">Vắng mặt</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:contents">
            <div>
              <input
                type="date"
                className="w-full h-8 sm:h-9 rounded-xl border border-blue-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-blue-400 cursor-pointer font-semibold"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                placeholder="Từ ngày"
              />
            </div>

            <div>
              <input
                type="date"
                className="w-full h-8 sm:h-9 rounded-xl border border-blue-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-blue-400 cursor-pointer font-semibold"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                placeholder="Đến ngày"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 1. Mobile Cards View (sm:hidden) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {records.map((r) => {
          const dateObj = new Date(r.ngay)
          const dayOfWeek = [
            'CN',
            'T2',
            'T3',
            'T4',
            'T5',
            'T6',
            'T7',
          ][dateObj.getDay()]
          const isLate = r.gioDen && r.gioDen > '08:30:00'
          const isPresent = r.trangThai === 'Có mặt'

          return (
            <div key={r.id} className="p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 text-center shrink-0">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">{dayOfWeek}</span>
                  <span className="text-xs font-black text-slate-800">{dateObj.getDate()}/{dateObj.getMonth() + 1}</span>
                </div>
                <div className="border-l border-slate-100 pl-2.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    {r.gioDen ? (
                      <span className={`font-mono font-bold ${isLate ? 'text-amber-600' : 'text-slate-800'}`}>
                        {String(r.gioDen).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                    <span className="text-slate-300">→</span>
                    {r.gioVe ? (
                      <span className="font-mono font-bold text-slate-700">
                        {String(r.gioVe).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isLate ? 'Đi muộn sau 08:30' : isPresent ? 'Sinh hoạt đúng giờ' : 'Nghỉ học'}
                  </p>
                </div>
              </div>

              <div>
                {isPresent ? (
                  isLate ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      <Clock size={10} /> Muộn
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={10} /> Có mặt
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                    <XCircle size={10} /> Vắng
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {records.length === 0 && (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CalendarDays size={24} className="mx-auto mb-1.5 text-slate-300" />
            <p className="font-bold">Không có bản ghi điểm danh</p>
          </div>
        )}
      </div>

      {/* 2. Desktop Full Table View (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50 text-[11px] font-extrabold uppercase text-blue-900 tracking-wider">
              <th className="py-3 px-4">Ngày</th>
              <th className="py-3 px-4">Thứ</th>
              <th className="py-3 px-4">Giờ đến</th>
              <th className="py-3 px-4">Giờ về</th>
              <th className="py-3 px-4">Trạng thái</th>
              <th className="py-3 px-4">Ghi chú</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => {
              const dateObj = new Date(r.ngay)
              const dayOfWeek = [
                'Chủ Nhật',
                'Thứ Hai',
                'Thứ Ba',
                'Thứ Tư',
                'Thứ Năm',
                'Thứ Sáu',
                'Thứ Bảy',
              ][dateObj.getDay()]
              const isLate = r.gioDen && r.gioDen > '08:30:00'
              const isPresent = r.trangThai === 'Có mặt'

              return (
                <tr key={r.id} className="hover:bg-blue-50/20 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {dateObj.toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{dayOfWeek}</td>
                  <td className="py-3 px-4">
                    {r.gioDen ? (
                      <span className={`font-mono font-bold ${isLate ? 'text-amber-600' : 'text-slate-700'}`}>
                        {String(r.gioDen).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {r.gioVe ? (
                      <span className="font-mono font-bold text-slate-700">
                        {String(r.gioVe).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isPresent ? (
                      isLate ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
                          <Clock size={11} /> Đi muộn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                          <CheckCircle2 size={11} /> Có mặt
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-extrabold text-rose-700">
                        <XCircle size={11} /> Vắng mặt
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {isLate ? 'Đến lớp sau giờ thể dục sáng' : isPresent ? 'Sinh hoạt đầy đủ' : 'Nghỉ học'}
                  </td>
                </tr>
              )
            })}

            {records.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <CalendarDays size={32} className="mx-auto mb-2 text-slate-300" />
                  <p className="font-bold">Không có bản ghi điểm danh trong khoảng thời gian này</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
