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
  data,
  filterMonth,
  filterYear,
}) => {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Biểu đồ chuyên cần theo tuần</h3>
          <p className="text-xs text-slate-400">Phân bố số buổi Có mặt, Đi muộn và Vắng mặt của bé</p>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Tháng {filterMonth}/{filterYear}
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="present" name="Có mặt đúng giờ" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="late" name="Đi muộn" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" name="Vắng mặt" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
