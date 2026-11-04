/**
 * Tiêu chuẩn Đánh giá Thể trạng và Tăng trưởng Trẻ em (WHO Child Growth Standards 0 - 5 tuổi)
 * Tham khảo chính thức từ Tổ chức Y tế Thế giới (WHO) & Viện Dinh Dưỡng Quốc Gia (Bộ Y tế)
 */

import {
  WhoPoint,
  HAZ_BOYS,
  HAZ_GIRLS,
  WAZ_BOYS,
  WAZ_GIRLS,
  WHZ_BOYS,
  WHZ_GIRLS,
} from './whoGrowthData';
import { WHO_ZSCORE_GUIDELINES, getWhoOverallAdvice } from './whoGuidelines';

export type { WhoPoint };
export { HAZ_BOYS, HAZ_GIRLS, WAZ_BOYS, WAZ_GIRLS, WHZ_BOYS, WHZ_GIRLS, WHO_ZSCORE_GUIDELINES };

export interface WhoIndicatorResult {
  zScore: number;
  code: string;
  label: string;
  badgeBg: string;
  textClass: string;
  borderClass: string;
  isAlert: boolean;
}

export interface WhoAssessmentResult {
  ageMonths: number;
  haz: WhoIndicatorResult;
  waz: WhoIndicatorResult;
  whz: WhoIndicatorResult;
  trangThaiTongThe: string;
  canCanThiep: boolean;
  loiKhuyen: string;
}

export function getInterpolatedPoint(table: Record<number, WhoPoint>, val: number): WhoPoint {
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (val <= keys[0]) return table[keys[0]];
  if (val >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

  let lower = keys[0];
  let upper = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (val >= keys[i] && val <= keys[i + 1]) {
      lower = keys[i];
      upper = keys[i + 1];
      break;
    }
  }

  const p1 = table[lower];
  const p2 = table[upper];
  const ratio = (val - lower) / (upper - lower);

  return {
    sdNeg3: p1.sdNeg3 + ratio * (p2.sdNeg3 - p1.sdNeg3),
    sdNeg2: p1.sdNeg2 + ratio * (p2.sdNeg2 - p1.sdNeg2),
    sdNeg1: p1.sdNeg1 + ratio * (p2.sdNeg1 - p1.sdNeg1),
    median: p1.median + ratio * (p2.median - p1.median),
    sdPos1: p1.sdPos1 + ratio * (p2.sdPos1 - p1.sdPos1),
    sdPos2: p1.sdPos2 + ratio * (p2.sdPos2 - p1.sdPos2),
    sdPos3: p1.sdPos3 + ratio * (p2.sdPos3 - p1.sdPos3),
  };
}

export function computeZScore(val: number, pt: WhoPoint): number {
  if (val === pt.median) return 0;
  if (val > pt.median) {
    if (val <= pt.sdPos1) {
      const step = pt.sdPos1 - pt.median;
      return step > 0 ? (val - pt.median) / step : 0;
    } else if (val <= pt.sdPos2) {
      const step = pt.sdPos2 - pt.sdPos1;
      return step > 0 ? 1 + (val - pt.sdPos1) / step : 1;
    } else if (val <= pt.sdPos3) {
      const step = pt.sdPos3 - pt.sdPos2;
      return step > 0 ? 2 + (val - pt.sdPos2) / step : 2;
    } else {
      const step = pt.sdPos3 - pt.sdPos2;
      return step > 0 ? 3 + (val - pt.sdPos3) / step : 3;
    }
  } else {
    if (val >= pt.sdNeg1) {
      const step = pt.median - pt.sdNeg1;
      return step > 0 ? -((pt.median - val) / step) : 0;
    } else if (val >= pt.sdNeg2) {
      const step = pt.sdNeg1 - pt.sdNeg2;
      return step > 0 ? -1 - (pt.sdNeg1 - val) / step : -1;
    } else if (val >= pt.sdNeg3) {
      const step = pt.sdNeg2 - pt.sdNeg3;
      return step > 0 ? -2 - (pt.sdNeg2 - val) / step : -2;
    } else {
      const step = pt.sdNeg2 - pt.sdNeg3;
      return step > 0 ? -3 - (pt.sdNeg3 - val) / step : -3;
    }
  }
}

export function getAgeInMonths(
  dob?: string,
  atDate?: string | Date | number
): number {
  if (typeof atDate === 'number' && !isNaN(atDate)) {
    return Math.min(60, Math.max(0, Math.round(atDate)));
  }
  if (!dob) return 48;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 48;

  let refDate: Date;
  if (atDate instanceof Date) {
    refDate = atDate;
  } else if (typeof atDate === 'string' && atDate.trim()) {
    refDate = new Date(atDate);
    if (isNaN(refDate.getTime())) refDate = new Date();
  } else {
    refDate = new Date();
  }

  let months =
    (refDate.getFullYear() - birth.getFullYear()) * 12 +
    (refDate.getMonth() - birth.getMonth());

  if (refDate.getDate() < birth.getDate()) {
    months -= 0.5;
  }
  return Math.min(60, Math.max(0, Math.round(months)));
}

export function evaluateWhoMetrics(
  weightKg?: number | null,
  heightCm?: number | null,
  dob?: string,
  gender: string = 'Nam',
  measurementDateOrAgeMonths?: string | Date | number
): WhoAssessmentResult {
  const isMale = !gender || gender === 'Nam' || gender === 'M' || gender === 'TRAI';
  const ageMonths = getAgeInMonths(dob, measurementDateOrAgeMonths);
  const w = Number(weightKg || 0);
  const h = Number(heightCm || 0);

  let hazZ = 0;
  let hazCode = 'BINH_THUONG';
  let hazLabel = 'Bình thường';
  let hazBg = 'bg-emerald-50';
  let hazText = 'text-emerald-700';
  let hazBorder = 'border-emerald-200';
  let hazAlert = false;

  if (h > 0) {
    const table = isMale ? HAZ_BOYS : HAZ_GIRLS;
    const pt = getInterpolatedPoint(table, ageMonths);
    hazZ = Math.round(computeZScore(h, pt) * 10) / 10;

    if (hazZ < -3) {
      hazCode = 'THAP_COI_NANG';
      hazLabel = 'Thấp còi nặng';
      hazBg = 'bg-rose-50';
      hazText = 'text-rose-700';
      hazBorder = 'border-rose-300';
      hazAlert = true;
    } else if (hazZ < -2) {
      hazCode = 'THAP_COI';
      hazLabel = 'Thấp còi';
      hazBg = 'bg-amber-50';
      hazText = 'text-amber-700';
      hazBorder = 'border-amber-300';
      hazAlert = true;
    }
  }

  let wazZ = 0;
  let wazCode = 'BINH_THUONG';
  let wazLabel = 'Bình thường';
  let wazBg = 'bg-emerald-50';
  let wazText = 'text-emerald-700';
  let wazBorder = 'border-emerald-200';
  let wazAlert = false;

  if (w > 0) {
    const table = isMale ? WAZ_BOYS : WAZ_GIRLS;
    const pt = getInterpolatedPoint(table, ageMonths);
    wazZ = Math.round(computeZScore(w, pt) * 10) / 10;

    if (wazZ > 5 || wazZ < -5) {
      wazCode = 'CAN_NANG_QUA_CAO';
      wazLabel = 'Vượt ngưỡng sinh học (Cần kiểm tra số đo)';
      wazBg = 'bg-purple-50';
      wazText = 'text-purple-700';
      wazBorder = 'border-purple-300';
      wazAlert = true;
    } else if (wazZ > 3) {
      wazCode = 'BEO_PHI';
      wazLabel = 'Béo phì';
      wazBg = 'bg-rose-50';
      wazText = 'text-rose-700';
      wazBorder = 'border-rose-300';
      wazAlert = true;
    } else if (wazZ > 2) {
      wazCode = 'THUA_CAN';
      wazLabel = 'Thừa cân';
      wazBg = 'bg-amber-50';
      wazText = 'text-amber-700';
      wazBorder = 'border-amber-300';
      wazAlert = true;
    } else if (wazZ < -3) {
      wazCode = 'NHE_CAN_NANG';
      wazLabel = 'Nhẹ cân nặng';
      wazBg = 'bg-rose-50';
      wazText = 'text-rose-700';
      wazBorder = 'border-rose-300';
      wazAlert = true;
    } else if (wazZ < -2) {
      wazCode = 'NHE_CAN';
      wazLabel = 'Nhẹ cân';
      wazBg = 'bg-amber-50';
      wazText = 'text-amber-700';
      wazBorder = 'border-amber-300';
      wazAlert = true;
    }
  }

  let whzZ = 0;
  let whzCode = 'BINH_THUONG';
  let whzLabel = 'Bình thường';
  let whzBg = 'bg-emerald-50';
  let whzText = 'text-emerald-700';
  let whzBorder = 'border-emerald-200';
  let whzAlert = false;

  if (w > 0 && h > 0) {
    const table = isMale ? WHZ_BOYS : WHZ_GIRLS;
    const pt = getInterpolatedPoint(table, h);
    whzZ = Math.round(computeZScore(w, pt) * 10) / 10;

    if (whzZ > 3) {
      whzCode = 'BEO_PHI';
      whzLabel = 'Béo phì';
      whzBg = 'bg-rose-50';
      whzText = 'text-rose-700';
      whzBorder = 'border-rose-300';
      whzAlert = true;
    } else if (whzZ > 2) {
      whzCode = 'THUA_CAN';
      whzLabel = 'Thừa cân';
      whzBg = 'bg-orange-50';
      whzText = 'text-orange-700';
      whzBorder = 'border-orange-300';
      whzAlert = true;
    } else if (whzZ >= -2) {
      whzCode = 'BINH_THUONG';
      whzLabel = 'Bình thường';
      whzBg = 'bg-emerald-50';
      whzText = 'text-emerald-700';
      whzBorder = 'border-emerald-200';
      whzAlert = false;
    } else if (whzZ >= -3) {
      whzCode = 'GAY_COM';
      whzLabel = 'Gầy còm';
      whzBg = 'bg-amber-50';
      whzText = 'text-amber-700';
      whzBorder = 'border-amber-300';
      whzAlert = true;
    } else {
      whzCode = 'GAY_COM_NANG';
      whzLabel = 'Gầy còm nặng';
      whzBg = 'bg-rose-50';
      whzText = 'text-rose-700';
      whzBorder = 'border-rose-300';
      whzAlert = true;
    }
  }

  const { trangThaiTongThe, canCanThiep, loiKhuyen } = getWhoOverallAdvice(
    wazZ,
    hazZ,
    whzZ,
    hazCode,
    wazCode,
    whzCode
  );

  return {
    ageMonths,
    haz: { zScore: hazZ, code: hazCode, label: hazLabel, badgeBg: hazBg, textClass: hazText, borderClass: hazBorder, isAlert: hazAlert },
    waz: { zScore: wazZ, code: wazCode, label: wazLabel, badgeBg: wazBg, textClass: wazText, borderClass: wazBorder, isAlert: wazAlert },
    whz: { zScore: whzZ, code: whzCode, label: whzLabel, badgeBg: whzBg, textClass: whzText, borderClass: whzBorder, isAlert: whzAlert },
    trangThaiTongThe,
    canCanThiep,
    loiKhuyen,
  };
}

export function calculateBmi(weightKg?: number | null, heightCm?: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const hM = heightCm / 100;
  return Math.round((weightKg / (hM * hM)) * 10) / 10;
}

export function classifyWhoBmi(bmi?: number | null, gender: string = 'Nam', dob?: string) {
  return {
    code: 'BINH_THUONG',
    label: 'Thể trạng bình thường',
    shortLabel: 'Bình thường',
    badgeBg: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    color: '#10b981',
    advice: 'Duy trì chế độ ăn và vận động hợp lý.',
  };
}
