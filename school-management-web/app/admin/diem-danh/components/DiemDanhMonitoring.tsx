'use client'

import React from 'react'
import { Eye, Search } from 'lucide-react'
import { Student, ClassRow } from '../types'

interface DiemDanhMonitoringProps {
  students: any[]
  classes: ClassRow[]
  selectedClassId: string
  setSelectedClassId: (v: string) => void
  q: string
  setQ: (v: string) => void
  onViewHistory: (student: Student) => void
}

export default function DiemDanhMonitoring({
  students,
  classes,
  selectedClassId,
  setSelectedClassId,
  q,
  setQ,
  onViewHistory,
}: DiemDanhMonitoringProps) {
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL')

  const filteredStudents = React.useMemo(() => {
    if (statusFilter === 'ALL') return students
    return students.filter((st) => {
      const att = st.att || {}
      const statusText = String(att.trangThai || '').toLowerCase()
      if (statusFilter === 'PRESENT') return statusText.includes('có mặt')
      if (statusFilter === 'LATE') return statusText.includes('muộn')
      if (statusFilter === 'ABSENT') return statusText.includes('vắng') || statusText.includes('nghỉ')
      if (statusFilter === 'UNRECORDED') return !att.coBanGhi
      return true
    })
  }, [students, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-2xl border border-rose-200 bg-rose-50/40 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
          >
            <option value="ALL">Toàn trường (Tất cả các lớp)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-rose-200 bg-rose-50/40 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
          >
            <option value="ALL">Tất cả trạng thái điểm danh</option>
            <option value="PRESENT">Đang có mặt tại lớp</option>
            <option value="LATE">Đi học muộn (Sau 8:30)</option>
            <option value="ABSENT">Vắng mặt / Xin nghỉ</option>
            <option value="UNRECORDED">Chưa điểm danh hôm nay</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Tìm theo tên bé, lớp..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-2xl border border-rose-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-rose-400 w-48 sm:w-60"
            />
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Hiển thị: <b className="text-rose-600">{filteredStudents.length}</b> / {students.length} học sinh
        </span>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Lớp / Khối</th>
                <th className="p-3.5 text-center">Trạng thái điểm danh</th>
                <th className="p-3.5">Giờ đón vào</th>
                <th className="p-3.5">Giờ trả về</th>
                <th className="p-3.5">Ghi chú sức khỏe / Đưa đón</th>
                <th className="p-3.5 text-center">Lịch sử</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
                  const att = st.att || {}
                  const isPresent = att.coBanGhi && String(att.trangThai).toLowerCase().includes('có mặt')
                  const isLate = att.coBanGhi && String(att.trangThai).toLowerCase().includes('muộn')
                  const isAbsent = att.coBanGhi && (String(att.trangThai).toLowerCase().includes('vắng') || String(att.trangThai).toLowerCase().includes('nghỉ'))

                  return (
                    <tr key={st.id} className="hover:bg-rose-50/20 transition">
                      <td className="p-3.5 font-bold text-slate-800">{st.tenHocSinh}</td>
                      <td className="p-3.5 text-slate-600">
                        <p className="font-semibold text-slate-700">{st.className}</p>
                        <p className="text-[10px] text-slate-400">{st.gradeName}</p>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isPresent
                            ? 'bg-emerald-50 text-emerald-700'
                            : isLate
                            ? 'bg-amber-50 text-amber-700'
                            : isAbsent
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isPresent ? 'Có mặt' : isLate ? 'Đi muộn' : isAbsent ? 'Vắng mặt' : 'Chưa điểm danh'}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-semibold">{att.gioDen || '-'}</td>
                      <td className="p-3.5 text-slate-600 font-semibold">{att.gioVe || '-'}</td>
                      <td className="p-3.5 text-slate-500 max-w-xs truncate">{att.ghiChu || '-'}</td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => onViewHistory(st)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                          title="Xem lịch sử chuyên cần"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
