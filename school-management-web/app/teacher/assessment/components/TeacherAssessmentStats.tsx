'use client';

import React from 'react';
import {
  Users,
  Activity,
  CheckCircle2,
  Award,
  PieChart as PieChartIcon,
  LayoutGrid,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { ActivityBreakdownSection } from './ActivityBreakdownSection';
import { StudentProfilesSection } from './StudentProfilesSection';

interface TeacherAssessmentStatsProps {
  selectedClassId: string;
  authorizedClasses: any[];
  currentClassName?: string;
  currentTeacherName?: string;
  onClassChange: (classId: string) => void;
  activitiesCount: number;
  progressStats: {
    totalStudents: number;
    completedCells: number;
    passRate: number;
    passCells: number;
    fullyCompletedStudentsCount: number;
  };
  classBreakdown: any[];
  tierPieData: any[];
  classStudents: any[];
  getStudentProgress: (studentId: string) => { completed: number; total: number; pass: number; rate: number };
  onOpenRadar: (student: any) => void;
  onGoToMatrix: () => void;
}

export default function TeacherAssessmentStats({
  selectedClassId,
  authorizedClasses,
  currentClassName,
  currentTeacherName,
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
  const displayClassName = currentClassName || authorizedClasses[0]?.tenLop || 'Lớp phụ trách';
  const displayTeacher = currentTeacherName || authorizedClasses[0]?.teacherName || '';

  return (
    <div className="space-y-6">
      {/* Thông tin lớp được phân công phụ trách */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase">Lớp phụ trách:</span>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-rose-50 to-orange-50 border border-rose-200">
            <span className="text-xs font-black text-rose-800">
              {displayClassName}
            </span>
            <span className="text-[11px] font-bold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200/60">
              Sĩ số: {classStudents.length || 30} trẻ
            </span>
            {displayTeacher && (
              <span className="text-[11px] font-medium text-slate-600 border-l border-rose-200 pl-2">
                GVCN: <strong>{displayTeacher}</strong>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Tổng hoạt động: <b className="text-slate-800">{activitiesCount}</b>
          </span>
          <button
            onClick={onGoToMatrix}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-rose-500 to-amber-500 text-white text-xs font-bold hover:from-rose-600 hover:to-amber-600 shadow-sm transition cursor-pointer"
          >
            <LayoutGrid size={14} />
            <span>Mở Ma trận Đánh giá</span>
          </button>
        </div>
      </div>

      {/* 4 Thẻ KPI */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Sĩ số lớp</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><Users size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-slate-800">{progressStats.totalStudents}</p>
          <p className="mt-1 text-xs text-slate-400">Bé trong lớp học</p>
        </div>

        <div className="bg-white rounded-3xl border border-rose-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lượt đánh giá HĐ</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600"><Activity size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-sky-600">{progressStats.completedCells}</p>
          <p className="mt-1 text-xs text-slate-400">Qua {activitiesCount} hoạt động tổ chức</p>
        </div>

        <div className="bg-white rounded-3xl border border-emerald-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Tỷ lệ Đạt chỉ số</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-emerald-600">{progressStats.passRate}%</p>
          <p className="mt-1 text-xs text-emerald-600 font-medium">{progressStats.passCells} lượt đạt chỉ số</p>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Đạt chuẩn 100%</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><Award size={16} /></span>
          </div>
          <p className="mt-2 text-3xl font-black text-amber-600">{progressStats.fullyCompletedStudentsCount}</p>
          <p className="mt-1 text-xs text-slate-400">Bé đã đạt đủ chỉ số chuẩn</p>
        </div>
      </div>

      {/* 2 KHỐI THỐNG KÊ CHI TIẾT */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ActivityBreakdownSection
          classBreakdown={classBreakdown}
          classStudents={classStudents}
          onGoToMatrix={onGoToMatrix}
        />

        <div className="bg-white rounded-3xl border border-rose-100 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between max-w-full overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-800">Phân bố Mức độ Cả Lớp</h3>
              <span className="p-2 rounded-xl bg-sky-50 text-sky-600"><PieChartIcon size={16} /></span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Xếp loại mức độ hoàn thành chỉ số của trẻ</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            {tierPieData.length > 0 && tierPieData.some((p) => p.value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tierPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                      {tierPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '1rem', borderColor: '#e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-base font-black text-slate-800">{progressStats.passRate}%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Đạt chuẩn</span>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu xếp loại cho lớp
              </div>
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

      <StudentProfilesSection
        classStudents={classStudents}
        getStudentProgress={getStudentProgress}
        onOpenRadar={onOpenRadar}
      />
    </div>
  );
}
