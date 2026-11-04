'use client'

import React from 'react'
import { UserCheck, Clock3, UserX, Users, BarChart3 } from 'lucide-react'
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

interface DiemDanhDashboardProps {
  presentCount: number
  lateCount: number
  absentCount: number
  unrecordedCount: number
  totalStudents: number
  schoolPercent: number
  byClass: any[]
  byGrade: any[]
}

export default function DiemDanhDashboard({
  presentCount,
  lateCount,
  absentCount,
  unrecordedCount,
  totalStudents,
  schoolPercent,
  byClass = [],
  byGrade = [],
}: DiemDanhDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 4 The KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Có mặt đúng giờ</span>
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-600">
              <UserCheck size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">{presentCount}</p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">{schoolPercent}% sĩ số trường</p>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Đến lớp muộn</span>
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-amber-600">{lateCount}</p>
          <p className="mt-1 text-xs text-slate-400">Sau 08:30 sáng</p>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Vắng mặt / Xin nghỉ</span>
            <span className="p-2 rounded-2xl bg-rose-50 text-rose-600">
              <UserX size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-rose-600">{absentCount}</p>
          <p className="mt-1 text-xs text-slate-400">Có phép & không phép</p>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Chưa điểm danh</span>
            <span className="p-2 rounded-2xl bg-slate-50 text-slate-500">
              <Users size={18} />
            </span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-700">{unrecordedCount}</p>
          <p className="mt-1 text-xs text-slate-400">Tổng sĩ số: {totalStudents} bé</p>
        </div>
      </div>

      {/* 2 Bieu do chuyen can */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bieu do theo tung Lop */}
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-rose-50 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-800">Tỷ lệ chuyên cần theo từng Lớp</h3>
                <p className="text-[11px] text-slate-400">Đối chiếu số trẻ có mặt và vắng mặt hôm nay</p>
              </div>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <BarChart3 size={16} />
              </span>
            </div>

            {byClass.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có dữ liệu điểm danh theo lớp hôm nay.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byClass} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                      height={45}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" bé" />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `${val} bé`,
                        name === 'present' ? 'Có mặt' : 'Vắng mặt',
                      ]}
                      labelFormatter={(l: any) => `Lớp: ${l}`}
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="present" name="Có mặt" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar dataKey="absent" name="Vắng mặt" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Dữ liệu điểm danh thực tế từ giáo viên</span>
            <span className="font-bold text-emerald-700">Đạt chuẩn chuyên cần</span>
          </div>
        </div>

        {/* Bieu do theo Khoi mam non */}
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-rose-50 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-800">Chuyên cần theo Khối mầm non</h3>
                <p className="text-[11px] text-slate-400">Nhà trẻ, Khối Mầm, Khối Chồi, Khối Lá</p>
              </div>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <BarChart3 size={16} />
              </span>
            </div>

            {byGrade.length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
                Chưa có dữ liệu chuyên cần theo khối hôm nay.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byGrade} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} unit=" bé" />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `${val} bé`,
                        name === 'present' ? 'Có mặt' : 'Vắng mặt',
                      ]}
                      labelFormatter={(l: any) => `Khối: ${l}`}
                      contentStyle={{
                        borderRadius: '1rem',
                        borderColor: '#e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                    <Bar dataKey="present" name="Có mặt" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="absent" name="Vắng mặt" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Theo dõi phân bố chuyên cần theo độ tuổi</span>
            <span className="font-bold text-sky-700">4 Khối mầm non</span>
          </div>
        </div>
      </div>
    </div>
  )
}
