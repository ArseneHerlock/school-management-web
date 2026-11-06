'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Scale,
  Activity,
  HeartPulse,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Child } from '../../data';
import { evaluateWhoMetrics, WhoAssessmentResult } from './whoStandards';
import {
  TeacherHealthFcmButtons,
  WhoFilterGroup,
  WhoGroupButtonItem,
} from './TeacherHealthFcmButtons';
import { TeacherHealthFcmCard } from './TeacherHealthFcmCard';

interface TeacherHealthFCMProps {
  childrenList: Child[];
  liveHealth: Record<string, any>;
  onSelectChildToInspect?: (child: Child) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  DAT_CHUAN_WHO: '#10b981',
  THAP_COI: '#3b82f6',
  THAP_COI_NANG: '#6366f1',
  NHE_CAN: '#f59e0b',
  NHE_CAN_NANG: '#f43f5e',
  GAY_COM: '#ea580c',
  GAY_COM_NANG: '#dc2626',
  THUA_CAN: '#8b5cf6',
  BEO_PHI: '#be185d',
};

export const TeacherHealthFCM: React.FC<TeacherHealthFCMProps> = ({
  childrenList,
  liveHealth,
  onSelectChildToInspect,
}) => {
  const [filterGroup, setFilterGroup] = useState<WhoFilterGroup>('ALL');

  const assessedList: Array<{
    child: Child;
    weight: number;
    height: number;
    assessment: WhoAssessmentResult;
  }> = [];

  const unmeasuredList: Child[] = [];

  childrenList.forEach((c) => {
    const rec = liveHealth[c.id];
    const weight = rec?.canNang != null ? Number(rec.canNang) : null;
    const height = rec?.chieuCao != null ? Number(rec.chieuCao) : null;

    if (weight && height && weight > 0 && height > 0) {
      const assessment = evaluateWhoMetrics(weight, height, c.dob, c.gender, rec?.ngayDo);
      assessedList.push({ child: c, weight, height, assessment });
    } else {
      unmeasuredList.push(c);
    }
  });

  const normalGroup = assessedList.filter((x) => !x.assessment.canCanThiep);
  const thapCoiGroup = assessedList.filter((x) => x.assessment.haz.code === 'THAP_COI');
  const thapCoiNangGroup = assessedList.filter((x) => x.assessment.haz.code === 'THAP_COI_NANG');
  const nheCanGroup = assessedList.filter((x) => x.assessment.waz.code === 'NHE_CAN');
  const nheCanNangGroup = assessedList.filter((x) => x.assessment.waz.code === 'NHE_CAN_NANG');
  const gayComGroup = assessedList.filter((x) => x.assessment.whz.code === 'GAY_COM');
  const gayComNangGroup = assessedList.filter((x) => x.assessment.whz.code === 'GAY_COM_NANG');
  const thuaCanGroup = assessedList.filter(
    (x) => x.assessment.whz.code === 'THUA_CAN' || x.assessment.waz.code === 'THUA_CAN'
  );
  const beoPhiGroup = assessedList.filter(
    (x) => x.assessment.whz.code === 'BEO_PHI' || x.assessment.waz.code === 'BEO_PHI'
  );

  const totalAssessed = assessedList.length;
  const normalRate = totalAssessed > 0 ? Math.round((normalGroup.length / totalAssessed) * 100) : 0;

  // Dữ liệu 9 nhóm phân loại thể trạng lớp
  const classNutritionStats = [
    { key: 'DAT_CHUAN_WHO' as WhoFilterGroup, name: 'Đạt chuẩn WHO', value: normalGroup.length, color: '#10b981', criteria: '-2 ≤ Z ≤ +2 SD' },
    { key: 'THAP_COI' as WhoFilterGroup, name: 'Thấp còi', value: thapCoiGroup.length, color: '#3b82f6', criteria: 'HAZ < -2 SD' },
    { key: 'THAP_COI_NANG' as WhoFilterGroup, name: 'Thấp còi nặng', value: thapCoiNangGroup.length, color: '#6366f1', criteria: 'HAZ < -3 SD' },
    { key: 'NHE_CAN' as WhoFilterGroup, name: 'Nhẹ cân', value: nheCanGroup.length, color: '#f59e0b', criteria: 'WAZ < -2 SD' },
    { key: 'NHE_CAN_NANG' as WhoFilterGroup, name: 'Nhẹ cân nặng', value: nheCanNangGroup.length, color: '#f43f5e', criteria: 'WAZ < -3 SD' },
    { key: 'GAY_COM' as WhoFilterGroup, name: 'Gầy còm', value: gayComGroup.length, color: '#ea580c', criteria: 'WHZ < -2 SD' },
    { key: 'GAY_COM_NANG' as WhoFilterGroup, name: 'Gầy còm nặng', value: gayComNangGroup.length, color: '#dc2626', criteria: 'WHZ < -3 SD' },
    { key: 'THUA_CAN' as WhoFilterGroup, name: 'Thừa cân', value: thuaCanGroup.length, color: '#8b5cf6', criteria: 'WHZ/WAZ > +2 SD' },
    { key: 'BEO_PHI' as WhoFilterGroup, name: 'Béo phì', value: beoPhiGroup.length, color: '#be185d', criteria: 'WHZ/WAZ > +3 SD' },
  ];

  const pieChartData = classNutritionStats.filter((item) => item.value > 0);

  const displayList = assessedList.filter((x) => {
    switch (filterGroup) {
      case 'DAT_CHUAN_WHO':
        return !x.assessment.canCanThiep;
      case 'THAP_COI':
        return x.assessment.haz.code === 'THAP_COI';
      case 'THAP_COI_NANG':
        return x.assessment.haz.code === 'THAP_COI_NANG';
      case 'NHE_CAN':
        return x.assessment.waz.code === 'NHE_CAN';
      case 'NHE_CAN_NANG':
        return x.assessment.waz.code === 'NHE_CAN_NANG';
      case 'GAY_COM':
        return x.assessment.whz.code === 'GAY_COM';
      case 'GAY_COM_NANG':
        return x.assessment.whz.code === 'GAY_COM_NANG';
      case 'THUA_CAN':
        return x.assessment.whz.code === 'THUA_CAN' || x.assessment.waz.code === 'THUA_CAN';
      case 'BEO_PHI':
        return x.assessment.whz.code === 'BEO_PHI' || x.assessment.waz.code === 'BEO_PHI';
      default:
        return true;
    }
  });

  const whoGroupButtons: WhoGroupButtonItem[] = [
    {
      key: 'DAT_CHUAN_WHO',
      label: 'Đạt chuẩn WHO',
      sub: 'Phát triển cân đối',
      count: normalGroup.length,
      icon: CheckCircle2,
      activeClass: 'bg-emerald-600 text-white border-emerald-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-emerald-300',
      iconIdle: 'text-emerald-500',
      subActive: 'text-emerald-100',
    },
    {
      key: 'THAP_COI',
      label: 'Thấp còi',
      sub: 'Chiều cao dưới chuẩn',
      count: thapCoiGroup.length,
      icon: Ruler,
      activeClass: 'bg-blue-600 text-white border-blue-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-blue-300',
      iconIdle: 'text-blue-500',
      subActive: 'text-blue-100',
    },
    {
      key: 'THAP_COI_NANG',
      label: 'Thấp còi nặng',
      sub: 'Cần can thiệp chiều cao',
      count: thapCoiNangGroup.length,
      icon: Ruler,
      activeClass: 'bg-indigo-600 text-white border-indigo-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-indigo-300',
      iconIdle: 'text-indigo-600',
      subActive: 'text-indigo-100',
    },
    {
      key: 'NHE_CAN',
      label: 'Nhẹ cân',
      sub: 'Cân nặng dưới chuẩn',
      count: nheCanGroup.length,
      icon: Scale,
      activeClass: 'bg-amber-500 text-white border-amber-600 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-amber-300',
      iconIdle: 'text-amber-500',
      subActive: 'text-amber-100',
    },
    {
      key: 'NHE_CAN_NANG',
      label: 'Nhẹ cân nặng',
      sub: 'Cần can thiệp dinh dưỡng',
      count: nheCanNangGroup.length,
      icon: Scale,
      activeClass: 'bg-orange-600 text-white border-orange-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-orange-300',
      iconIdle: 'text-orange-600',
      subActive: 'text-orange-100',
    },
    {
      key: 'GAY_COM',
      label: 'Gầy còm',
      sub: 'Thiếu cân so với chiều cao',
      count: gayComGroup.length,
      icon: Activity,
      activeClass: 'bg-rose-500 text-white border-rose-600 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-rose-300',
      iconIdle: 'text-rose-500',
      subActive: 'text-rose-100',
    },
    {
      key: 'GAY_COM_NANG',
      label: 'Gầy còm nặng',
      sub: 'Cần phục hồi thể trạng',
      count: gayComNangGroup.length,
      icon: Activity,
      activeClass: 'bg-red-600 text-white border-red-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-red-300',
      iconIdle: 'text-red-600',
      subActive: 'text-red-100',
    },
    {
      key: 'THUA_CAN',
      label: 'Thừa cân',
      sub: 'Cân nặng vượt chuẩn',
      count: thuaCanGroup.length,
      icon: AlertTriangle,
      activeClass: 'bg-purple-600 text-white border-purple-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-purple-300',
      iconIdle: 'text-purple-600',
      subActive: 'text-purple-100',
    },
    {
      key: 'BEO_PHI',
      label: 'Béo phì',
      sub: 'Cần cân bằng năng lượng',
      count: beoPhiGroup.length,
      icon: AlertTriangle,
      activeClass: 'bg-pink-600 text-white border-pink-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-pink-300',
      iconIdle: 'text-pink-600',
      subActive: 'text-pink-100',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Banner Tổng quan thể trạng lớp */}
      <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 text-white shadow-md shadow-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              THEO DÕI THỂ TRẠNG LỚP HỌC
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Giám Sát Thể Trạng & Sức Khỏe Định Kỳ
            </h2>
            <p className="text-xs text-orange-100 font-medium mt-1">
              Theo dõi định kỳ chỉ số phát triển của các bé để giáo viên kịp thời phối hợp cùng gia đình chăm sóc chu đáo.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-md text-center">
            <div>
              <p className="text-2xl font-black">{normalRate}%</p>
              <p className="text-[10px] uppercase font-bold text-orange-100">Chuẩn WHO</p>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-black">{totalAssessed}</p>
              <p className="text-[10px] uppercase font-bold text-orange-100">Bé đã đo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ Cơ Cấu 9 Thể Trạng Dinh Dưỡng Lớp Học */}
      {totalAssessed > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <HeartPulse size={16} />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  Cơ cấu 9 Thể trạng Dinh dưỡng Lớp học
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tỷ lệ học sinh đạt chuẩn và các mức độ suy dinh dưỡng, thừa cân trong lớp
                </p>
              </div>
            </div>
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700 border border-orange-200">
              {totalAssessed} học sinh đã có số đo
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
            {/* Donut Chart */}
            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} bé (${Math.round((Number(val) / totalAssessed) * 100)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      borderColor: '#fed7aa',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-emerald-600">{normalRate}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Chuẩn WHO</span>
              </div>
            </div>

            {/* Grid 9 phân loại thể trạng */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {classNutritionStats.map((item) => {
                const pct = totalAssessed > 0 ? Math.round((item.value / totalAssessed) * 100) : 0;
                const isSelected = filterGroup === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilterGroup(isSelected ? 'ALL' : item.key)}
                    className={`rounded-xl border p-2 text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500 text-white shadow-xs'
                        : item.value > 0
                        ? 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/40'
                        : 'border-slate-100 bg-slate-50/50 opacity-60'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className={`font-bold text-[11px] truncate ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <span className={`font-black text-xs shrink-0 ml-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {item.value} ({pct}%)
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Nút lọc nhanh theo 9 nhóm WHO */}
      <TeacherHealthFcmButtons
        buttons={whoGroupButtons}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
      />

      {/* Danh sách học sinh theo trạng thái phân loại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayList.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            Không có học sinh nào trong lớp thuộc nhóm này.
          </div>
        ) : (
          displayList.map(({ child, assessment }) => (
            <TeacherHealthFcmCard
              key={child.id}
              child={child}
              assessment={assessment}
              onSelectChildToInspect={onSelectChildToInspect}
            />
          ))
        )}
      </div>
    </div>
  );
};
