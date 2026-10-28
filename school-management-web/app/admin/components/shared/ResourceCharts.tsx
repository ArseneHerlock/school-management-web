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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const palette = ['#43a968', '#22c55e', '#84cc16', '#14b8a6', '#f59e0b', '#64748b'];

interface ResourceChartsProps {
  primaryLabel: string;
  secondaryLabel: string;
  primaryChart: Array<{ name: string; value: number }>;
  secondaryChart: Array<{ name: string; value: number }>;
}

export const ResourceCharts: React.FC<ResourceChartsProps> = ({
  primaryLabel,
  secondaryLabel,
  primaryChart,
  secondaryChart,
}) => {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_.75fr]">
      <div className="admin-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-slate-900">Phân bổ theo {primaryLabel}</h2>
            <p className="text-xs text-slate-400">Tự động tổng hợp từ dữ liệu máy chủ.</p>
          </div>
        </div>
        <div className="mt-3 h-56">
          {primaryChart.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={primaryChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5efe8" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#43a968" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>
      <div className="admin-card p-4">
        <h2 className="font-black text-slate-900">Tỷ trọng theo {secondaryLabel}</h2>
        <div className="mt-3 h-56">
          {secondaryChart.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={secondaryChart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82}>
                  {secondaryChart.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </div>
      </div>
    </div>
  );
};

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-emerald-50/70 text-sm font-semibold text-emerald-700">
      Chưa có dữ liệu thống kê
    </div>
  );
}
