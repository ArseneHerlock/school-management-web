import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Scale,
  Activity,
} from 'lucide-react';
import { Child } from '../../data';
import { evaluateWhoMetrics, WhoAssessmentResult } from './whoStandards';
import { WhoFilterGroup, WhoGroupButtonItem } from './TeacherHealthFcmButtons';

export const CATEGORY_COLORS: Record<string, string> = {
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

export interface AssessedChildItem {
  child: Child;
  weight: number;
  height: number;
  assessment: WhoAssessmentResult;
}

export function processHealthData(childrenList: Child[], liveHealth: Record<string, any>) {
  const assessedList: AssessedChildItem[] = [];
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

  return {
    assessedList,
    unmeasuredList,
    normalRate,
    totalAssessed,
    pieChartData,
    whoGroupButtons,
  };
}
