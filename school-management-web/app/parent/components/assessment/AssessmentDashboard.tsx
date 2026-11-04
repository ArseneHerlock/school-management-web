'use client'

import React from 'react'
import { CheckCircle2, XCircle, Award, Sparkles, TrendingUp, Info } from 'lucide-react'
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
  radarChartData = [],
  barChartData = [],
  domainBreakdown = [],
}: AssessmentDashboardProps) {
  const hasAssessmentData = generalStats.totalAssessed > 0

  return (
    <div className="space-y-6">
      {/* 4 Thẻ KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Mức độ phát triển</span>
            <span className="p-2 rounded-2xl bg-rose-50 text-rose-600">
              <TrendingUp size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-rose-600">{generalStats.overallRate}%</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
              style={{ width: `${generalStats.overallRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tiêu chí đạt chuẩn</span>
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">{generalStats.totalPass}</p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">Chỉ số con làm rất tốt</p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cần rèn luyện thêm</span>
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-600">
              <XCircle size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-amber-600">{generalStats.totalFail}</p>
          <p className="mt-1 text-xs text-slate-400">Cô và gia đình cùng hỗ trợ con</p>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Tiêu chí đã theo dõi</span>
            <span className="p-2 rounded-2xl bg-sky-50 text-sky-600">
              <Award size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-800">
            {generalStats.totalAssessed}/{generalStats.totalCriteria}
          </p>
          <p className="mt-1 text-xs text-slate-400">Tổng ngân hàng chuẩn</p>
        </div>
      </div>

      {/* 2 Biểu đồ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Biểu đồ đa giác 5 lĩnh vực */}
        <div className="rounded-3xl border border-rose-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-2 border-b border-rose-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  Biểu đồ 5 Lĩnh vực Phát triển
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  So sánh năng lực thực tế của bé với mục tiêu chuẩn 100%
                </p>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                Toàn diện
              </span>
            </div>

            {!hasAssessmentData || radarChartData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/20 p-6 text-center text-xs text-slate-500">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-xs text-rose-500 mb-2 border border-rose-100">
                  <Sparkles size={20} />
                </div>
                <p className="font-bold text-slate-700">Chưa có phiếu đánh giá định kỳ</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                  Cô giáo sẽ ghi nhận các cột mốc phát triển của con qua các hoạt động trải nghiệm sắp tới.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarChartData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis
                      dataKey="domain"
                      tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar
                      name="Điểm phát triển (%)"
                      dataKey="Điểm phát triển (%)"
                      stroke="#f43f5e"
                      fill="#f43f5e"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Khung chuẩn mầm non BGDĐT</span>
            <span className="font-bold text-rose-600">Đánh giá theo quý</span>
          </div>
        </div>

        {/* Biểu đồ Đạt vs Cần rèn luyện */}
        <div className="rounded-3xl border border-rose-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4 pb-2 border-b border-rose-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  Tiêu chí Đạt vs Cần rèn luyện
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Phân bổ chi tiết số lượng chỉ số của từng mảng
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Chi tiết
              </span>
            </div>

            {!hasAssessmentData || barChartData.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                Chưa có dữ liệu phân bổ tiêu chí.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={45}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" chỉ số" />
                    <Tooltip
                      formatter={(val: any, name: any) => [`${val} chỉ số`, name]}
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="Đạt chuẩn" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="Cần rèn luyện" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Gia đình có thể phối hợp cùng cô rèn luyện</span>
            <span className="font-bold text-emerald-700">Đồng hành cùng con</span>
          </div>
        </div>
      </div>
    </div>
  )
}
