/**
 * Tiêu chuẩn Đánh giá Thể trạng và Tăng trưởng Trẻ em (WHO Child Growth Standards 0 - 5 tuổi)
 * Tham khảo chính thức từ Tổ chức Y tế Thế giới (WHO) & Viện Dinh Dưỡng Quốc Gia (Bộ Y tế)
 * Đánh giá dựa trên 3 chỉ số Z-score:
 * 1. HAZ: Chiều cao theo tuổi (Height-for-Age Z-score) -> Đánh giá Thấp còi
 * 2. WAZ: Cân nặng theo tuổi (Weight-for-Age Z-score) -> Đánh giá Nhẹ cân
 * 3. WHZ: Cân nặng theo chiều cao (Weight-for-Height Z-score) -> Đánh giá Gầy còm / Thừa cân / Béo phì
 */

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

// Bảng số liệu phân vị WHO 2006 (0 - 60 tháng tuổi)
interface WhoPoint {
  sdNeg3: number;
  sdNeg2: number;
  sdNeg1: number;
  median: number;
  sdPos1: number;
  sdPos2: number;
  sdPos3: number;
}

const HAZ_BOYS: Record<number, WhoPoint> = {
  0:  { sdNeg3: 44.2, sdNeg2: 46.1, sdNeg1: 48.0, median: 49.9, sdPos1: 51.8, sdPos2: 53.7, sdPos3: 55.6 },
  6:  { sdNeg3: 61.2, sdNeg2: 63.3, sdNeg1: 65.5, median: 67.6, sdPos1: 69.8, sdPos2: 71.9, sdPos3: 74.0 },
  12: { sdNeg3: 68.6, sdNeg2: 71.0, sdNeg1: 73.4, median: 75.7, sdPos1: 78.1, sdPos2: 80.5, sdPos3: 82.9 },
  18: { sdNeg3: 74.2, sdNeg2: 76.9, sdNeg1: 79.6, median: 82.3, sdPos1: 85.0, sdPos2: 87.7, sdPos3: 90.4 },
  24: { sdNeg3: 79.9, sdNeg2: 82.5, sdNeg1: 85.1, median: 87.8, sdPos1: 90.4, sdPos2: 93.2, sdPos3: 95.8 },
  30: { sdNeg3: 84.1, sdNeg2: 87.1, sdNeg1: 90.0, median: 92.9, sdPos1: 95.8, sdPos2: 98.7, sdPos3: 101.6 },
  36: { sdNeg3: 87.7, sdNeg2: 90.5, sdNeg1: 93.3, median: 96.1, sdPos1: 99.0, sdPos2: 101.8, sdPos3: 104.6 },
  42: { sdNeg3: 91.2, sdNeg2: 94.1, sdNeg1: 97.0, median: 99.9, sdPos1: 102.8, sdPos2: 105.7, sdPos3: 108.6 },
  48: { sdNeg3: 94.3, sdNeg2: 97.3, sdNeg1: 100.3, median: 103.3, sdPos1: 106.3, sdPos2: 109.4, sdPos3: 112.4 },
  54: { sdNeg3: 97.5, sdNeg2: 100.6, sdNeg1: 103.7, median: 106.8, sdPos1: 109.9, sdPos2: 113.1, sdPos3: 116.2 },
  60: { sdNeg3: 100.5, sdNeg2: 103.7, sdNeg1: 106.9, median: 110.0, sdPos1: 113.2, sdPos2: 116.3, sdPos3: 119.5 },
};

const HAZ_GIRLS: Record<number, WhoPoint> = {
  0:  { sdNeg3: 43.6, sdNeg2: 45.4, sdNeg1: 47.3, median: 49.1, sdPos1: 51.0, sdPos2: 52.9, sdPos3: 54.7 },
  6:  { sdNeg3: 59.5, sdNeg2: 61.5, sdNeg1: 63.6, median: 65.7, sdPos1: 67.8, sdPos2: 69.9, sdPos3: 71.9 },
  12: { sdNeg3: 66.3, sdNeg2: 68.9, sdNeg1: 71.4, median: 74.0, sdPos1: 76.6, sdPos2: 79.2, sdPos3: 81.7 },
  18: { sdNeg3: 72.4, sdNeg2: 75.2, sdNeg1: 78.0, median: 80.7, sdPos1: 83.5, sdPos2: 86.2, sdPos3: 89.0 },
  24: { sdNeg3: 78.1, sdNeg2: 80.9, sdNeg1: 83.6, median: 86.4, sdPos1: 89.1, sdPos2: 91.9, sdPos3: 94.7 },
  30: { sdNeg3: 82.8, sdNeg2: 85.8, sdNeg1: 88.8, median: 91.7, sdPos1: 94.7, sdPos2: 97.7, sdPos3: 100.6 },
  36: { sdNeg3: 86.3, sdNeg2: 89.2, sdNeg1: 92.1, median: 95.1, sdPos1: 98.1, sdPos2: 101.0, sdPos3: 104.0 },
  42: { sdNeg3: 89.9, sdNeg2: 92.9, sdNeg1: 95.9, median: 99.0, sdPos1: 102.0, sdPos2: 105.1, sdPos3: 108.1 },
  48: { sdNeg3: 93.2, sdNeg2: 96.4, sdNeg1: 99.6, median: 102.7, sdPos1: 105.9, sdPos2: 109.0, sdPos3: 112.1 },
  54: { sdNeg3: 96.3, sdNeg2: 99.6, sdNeg1: 102.9, median: 106.1, sdPos1: 109.4, sdPos2: 112.7, sdPos3: 115.9 },
  60: { sdNeg3: 99.3, sdNeg2: 102.7, sdNeg1: 106.0, median: 109.4, sdPos1: 112.8, sdPos2: 116.1, sdPos3: 119.5 },
};

const WAZ_BOYS: Record<number, WhoPoint> = {
  0:  { sdNeg3: 2.1, sdNeg2: 2.5, sdNeg1: 2.9, median: 3.3, sdPos1: 3.9, sdPos2: 4.4, sdPos3: 5.0 },
  6:  { sdNeg3: 5.9, sdNeg2: 6.4, sdNeg1: 7.1, median: 7.9, sdPos1: 8.8, sdPos2: 9.8, sdPos3: 10.9 },
  12: { sdNeg3: 6.9, sdNeg2: 7.7, sdNeg1: 8.6, median: 9.6, sdPos1: 10.8, sdPos2: 12.0, sdPos3: 13.3 },
  18: { sdNeg3: 7.8, sdNeg2: 8.8, sdNeg1: 9.8, median: 10.9, sdPos1: 12.2, sdPos2: 13.7, sdPos3: 15.3 },
  24: { sdNeg3: 8.6, sdNeg2: 9.7, sdNeg1: 10.8, median: 12.2, sdPos1: 13.6, sdPos2: 15.3, sdPos3: 17.1 },
  30: { sdNeg3: 9.4, sdNeg2: 10.5, sdNeg1: 11.8, median: 13.3, sdPos1: 15.0, sdPos2: 16.9, sdPos3: 19.0 },
  36: { sdNeg3: 10.0, sdNeg2: 11.3, sdNeg1: 12.7, median: 14.3, sdPos1: 16.2, sdPos2: 18.3, sdPos3: 20.7 },
  42: { sdNeg3: 10.6, sdNeg2: 12.0, sdNeg1: 13.6, median: 15.3, sdPos1: 17.4, sdPos2: 19.7, sdPos3: 22.4 },
  48: { sdNeg3: 11.2, sdNeg2: 12.7, sdNeg1: 14.4, median: 16.3, sdPos1: 18.6, sdPos2: 21.2, sdPos3: 24.2 },
  54: { sdNeg3: 11.8, sdNeg2: 13.4, sdNeg1: 15.2, median: 17.3, sdPos1: 19.8, sdPos2: 22.7, sdPos3: 26.0 },
  60: { sdNeg3: 12.4, sdNeg2: 14.1, sdNeg1: 16.0, median: 18.3, sdPos1: 21.0, sdPos2: 24.2, sdPos3: 27.9 },
};

const WAZ_GIRLS: Record<number, WhoPoint> = {
  0:  { sdNeg3: 2.0, sdNeg2: 2.4, sdNeg1: 2.8, median: 3.2, sdPos1: 3.7, sdPos2: 4.2, sdPos3: 4.8 },
  6:  { sdNeg3: 5.3, sdNeg2: 5.8, sdNeg1: 6.5, median: 7.3, sdPos1: 8.2, sdPos2: 9.3, sdPos3: 10.4 },
  12: { sdNeg3: 6.3, sdNeg2: 7.0, sdNeg1: 7.9, median: 8.9, sdPos1: 10.1, sdPos2: 11.5, sdPos3: 12.9 },
  18: { sdNeg3: 7.2, sdNeg2: 8.1, sdNeg1: 9.1, median: 10.2, sdPos1: 11.6, sdPos2: 13.2, sdPos3: 14.9 },
  24: { sdNeg3: 8.1, sdNeg2: 9.0, sdNeg1: 10.2, median: 11.5, sdPos1: 13.0, sdPos2: 14.8, sdPos3: 16.8 },
  30: { sdNeg3: 8.9, sdNeg2: 10.0, sdNeg1: 11.2, median: 12.7, sdPos1: 14.4, sdPos2: 16.5, sdPos3: 18.8 },
  36: { sdNeg3: 9.6, sdNeg2: 10.8, sdNeg1: 12.2, median: 13.9, sdPos1: 15.8, sdPos2: 18.1, sdPos3: 20.8 },
  42: { sdNeg3: 10.3, sdNeg2: 11.6, sdNeg1: 13.1, median: 15.0, sdPos1: 17.2, sdPos2: 19.8, sdPos3: 22.9 },
  48: { sdNeg3: 10.9, sdNeg2: 12.3, sdNeg1: 14.0, median: 16.1, sdPos1: 18.5, sdPos2: 21.5, sdPos3: 25.0 },
  54: { sdNeg3: 11.5, sdNeg2: 13.0, sdNeg1: 14.9, median: 17.2, sdPos1: 19.9, sdPos2: 23.2, sdPos3: 27.1 },
  60: { sdNeg3: 12.1, sdNeg2: 13.7, sdNeg1: 15.8, median: 18.2, sdPos1: 21.2, sdPos2: 24.9, sdPos3: 29.2 },
};

const WHZ_BOYS: Record<number, WhoPoint> = {
  65:  { sdNeg3: 5.9, sdNeg2: 6.3, sdNeg1: 6.9, median: 7.4, sdPos1: 8.1, sdPos2: 8.8, sdPos3: 9.6 },
  70:  { sdNeg3: 6.8, sdNeg2: 7.4, sdNeg1: 8.0, median: 8.6, sdPos1: 9.3, sdPos2: 10.1, sdPos3: 11.0 },
  75:  { sdNeg3: 7.6, sdNeg2: 8.2, sdNeg1: 8.8, median: 9.5, sdPos1: 10.4, sdPos2: 11.3, sdPos3: 12.3 },
  80:  { sdNeg3: 8.2, sdNeg2: 8.9, sdNeg1: 9.6, median: 10.4, sdPos1: 11.3, sdPos2: 12.3, sdPos3: 13.4 },
  85:  { sdNeg3: 9.1, sdNeg2: 9.8, sdNeg1: 10.6, median: 11.5, sdPos1: 12.4, sdPos2: 13.6, sdPos3: 14.8 },
  90:  { sdNeg3: 10.0, sdNeg2: 10.8, sdNeg1: 11.7, median: 12.6, sdPos1: 13.7, sdPos2: 15.0, sdPos3: 16.5 },
  95:  { sdNeg3: 11.0, sdNeg2: 11.8, sdNeg1: 12.8, median: 13.9, sdPos1: 15.1, sdPos2: 16.5, sdPos3: 18.2 },
  100: { sdNeg3: 12.0, sdNeg2: 13.0, sdNeg1: 14.0, median: 15.2, sdPos1: 16.6, sdPos2: 18.2, sdPos3: 20.2 },
  105: { sdNeg3: 13.1, sdNeg2: 14.2, sdNeg1: 15.4, median: 16.7, sdPos1: 18.3, sdPos2: 20.2, sdPos3: 22.4 },
  110: { sdNeg3: 14.2, sdNeg2: 15.5, sdNeg1: 16.8, median: 18.3, sdPos1: 20.1, sdPos2: 22.3, sdPos3: 24.9 },
  115: { sdNeg3: 15.5, sdNeg2: 17.0, sdNeg1: 18.5, median: 20.2, sdPos1: 22.2, sdPos2: 24.7, sdPos3: 27.7 },
  120: { sdNeg3: 17.0, sdNeg2: 18.6, sdNeg1: 20.3, median: 22.1, sdPos1: 24.4, sdPos2: 27.3, sdPos3: 30.7 },
};

const WHZ_GIRLS: Record<number, WhoPoint> = {
  65:  { sdNeg3: 5.5, sdNeg2: 5.9, sdNeg1: 6.5, median: 7.0, sdPos1: 7.7, sdPos2: 8.4, sdPos3: 9.2 },
  70:  { sdNeg3: 6.3, sdNeg2: 6.9, sdNeg1: 7.5, median: 8.1, sdPos1: 8.8, sdPos2: 9.6, sdPos3: 10.5 },
  75:  { sdNeg3: 7.1, sdNeg2: 7.7, sdNeg1: 8.3, median: 9.0, sdPos1: 9.8, sdPos2: 10.7, sdPos3: 11.7 },
  80:  { sdNeg3: 7.7, sdNeg2: 8.4, sdNeg1: 9.1, median: 9.9, sdPos1: 10.7, sdPos2: 11.8, sdPos3: 13.0 },
  85:  { sdNeg3: 8.5, sdNeg2: 9.2, sdNeg1: 10.0, median: 11.0, sdPos1: 12.0, sdPos2: 13.2, sdPos3: 14.5 },
  90:  { sdNeg3: 9.5, sdNeg2: 10.3, sdNeg1: 11.2, median: 12.2, sdPos1: 13.3, sdPos2: 14.7, sdPos3: 16.3 },
  95:  { sdNeg3: 10.4, sdNeg2: 11.3, sdNeg1: 12.3, median: 13.5, sdPos1: 14.7, sdPos2: 16.3, sdPos3: 18.1 },
  100: { sdNeg3: 11.4, sdNeg2: 12.5, sdNeg1: 13.6, median: 14.8, sdPos1: 16.2, sdPos2: 18.0, sdPos3: 20.1 },
  105: { sdNeg3: 12.5, sdNeg2: 13.7, sdNeg1: 15.0, median: 16.3, sdPos1: 18.0, sdPos2: 20.0, sdPos3: 22.5 },
  110: { sdNeg3: 13.7, sdNeg2: 15.0, sdNeg1: 16.4, median: 17.9, sdPos1: 19.8, sdPos2: 22.1, sdPos3: 25.0 },
  115: { sdNeg3: 15.0, sdNeg2: 16.5, sdNeg1: 18.1, median: 19.8, sdPos1: 22.0, sdPos2: 24.7, sdPos3: 28.0 },
  120: { sdNeg3: 16.4, sdNeg2: 18.1, sdNeg1: 19.9, median: 21.8, sdPos1: 24.3, sdPos2: 27.5, sdPos3: 31.4 },
};

function getInterpolatedPoint(table: Record<number, WhoPoint>, val: number): WhoPoint {
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

function computeZScore(val: number, pt: WhoPoint): number {
  if (val === pt.median) return 0;
  if (val > pt.median) {
    if (val <= pt.sdPos2) {
      const step = (pt.sdPos2 - pt.median) / 2;
      return step > 0 ? (val - pt.median) / step : 0;
    } else {
      const step = pt.sdPos3 - pt.sdPos2;
      return step > 0 ? 2 + (val - pt.sdPos2) / step : 2;
    }
  } else {
    if (val >= pt.sdNeg2) {
      const step = (pt.median - pt.sdNeg2) / 2;
      return step > 0 ? -((pt.median - val) / step) : 0;
    } else {
      const step = pt.sdNeg2 - pt.sdNeg3;
      return step > 0 ? -2 - (pt.sdNeg2 - val) / step : -2;
    }
  }
}

export function getAgeInMonths(dob?: string): number {
  if (!dob) return 48;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 48;
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return Math.min(60, Math.max(0, months));
}

export function evaluateWhoMetrics(
  weightKg?: number | null,
  heightCm?: number | null,
  dob?: string,
  gender: string = 'Nam'
): WhoAssessmentResult {
  const isMale = !gender || gender === 'Nam' || gender === 'M' || gender === 'TRAI';
  const ageMonths = getAgeInMonths(dob);
  const w = Number(weightKg || 0);
  const h = Number(heightCm || 0);

  // 1. HAZ
  let hazZ = 0;
  let hazCode = 'BINH_THUONG';
  let hazLabel = 'Chiều cao bình thường';
  let hazBg = 'bg-blue-50';
  let hazText = 'text-blue-700';
  let hazBorder = 'border-blue-200';
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
    } else if (hazZ > 2) {
      hazCode = 'CAO';
      hazLabel = 'Cao hơn chuẩn';
      hazBg = 'bg-sky-50';
      hazText = 'text-sky-700';
      hazBorder = 'border-sky-200';
    }
  }

  // 2. WAZ
  let wazZ = 0;
  let wazCode = 'BINH_THUONG';
  let wazLabel = 'Cân nặng bình thường';
  let wazBg = 'bg-emerald-50';
  let wazText = 'text-emerald-700';
  let wazBorder = 'border-emerald-200';
  let wazAlert = false;

  if (w > 0) {
    const table = isMale ? WAZ_BOYS : WAZ_GIRLS;
    const pt = getInterpolatedPoint(table, ageMonths);
    wazZ = Math.round(computeZScore(w, pt) * 10) / 10;

    if (wazZ < -3) {
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
    } else if (wazZ > 2) {
      wazCode = 'CAN_NANG_CAO';
      wazLabel = 'Cân nặng cao';
      wazBg = 'bg-amber-50';
      wazText = 'text-amber-700';
      wazBorder = 'border-amber-200';
    }
  }

  // 3. WHZ
  let whzZ = 0;
  let whzCode = 'BINH_THUONG';
  let whzLabel = 'Thể trạng cân đối';
  let whzBg = 'bg-emerald-50';
  let whzText = 'text-emerald-700';
  let whzBorder = 'border-emerald-200';
  let whzAlert = false;

  if (w > 0 && h > 0) {
    const table = isMale ? WHZ_BOYS : WHZ_GIRLS;
    const pt = getInterpolatedPoint(table, h);
    whzZ = Math.round(computeZScore(w, pt) * 10) / 10;

    if (whzZ < -3) {
      whzCode = 'GAY_COM_NANG';
      whzLabel = 'Gầy còm nặng';
      whzBg = 'bg-rose-50';
      whzText = 'text-rose-700';
      whzBorder = 'border-rose-300';
      whzAlert = true;
    } else if (whzZ < -2) {
      whzCode = 'GAY_COM';
      whzLabel = 'Gầy còm';
      whzBg = 'bg-amber-50';
      whzText = 'text-amber-700';
      whzBorder = 'border-amber-300';
      whzAlert = true;
    } else if (whzZ <= 1) {
      whzCode = 'BINH_THUONG';
      whzLabel = 'Cân đối (Chuẩn WHO)';
      whzBg = 'bg-emerald-50';
      whzText = 'text-emerald-700';
      whzBorder = 'border-emerald-200';
    } else if (whzZ <= 2) {
      whzCode = 'NGUY_CO_THUA_CAN';
      whzLabel = 'Nguy cơ thừa cân';
      whzBg = 'bg-yellow-50';
      whzText = 'text-yellow-700';
      whzBorder = 'border-yellow-200';
    } else if (whzZ <= 3) {
      whzCode = 'THUA_CAN';
      whzLabel = 'Thừa cân';
      whzBg = 'bg-orange-50';
      whzText = 'text-orange-700';
      whzBorder = 'border-orange-300';
      whzAlert = true;
    } else {
      whzCode = 'BEO_PHI';
      whzLabel = 'Béo phì';
      whzBg = 'bg-rose-50';
      whzText = 'text-rose-700';
      whzBorder = 'border-rose-300';
      whzAlert = true;
    }
  }

  // Đánh giá tổng hợp
  let trangThaiTongThe = 'Bình thường';
  let canCanThiep = false;
  let loiKhuyen = 'Bé phát triển thể chất cân đối theo chuẩn WHO. Duy trì chế độ dinh dưỡng và vận động hiện tại.';

  if (whzCode === 'BEO_PHI') {
    trangThaiTongThe = 'Béo phì';
    canCanThiep = true;
    loiKhuyen = 'Cần điều chỉnh khẩu phần ăn giảm tinh bột, nước ngọt có đường; tăng cường rau xanh và vận động ngoài trời.';
  } else if (whzCode === 'THUA_CAN') {
    trangThaiTongThe = 'Thừa cân';
    canCanThiep = true;
    loiKhuyen = 'Theo dõi sát cân nặng, hạn chế thức ăn nhiều dầu mỡ và duy trì thói quen tập thể dục hàng ngày.';
  } else if (whzAlert || hazAlert || wazAlert) {
    trangThaiTongThe = 'Cần can thiệp dinh dưỡng';
    canCanThiep = true;
    loiKhuyen = 'Trẻ có dấu hiệu thiếu chuẩn (thấp còi hoặc nhẹ cân/gầy còm). Cần tăng cường vi chất (Kẽm, Canxi, D3) và bổ sung bữa phụ.';
  }

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

// Hàm tương thích ngược cũ (nếu code cũ cần)
export function calculateBmi(weightKg?: number | null, heightCm?: number | null): number | null {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) return null;
  const hM = heightCm / 100;
  return Math.round((weightKg / (hM * hM)) * 10) / 10;
}

export function classifyWhoBmi(bmi?: number | null, gender: string = 'Nam', dob?: string) {
  const isMale = !gender || gender === 'Nam' || gender === 'M';
  const ageMonths = getAgeInMonths(dob);
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
