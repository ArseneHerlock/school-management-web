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
    <div className="rounded-3xl border border-blue-100 bg-white overflow-hidden shadow-xs">
      <div className="p-5 border-b border-blue-50 bg-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-800">Lịch sử điểm danh chi tiết</h3>
            <p className="text-xs text-slate-400 mt-0.5">Theo dõi nhật ký đưa đón và trạng thái từng ngày</p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Tổng số: <b className="text-blue-600">{records.length}</b> ngày
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Trạng thái</label>
            <select
              className="w-full mt-1 h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="present">Có mặt</option>
              <option value="late">Đi muộn (sau 08:30)</option>
              <option value="absent">Vắng mặt</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Từ ngày</label>
            <input
              type="date"
              className="w-full mt-1 h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Đến ngày</label>
            <input
              type="date"
              className="w-full mt-1 h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 cursor-pointer"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-blue-50 bg-blue-50/50 text-[11px] font-extrabold uppercase text-blue-900 tracking-wider">
              <th className="py-3.5 px-4">Ngày</th>
              <th className="py-3.5 px-4">Thứ</th>
              <th className="py-3.5 px-4">Giờ đến</th>
              <th className="py-3.5 px-4">Giờ về</th>
              <th className="py-3.5 px-4">Trạng thái</th>
              <th className="py-3.5 px-4">Ghi chú</th>
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
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {dateObj.toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{dayOfWeek}</td>
                  <td className="py-3.5 px-4">
                    {r.gioDen ? (
                      <span className={`font-mono font-bold ${isLate ? 'text-amber-600' : 'text-slate-700'}`}>
                        {String(r.gioDen).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {r.gioVe ? (
                      <span className="font-mono font-bold text-slate-700">
                        {String(r.gioVe).slice(0, 5)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-slate-400">
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
