'use client';

import React, { useState } from 'react';
import {
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
import {
  TeacherHealthFcmButtons,
  WhoFilterGroup,
} from './TeacherHealthFcmButtons';
import { TeacherHealthFcmCard } from './TeacherHealthFcmCard';
import { processHealthData } from './teacherHealthFcmHelpers';

interface TeacherHealthFCMProps {
  childrenList: Child[];
  liveHealth: Record<string, any>;
  onSelectChildToInspect?: (child: Child) => void;
}

export const TeacherHealthFCM: React.FC<TeacherHealthFCMProps> = ({
  childrenList,
  liveHealth,
  onSelectChildToInspect,
}) => {
  const [filterGroup, setFilterGroup] = useState<WhoFilterGroup>('ALL');

  const {
    assessedList,
    unmeasuredList,
    normalRate,
    totalAssessed,
    pieChartData,
    whoGroupButtons,
  } = processHealthData(childrenList, liveHealth);

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
            <div className="h-8 w-px bg-white/20" />
            <div>
              <p className="text-2xl font-black">{unmeasuredList.length}</p>
              <p className="text-[10px] uppercase font-bold text-orange-100">Chưa đo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ tròn 9 nhóm thể trạng */}
      {pieChartData.length > 0 && (
        <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-56 w-56 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${val} bé (${Math.round((Number(val) / totalAssessed) * 100)}%)`,
                      `${item.payload.name} (${item.payload.criteria})`,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800">{totalAssessed}</span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Học sinh</span>
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-3 gap-2">
              {pieChartData.map((item) => {
                const pct = totalAssessed > 0 ? Math.round((item.value / totalAssessed) * 100) : 0;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilterGroup(item.key)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition cursor-pointer ${
                      filterGroup === item.key
                        ? 'border-orange-500 bg-orange-50/60 shadow-2xs'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100/70'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-700 truncate">{item.name}</p>
                      <p className="text-[10px] font-extrabold text-slate-500">
                        {item.value} bé <span className="font-normal text-slate-400">({pct}%)</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Nhóm nút phân loại 9 nhóm WHO */}
      <TeacherHealthFcmButtons
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
        buttons={whoGroupButtons}
      />

      {/* Danh sách học sinh theo nhóm thể trạng */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Danh sách học sinh ({displayList.length} bé)
          </h3>
          {filterGroup !== 'ALL' && (
            <button
              onClick={() => setFilterGroup('ALL')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
            >
              Xem tất cả học sinh
            </button>
          )}
        </div>

        {displayList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <HeartPulse size={32} className="mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-600">
              Không có học sinh nào thuộc nhóm phân loại này trong lớp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayList.map((item) => (
              <TeacherHealthFcmCard
                key={item.child.id}
                child={item.child}
                assessment={item.assessment}
                onSelectChildToInspect={onSelectChildToInspect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
