"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarCheck, ArrowRight, BarChart3, ListFilter, Users } from "lucide-react";
import { ClassAttendanceStat } from "@/services/adminDashboardTypes";

interface ClassAttendanceChartProps {
  classAttendance: ClassAttendanceStat[];
  onNavigate?: (tab: string) => void;
}

export function ClassAttendanceChart({
  classAttendance = [],
  onNavigate,
}: ClassAttendanceChartProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");

  const totalEnrolled = classAttendance.reduce((acc, c) => acc + c.enrolled, 0);
  const totalPresent = classAttendance.reduce((acc, c) => acc + c.present, 0);
  const totalAbsent = classAttendance.reduce((acc, c) => acc + c.absent, 0);
  const overallRate =
    totalEnrolled > 0 ? Math.round((totalPresent / totalEnrolled) * 100) : 0;

  // Trích xuất các khối lớp hiện có trong danh sách
  const grades = useMemo(() => {
    const list: string[] = [];
    classAttendance.forEach((c) => {
      const lower = c.className.toLowerCase();
      let g = "Khác";
      if (lower.includes("mầm")) g = "Khối Mầm";
      else if (lower.includes("chồi")) g = "Khối Chồi";
      else if (lower.includes("lá")) g = "Khối Lá";
      else if (lower.includes("nhà trẻ") || lower.includes("trẻ")) g = "Nhà trẻ";
      if (!list.includes(g)) list.push(g);
    });
    return list;
  }, [classAttendance]);

  // Lọc dữ liệu theo khối đã chọn
  const filteredData = useMemo(() => {
    let data = classAttendance;
    if (selectedGrade !== "ALL") {
      data = classAttendance.filter((c) => {
        const lower = c.className.toLowerCase();
        if (selectedGrade === "Khối Mầm") return lower.includes("mầm");
        if (selectedGrade === "Khối Chồi") return lower.includes("chồi");
        if (selectedGrade === "Khối Lá") return lower.includes("lá");
        if (selectedGrade === "Nhà trẻ") return lower.includes("nhà trẻ") || lower.includes("trẻ");
        return true;
      });
    }

    // Làm gọn tên lớp (Bỏ chữ 'Lớp ' thừa trên nhãn trục X)
    return data.map((c) => ({
      ...c,
      displayName: c.className.replace(/^Lớp\s+/i, ""),
      rate: c.enrolled > 0 ? Math.round((c.present / c.enrolled) * 100) : 0,
    }));
  }, [classAttendance, selectedGrade]);

  const chartMinWidth = filteredData.length > 6 ? 560 : 320;

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between max-w-full min-w-0">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CalendarCheck size={16} />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
                Chuyên cần Từng Lớp Hôm nay
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {totalPresent}/{totalEnrolled} trẻ có mặt toàn trường ({overallRate}%)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode("chart")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
                  viewMode === "chart"
                    ? "bg-white text-emerald-700 shadow-2xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <BarChart3 size={13} />
                <span>Cột</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition ${
                  viewMode === "list"
                    ? "bg-white text-emerald-700 shadow-2xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users size={13} />
                <span>Chi tiết</span>
              </button>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate("diem-danh")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer ml-1"
              >
                <span className="hidden sm:inline">Sổ điểm danh</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Khối Bộ Lọc Lớp / Khối Thông Minh */}
        {classAttendance.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedGrade("ALL")}
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
                selectedGrade === "ALL"
                  ? "bg-emerald-600 text-white shadow-2xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({classAttendance.length} lớp)
            </button>
            {grades.map((g) => {
              const count = classAttendance.filter((c) => {
                const lower = c.className.toLowerCase();
                if (g === "Khối Mầm") return lower.includes("mầm");
                if (g === "Khối Chồi") return lower.includes("chồi");
                if (g === "Khối Lá") return lower.includes("lá");
                if (g === "Nhà trẻ") return lower.includes("nhà trẻ") || lower.includes("trẻ");
                return true;
              }).length;

              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSelectedGrade(g)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
                    selectedGrade === g
                      ? "bg-emerald-600 text-white shadow-2xs font-black"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Nội dung Biểu đồ hoặc Danh sách lớp */}
        {classAttendance.length === 0 ? (
          <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
            Chưa có dữ liệu danh sách lớp hoặc điểm danh hôm nay.
          </div>
        ) : viewMode === "list" ? (
          /* Chế độ Danh sách chuẩn Touch Mobile */
          <div className="mt-3.5 space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-1">
            {filteredData.map((cls) => (
              <div
                key={cls.classId || cls.className}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-slate-100/70 transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 truncate">
                      {cls.className}
                    </span>
                    <span className="font-black text-emerald-700">
                      {cls.present}/{cls.enrolled} ({cls.rate}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${cls.rate}%` }}
                    />
                  </div>
                </div>
                {cls.absent > 0 && (
                  <span className="rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-black text-rose-600 shrink-0">
                    -{cls.absent} vắng
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Chế độ Biểu đồ Cột Recharts Chống tràn ngang */
          <div className="mt-3 w-full min-w-0 overflow-x-auto no-scrollbar">
            {selectedGrade === "ALL" && filteredData.length > 6 && (
              <p className="text-[10px] text-slate-400 mb-1 italic sm:hidden">
                ↔ Vuốt ngang biểu đồ để xem đủ {filteredData.length} lớp học
              </p>
            )}
            <div style={{ minWidth: `${chartMinWidth}px`, height: "230px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 12, right: 12, left: -22, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="displayName"
                    interval={0}
                    angle={filteredData.length > 5 ? -15 : 0}
                    textAnchor={filteredData.length > 5 ? "end" : "middle"}
                    height={38}
                    tick={{ fontSize: 10, fill: "#475569", fontWeight: 700 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    unit=" bé"
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      `${val} bé`,
                      name === "present"
                        ? "Có mặt tại trường"
                        : "Vắng mặt / Xin nghỉ",
                    ]}
                    labelFormatter={(label: any) => `Lớp: ${label}`}
                    contentStyle={{
                      borderRadius: "0.85rem",
                      borderColor: "#e2e8f0",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                      padding: "8px 12px",
                    }}
                  />
                  <Bar
                    dataKey="present"
                    name="present"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={filteredData.length > 6 ? 20 : 28}
                  />
                  <Bar
                    dataKey="absent"
                    name="absent"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={filteredData.length > 6 ? 20 : 28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Footer Tổng kết */}
      {classAttendance.length > 0 && (
        <div className="mt-2 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Có mặt: {totalPresent}
            </span>
            <span className="flex items-center gap-1 font-bold text-rose-600">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Vắng: {totalAbsent}
            </span>
          </div>
          <span className="font-semibold text-slate-400">
            Sĩ số: <strong className="text-slate-700">{totalEnrolled}</strong> trẻ
          </span>
        </div>
      )}
    </section>
  );
}
