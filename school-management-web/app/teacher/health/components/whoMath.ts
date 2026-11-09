import { WhoPoint } from './whoGrowthData';

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
