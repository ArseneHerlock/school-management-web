'use client'

import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'
import { CalendarDays, CheckCircle2, Info } from 'lucide-react'

interface ChartDataPoint {
  name: string
  present: number
  absent: number
  late: number
}

interface AttendanceChartCardProps {
  data: ChartDataPoint[]
  filterMonth: number
  filterYear: number
}

export const AttendanceChartCard: React.FC<AttendanceChartCardProps> = ({
  data = [],
  filterMonth,
  filterYear,
}) => {
  const hasData = data.some(
    (d) => (d.present || 0) + (d.absent || 0) + (d.late || 0) > 0
  )

  const totalPresent = data.reduce((acc, d) => acc + (d.present || 0), 0)
  const totalLate = data.reduce((acc, d) => acc + (d.late || 0), 0)
  const totalAbsent = data.reduce((acc, d) => acc + (d.absent || 0), 0)

  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-blue-50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <CalendarDays size={16} />
            </span>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                Biểu đồ chuyên cần theo tuần
              </h3>
              <p className="text-xs text-slate-400">
                Phân bố số buổi Có mặt, Đi muộn và Nghỉ học của bé
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            Tháng {filterMonth}/{filterYear}
          </span>
        </div>

        {!hasData ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 p-6 text-center text-xs text-slate-500">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-xs text-blue-500 mb-2 border border-blue-100">
              <CalendarDays size={20} />
            </div>
            <p className="font-bold text-slate-700">Chưa có bản ghi điểm danh tháng này</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
              Khi bé đến lớp và cô giáo điểm danh mỗi sáng, biểu đồ sẽ tự động ghi nhận số ngày đi học của con.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" buổi" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} buổi`,
                    name === 'present'
                      ? 'Có mặt đúng giờ'
                      : name === 'late'
                      ? 'Đi học muộn'
                      : 'Nghỉ học',
                  ]}
                  contentStyle={{
                    borderRadius: '1rem',
                    borderColor: '#e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 6 }} />
                <Bar dataKey="present" name="Có mặt đúng giờ" fill="#0284c7" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="late" name="Đi muộn" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="absent" name="Nghỉ học" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sky-700">Có mặt: {totalPresent} buổi</span>
            {totalLate > 0 && <span className="font-bold text-amber-600">Đi muộn: {totalLate}</span>}
            <span className="font-bold text-rose-600">Nghỉ: {totalAbsent} buổi</span>
          </div>
          <span className="font-semibold text-slate-400">Đồng bộ từ sổ điểm danh lớp</span>
        </div>
      )}
    </div>
  )
}
