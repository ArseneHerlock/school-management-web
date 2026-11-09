"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { HeartPulse, Info, CheckCircle2, Filter } from "lucide-react";
import HealthStackedBarChart from "./HealthStackedBarChart";
import { PieCategoryItem, StackedNutritionBarData } from "../healthAggregations";
import { HealthCategoryFilter, HEALTH_CATEGORY_COLORS } from "../types";

interface SucKhoeChartsProps {
  schoolPie: PieCategoryItem[];
  byGrade: StackedNutritionBarData[];
  byClass: StackedNutritionBarData[];
  selectedCategory?: HealthCategoryFilter;
  onSelectCategory?: (category: HealthCategoryFilter) => void;
}

export const SucKhoeCharts: React.FC<SucKhoeChartsProps> = ({
  schoolPie = [],
  byGrade = [],
  byClass = [],
  selectedCategory = "ALL",
  onSelectCategory,
}) => {
  const totalStudents = schoolPie.reduce(
    (acc, curr) => acc + (curr.value || 0),
    0
  );

  const normalItem = schoolPie.find((p) => p.key === "DAT_CHUAN");
  const normalPercent =
    totalStudents > 0
      ? Math.round(((normalItem?.value || 0) / totalStudents) * 100)
      : 0;

  // Lọc các lát cắt có số lượng > 0 cho biểu đồ tròn
  const nonZeroPieData = schoolPie.filter((p) => p.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Biểu đồ Donut 9 Thể Trạng WHO */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <HeartPulse size={16} />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-800">
                    Cơ cấu 9 Thể trạng Dinh dưỡng Toàn trường
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Phân bố thể trạng và dinh dưỡng toàn trường theo chuẩn WHO
                  </p>
                </div>
              </div>
              {totalStudents > 0 && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  {normalPercent}% Đạt chuẩn WHO
                </span>
              )}
            </div>

            {schoolPie.length === 0 || totalStudents === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
                Chưa có dữ liệu hồ sơ khám sức khỏe toàn trường.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-[180px_1fr] items-center gap-4">
                {/* Donut Chart */}
                <div className="h-56 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={nonZeroPieData}
                        dataKey="value"
                        nameKey="shortLabel"
                        innerRadius={52}
                        outerRadius={78}
                        paddingAngle={3}
                      >
                        {nonZeroPieData.map((entry) => (
                          <Cell
                            key={entry.key}
                            fill={entry.color || HEALTH_CATEGORY_COLORS[entry.shortLabel] || "#6366f1"}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `${val} bé (${totalStudents > 0 ? Math.round((Number(val) / totalStudents) * 100) : 0}%)`,
                          name,
                        ]}
                        contentStyle={{
                          borderRadius: "1rem",
                          borderColor: "#e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-emerald-600">
                      {normalPercent}%
                    </span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Chuẩn WHO
                    </span>
                  </div>
                </div>

                {/* Danh sách 9 phân loại chi tiết */}
                <div className="space-y-1.5 text-xs max-h-72 overflow-y-auto pr-1">
                  {schoolPie.map((item) => {
                    const isSelected = selectedCategory === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onSelectCategory?.(isSelected ? "ALL" : item.key)}
                        className={`w-full text-left rounded-xl border p-2 transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-slate-800 bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                            : item.value > 0
                            ? "border-slate-200/90 bg-white hover:border-slate-400 hover:bg-slate-50/70"
                            : "border-slate-100 bg-slate-50/50 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="min-w-0 truncate">
                            <span
                              className={`font-bold block truncate text-[11px] ${
                                isSelected ? "text-white" : "text-slate-700"
                              }`}
                            >
                              {item.shortLabel}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-2">
                          <span
                            className={`font-black text-xs block ${
                              isSelected ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {item.value} bé
                          </span>
                          <span
                            className={`text-[10px] block ${
                              isSelected ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {item.percent}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Info size={12} className="text-slate-400" />
              Tổng số học sinh khảo sát: <b>{totalStudents} bé</b>
            </span>
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Filter size={11} /> Bấm nhóm để lọc bảng
            </span>
          </div>
        </div>

        {/* Biểu đồ phân bổ 9 thể trạng theo Khối */}
        <HealthStackedBarChart
          title="Phân loại 9 Thể trạng Dinh dưỡng theo Khối"
          subtitle="Tỷ lệ đầy đủ 9 tiêu chí WHO và Chưa đo phân bố theo khối học"
          data={byGrade}
        />
      </div>

      {/* Biểu đồ phân bổ 9 thể trạng theo Lớp */}
      <HealthStackedBarChart
        title="Phân loại 9 Thể trạng Dinh dưỡng chi tiết từng Lớp học"
        subtitle="So sánh cơ cấu sức khỏe học sinh giữa các lớp để lập chế độ dinh dưỡng bán trú theo chuẩn WHO"
        data={byClass}
      />
    </div>
  );
};

export default SucKhoeCharts;
