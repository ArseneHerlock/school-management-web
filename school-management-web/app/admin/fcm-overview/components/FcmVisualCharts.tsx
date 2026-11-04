"use client";

import React from "react";
import { PieChart as PieIcon, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CLUSTER_CONFIG } from "../types";

interface FcmVisualChartsProps {
  pieData: Array<{ name: string; value: number; color: string }>;
  barChartData: Array<Record<string, any>>;
  clusterCounts: Record<number, number>;
}

export function FcmVisualCharts({
  pieData,
  barChartData,
  clusterCounts,
}: FcmVisualChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Pie Chart: School-wide Cluster Distribution */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">
              Cơ cấu phát triển toàn trường
            </h3>
            <p className="text-[11px] text-slate-400">
              Tỷ trọng 4 cụm phân loại
            </p>
          </div>
          <PieIcon size={18} className="text-slate-400" />
        </div>

        <div className="mt-4 h-64 w-full">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} trẻ`, name]}
                  contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu phân cụm tháng này
            </div>
          )}
        </div>

        {/* Legend Details */}
        <div className="mt-2 space-y-2 text-xs">
          {([1, 2, 3, 4] as const).map((cId) => (
            <div key={cId} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CLUSTER_CONFIG[cId].color }}
                />
                <span className="text-slate-600">
                  {CLUSTER_CONFIG[cId].shortName}
                </span>
              </div>
              <span className="font-bold text-slate-800">
                {clusterCounts[cId]} trẻ
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Cluster Distribution by Class */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">
              Phân bố phát triển theo từng lớp
            </h3>
            <p className="text-[11px] text-slate-400">
              So sánh số lượng trẻ ở các cụm giữa các lớp
            </p>
          </div>
          <BarChart3 size={18} className="text-slate-400" />
        </div>

        <div className="mt-4 h-80 w-full">
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="Nhóm 1"
                  stackId="a"
                  fill={CLUSTER_CONFIG[1].color}
                />
                <Bar
                  dataKey="Nhóm 2"
                  stackId="a"
                  fill={CLUSTER_CONFIG[2].color}
                />
                <Bar
                  dataKey="Nhóm 3"
                  stackId="a"
                  fill={CLUSTER_CONFIG[3].color}
                />
                <Bar
                  dataKey="Nhóm 4"
                  stackId="a"
                  fill={CLUSTER_CONFIG[4].color}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu phân cụm theo lớp
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
