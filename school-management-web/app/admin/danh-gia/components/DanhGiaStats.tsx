'use client'

import React from 'react'
import { Users, TrendingUp, Sparkles, Layers, CheckCircle2, XCircle, BarChart3 } from 'lucide-react'
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
import { DanhGiaStatsData, ClassChartItem, DomainChartItem } from '../types'

interface DanhGiaStatsProps {
  stats: DanhGiaStatsData
  classesCount: number
  classChartData: ClassChartItem[]
  domainChartData: DomainChartItem[]
}

export default function DanhGiaStats({
  stats,
  classesCount,
  classChartData = [],
  domainChartData = [],
}: DanhGiaStatsProps) {
  return (
    <div className="space-y-6">
      {/* 4 Thẻ Thống Kê */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng số học sinh
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalStudents}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-emerald-50">
            <span>Số lớp đang theo dõi</span>
            <span className="font-bold text-slate-700">{classesCount} lớp</span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tiến độ đánh giá
              </p>
              <p className="mt-1.5 text-3xl font-black text-emerald-600">{stats.completionRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Đã đánh giá: {stats.assessedCount}</span>
            <span>Chưa đánh giá: {stats.unassessedCount}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng lượt đánh giá
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalAssessments}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-emerald-50">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> {stats.passCount} Đạt tiêu chí
            </span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <XCircle size={13} /> {stats.failCount} Cần rèn luyện
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ngân hàng Phát triển
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalCriteria}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Layers size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-emerald-50">
            <span>{stats.totalActivities} hoạt động</span>
            <span>{stats.totalDomains} lĩnh vực mầm non</span>
          </div>
        </div>
      </div>

      {/* 2 Biểu Đồ Phân Tích */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Biểu đồ theo Lớp */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-50">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Kết quả đánh giá theo Lớp
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Số lượt Đạt vs Cần rèn luyện của từng lớp</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Theo Lớp
              </span>
            </div>

            {classChartData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có dữ liệu đánh giá theo lớp học.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={45}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" lượt" />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `${val} lượt đánh giá`,
                        name === 'pass' ? 'Đạt chuẩn' : 'Cần rèn luyện',
                      ]}
                      labelFormatter={(l: any) => `Lớp: ${l}`}
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="pass" name="Đạt chuẩn" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="fail" name="Cần rèn luyện" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Theo dõi phân bố mức độ hoàn thành</span>
            <span className="font-bold text-emerald-700">Đánh giá thực tế</span>
          </div>
        </div>

        {/* Biểu đồ theo Lĩnh vực */}
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-50">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">
                  Kết quả theo Lĩnh vực phát triển
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Mức độ đạt chuẩn theo các mảng giáo dục</p>
              </div>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                5 Lĩnh vực
              </span>
            </div>

            {domainChartData.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có dữ liệu đánh giá theo lĩnh vực.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={45}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" lượt" />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `${val} lượt đánh giá`,
                        name === 'pass' ? 'Đạt chuẩn' : 'Cần rèn luyện',
                      ]}
                      labelFormatter={(l: any) => `Lĩnh vực: ${l}`}
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="pass" name="Đạt chuẩn" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="fail" name="Cần rèn luyện" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Thể chất, Nhận thức, Ngôn ngữ, Xã hội, Thẩm mỹ</span>
            <span className="font-bold text-sky-700">Khung chuẩn BGDĐT</span>
          </div>
        </div>
      </div>
    </div>
  )
}
