'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Ruler,
  Scale,
  TrendingDown,
  TrendingUp,
  Info,
  Sparkles,
} from 'lucide-react';
import { HealthRecord, WhoCurvePoint } from '@/services/health';
import { evaluateWhoMetrics } from '@/app/teacher/health/components/whoStandards';

// Bảng tọa độ đường chuẩn WHO 2006 (0 - 60 tháng tuổi)
const WHO_HAZ_BOYS: WhoCurvePoint[] = [
  { x: 0, sdNeg3: 44.2, sdNeg2: 46.1, sdNeg1: 48.0, median: 49.9, sdPos1: 51.8, sdPos2: 53.7, sdPos3: 55.6 },
  { x: 6, sdNeg3: 61.2, sdNeg2: 63.3, sdNeg1: 65.5, median: 67.6, sdPos1: 69.8, sdPos2: 71.9, sdPos3: 74.0 },
  { x: 12, sdNeg3: 68.6, sdNeg2: 71.0, sdNeg1: 73.4, median: 75.7, sdPos1: 78.1, sdPos2: 80.5, sdPos3: 82.9 },
  { x: 18, sdNeg3: 74.2, sdNeg2: 76.9, sdNeg1: 79.6, median: 82.3, sdPos1: 85.0, sdPos2: 87.7, sdPos3: 90.4 },
  { x: 24, sdNeg3: 79.9, sdNeg2: 82.5, sdNeg1: 85.1, median: 87.8, sdPos1: 90.4, sdPos2: 93.2, sdPos3: 95.8 },
  { x: 30, sdNeg3: 84.1, sdNeg2: 87.1, sdNeg1: 90.0, median: 92.9, sdPos1: 95.8, sdPos2: 98.7, sdPos3: 101.6 },
  { x: 36, sdNeg3: 87.7, sdNeg2: 90.5, sdNeg1: 93.3, median: 96.1, sdPos1: 99.0, sdPos2: 101.8, sdPos3: 104.6 },
  { x: 42, sdNeg3: 91.2, sdNeg2: 94.1, sdNeg1: 97.0, median: 99.9, sdPos1: 102.8, sdPos2: 105.7, sdPos3: 108.6 },
  { x: 48, sdNeg3: 94.3, sdNeg2: 97.3, sdNeg1: 100.3, median: 103.3, sdPos1: 106.3, sdPos2: 109.4, sdPos3: 112.4 },
  { x: 54, sdNeg3: 97.5, sdNeg2: 100.6, sdNeg1: 103.7, median: 106.8, sdPos1: 109.9, sdPos2: 113.1, sdPos3: 116.2 },
  { x: 60, sdNeg3: 100.5, sdNeg2: 103.7, sdNeg1: 106.9, median: 110.0, sdPos1: 113.2, sdPos2: 116.3, sdPos3: 119.5 },
];

const WHO_HAZ_GIRLS: WhoCurvePoint[] = [
  { x: 0, sdNeg3: 43.6, sdNeg2: 45.4, sdNeg1: 47.3, median: 49.1, sdPos1: 51.0, sdPos2: 52.9, sdPos3: 54.7 },
  { x: 6, sdNeg3: 59.5, sdNeg2: 61.5, sdNeg1: 63.6, median: 65.7, sdPos1: 67.8, sdPos2: 69.9, sdPos3: 71.9 },
  { x: 12, sdNeg3: 66.3, sdNeg2: 68.9, sdNeg1: 71.4, median: 74.0, sdPos1: 76.6, sdPos2: 79.2, sdPos3: 81.7 },
  { x: 18, sdNeg3: 72.4, sdNeg2: 75.2, sdNeg1: 78.0, median: 80.7, sdPos1: 83.5, sdPos2: 86.2, sdPos3: 89.0 },
  { x: 24, sdNeg3: 78.1, sdNeg2: 80.9, sdNeg1: 83.6, median: 86.4, sdPos1: 89.1, sdPos2: 91.9, sdPos3: 94.7 },
  { x: 30, sdNeg3: 82.8, sdNeg2: 85.8, sdNeg1: 88.8, median: 91.7, sdPos1: 94.7, sdPos2: 97.7, sdPos3: 100.6 },
  { x: 36, sdNeg3: 86.3, sdNeg2: 89.2, sdNeg1: 92.1, median: 95.1, sdPos1: 98.1, sdPos2: 101.0, sdPos3: 104.0 },
  { x: 42, sdNeg3: 89.9, sdNeg2: 92.9, sdNeg1: 95.9, median: 99.0, sdPos1: 102.0, sdPos2: 105.1, sdPos3: 108.1 },
  { x: 48, sdNeg3: 93.2, sdNeg2: 96.4, sdNeg1: 99.6, median: 102.7, sdPos1: 105.9, sdPos2: 109.0, sdPos3: 112.1 },
  { x: 54, sdNeg3: 96.3, sdNeg2: 99.6, sdNeg1: 102.9, median: 106.1, sdPos1: 109.4, sdPos2: 112.7, sdPos3: 115.9 },
  { x: 60, sdNeg3: 99.3, sdNeg2: 102.7, sdNeg1: 106.0, median: 109.4, sdPos1: 112.8, sdPos2: 116.1, sdPos3: 119.5 },
];

const WHO_WAZ_BOYS: WhoCurvePoint[] = [
  { x: 0, sdNeg3: 2.1, sdNeg2: 2.5, sdNeg1: 2.9, median: 3.3, sdPos1: 3.9, sdPos2: 4.4, sdPos3: 5.0 },
  { x: 6, sdNeg3: 5.9, sdNeg2: 6.4, sdNeg1: 7.1, median: 7.9, sdPos1: 8.8, sdPos2: 9.8, sdPos3: 10.9 },
  { x: 12, sdNeg3: 6.9, sdNeg2: 7.7, sdNeg1: 8.6, median: 9.6, sdPos1: 10.8, sdPos2: 12.0, sdPos3: 13.3 },
  { x: 18, sdNeg3: 7.8, sdNeg2: 8.8, sdNeg1: 9.8, median: 10.9, sdPos1: 12.2, sdPos2: 13.7, sdPos3: 15.3 },
  { x: 24, sdNeg3: 8.6, sdNeg2: 9.7, sdNeg1: 10.8, median: 12.2, sdPos1: 13.6, sdPos2: 15.3, sdPos3: 17.1 },
  { x: 30, sdNeg3: 9.4, sdNeg2: 10.5, sdNeg1: 11.8, median: 13.3, sdPos1: 15.0, sdPos2: 16.9, sdPos3: 19.0 },
  { x: 36, sdNeg3: 10.0, sdNeg2: 11.3, sdNeg1: 12.7, median: 14.3, sdPos1: 16.2, sdPos2: 18.3, sdPos3: 20.7 },
  { x: 42, sdNeg3: 10.6, sdNeg2: 12.0, sdNeg1: 13.6, median: 15.3, sdPos1: 17.4, sdPos2: 19.7, sdPos3: 22.4 },
  { x: 48, sdNeg3: 11.2, sdNeg2: 12.7, sdNeg1: 14.4, median: 16.3, sdPos1: 18.6, sdPos2: 21.2, sdPos3: 24.2 },
  { x: 54, sdNeg3: 11.8, sdNeg2: 13.4, sdNeg1: 15.2, median: 17.3, sdPos1: 19.8, sdPos2: 22.7, sdPos3: 26.0 },
  { x: 60, sdNeg3: 12.4, sdNeg2: 14.1, sdNeg1: 16.0, median: 18.3, sdPos1: 21.0, sdPos2: 24.2, sdPos3: 27.9 },
];

const WHO_WAZ_GIRLS: WhoCurvePoint[] = [
  { x: 0, sdNeg3: 2.0, sdNeg2: 2.4, sdNeg1: 2.8, median: 3.2, sdPos1: 3.7, sdPos2: 4.2, sdPos3: 4.8 },
  { x: 6, sdNeg3: 5.3, sdNeg2: 5.8, sdNeg1: 6.5, median: 7.3, sdPos1: 8.2, sdPos2: 9.3, sdPos3: 10.4 },
  { x: 12, sdNeg3: 6.3, sdNeg2: 7.0, sdNeg1: 7.9, median: 8.9, sdPos1: 10.1, sdPos2: 11.5, sdPos3: 12.9 },
  { x: 18, sdNeg3: 7.2, sdNeg2: 8.1, sdNeg1: 9.1, median: 10.2, sdPos1: 11.6, sdPos2: 13.2, sdPos3: 14.9 },
  { x: 24, sdNeg3: 8.1, sdNeg2: 9.0, sdNeg1: 10.2, median: 11.5, sdPos1: 13.0, sdPos2: 14.8, sdPos3: 16.8 },
  { x: 30, sdNeg3: 8.9, sdNeg2: 10.0, sdNeg1: 11.2, median: 12.7, sdPos1: 14.4, sdPos2: 16.5, sdPos3: 18.8 },
  { x: 36, sdNeg3: 9.6, sdNeg2: 10.8, sdNeg1: 12.2, median: 13.9, sdPos1: 15.8, sdPos2: 18.1, sdPos3: 20.8 },
  { x: 42, sdNeg3: 10.3, sdNeg2: 11.6, sdNeg1: 13.1, median: 15.0, sdPos1: 17.2, sdPos2: 19.8, sdPos3: 22.9 },
  { x: 48, sdNeg3: 10.9, sdNeg2: 12.3, sdNeg1: 14.0, median: 16.1, sdPos1: 18.5, sdPos2: 21.5, sdPos3: 25.0 },
  { x: 54, sdNeg3: 11.5, sdNeg2: 13.0, sdNeg1: 14.9, median: 17.2, sdPos1: 19.9, sdPos2: 23.2, sdPos3: 27.1 },
  { x: 60, sdNeg3: 12.1, sdNeg2: 13.7, sdNeg1: 15.8, median: 18.2, sdPos1: 21.2, sdPos2: 24.9, sdPos3: 29.2 },
];

const WHO_WHZ_BOYS: WhoCurvePoint[] = [
  { x: 65, sdNeg3: 5.9, sdNeg2: 6.3, sdNeg1: 6.9, median: 7.4, sdPos1: 8.1, sdPos2: 8.8, sdPos3: 9.6 },
  { x: 70, sdNeg3: 6.8, sdNeg2: 7.4, sdNeg1: 8.0, median: 8.6, sdPos1: 9.3, sdPos2: 10.1, sdPos3: 11.0 },
  { x: 75, sdNeg3: 7.6, sdNeg2: 8.2, sdNeg1: 8.8, median: 9.5, sdPos1: 10.4, sdPos2: 11.3, sdPos3: 12.3 },
  { x: 80, sdNeg3: 8.2, sdNeg2: 8.9, sdNeg1: 9.6, median: 10.4, sdPos1: 11.3, sdPos2: 12.3, sdPos3: 13.4 },
  { x: 85, sdNeg3: 9.1, sdNeg2: 9.8, sdNeg1: 10.6, median: 11.5, sdPos1: 12.4, sdPos2: 13.6, sdPos3: 14.8 },
  { x: 90, sdNeg3: 10.0, sdNeg2: 10.8, sdNeg1: 11.7, median: 12.6, sdPos1: 13.7, sdPos2: 15.0, sdPos3: 16.5 },
  { x: 95, sdNeg3: 11.0, sdNeg2: 11.8, sdNeg1: 12.8, median: 13.9, sdPos1: 15.1, sdPos2: 16.5, sdPos3: 18.2 },
  { x: 100, sdNeg3: 12.0, sdNeg2: 13.0, sdNeg1: 14.0, median: 15.2, sdPos1: 16.6, sdPos2: 18.2, sdPos3: 20.2 },
  { x: 105, sdNeg3: 13.1, sdNeg2: 14.2, sdNeg1: 15.4, median: 16.7, sdPos1: 18.3, sdPos2: 20.2, sdPos3: 22.4 },
  { x: 110, sdNeg3: 14.2, sdNeg2: 15.5, sdNeg1: 16.8, median: 18.3, sdPos1: 20.1, sdPos2: 22.3, sdPos3: 24.9 },
  { x: 115, sdNeg3: 15.5, sdNeg2: 17.0, sdNeg1: 18.5, median: 20.2, sdPos1: 22.2, sdPos2: 24.7, sdPos3: 27.7 },
  { x: 120, sdNeg3: 17.0, sdNeg2: 18.6, sdNeg1: 20.3, median: 22.1, sdPos1: 24.4, sdPos2: 27.3, sdPos3: 30.7 },
];

const WHO_WHZ_GIRLS: WhoCurvePoint[] = [
  { x: 65, sdNeg3: 5.5, sdNeg2: 5.9, sdNeg1: 6.5, median: 7.0, sdPos1: 7.7, sdPos2: 8.4, sdPos3: 9.2 },
  { x: 70, sdNeg3: 6.3, sdNeg2: 6.9, sdNeg1: 7.5, median: 8.1, sdPos1: 8.8, sdPos2: 9.6, sdPos3: 10.5 },
  { x: 75, sdNeg3: 7.1, sdNeg2: 7.7, sdNeg1: 8.3, median: 9.0, sdPos1: 9.8, sdPos2: 10.7, sdPos3: 11.7 },
  { x: 80, sdNeg3: 7.7, sdNeg2: 8.4, sdNeg1: 9.1, median: 9.9, sdPos1: 10.7, sdPos2: 11.8, sdPos3: 13.0 },
  { x: 85, sdNeg3: 8.5, sdNeg2: 9.2, sdNeg1: 10.0, median: 11.0, sdPos1: 12.0, sdPos2: 13.2, sdPos3: 14.5 },
  { x: 90, sdNeg3: 9.5, sdNeg2: 10.3, sdNeg1: 11.2, median: 12.2, sdPos1: 13.3, sdPos2: 14.7, sdPos3: 16.3 },
  { x: 95, sdNeg3: 10.4, sdNeg2: 11.3, sdNeg1: 12.3, median: 13.5, sdPos1: 14.7, sdPos2: 16.3, sdPos3: 18.1 },
  { x: 100, sdNeg3: 11.4, sdNeg2: 12.5, sdNeg1: 13.6, median: 14.8, sdPos1: 16.2, sdPos2: 18.0, sdPos3: 20.1 },
  { x: 105, sdNeg3: 12.5, sdNeg2: 13.7, sdNeg1: 15.0, median: 16.3, sdPos1: 18.0, sdPos2: 20.0, sdPos3: 22.5 },
  { x: 110, sdNeg3: 13.7, sdNeg2: 15.0, sdNeg1: 16.4, median: 17.9, sdPos1: 19.8, sdPos2: 22.1, sdPos3: 25.0 },
  { x: 115, sdNeg3: 15.0, sdNeg2: 16.5, sdNeg1: 18.1, median: 19.8, sdPos1: 22.0, sdPos2: 24.7, sdPos3: 28.0 },
  { x: 120, sdNeg3: 16.4, sdNeg2: 18.1, sdNeg1: 19.9, median: 21.8, sdPos1: 24.3, sdPos2: 27.5, sdPos3: 31.4 },
];

// Hàm nội suy tuyến tính điểm chuẩn tham chiếu WHO cho tháng tuổi hoặc chiều cao bất kỳ
function interpolateCurvePoint(curve: WhoCurvePoint[], x: number): WhoCurvePoint {
  if (curve.length === 0) {
    return { x, sdNeg3: 0, sdNeg2: 0, sdNeg1: 0, median: 0, sdPos1: 0, sdPos2: 0, sdPos3: 0 };
  }
  if (x <= curve[0].x) return { ...curve[0], x };
  if (x >= curve[curve.length - 1].x) return { ...curve[curve.length - 1], x };

  const exact = curve.find((p) => p.x === x);
  if (exact) return exact;

  let lower = curve[0];
  let upper = curve[curve.length - 1];

  for (let i = 0; i < curve.length - 1; i++) {
    if (curve[i].x <= x && curve[i + 1].x >= x) {
      lower = curve[i];
      upper = curve[i + 1];
      break;
    }
  }

  const range = upper.x - lower.x;
  if (range === 0) return { ...lower, x };
  const ratio = (x - lower.x) / range;

  const lerp = (a: number, b: number) => Math.round((a + ratio * (b - a)) * 10) / 10;

  return {
    x,
    sdNeg3: lerp(lower.sdNeg3, upper.sdNeg3),
    sdNeg2: lerp(lower.sdNeg2, upper.sdNeg2),
    sdNeg1: lerp(lower.sdNeg1, upper.sdNeg1),
    median: lerp(lower.median, upper.median),
    sdPos1: lerp(lower.sdPos1, upper.sdPos1),
    sdPos2: lerp(lower.sdPos2, upper.sdPos2),
    sdPos3: lerp(lower.sdPos3, upper.sdPos3),
  };
}

export interface WhoGrowthChartProps {
  records: HealthRecord[];
  gender?: string; // "Nam" | "Nữ"
  dob?: string;
  studentName?: string;
  className?: string;
  height?: number;
}

export const WhoGrowthChart: React.FC<WhoGrowthChartProps> = ({
  records,
  gender = 'Nam',
  dob,
  studentName,
  className,
  height = 380,
}) => {
  const [activeIndicator, setActiveIndicator] = useState<'HAZ' | 'WAZ' | 'WHZ'>('HAZ');

  const isBoy = useMemo(() => {
    const g = String(gender || '').trim().toUpperCase();
    return g.startsWith('N') && g !== 'NỮ' && g !== 'NU' || g === 'M' || g === 'NAM';
  }, [gender]);

  // Sắp xếp các lần đo theo ngày tăng dần để vẽ tiến trình đường liên tục
  const sortedRecords = useMemo(() => {
    return [...records]
      .filter((r) => (r.canNang && r.canNang > 0) || (r.chieuCao && r.chieuCao > 0))
      .sort((a, b) => {
        const da = new Date(a.ngayDo || a.ngayKham || a.createdAt || '').getTime();
        const db = new Date(b.ngayDo || b.ngayKham || b.createdAt || '').getTime();
        return da - db;
      });
  }, [records]);

  // Lần đo mới nhất
  const latestRecord = sortedRecords[sortedRecords.length - 1];

  // Tính tuổi theo tháng tại thời điểm đo
  const calculateMonthAtDate = (recordDate?: string) => {
    if (!dob || !recordDate) return 48;
    const b = new Date(dob);
    const d = new Date(recordDate);
    if (isNaN(b.getTime()) || isNaN(d.getTime())) return 48;
    return Math.max(0, Math.min(60, (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth())));
  };

  // Chuẩn bị dữ liệu tích hợp giữa đường chuẩn WHO và các điểm đo thực tế của trẻ
  const chartData = useMemo(() => {
    if (activeIndicator === 'HAZ') {
      const baseCurve = isBoy ? WHO_HAZ_BOYS : WHO_HAZ_GIRLS;
      const combined = baseCurve.map((pt) => ({
        x: pt.x,
        label: `${pt.x} tháng`,
        sdNeg3: pt.sdNeg3,
        sdNeg2: pt.sdNeg2,
        median: pt.median,
        sdPos2: pt.sdPos2,
        sdPos3: pt.sdPos3,
        beThucTe: undefined as number | undefined,
        tooltipData: null as any,
      }));

      // Chèn các điểm thực tế của trẻ vào biểu đồ
      sortedRecords.forEach((r) => {
        if (!r.chieuCao || r.chieuCao <= 0) return;
        const m = r.thangTuoi != null ? r.thangTuoi : calculateMonthAtDate(r.ngayDo || r.ngayKham);

        // Tìm mốc gần nhất hoặc thêm điểm mới với chuẩn nội suy
        const existing = combined.find((p) => p.x === m);
        if (existing) {
          existing.beThucTe = Number(r.chieuCao);
          existing.tooltipData = r;
        } else {
          const interp = interpolateCurvePoint(baseCurve, m);
          combined.push({
            x: m,
            label: `${m} tháng`,
            sdNeg3: interp.sdNeg3,
            sdNeg2: interp.sdNeg2,
            median: interp.median,
            sdPos2: interp.sdPos2,
            sdPos3: interp.sdPos3,
            beThucTe: Number(r.chieuCao),
            tooltipData: r,
          });
        }
      });

      return combined.sort((a, b) => a.x - b.x);
    } else if (activeIndicator === 'WAZ') {
      const baseCurve = isBoy ? WHO_WAZ_BOYS : WHO_WAZ_GIRLS;
      const combined = baseCurve.map((pt) => ({
        x: pt.x,
        label: `${pt.x} tháng`,
        sdNeg3: pt.sdNeg3,
        sdNeg2: pt.sdNeg2,
        median: pt.median,
        sdPos2: pt.sdPos2,
        sdPos3: pt.sdPos3,
        beThucTe: undefined as number | undefined,
        tooltipData: null as any,
      }));

      sortedRecords.forEach((r) => {
        if (!r.canNang || r.canNang <= 0) return;
        const m = r.thangTuoi != null ? r.thangTuoi : calculateMonthAtDate(r.ngayDo || r.ngayKham);
        const existing = combined.find((p) => p.x === m);
        if (existing) {
          existing.beThucTe = Number(r.canNang);
          existing.tooltipData = r;
        } else {
          const interp = interpolateCurvePoint(baseCurve, m);
          combined.push({
            x: m,
            label: `${m} tháng`,
            sdNeg3: interp.sdNeg3,
            sdNeg2: interp.sdNeg2,
            median: interp.median,
            sdPos2: interp.sdPos2,
            sdPos3: interp.sdPos3,
            beThucTe: Number(r.canNang),
            tooltipData: r,
          });
        }
      });

      return combined.sort((a, b) => a.x - b.x);
    } else {
      // WHZ: Cân nặng theo chiều cao (65cm - 120cm)
      const baseCurve = isBoy ? WHO_WHZ_BOYS : WHO_WHZ_GIRLS;
      const combined = baseCurve.map((pt) => ({
        x: pt.x,
        label: `${pt.x} cm`,
        sdNeg3: pt.sdNeg3,
        sdNeg2: pt.sdNeg2,
        median: pt.median,
        sdPos2: pt.sdPos2,
        sdPos3: pt.sdPos3,
        beThucTe: undefined as number | undefined,
        tooltipData: null as any,
      }));

      sortedRecords.forEach((r) => {
        if (!r.canNang || !r.chieuCao || r.canNang <= 0 || r.chieuCao <= 0) return;
        const h = Math.round(Number(r.chieuCao));
        const existing = combined.find((p) => Math.abs(p.x - h) <= 1);
        if (existing) {
          existing.beThucTe = Number(r.canNang);
          existing.tooltipData = r;
        } else {
          const interp = interpolateCurvePoint(baseCurve, h);
          combined.push({
            x: h,
            label: `${h} cm`,
            sdNeg3: interp.sdNeg3,
            sdNeg2: interp.sdNeg2,
            median: interp.median,
            sdPos2: interp.sdPos2,
            sdPos3: interp.sdPos3,
            beThucTe: Number(r.canNang),
            tooltipData: r,
          });
        }
      });

      return combined.sort((a, b) => a.x - b.x);
    }
  }, [activeIndicator, isBoy, sortedRecords, dob]);

  // Đánh giá xu hướng tiến triển qua các lần đo
  const trendInfo = useMemo(() => {
    if (sortedRecords.length < 2) {
      return {
        direction: 'neutral',
        text: 'Cần ít nhất 2 đợt đo định kỳ để đánh giá xu hướng tiến triển thể trạng của bé.',
      };
    }
    const prev = sortedRecords[sortedRecords.length - 2];
    const curr = sortedRecords[sortedRecords.length - 1];

    const hDiff = (Number(curr.chieuCao || 0) - Number(prev.chieuCao || 0));
    const wDiff = (Number(curr.canNang || 0) - Number(prev.canNang || 0));

    if (hDiff >= 0 && wDiff > 0) {
      return {
        direction: 'up',
        text: `Đang tăng trưởng rất tốt (+${wDiff.toFixed(1)} kg, +${hDiff.toFixed(1)} cm so với lần đo trước).`,
      };
    }
    if (wDiff < 0) {
      return {
        direction: 'down',
        text: `Cân nặng có dấu hiệu sụt (${wDiff.toFixed(1)} kg so với lần đo trước). Cần chú ý bồi dưỡng dinh dưỡng.`,
      };
    }
    return {
      direction: 'flat',
      text: 'Các chỉ số thể trạng đang chững lại / đi ngang. Tiếp tục theo dõi sát chế độ sinh hoạt.',
    };
  }, [sortedRecords]);

  // Custom Tooltip trực quan chuẩn y khoa
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const pt = payload[0]?.payload;
    const rec: HealthRecord = pt?.tooltipData;

    const dyn = rec && (rec.canNang || rec.chieuCao)
      ? evaluateWhoMetrics(
          rec.canNang != null ? Number(rec.canNang) : undefined,
          rec.chieuCao != null ? Number(rec.chieuCao) : undefined,
          dob,
          gender
        )
      : null;

    const hazZ = dyn ? dyn.haz.zScore : rec?.haz;
    const hazLabel = dyn ? dyn.haz.label : rec?.ketLuanHaz;

    const wazZ = dyn ? dyn.waz.zScore : rec?.waz;
    const wazLabel = dyn ? dyn.waz.label : rec?.ketLuanWaz;

    const whzZ = dyn ? dyn.whz.zScore : rec?.whz;
    const whzLabel = dyn ? dyn.whz.label : rec?.ketLuanWhz;

    return (
      <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl text-xs backdrop-blur-md border border-slate-700/80 min-w-[220px]">
        <div className="font-bold text-amber-300 pb-1.5 border-b border-slate-700/60 flex items-center justify-between">
          <span>{pt.label}</span>
          {rec?.ngayDo && (
            <span className="text-[10px] text-slate-400 font-normal">
              {new Date(rec.ngayDo).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>

        {pt.beThucTe != null ? (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-indigo-300 font-bold">
              <span>Bé thực tế:</span>
              <span className="text-sm text-white">
                {pt.beThucTe} {activeIndicator === 'HAZ' ? 'cm' : 'kg'}
              </span>
            </div>
            {hazZ != null && activeIndicator === 'HAZ' && (
              <div className="flex items-center justify-between text-slate-300">
                <span>Z-score (HAZ):</span>
                <span className="font-semibold text-emerald-400">{hazZ > 0 ? `+${hazZ}` : hazZ} SD</span>
              </div>
            )}
            {wazZ != null && activeIndicator === 'WAZ' && (
              <div className="flex items-center justify-between text-slate-300">
                <span>Z-score (WAZ):</span>
                <span className="font-semibold text-emerald-400">{wazZ > 0 ? `+${wazZ}` : wazZ} SD</span>
              </div>
            )}
            {whzZ != null && activeIndicator === 'WHZ' && (
              <div className="flex items-center justify-between text-slate-300">
                <span>Z-score (WHZ):</span>
                <span className="font-semibold text-emerald-400">{whzZ > 0 ? `+${whzZ}` : whzZ} SD</span>
              </div>
            )}
            {hazLabel && activeIndicator === 'HAZ' && (
              <div className="pt-1 text-[11px] text-amber-200 border-t border-slate-800">
                {hazLabel}
              </div>
            )}
            {wazLabel && activeIndicator === 'WAZ' && (
              <div className="pt-1 text-[11px] text-amber-200 border-t border-slate-800">
                {wazLabel}
              </div>
            )}
            {whzLabel && activeIndicator === 'WHZ' && (
              <div className="pt-1 text-[11px] text-amber-200 border-t border-slate-800">
                {whzLabel}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-1 text-slate-400 text-[11px]">Mốc chuẩn tham chiếu WHO</div>
        )}

        <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] space-y-0.5 text-slate-400">
          {pt.median != null && <div>Chuẩn TB (Median): {pt.median} {activeIndicator === 'HAZ' ? 'cm' : 'kg'}</div>}
          {pt.sdNeg2 != null && <div>Ranh giới thiếu (-2SD): {pt.sdNeg2} {activeIndicator === 'HAZ' ? 'cm' : 'kg'}</div>}
          {pt.sdPos2 != null && <div>Ranh giới thừa (+2SD): {pt.sdPos2} {activeIndicator === 'HAZ' ? 'cm' : 'kg'}</div>}
        </div>
      </div>
    );
  };

  // Đánh giá thể trạng đợt mới nhất chuẩn y khoa theo đúng ngày sinh và giới tính thực tế của bé
  const latestEvaluation = useMemo(() => {
    if (!latestRecord) return null;
    const w = latestRecord.canNang != null ? Number(latestRecord.canNang) : undefined;
    const h = latestRecord.chieuCao != null ? Number(latestRecord.chieuCao) : undefined;
    if ((!w || w <= 0) && (!h || h <= 0)) return null;
    return evaluateWhoMetrics(w, h, dob, gender);
  }, [latestRecord, dob, gender]);

  const latestHazVal = latestEvaluation ? latestEvaluation.haz.zScore : latestRecord?.haz;
  const latestHazLabel = latestEvaluation ? latestEvaluation.haz.label : latestRecord?.ketLuanHaz;

  const latestWazVal = latestEvaluation ? latestEvaluation.waz.zScore : latestRecord?.waz;
  const latestWazLabel = latestEvaluation ? latestEvaluation.waz.label : latestRecord?.ketLuanWaz;

  const latestWhzVal = latestEvaluation ? latestEvaluation.whz.zScore : latestRecord?.whz;
  const latestWhzLabel = latestEvaluation ? latestEvaluation.whz.label : latestRecord?.ketLuanWhz;
  const latestWhzStatus = latestEvaluation ? latestEvaluation.trangThaiTongThe : (latestRecord?.trangThaiTheTrang || 'CÂN ĐỐI');

  return (
    <div className="space-y-4">
      {/* 3 Thẻ Kết Luận WHO Đợt Đo Mới Nhất */}
      {latestRecord && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card HAZ */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-indigo-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <Ruler size={16} /> Chiều cao theo tuổi (HAZ)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white text-blue-800 border border-blue-200 shadow-2xs">
                {latestHazVal != null ? `${latestHazVal > 0 ? '+' : ''}${latestHazVal} SD` : 'Chưa tính'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-800">
              {latestRecord.chieuCao || '--'} <span className="text-sm font-semibold text-slate-500">cm</span>
            </div>
            <p className="mt-1 text-xs font-bold text-blue-900 leading-snug">
              {latestHazLabel || (latestHazVal && latestHazVal < -2 ? 'Suy dinh dưỡng thể thấp còi' : 'Chiều cao phát triển bình thường')}
            </p>
          </div>

          {/* Card WAZ */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Scale size={16} /> Cân nặng theo tuổi (WAZ)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white text-emerald-800 border border-emerald-200 shadow-2xs">
                {latestWazVal != null ? `${latestWazVal > 0 ? '+' : ''}${latestWazVal} SD` : 'Chưa tính'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-800">
              {latestRecord.canNang || '--'} <span className="text-sm font-semibold text-slate-500">kg</span>
            </div>
            <p className="mt-1 text-xs font-bold text-emerald-900 leading-snug">
              {latestWazLabel || (latestWazVal && latestWazVal < -2 ? 'Suy dinh dưỡng thể nhẹ cân' : 'Cân nặng bình thường theo tuổi')}
            </p>
          </div>

          {/* Card WHZ */}
          <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Activity size={16} /> Cân nặng / Chiều cao (WHZ)
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white text-amber-800 border border-amber-200 shadow-2xs">
                {latestWhzVal != null ? `${latestWhzVal > 0 ? '+' : ''}${latestWhzVal} SD` : 'Chưa tính'}
              </span>
            </div>
            <div className="mt-2 text-2xl font-black text-slate-800">
              {latestWhzStatus}
            </div>
            <p className="mt-1 text-xs font-bold text-amber-900 leading-snug">
              {latestWhzLabel || (latestWhzVal && latestWhzVal > 2 ? 'Thừa cân' : 'Thể trạng cân đối, dinh dưỡng bình thường')}
            </p>
          </div>
        </div>
      )}

      {/* Thanh Điều hướng 3 Chỉ số */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveIndicator('HAZ')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              activeIndicator === 'HAZ'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chiều cao (HAZ)
          </button>
          <button
            type="button"
            onClick={() => setActiveIndicator('WAZ')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              activeIndicator === 'WAZ'
                ? 'bg-white text-emerald-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cân nặng (WAZ)
          </button>
          <button
            type="button"
            onClick={() => setActiveIndicator('WHZ')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
              activeIndicator === 'WHZ'
                ? 'bg-white text-amber-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thể trạng (WHZ)
          </button>
        </div>

        {/* Thông báo xu hướng phát triển */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          {trendInfo.direction === 'up' && <TrendingUp size={16} className="text-emerald-500 shrink-0" />}
          {trendInfo.direction === 'down' && <TrendingDown size={16} className="text-rose-500 shrink-0" />}
          {trendInfo.direction === 'flat' && <Activity size={16} className="text-amber-500 shrink-0" />}
          <span>{trendInfo.text}</span>
        </div>
      </div>

      {/* Vùng Biểu đồ Đường Cong Tăng Trưởng */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
          <div>
            Biểu đồ chuẩn WHO ({isBoy ? 'Bé trai' : 'Bé gái'} 0 - 5 tuổi) •{' '}
            <span className="font-bold text-slate-700">
              {activeIndicator === 'HAZ' && 'Chiều cao theo tháng tuổi'}
              {activeIndicator === 'WAZ' && 'Cân nặng theo tháng tuổi'}
              {activeIndicator === 'WHZ' && 'Cân nặng theo chiều cao'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Median (0 SD)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Ranh giới ±2 SD
            </span>
            <span className="flex items-center gap-1 font-bold text-indigo-600">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block shadow-2xs" /> Bé thực tế
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#cbd5e1"
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                stroke="#cbd5e1"
                domain={['auto', 'auto']}
                unit={activeIndicator === 'HAZ' ? 'cm' : 'kg'}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Đường chuẩn WHO: +2SD (Vàng/Cam) */}
              <Line
                type="monotone"
                dataKey="sdPos2"
                name="+2 SD (Ngưỡng thừa)"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />

              {/* Đường chuẩn WHO: Median 0 SD (Xanh ngọc - Chuẩn lý tưởng) */}
              <Line
                type="monotone"
                dataKey="median"
                name="Median (Chuẩn TB WHO)"
                stroke="#10b981"
                strokeWidth={2.2}
                dot={false}
                connectNulls
              />

              {/* Đường chuẩn WHO: -2SD (Cam - Ngưỡng thiếu) */}
              <Line
                type="monotone"
                dataKey="sdNeg2"
                name="-2 SD (Ngưỡng thiếu)"
                stroke="#fb923c"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />

              {/* Đường thực tế của trẻ (Indigo đậm, nét dày, dot nổi bật) */}
              <Line
                type="monotone"
                dataKey="beThucTe"
                name="Số đo của bé"
                stroke="#4f46e5"
                strokeWidth={3.5}
                dot={{ r: 6, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 9, fill: '#4338ca', stroke: '#fff', strokeWidth: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lời khuyên y khoa dinh dưỡng */}
        {latestRecord?.loiKhuyen && (
          <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-700">
            <Info size={17} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-900">Khuyến nghị dinh dưỡng & phát triển: </span>
              {latestRecord.loiKhuyen}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhoGrowthChart;
