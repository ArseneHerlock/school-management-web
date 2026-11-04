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
  const whoChartData = [
    {
      name: "Bình thường (Đạt chuẩn WHO)",
      value: whoNutrition.normalCount,
      color: "#10b981",
      labelShort: "Chuẩn WHO",
    },
    {
      name: "Thấp còi / Nhẹ cân",
      value: whoNutrition.underweightOrStuntedCount,
      color: "#f59e0b",
      labelShort: "Nhẹ cân / Thấp còi",
    },
    {
      name: "Thừa cân / Béo phì",
      value: whoNutrition.overweightOrObeseCount,
      color: "#f97316",
      labelShort: "Thừa cân / Béo phì",
    },
    {
      name: "Chưa có số đo kỳ này",
      value: whoNutrition.unmeasuredCount,
      color: "#cbd5e1",
      labelShort: "Chưa đo",
    },
  ].filter((item) => item.value > 0);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between max-w-full min-w-0">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <HeartPulse size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
                Thể trạng Trẻ em (Chuẩn WHO)
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                Đánh giá định kỳ dinh dưỡng & thể lực theo chuẩn WHO
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-black text-rose-700 border border-rose-200">
              {whoNutrition.measuredCount}/{whoNutrition.totalStudents} trẻ đã đo
            </span>
            {onNavigate && (
              <button
                onClick={() => onNavigate("suc-khoe")}
                className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-0.5 cursor-pointer"
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
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
            <div className="h-44 sm:h-52 w-full relative min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={whoChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {whoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} trẻ (${Math.round((val / (whoNutrition.totalStudents || 1)) * 100)}%)`,
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

            {/* 2x2 Clean Grid on Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-[11px] truncate">
                    Chuẩn WHO
                  </span>
                </div>
                <span className="font-black text-emerald-700 text-xs">
                  {whoNutrition.normalCount} ({whoNutrition.normalPercent}%)
                </span>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-[11px] truncate">
                    Thấp còi
                  </span>
                </div>
                <span className="font-black text-amber-700 text-xs">
                  {whoNutrition.underweightOrStuntedCount} ({whoNutrition.underweightPercent}%)
                </span>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-[11px] truncate">
                    Thừa cân
                  </span>
                </div>
                <span className="font-black text-orange-700 text-xs">
                  {whoNutrition.overweightOrObeseCount} ({whoNutrition.overweightPercent}%)
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-slate-400 shrink-0" />
                  <span className="font-bold text-slate-600 text-[11px] truncate">
                    Chưa cập nhật
                  </span>
                </div>
                <span className="font-black text-slate-700 text-xs">
                  {whoNutrition.unmeasuredCount} bé
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 text-slate-600 font-medium truncate">
          <Info size={12} className="text-rose-500 shrink-0" />
          <span>Theo lứa tuổi & giới tính WHO</span>
        </span>
        <span className="font-bold text-emerald-700 shrink-0 ml-2">
          Mục tiêu: ≥ 90%
        </span>
      </div>
    </section>
  );
}
