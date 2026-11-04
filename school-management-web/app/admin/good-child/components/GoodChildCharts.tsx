"use client";

import { BarChart2, Star } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ClassChartItem, DistributionItem } from "../types";

interface GoodChildChartsProps {
  classChartData: ClassChartItem[];
  distributionPieData: DistributionItem[];
}

export default function GoodChildCharts({
  classChartData,
  distributionPieData,
}: GoodChildChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Bar chart: Flowers across classes */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">Thống kê khen thưởng theo từng lớp</h3>
            <p className="text-[11px] text-slate-400">
              So sánh số hoa nhỏ thứ 6 và ngôi sao tháng giữa các lớp
            </p>
          </div>
          <BarChart2 size={18} className="text-slate-400" />
        </div>

        <div className="mt-4 h-72 w-full">
          {classChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={classChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar
                  dataKey="daily"
                  name="Hoa nhỏ thứ 6"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bonus"
                  name="Ngôi sao tháng"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu sổ bé ngoan cho tháng này
            </div>
          )}
        </div>
      </div>

      {/* Pie chart: Achievement levels */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">Cơ cấu số hoa đạt được</h3>
            <p className="text-[11px] text-slate-400">Phân bố mức độ khen thưởng</p>
          </div>
          <Star size={18} className="text-slate-400" />
        </div>

        <div className="mt-4 h-64 w-full">
          {distributionPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} bé`, name]}
                  contentStyle={{ borderRadius: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chưa có dữ liệu
            </div>
          )}
        </div>

        <div className="mt-2 space-y-1.5 text-xs">
          {distributionPieData.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                <span className="text-slate-600">{d.name}</span>
              </div>
              <span className="font-bold text-slate-800">{d.value} bé</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
