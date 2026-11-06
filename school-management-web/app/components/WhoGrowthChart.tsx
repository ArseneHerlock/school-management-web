"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  TrendingDown,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  WhoGrowthChartData,
  WhoChartPoint,
  getWhoGrowthChart,
} from "@/services/health";
import {
  WhoGrowthChartProps,
  WHO_TABLES,
} from "./who/whoChartTypes";
import WhoSummaryCards from "./who/WhoSummaryCards";
import WhoChartArea from "./who/WhoChartArea";

export type { WhoGrowthChartProps };
export { WHO_TABLES };

export const WhoGrowthChart: React.FC<WhoGrowthChartProps> = ({
  childId,
  records,
  gender = "Nam",
  dob,
  studentName,
  className,
  height = 360,
}) => {
  const [activeTab, setActiveTab] = useState<"HAZ" | "WAZ" | "WHZ">("HAZ");
  const [dataPayload, setDataPayload] = useState<WhoGrowthChartData | null>(
    null
  );
  const [loading, setLoading] = useState(Boolean(childId));

  useEffect(() => {
    if (!childId) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    setLoading(true);
    getWhoGrowthChart(childId, {
      tenHocSinh: studentName,
      ngaySinh: dob,
      gioiTinh: gender,
    })
      .then((res) => {
        if (isMounted && res) setDataPayload(res);
      })
      .catch((err) => console.error("Lỗi tải biểu đồ WHO:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [childId, dob, gender, studentName]);

  const isBoy = useMemo(() => {
    const g = String(gender || "")
      .trim()
      .toUpperCase();
    return (
      (g.startsWith("N") && g !== "NỮ" && g !== "NU") ||
      g === "M" ||
      g === "NAM"
    );
  }, [gender]);

  const lanDo = useMemo(
    () => dataPayload?.lanDoMoiNhat || records?.[0] || null,
    [dataPayload, records]
  );

  const chartPoints = useMemo<WhoChartPoint[]>(() => {
    if (!dataPayload) return [];
    return activeTab === "HAZ"
      ? dataPayload.hazChartData || []
      : activeTab === "WAZ"
      ? dataPayload.wazChartData || []
      : dataPayload.whzChartData || [];
  }, [dataPayload, activeTab]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-xs font-bold text-slate-500">
          Đang tải biểu đồ tăng trưởng WHO từ máy chủ...
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {/* 3 Thẻ Kết Luận WHO */}
      <WhoSummaryCards lanDo={lanDo} />

      {/* Tabs chuyển đổi & Xu hướng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(["HAZ", "WAZ", "WHZ"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab === "HAZ"
                ? "Chiều cao (HAZ)"
                : tab === "WAZ"
                ? "Cân nặng (WAZ)"
                : "Thể trạng (WHZ)"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          {dataPayload?.xuHuongPhatTrien === "up" && (
            <TrendingUp size={16} className="text-emerald-500" />
          )}
          {dataPayload?.xuHuongPhatTrien === "down" && (
            <TrendingDown size={16} className="text-rose-500" />
          )}
          {dataPayload?.xuHuongPhatTrien === "flat" && (
            <Activity size={16} className="text-amber-500" />
          )}
          <span>
            {dataPayload?.nhanXetXuHuong ||
              "Dữ liệu thể trạng tính toán tự động theo chuẩn WHO 2006."}
          </span>
        </div>
      </div>

      {/* Vùng Biểu đồ Đường cong */}
      <WhoChartArea
        chartPoints={chartPoints}
        activeTab={activeTab}
        isBoy={isBoy}
        height={height}
        lanDo={lanDo}
      />
    </div>
  );
};

export default WhoGrowthChart;
