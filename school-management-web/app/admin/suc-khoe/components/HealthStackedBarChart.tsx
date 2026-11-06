"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Activity, Info } from "lucide-react";
import { StackedNutritionBarData } from "../healthAggregations";

interface HealthStackedBarChartProps {
  title: string;
  subtitle: string;
  data?: StackedNutritionBarData[];
}

const CATEGORY_BARS = [
  { key: "datChuan", name: "Đạt chuẩn WHO", color: "#10b981" },
  { key: "thapCoi", name: "Thấp còi", color: "#3b82f6" },
  { key: "thapCoiNang", name: "Thấp còi nặng", color: "#6366f1" },
  { key: "nheCan", name: "Nhẹ cân", color: "#f59e0b" },
  { key: "nheCanNang", name: "Nhẹ cân nặng", color: "#f43f5e" },
  { key: "gayCom", name: "Gầy còm", color: "#ea580c" },
  { key: "gayComNang", name: "Gầy còm nặng", color: "#dc2626" },
  { key: "thuaCan", name: "Thừa cân", color: "#8b5cf6" },
  { key: "beoPhi", name: "Béo phì", color: "#be185d" },
  { key: "unmeasured", name: "Chưa có số đo", color: "#cbd5e1" },
];

export default function HealthStackedBarChart({
  title,
  subtitle,
  data = [],
}: HealthStackedBarChartProps) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Activity size={16} />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 self-start sm:self-auto">
            {data.length} nhóm lớp
          </span>
        </div>

        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
            Chưa có dữ liệu đo kiểm sức khỏe cho danh mục này.
          </div>
        ) : (
          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 15, left: 10, bottom: 35 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={45}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  unit=" bé"
                  width={55}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} học sinh`, name]}
                  labelFormatter={(l: any) => `Nhóm: ${l}`}
                  contentStyle={{
                    borderRadius: "1rem",
                    borderColor: "#e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                  iconType="circle"
                />
                {CATEGORY_BARS.map((bar, idx) => (
                  <Bar
                    key={bar.key}
                    dataKey={bar.key}
                    name={bar.name}
                    fill={bar.color}
                    stackId="theTrang"
                    radius={idx === CATEGORY_BARS.length - 1 ? [6, 6, 0, 0] : undefined}
                    maxBarSize={42}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <Info size={13} className="text-emerald-600" />
          Chiều cao cột = Tổng sĩ số. Phân bố chi tiết 9 tiêu chí chuẩn WHO 2006.
        </span>
        <span className="font-bold text-emerald-700">
          Chuẩn WHO & Viện Dinh Dưỡng
        </span>
      </div>
    </div>
  );
}
