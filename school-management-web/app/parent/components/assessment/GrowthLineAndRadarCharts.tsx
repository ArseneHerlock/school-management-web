'use client';

import React from 'react';
import { TrendingUp, Heart } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface ChartDataItem {
  label: string;
  score: number;
  clusterName: string;
  rawCluster: number;
}

interface GrowthLineAndRadarChartsProps {
  chartData: ChartDataItem[];
  radarScores?: Record<string, number> | null;
}

export function GrowthLineAndRadarCharts({
  chartData,
  radarScores,
}: GrowthLineAndRadarChartsProps) {
  const getRadarVal = (vnKey: string, camelKey: string, fallback: number) => {
    const val =
      radarScores?.[vnKey] ??
      radarScores?.[camelKey] ??
      (vnKey === 'Thẩm mỹ' ? radarScores?.['Thẩm mĩ'] : undefined) ??
      fallback;
    const num = Number(val);
    return num > 1 ? num / 100 : num;
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Timeline Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-7">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">
              Biểu đồ tiến trình phát triển của con
            </h3>
            <p className="text-[11px] text-slate-400">
              Theo dõi đường cong phát triển qua từng tháng học
            </p>
          </div>
          <TrendingUp size={18} className="text-indigo-500" />
        </div>

        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[1, 4]}
                ticks={[1, 2, 3, 4]}
                tickFormatter={(val) => {
                  if (val === 4) return 'Chuẩn';
                  if (val === 3) return 'Khá';
                  if (val === 2) return 'TB';
                  return 'Cần hỗ trợ';
                }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                formatter={(val: any, name: any, item: any) => [
                  item.payload.clusterName,
                  'Mức độ phát triển',
                ]}
                contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6, fill: '#6366f1' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5 Domains Radar for Latest Month */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">5 lĩnh vực phát triển</h3>
            <p className="text-[11px] text-slate-400">Đánh giá theo chuẩn của Bộ Giáo dục</p>
          </div>
          <Heart size={18} className="text-rose-500" />
        </div>

        <div className="mt-2 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="70%"
              data={[
                {
                  domain: 'Thể chất',
                  score: getRadarVal('Thể chất', 'theChat', 0.8),
                  fullMark: 1,
                },
                {
                  domain: 'Nhận thức',
                  score: getRadarVal('Nhận thức', 'nhanThuc', 0.75),
                  fullMark: 1,
                },
                {
                  domain: 'Ngôn ngữ',
                  score: getRadarVal('Ngôn ngữ', 'ngonNgu', 0.85),
                  fullMark: 1,
                },
                {
                  domain: 'Tình cảm xã hội',
                  score: getRadarVal('Tình cảm - Xã hội', 'tinhCamXaHoi', 0.8),
                  fullMark: 1,
                },
                {
                  domain: 'Thẩm mỹ',
                  score: getRadarVal('Thẩm mĩ', 'thamMy', 0.7),
                  fullMark: 1,
                },
              ]}
            >
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 9 }} />
              <Radar
                name="Mức đạt được"
                dataKey="score"
                stroke="#ec4899"
                fill="#ec4899"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
