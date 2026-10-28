'use client'

import React from 'react'
import { Users, TrendingUp, Sparkles, Layers, CheckCircle2, XCircle } from 'lucide-react'
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
import { DanhGiaStatsData, ClassChartItem, DomainChartItem } from './types'

interface DanhGiaStatsProps {
  stats: DanhGiaStatsData
  classesCount: number
  classChartData: ClassChartItem[]
  domainChartData: DomainChartItem[]
}

export default function DanhGiaStats({
  stats,
  classesCount,
  classChartData,
  domainChartData,
}: DanhGiaStatsProps) {
  return (
    <div className="space-y-6">
      {/* 4 Thẻ Thống Kê */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng số học sinh
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalStudents}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-rose-50">
            <span>Số lớp đang theo dõi</span>
            <span className="font-bold text-slate-700">{classesCount} lớp</span>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tiến độ đánh giá
              </p>
              <p className="mt-1.5 text-3xl font-black text-rose-600">{stats.completionRate}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-400">
            <span>Đã đánh giá: {stats.assessedCount}</span>
            <span>Chưa đánh giá: {stats.unassessedCount}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tổng lượt đánh giá
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalAssessments}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-rose-50">
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 size={13} /> {stats.passCount} Đạt
            </span>
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <XCircle size={13} /> {stats.failCount} Chưa đạt
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ngân hàng Phát triển
              </p>
              <p className="mt-1.5 text-3xl font-black text-slate-800">{stats.totalCriteria}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Layers size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-rose-50">
            <span>{stats.totalActivities} hoạt động</span>
            <span>{stats.totalDomains} lĩnh vực</span>
          </div>
        </div>
      </div>

      {/* 2 Biểu Đồ Phân Tích */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800">Kết quả đánh giá theo Lớp</h3>
              <p className="text-xs text-slate-400 mt-0.5">Số lượt Đạt vs Chưa đạt của từng lớp</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              Theo Lớp
            </span>
          </div>
          <div className="h-64 w-full">
            {classChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="pass" name="Đạt" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fail" name="Chưa đạt" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu đánh giá theo lớp
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800">Kết quả theo Lĩnh vực phát triển</h3>
              <p className="text-xs text-slate-400 mt-0.5">Mức độ hoàn thành các chỉ số phát triển</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              Theo Lĩnh vực
            </span>
          </div>
          <div className="h-64 w-full">
            {domainChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="pass" name="Đạt" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fail" name="Chưa đạt" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu theo lĩnh vực
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
