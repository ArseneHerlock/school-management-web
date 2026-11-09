"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HeartPulse, ArrowRight, Info } from "lucide-react";
import { WhoNutritionSummary } from "@/services/adminDashboardTypes";

interface WhoNutritionChartProps {
  whoNutrition: WhoNutritionSummary;
  onNavigate?: (tab: string) => void;
}

export function WhoNutritionChart({
  whoNutrition,
  onNavigate,
}: WhoNutritionChartProps) {
  const total = whoNutrition.totalStudents || 1;

  // 9 Phân loại thể trạng dinh dưỡng chuẩn WHO 2006 (0 - 5 tuổi)
  const who9Categories = [
    {
      id: "DAT_CHUAN",
      name: "Đạt chuẩn WHO",
      shortLabel: "Chuẩn WHO",
      value: whoNutrition.normalCount || 0,
      color: "#10b981",
      dotColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-100 bg-emerald-50/50",
    },
    {
      id: "THAP_COI",
      name: "Thấp còi",
      shortLabel: "Thấp còi",
      value: whoNutrition.stuntedCount || 0,
      color: "#3b82f6",
      dotColor: "bg-blue-500",
      textColor: "text-blue-700",
      borderColor: "border-blue-100 bg-blue-50/50",
    },
    {
      id: "THAP_COI_NANG",
      name: "Thấp còi nặng",
      shortLabel: "Thấp còi nặng",
      value: whoNutrition.severelyStuntedCount || 0,
      color: "#6366f1",
      dotColor: "bg-indigo-600",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-100 bg-indigo-50/50",
    },
    {
      id: "NHE_CAN",
      name: "Nhẹ cân",
      shortLabel: "Nhẹ cân",
      value: whoNutrition.underweightCount || 0,
      color: "#f59e0b",
      dotColor: "bg-amber-500",
      textColor: "text-amber-700",
      borderColor: "border-amber-100 bg-amber-50/50",
    },
    {
      id: "NHE_CAN_NANG",
      name: "Nhẹ cân nặng",
      shortLabel: "Nhẹ cân nặng",
      value: whoNutrition.severelyUnderweightCount || 0,
      color: "#f43f5e",
      dotColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-100 bg-emerald-50/50",
    },
    {
      id: "GAY_COM",
      name: "Gầy còm",
      shortLabel: "Gầy còm",
      value: whoNutrition.wastedCount || 0,
      color: "#ea580c",
      dotColor: "bg-orange-500",
      textColor: "text-orange-700",
      borderColor: "border-orange-100 bg-orange-50/50",
    },
    {
      id: "GAY_COM_NANG",
      name: "Gầy còm nặng",
      shortLabel: "Gầy còm nặng",
      value: whoNutrition.severelyWastedCount || 0,
      color: "#dc2626",
      dotColor: "bg-red-600",
      textColor: "text-red-700",
      borderColor: "border-red-100 bg-red-50/50",
    },
    {
      id: "THUA_CAN",
      name: "Thừa cân",
      shortLabel: "Thừa cân",
      value: whoNutrition.overweightCount || 0,
      color: "#8b5cf6",
      dotColor: "bg-purple-500",
      textColor: "text-purple-700",
      borderColor: "border-purple-100 bg-purple-50/50",
    },
    {
      id: "BEO_PHI",
      name: "Béo phì",
      shortLabel: "Béo phì",
      value: whoNutrition.obeseCount || 0,
      color: "#be185d",
      dotColor: "bg-pink-600",
      textColor: "text-pink-700",
      borderColor: "border-pink-100 bg-pink-50/50",
    },
  ];

  if ((whoNutrition.unmeasuredCount || 0) > 0) {
    who9Categories.push({
      id: "CHUA_DO",
      name: "Chưa cập nhật",
      shortLabel: "Chưa cập nhật",
      value: whoNutrition.unmeasuredCount,
      color: "#94a3b8",
      dotColor: "bg-slate-400",
      textColor: "text-slate-600",
      borderColor: "border-slate-100 bg-slate-50",
    });
  }

  const chartData = who9Categories.filter((item) => item.value > 0);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between max-w-full min-w-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <HeartPulse size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                Thể trạng học sinh (WHO)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 border border-emerald-200">
              {whoNutrition.measuredCount}/{whoNutrition.totalStudents} trẻ đã đo
            </span>
            {onNavigate && (
              <button
                onClick={() => onNavigate("suc-khoe")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
              >
                <span className="hidden sm:inline">Sổ y tế</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {whoNutrition.measuredCount === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
            Chưa có dữ liệu hồ sơ khám sức khỏe định kỳ nào trong đợt này.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[200px_1fr] items-center gap-4">
            {/* Donut Chart */}
            <div className="h-48 sm:h-56 w-full relative min-w-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={74}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} trẻ (${Math.round((Number(val) / total) * 100)}%)`,
                      name,
                    ]}
                    contentStyle={{
                      borderRadius: "0.85rem",
                      borderColor: "#e2e8f0",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                      padding: "8px 12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl sm:text-2xl font-black text-slate-800">
                  {whoNutrition.normalPercent}%
                </span>
                <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wide">
                  Đạt chuẩn
                </span>
              </div>
            </div>

            {/* Danh sách 9 nhóm thể trạng chuẩn WHO */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs max-h-60 overflow-y-auto pr-1">
              {who9Categories.map((c) => {
                const pct = Math.round((c.value / total) * 100);
                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-2 flex flex-col justify-between transition ${
                      c.value > 0 ? c.borderColor : "border-slate-100 bg-slate-50/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${c.dotColor}`} />
                      <span className="font-bold text-slate-700 text-[11px] truncate" title={c.name}>
                        {c.shortLabel}
                      </span>
                    </div>
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className={`font-black text-xs ${c.textColor}`}>
                        {c.value} trẻ
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-slate-600 font-medium truncate">
          <Info size={12} className="text-emerald-500 shrink-0" />
          <span>Theo 9 phân loại chuẩn lứa tuổi & giới tính WHO 2006</span>
        </span>
        <span className="font-bold text-emerald-700 shrink-0 ml-2">
          Mục tiêu chuẩn: ≥ 90%
        </span>
      </div>
    </section>
  );
}
