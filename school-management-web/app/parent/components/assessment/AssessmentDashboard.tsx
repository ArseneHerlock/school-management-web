'use client'

import React from 'react'
import { CheckCircle2, XCircle, Award, Sparkles, TrendingUp } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'

interface AssessmentDashboardProps {
  generalStats: {
    totalPass: number
    totalFail: number
    totalAssessed: number
    totalCriteria: number
    overallRate: number
  }
  radarChartData: any[]
  barChartData: any[]
  domainBreakdown: any[]
}

export default function AssessmentDashboard({
  generalStats,
  radarChartData,
  barChartData,
  domainBreakdown,
}: AssessmentDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 4 Thẻ KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Mức độ phát triển</span>
            <span className="p-2 rounded-2xl bg-rose-50 text-rose-600"><TrendingUp size={18} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-rose-600">{generalStats.overallRate}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ width: `${generalStats.overallRate}%` }} />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tiêu chí đạt chuẩn</span>
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={18} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">{generalStats.totalPass}</p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">Chỉ số bé làm rất tốt</p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cần rèn luyện thêm</span>
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-600"><XCircle size={18} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-amber-600">{generalStats.totalFail}</p>
          <p className="mt-1 text-xs text-slate-400">Cô và gia đình cùng hỗ trợ</p>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tiêu chí đã theo dõi</span>
            <span className="p-2 rounded-2xl bg-sky-50 text-sky-600"><Award size={18} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-800">
            {generalStats.totalAssessed}/{generalStats.totalCriteria}
          </p>
          <p className="mt-1 text-xs text-slate-400">Tổng ngân hàng chuẩn</p>
        </div>
      </div>

      {/* 2 Biểu đồ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-800">Biểu đồ đa giác 5 lĩnh vực phát triển</h3>
            <p className="text-xs text-slate-400 mt-0.5">So sánh năng lực thực tế của bé với mục tiêu chuẩn 100%</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar name="Điểm phát triển (%)" dataKey="Điểm phát triển (%)" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-800">Số lượng tiêu chí Đạt vs Cần rèn luyện</h3>
            <p className="text-xs text-slate-400 mt-0.5">Phân bổ chi tiết số lượng chỉ số của từng mảng</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Đạt chuẩn" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cần rèn luyện" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
