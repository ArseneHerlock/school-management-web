"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Info } from "lucide-react";
import { HealthRecord, WhoChartPoint } from "@/services/health";

interface WhoChartAreaProps {
  chartPoints: WhoChartPoint[];
  activeTab: "HAZ" | "WAZ" | "WHZ";
  isBoy: boolean;
  height: number;
  lanDo: HealthRecord | null;
}

export default function WhoChartArea({
  chartPoints,
  activeTab,
  isBoy,
  height,
  lanDo,
}: WhoChartAreaProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
        <div>
          Biểu đồ WHO ({isBoy ? "Bé trai" : "Bé gái"} 0 - 5 tuổi) •{" "}
          <span className="font-bold text-slate-700">
            {activeTab === "HAZ"
              ? "Chiều cao / Tuổi"
              : activeTab === "WAZ"
              ? "Cân nặng / Tuổi"
              : "Cân nặng / Chiều cao"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Chuẩn trung bình WHO
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Giới hạn chuẩn
          </span>
          <span className="flex items-center gap-1 font-bold text-indigo-600">
            <span className="w-3 h-3 rounded-full bg-indigo-600" /> Bé thực tế
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        {chartPoints.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartPoints}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#cbd5e1"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#cbd5e1"
                domain={["auto", "auto"]}
                unit={activeTab === "HAZ" ? "cm" : "kg"}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const pt: WhoChartPoint = payload[0]?.payload;
                  const unit = activeTab === "HAZ" ? "cm" : "kg";
                  return (
                    <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs backdrop-blur-md border border-slate-700 min-w-[200px]">
                      <div className="font-bold text-amber-300 pb-1 border-b border-slate-700 flex justify-between">
                        <span>{pt.label}</span>
                        {pt.ngayDo && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(pt.ngayDo).toLocaleDateString("vi-VN")}
                          </span>
                        )}
                      </div>
                      {pt.beThucTe != null ? (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex justify-between font-bold text-indigo-300">
                            <span>Bé thực tế:</span>
                            <span className="text-white">
                              {pt.beThucTe} {unit}
                            </span>
                          </div>
                          {pt.phanLoai && (
                            <div className="text-[11px] text-amber-200 border-t border-slate-800 pt-1 font-semibold">
                              {pt.phanLoai}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-slate-400 text-[11px]">
                          Mốc chuẩn tham chiếu WHO
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="sdPos2"
                stroke="#f59e0b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="median"
                stroke="#10b981"
                strokeWidth={2.2}
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="sdNeg2"
                stroke="#fb923c"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="beThucTe"
                stroke="#4f46e5"
                strokeWidth={3.5}
                dot={{
                  r: 6,
                  fill: "#4f46e5",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 8,
                  fill: "#4338ca",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 font-bold">
            Chưa có dữ liệu biểu đồ từ máy chủ.
          </div>
        )}
      </div>
    </div>
  );
}
export { WhoChartArea };
