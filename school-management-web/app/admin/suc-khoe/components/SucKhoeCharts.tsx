"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { HeartPulse, Info } from "lucide-react";
import HealthStackedBarChart from "./HealthStackedBarChart";

interface SucKhoeChartsProps {
  schoolPie: any[];
  byGrade: any[];
  byClass: any[];
}

const HEALTH_COLORS: Record<string, string> = {
  "Đạt chuẩn (Bình thường)": "#10B981",
  "Thấp còi": "#EAB308",
  "Nhẹ cân": "#F97316",
  "Suy dinh dưỡng": "#EF4444",
  "Thừa cân": "#D946EF",
  "Béo phì": "#BE185D",
  "Chưa có số đo": "#94A3B8",
};

const DEFAULT_PALETTE = ["#10b981", "#f59e0b", "#f43f5e", "#cbd5e1", "#6366f1"];

export const SucKhoeCharts: React.FC<SucKhoeChartsProps> = ({
  schoolPie = [],
  byGrade = [],
  byClass = [],
}) => {
  const totalMeasured = schoolPie.reduce(
    (acc, curr) => acc + (curr.value || 0),
    0,
  );
  const normalItem = schoolPie.find(
    (p) =>
      p.name.toLowerCase().includes("bình thường") ||
      p.name.toLowerCase().includes("chuẩn"),
  );
  const normalPercent =
    totalMeasured > 0
      ? Math.round(((normalItem?.value || 0) / totalMeasured) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <HeartPulse size={16} />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800">
                    Cơ cấu Thể trạng Dinh dưỡng Toàn trường
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Phân bổ sức khỏe theo chỉ số Z-score chuẩn WHO
                  </p>
                </div>
              </div>
              {totalMeasured > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
                  {normalPercent}% Đạt chuẩn WHO
                </span>
              )}
            </div>

            {schoolPie.length === 0 || totalMeasured === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
                Chưa có dữ liệu hồ sơ khám sức khỏe toàn trường.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-56 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={schoolPie}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                      >
                        {schoolPie.map((entry, i) => {
                          const c =
                            HEALTH_COLORS[entry.name] ||
                            DEFAULT_PALETTE[i % DEFAULT_PALETTE.length];
                          return <Cell key={i} fill={c} />;
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `${val} bé (${Math.round((val / totalMeasured) * 100)}%)`,
                          name,
                        ]}
                        contentStyle={{
                          borderRadius: "1rem",
                          borderColor: "#e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-emerald-600">
                      {normalPercent}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Chuẩn WHO
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {schoolPie.map((item, idx) => {
                    const c =
                      HEALTH_COLORS[item.name] ||
                      DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];
                    const pct =
                      totalMeasured > 0
                        ? Math.round((item.value / totalMeasured) * 100)
                        : 0;
                    return (
                      <div
                        key={item.name}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: c }}
                          />
                          <span className="font-bold text-slate-700">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-black text-slate-800">
                          {item.value} bé ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info size={12} className="text-slate-400" />
              Tổng học sinh khảo sát: <b>{totalMeasured} bé</b>
            </span>
            <span className="font-bold text-emerald-700">Y tế học đường</span>
          </div>
        </div>

        <HealthStackedBarChart
          title="Phân loại Thể trạng Dinh dưỡng theo Khối"
          subtitle="Tỷ lệ trẻ Đạt chuẩn, Suy dinh dưỡng, Thừa cân và Chưa đo theo khối"
          data={byGrade}
        />
      </div>

      <HealthStackedBarChart
        title="Phân loại Thể trạng Dinh dưỡng chi tiết từng Lớp học"
        subtitle="So sánh cơ cấu sức khỏe học sinh giữa các lớp để lập chế độ dinh dưỡng bán trú"
        data={byClass}
      />
    </div>
  );
};

export default SucKhoeCharts;
