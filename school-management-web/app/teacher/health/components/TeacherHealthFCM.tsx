'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Scale,
  Activity,
} from 'lucide-react';
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
      sub: '-2 SD ≤ Z ≤ +2 SD',
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
      sub: 'HAZ: -3 ≤ Z < -2 SD',
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
      sub: 'HAZ: Z < -3 SD',
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
      sub: 'WAZ: -3 ≤ Z < -2 SD',
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
      sub: 'WAZ: Z < -3 SD',
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
      sub: 'WHZ: -3 ≤ Z < -2 SD',
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
      sub: 'WHZ: Z < -3 SD',
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
      sub: '+2 SD < Z ≤ +3 SD',
      count: thuaCanGroup.length,
      icon: AlertTriangle,
      activeClass: 'bg-yellow-500 text-white border-yellow-600 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-yellow-300',
      iconIdle: 'text-yellow-600',
      subActive: 'text-yellow-100',
    },
    {
      key: 'BEO_PHI',
      label: 'Béo phì',
      sub: 'Z > +3 SD',
      count: beoPhiGroup.length,
      icon: AlertTriangle,
      activeClass: 'bg-purple-600 text-white border-purple-700 shadow-sm',
      idleClass: 'bg-white border-slate-200 hover:border-purple-300',
      iconIdle: 'text-purple-600',
      subActive: 'text-purple-100',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Banner Tổng quan thể trạng lớp theo WHO */}
      <div className="rounded-3xl border border-orange-200 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 p-6 text-white shadow-md shadow-orange-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              BÁO CÁO THỂ TRẠNG WHO (0 - 5 TUỔI)
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2">
              Giám Sát Thể Trạng & Cảnh Báo Sớm
            </h2>
            <p className="text-xs text-orange-100 font-medium mt-1">
              Hệ thống tự động phân loại theo 3 chỉ số <strong>HAZ (Thấp còi)</strong>, <strong>WAZ (Nhẹ cân)</strong> và <strong>WHZ (Gầy còm / Thừa cân)</strong> để cô giáo kịp thời phối hợp can thiệp.
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

      <TeacherHealthFcmButtons
        buttons={whoGroupButtons}
        filterGroup={filterGroup}
        setFilterGroup={setFilterGroup}
      />

      {/* Danh sách học sinh theo trạng thái phân loại */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayList.map(({ child, assessment }) => (
          <TeacherHealthFcmCard
            key={child.id}
            child={child}
            assessment={assessment}
            onSelectChildToInspect={onSelectChildToInspect}
          />
        ))}
      </div>
    </div>
  );
};
