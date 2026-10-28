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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { colors } from './types'

interface SucKhoeChartsProps {
  schoolPie: any[]
  byGrade: any[]
  byClass: any[]
}

export const SucKhoeCharts: React.FC<SucKhoeChartsProps> = ({
  schoolPie,
  byGrade,
  byClass,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
        <div className="admin-card p-4">
          <h2 className="font-black">Tỷ lệ phân loại sức khỏe toàn trường</h2>
          <div className="mt-3 h-72">
            {schoolPie.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schoolPie}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={56}
                    outerRadius={92}
                  >
                    {schoolPie.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </div>
        </div>

        <Chart title="Biểu đồ sức khỏe theo khối" data={byGrade} />
      </div>

      <Chart title="Biểu đồ sức khỏe chi tiết từng lớp" data={byClass} />
    </div>
  )
}

function Chart({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="admin-card p-4">
      <h2 className="font-black">{title}</h2>
      <div className="mt-3 h-72">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e5efe8" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="measured" name="Đã có chỉ số" fill="#43a968" radius={[8, 8, 0, 0]} />
              <Bar dataKey="normal" name="BMI bình thường" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </div>
    </div>
  )
}

function Empty() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
      Chưa có dữ liệu từ máy chủ
    </div>
  )
}
