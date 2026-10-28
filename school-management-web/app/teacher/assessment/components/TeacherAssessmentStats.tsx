'use client'

import React from 'react'
import {
  Users,
  Activity,
  CheckCircle2,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  LayoutGrid,
  Eye,
  Heart,
  Brain,
  MessageSquare,
  Palette,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface TeacherAssessmentStatsProps {
  selectedClassId: string
  authorizedClasses: any[]
  onClassChange: (classId: string) => void
  activitiesCount: number
  progressStats: {
    totalStudents: number
    completedCells: number
    passRate: number
    passCells: number
    fullyCompletedStudentsCount: number
  }
  classBreakdown: any[]
  tierPieData: any[]
  classStudents: any[]
  getStudentProgress: (studentId: string) => { completed: number; total: number; pass: number; rate: number }
  onOpenRadar: (student: any) => void
  onGoToMatrix: () => void
}

export default function TeacherAssessmentStats({
  selectedClassId,
  authorizedClasses,
  onClassChange,
  activitiesCount,
  progressStats,
  classBreakdown,
  tierPieData,
  classStudents,
  getStudentProgress,
  onOpenRadar,
  onGoToMatrix,
}: TeacherAssessmentStatsProps) {
  return (
    <div className="space-y-6">
      {/* Bộ chọn lớp nhanh trên Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Lớp phụ trách:</span>
          <select
            value={selectedClassId}
            onChange={(e) => onClassChange(e.target.value)}
            className="w-full sm:w-auto max-w-[240px] truncate rounded-xl border border-rose-200 bg-rose-50/40 px-3 py-1.5 text-xs font-bold text-rose-800 outline-none focus:border-rose-400"
          >
            {authorizedClasses.map((c) => (
              <option key={c.id || c.Id} value={c.id || c.Id}>
                {c.tenLop || c.TenLop} (Sĩ số: {c.siSo || c.SiSo || '—'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Tổng hoạt động: <b className="text-slate-800">{activitiesCount}</b>
          </span>
          <button
            onClick={onGoToMatrix}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold hover:from-rose-600 hover:to-amber-600 shadow-sm transition"
          >
            <LayoutGrid size={14} />
            <span>Mở Ma trận Đánh giá</span>
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Sĩ số lớp</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><Users size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-800">{progressStats.totalStudents}</p>
          <p className="mt-1 text-xs text-slate-400">Bé trong lớp học</p>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lượt đánh giá HĐ</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600"><Activity size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-sky-600">{progressStats.completedCells}</p>
          <p className="mt-1 text-xs text-slate-400">Qua {activitiesCount} hoạt động tổ chức</p>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Tỷ lệ Đạt chỉ số</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">{progressStats.passRate}%</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">{progressStats.passCells} lượt đạt chỉ số</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Đạt chuẩn 100%</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Award size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-amber-600">{progressStats.fullyCompletedStudentsCount}</p>
          <p className="mt-1 text-xs text-slate-400">Bé đã đạt đủ chỉ số chuẩn</p>
        </div>
      </div>

      {/* 2 BIỂU ĐỒ */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Thống kê Đạt chuẩn theo 5 Lĩnh vực Toàn Lớp
              </h3>
              <p className="text-xs text-slate-400">
                Số lượt học sinh Đạt chuẩn, Cần rèn luyện và Chưa đánh giá
              </p>
            </div>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><BarChart3 size={16} /></span>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="shortName" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="passSlots" name="Đạt chuẩn" fill="#10b981" stackId="a" />
                <Bar dataKey="failSlots" name="Cần rèn luyện" fill="#f43f5e" stackId="a" />
                <Bar dataKey="unassessedSlots" name="Chưa đánh giá" fill="#e2e8f0" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">Phân bố Mức độ Cả Lớp</h3>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600"><PieChartIcon size={16} /></span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Xếp loại mức độ hoàn thành chỉ số của trẻ</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            {tierPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {tierPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Chưa có dữ liệu xếp loại</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100">
            {tierPieData.map((tier) => (
              <div key={tier.name} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className="truncate">{tier.name}: <b>{tier.value}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÉ TRONG LỚP & HỒ SƠ NĂNG LỰC */}
      <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs">
        <h3 className="text-sm font-extrabold text-slate-800 mb-3">Hồ sơ năng lực từng bé trong lớp</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classStudents.map((st) => {
            const prog = getStudentProgress(st.id)
            return (
              <div key={st.id} className="rounded-2xl border border-rose-50 bg-rose-50/20 p-3.5 flex items-center justify-between hover:bg-rose-50/40 transition">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-bold text-slate-800 text-xs truncate">{st.tenHocSinh}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500" style={{ width: `${prog.rate}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-rose-600">{prog.rate}%</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Đạt: {prog.pass}/{prog.completed} chỉ số</p>
                </div>
                <button
                  onClick={() => onOpenRadar(st)}
                  className="p-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition shrink-0"
                  title="Xem biểu đồ Radar năng lực"
                >
                  <Eye size={15} />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
