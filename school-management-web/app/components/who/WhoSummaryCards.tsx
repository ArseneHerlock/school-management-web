"use client";

import React, { useMemo } from "react";
import { Activity, Ruler, Scale } from "lucide-react";
import { HealthRecord } from "@/services/health";

interface WhoSummaryCardsProps {
  lanDo: HealthRecord | null;
}

export default function WhoSummaryCards({ lanDo }: WhoSummaryCardsProps) {
  const summaryCards = useMemo(() => {
    if (!lanDo) return [];
    const getTheme = (z?: number | null) => {
      if (z == null)
        return {
          border: "border-slate-200 bg-slate-50",
          badge: "bg-white text-slate-700 border-slate-200",
          title: "text-slate-700",
        };
      if (Math.abs(z) > 5)
        return {
          border: "border-purple-200 bg-purple-50/60",
          badge: "bg-white text-purple-700 border-purple-300",
          title: "text-purple-700",
        };
      if (Math.abs(z) > 3)
        return {
          border: "border-rose-200 bg-rose-50/60",
          badge: "bg-white text-rose-700 border-rose-300",
          title: "text-rose-700",
        };
      if (Math.abs(z) > 2)
        return {
          border: "border-amber-200 bg-amber-50/60",
          badge: "bg-white text-amber-700 border-amber-300",
          title: "text-amber-700",
        };
      return {
        border: "border-emerald-100 bg-emerald-50/50",
        badge: "bg-white text-emerald-700 border-emerald-200",
        title: "text-emerald-700",
      };
    };

    return [
      {
        id: "HAZ",
        label: "Chiều cao theo tuổi",
        icon: Ruler,
        val: lanDo.chieuCao,
        unit: "cm",
        z: lanDo.haz,
        conclusion: lanDo.ketLuanHaz || "Đạt chuẩn",
        theme: getTheme(lanDo.haz),
      },
      {
        id: "WAZ",
        label: "Cân nặng theo tuổi",
        icon: Scale,
        val: lanDo.canNang,
        unit: "kg",
        z: lanDo.waz,
        conclusion: lanDo.ketLuanWaz || "Đạt chuẩn",
        isExtreme: lanDo.waz != null && Math.abs(lanDo.waz) > 5,
        theme: getTheme(lanDo.waz),
      },
      {
        id: "WHZ",
        label: "Thể trạng phát triển",
        icon: Activity,
        val: lanDo.trangThaiTheTrang || "CÂN ĐỐI",
        unit: "",
        z: lanDo.whz,
        conclusion: lanDo.ketLuanWhz || "Cân đối",
        theme: getTheme(lanDo.whz),
      },
    ];
  }, [lanDo]);

  if (!lanDo) return null;

  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
      {summaryCards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`rounded-xl sm:rounded-2xl border p-2.5 sm:p-4 shadow-2xs ${c.theme.border} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`text-[9px] sm:text-xs font-black uppercase tracking-wider flex items-center gap-1 ${c.theme.title} truncate`}
                >
                  <Icon size={13} className="shrink-0" /> <span className="truncate">{c.label}</span>
                </span>
                <span
                  className={`text-[9px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 rounded-full font-bold border shadow-2xs shrink-0 ${c.theme.badge} hidden sm:inline-block`}
                >
                  {c.conclusion}
                </span>
              </div>
              <div className="mt-1.5 sm:mt-2 text-sm sm:text-2xl font-black text-slate-800 leading-tight">
                {c.val || "--"}{" "}
                {c.unit && (
                  <span className="text-[10px] sm:text-sm font-semibold text-slate-500">
                    {c.unit}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1 sm:hidden">
              <span
                className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold border ${c.theme.badge} truncate block text-center`}
              >
                {c.conclusion}
              </span>
            </div>
            {c.isExtreme && (
              <p className="mt-1 text-[9px] text-rose-600 font-semibold italic hidden sm:block">
                * Số đo bất thường
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
export { WhoSummaryCards };
