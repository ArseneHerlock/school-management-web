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
import { CalendarDays, Calendar } from 'lucide-react'

interface ChartDataPoint {
  name: string
  dateRange?: string
  present: number
  absent: number
  late: number
}

interface AttendanceChartCardProps {
  data: ChartDataPoint[]
  filterMonth: number
  setFilterMonth: (m: number) => void
  filterYear: number
  setFilterYear: (y: number) => void
}

export const AttendanceChartCard: React.FC<AttendanceChartCardProps> = ({
  data = [],
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
}) => {
  const hasData = data.some(
    (d) => (d.present || 0) + (d.absent || 0) + (d.late || 0) > 0
  )

  const totalOnTime = data.reduce((acc, d) => acc + (d.present || 0), 0)
  const totalLate = data.reduce((acc, d) => acc + (d.late || 0), 0)
  const totalAttended = totalOnTime + totalLate
  const totalAbsent = data.reduce((acc, d) => acc + (d.absent || 0), 0)

  // Tính ngưỡng tối đa của trục Y (chuẩn 5 ngày học/tuần)
  const maxWeekly = Math.max(
    5,
    ...data.map((d) => Math.max(d.present || 0, d.absent || 0, d.late || 0))
  )

  const yTicks = React.useMemo(() => {
    if (maxWeekly <= 5) return [0, 1, 2, 3, 4, 5]
    const step = Math.max(1, Math.ceil(maxWeekly / 5))
    const list: number[] = []
    for (let i = 0; i <= maxWeekly; i += step) {
      list.push(i)
    }
    if (list[list.length - 1] !== maxWeekly) list.push(maxWeekly)
    return Array.from(new Set(list)).sort((a, b) => a - b)
  }, [maxWeekly])

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-blue-100 bg-white p-3.5 sm:p-5 shadow-xs flex flex-col justify-between min-w-0 max-w-full">
      <div>
        {/* Header với bộ chọn Tháng / Năm trực tiếp */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 pb-3 border-b border-blue-50">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
              <CalendarDays size={16} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
                Biểu đồ chuyên cần theo tuần
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Phân bố số ngày Có mặt, Đi muộn và Nghỉ theo từng tuần
              </p>
            </div>
          </div>

          {/* Bộ chọn tháng và năm */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-blue-50/80 border border-blue-200/80 rounded-xl px-2.5 py-1">
              <Calendar size={13} className="text-blue-600 shrink-0" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-blue-900 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
              <span className="text-blue-300">/</span>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-blue-900 outline-none cursor-pointer"
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 p-5 text-center text-xs text-slate-500">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs text-blue-500 mb-2 border border-blue-100">
              <CalendarDays size={18} />
            </div>
            <p className="font-bold text-slate-700">Chưa có bản ghi điểm danh trong Tháng {filterMonth}/{filterYear}</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Vui lòng chọn tháng khác hoặc chờ giáo viên hoàn tất điểm danh lớp.
            </p>
          </div>
        ) : (
          <div className="h-52 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 6, left: 2, bottom: 2 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={({ x, y, payload }: any) => {
                    const item = data.find((d) => d.name === payload.value)
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={10} textAnchor="middle" fill="#334155" fontSize={10} fontWeight={700}>
                          {payload.value}
                        </text>
                        {item?.dateRange && (
                          <text x={0} y={0} dy={22} textAnchor="middle" fill="#94a3b8" fontSize={8} fontWeight={600}>
                            {item.dateRange}
                          </text>
                        )}
                      </g>
                    )
                  }}
                  height={30}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, yTicks[yTicks.length - 1] || 5]}
                  ticks={yTicks}
                  width={28}
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  tickFormatter={(v) => `${v}b`}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val} ngày (buổi)`,
                    name === 'present'
                      ? 'Có mặt đúng giờ'
                      : name === 'late'
                      ? 'Đi học muộn'
                      : 'Nghỉ học',
                  ]}
                  contentStyle={{
                    borderRadius: '0.75rem',
                    borderColor: '#e2e8f0',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: 6 }}
                  iconSize={10}
                />
                <Bar
                  dataKey="present"
                  name="Có mặt đúng giờ"
                  fill="#0284c7"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="late"
                  name="Đi muộn"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
                <Bar
                  dataKey="absent"
                  name="Nghỉ học"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {hasData && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-[11px] font-bold">
            <span className="text-sky-700">Có mặt: {totalAttended} buổi</span>
            {totalLate > 0 && <span className="text-amber-600">({totalLate} muộn)</span>}
            <span className="text-rose-600">· Nghỉ: {totalAbsent} buổi</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Tháng {filterMonth}/{filterYear} · Tối đa 5 ngày học/tuần (T2–T6)</span>
        </div>
      )}
    </div>
  )
}
