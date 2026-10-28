'use client'

import React from 'react'
import { Activity, Calendar, Search, LineChart as ChartIcon } from 'lucide-react'
import Pagination from '@/app/admin/components/shared/Pagination'
import { ClassRow } from './types'

interface HealthTableRow {
  id: string
  tenHocSinh: string
  className: string
  gradeName: string
  quarterLabel: string
  health?: any
  haz?: number
  waz?: number
  whz?: number
  hazLabel?: string
  wazLabel?: string
  whzLabel?: string
  trangThaiTheTrang?: string
  canCanThiep?: boolean
  lopId?: string
}

interface SucKhoeTableProps {
  filtered: HealthTableRow[]
  paginated: HealthTableRow[]
  classes: ClassRow[]
  q: string
  setQ: (val: string) => void
  quarterFilter: string
  setQuarterFilter: (val: string) => void
  classFilter: string
  setClassFilter: (val: string) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  itemsPerPage: number
  onOpen: (row: any) => void
}

export const SucKhoeTable: React.FC<SucKhoeTableProps> = ({
  filtered,
  paginated,
  classes,
  q,
  setQ,
  quarterFilter,
  setQuarterFilter,
  classFilter,
  setClassFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onOpen,
}) => {
  return (
    <div className="space-y-4">
      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_200px_220px]">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="admin-input pl-10"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm học sinh, lớp, khối..."
            />
          </div>
          <select
            className="admin-input font-bold"
            value={quarterFilter}
            onChange={(e) => setQuarterFilter(e.target.value)}
          >
            <option value="">Tất cả Đợt / Quý</option>
            <option value="Quý 1">Đợt Quý 1</option>
            <option value="Quý 2">Đợt Quý 2</option>
            <option value="Quý 3">Đợt Quý 3</option>
            <option value="Quý 4">Đợt Quý 4</option>
          </select>
          <select
            className="admin-input"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">Tất cả lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Khối / Lớp</th>
                <th>Chiều cao / Cân nặng</th>
                <th>HAZ (Chiều cao/Tuổi)</th>
                <th>WAZ (Cân nặng/Tuổi)</th>
                <th>WHZ (Thể trạng)</th>
                <th>Đánh giá WHO</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                  <td>
                    <b>{s.tenHocSinh}</b>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} /> {s.quarterLabel}
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-slate-700">{s.className}</span>
                    <div className="text-[10px] text-slate-400">{s.gradeName}</div>
                  </td>
                  <td>
                    {s.health?.chieuCao && s.health?.canNang ? (
                      <span className="font-semibold text-slate-800">
                        {s.health.chieuCao} cm · {s.health.canNang} kg
                      </span>
                    ) : (
                      <span className="text-slate-300 italic">Chưa có số đo</span>
                    )}
                  </td>
                  <td>
                    {s.haz != null ? (
                      <div>
                        <span className="font-bold text-blue-700">
                          {s.haz > 0 ? `+${s.haz}` : s.haz} SD
                        </span>
                        <div className="text-[10px] text-slate-500">{s.hazLabel}</div>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td>
                    {s.waz != null ? (
                      <div>
                        <span className="font-bold text-emerald-700">
                          {s.waz > 0 ? `+${s.waz}` : s.waz} SD
                        </span>
                        <div className="text-[10px] text-slate-500">{s.wazLabel}</div>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td>
                    {s.whz != null ? (
                      <div>
                        <span className="font-bold text-amber-700">
                          {s.whz > 0 ? `+${s.whz}` : s.whz} SD
                        </span>
                        <div className="text-[10px] text-slate-500">{s.whzLabel}</div>
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        !s.canCanThiep && s.health?.canNang
                          ? 'status-ok'
                          : !s.health?.canNang
                          ? 'status-off'
                          : 'status-warn'
                      }`}
                    >
                      {s.trangThaiTheTrang || (s.health?.canNang ? 'Bình thường' : 'Chưa đo')}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => onOpen(s)}
                      className="admin-btn-small flex items-center gap-1.5"
                    >
                      <ChartIcon size={14} className="text-indigo-600" />
                      <span>Xem biểu đồ & Lịch sử</span>
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy học sinh.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
