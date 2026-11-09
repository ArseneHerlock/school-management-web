'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface ActivityBreakdownChartProps {
  processedBreakdown: any[];
  classStudents: any[];
  classBreakdownLength: number;
}

export function ActivityBreakdownChart({
  processedBreakdown,
  classStudents,
  classBreakdownLength,
}: ActivityBreakdownChartProps) {
  if (classBreakdownLength === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
        Chưa có dữ liệu đánh giá hoạt động cho lớp học này.
      </div>
    );
  }

  return (
    <div className="h-68 w-full mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedBreakdown}
          margin={{ top: 10, right: 10, left: -20, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="shortName"
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={40}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10 }}
            unit="%"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            formatter={(val: any, name: any, item: any) => {
              const p = item?.payload || {};
              if (name === 'Đạt chuẩn') {
                return [`${val}% (${p.passSlots || 0}/${p.totalSlots || 0} lượt)`, name];
              }
              if (name === 'Cần rèn luyện') {
                const hsText = p.failStudentsCount
                  ? ` - ở ${p.failStudentsCount} trẻ`
                  : '';
                return [
                  `${val}% (${p.failSlots || 0}/${p.totalSlots || 0} lượt${hsText})`,
                  name,
                ];
              }
              return [`${val}% (${p.unassessedSlots || 0} lượt)`, name];
            }}
            labelFormatter={(label: any, payload: any) => {
              const p = payload?.[0]?.payload;
              if (!p) return label;
              const dText = p.domainShortName ? `[${p.domainShortName}] ` : '';
              return `${dText}${p.fullName || label} (${p.studentCount || classStudents.length} HS × ${p.criteriaCount || 4} tiêu chí = ${p.totalSlots || 100} lượt)`;
            }}
            contentStyle={{
              borderRadius: '1rem',
              borderColor: '#e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
          />
          <Bar dataKey="passRate" name="Đạt chuẩn" fill="#10b981" stackId="a" />
          <Bar dataKey="failRate" name="Cần rèn luyện" fill="#f43f5e" stackId="a" />
          <Bar
            dataKey="unassessedRate"
            name="Chưa đánh giá"
            fill="#cbd5e1"
            stackId="a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
