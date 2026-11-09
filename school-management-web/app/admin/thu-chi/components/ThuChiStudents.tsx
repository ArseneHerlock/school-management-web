'use client'

import React from 'react'
import { Check, CheckCircle2, AlertTriangle, RotateCcw, Search } from 'lucide-react'
import { StudentDebtRow } from '../types'
import Pagination from '@/app/admin/components/shared/Pagination'

interface ThuChiStudentsProps {
  studentsDebtList: StudentDebtRow[]
  classes: any[]
  selectedClassFilter: string
  setSelectedClassFilter: (val: string) => void
  debtStatusFilter: 'ALL' | 'DEBT' | 'SETTLED'
  setDebtStatusFilter: (val: 'ALL' | 'DEBT' | 'SETTLED') => void
  searchStudent: string
  setSearchStudent: (val: string) => void
  currentPage: number
  setCurrentPage: (p: number) => void
  pageSize: number
  money: (n: any) => string
  onSettleDebt: (row: StudentDebtRow) => void
  onRevertDebt: (row: StudentDebtRow) => void
}

export default function ThuChiStudents({
  studentsDebtList,
  classes,
  selectedClassFilter,
  setSelectedClassFilter,
  debtStatusFilter,
  setDebtStatusFilter,
  searchStudent,
  setSearchStudent,
  currentPage,
  setCurrentPage,
  pageSize,
  money,
  onSettleDebt,
  onRevertDebt,
}: ThuChiStudentsProps) {
  const filtered = React.useMemo(() => {
    return studentsDebtList.filter((st) => {
      if (selectedClassFilter && st.lopId !== selectedClassFilter) return false
      if (debtStatusFilter === 'DEBT' && st.isSettled) return false
      if (debtStatusFilter === 'SETTLED' && !st.isSettled) return false
      if (searchStudent) {
        const q = searchStudent.toLowerCase()
        if (!st.tenHocSinh.toLowerCase().includes(q) && !st.className.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [studentsDebtList, selectedClassFilter, debtStatusFilter, searchStudent])

  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  return (
    <div className="space-y-4">
      {/* Bộ lọc học sinh & công nợ */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-emerald-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedClassFilter}
            onChange={(e) => { setSelectedClassFilter(e.target.value); setCurrentPage(1); }}
            className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-400"
          >
            <option value="">Tất cả lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => { setDebtStatusFilter('ALL'); setCurrentPage(1); }}
              className={`rounded-lg px-2.5 py-1 font-bold ${debtStatusFilter === 'ALL' ? 'bg-white shadow-xs' : 'text-slate-500'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => { setDebtStatusFilter('DEBT'); setCurrentPage(1); }}
              className={`rounded-lg px-2.5 py-1 font-bold ${debtStatusFilter === 'DEBT' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'}`}
            >
              Còn nợ
            </button>
            <button
              onClick={() => { setDebtStatusFilter('SETTLED'); setCurrentPage(1); }}
              className={`rounded-lg px-2.5 py-1 font-bold ${debtStatusFilter === 'SETTLED' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'}`}
            >
              Đã gạch nợ
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Tìm tên bé..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="rounded-xl border border-emerald-200 py-1.5 pl-8 pr-3 text-xs outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Tìm thấy: <b className="text-emerald-600">{filtered.length}</b> học sinh
        </span>
      </div>

      {/* Bảng công nợ */}
      <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-emerald-100 bg-emerald-50/20 text-slate-500 text-[10px] uppercase">
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Lớp</th>
                <th className="p-3.5">Định mức phải thu</th>
                <th className="p-3.5">Đã đóng</th>
                <th className="p-3.5">Còn nợ</th>
                <th className="p-3.5 text-center">Trạng thái</th>
                <th className="p-3.5 text-center">Hành động gạch nợ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {paginated.map((st) => (
                <tr key={st.id} className="hover:bg-emerald-50/20 transition">
                  <td className="p-3.5 font-bold text-slate-800">{st.tenHocSinh}</td>
                  <td className="p-3.5 text-slate-600">{st.className}</td>
                  <td className="p-3.5 font-bold text-slate-800">{money(st.totalRequired)} đ</td>
                  <td className="p-3.5 text-emerald-600 font-bold">{money(st.paidAmount)} đ</td>
                  <td className="p-3.5 font-black text-emerald-600">{money(st.debtAmount)} đ</td>
                  <td className="p-3.5 text-center">
                    {st.isSettled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} /> Đã thu đủ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <AlertTriangle size={13} /> Chưa nộp
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {st.isSettled ? (
                      <button
                        onClick={() => onRevertDebt(st)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-xl border border-slate-200 text-slate-500 text-xs font-semibold hover:bg-slate-50"
                        title="Hủy gạch nợ"
                      >
                        <RotateCcw size={12} /> Hủy thu
                      </button>
                    ) : (
                      <button
                        onClick={() => onSettleDebt(st)}
                        className="inline-flex items-center gap-1 px-3.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold hover:from-emerald-600 hover:to-emerald-700 shadow-xs"
                      >
                        <Check size={13} /> Thu học phí
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Không tìm thấy học sinh nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-emerald-100 flex justify-end">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filtered.length}
            totalPages={Math.ceil(filtered.length / pageSize) || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
