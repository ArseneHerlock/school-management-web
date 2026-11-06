"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Ruler,
  Scale,
  Users,
  TrendingDown,
  Filter,
} from "lucide-react";
import { HealthCategoryFilter } from "../types";

interface SucKhoeKpiCardsProps {
  totalStudents: number;
  measuredCount: number;
  normalCount: number;
  underweightCount: number;
  severelyUnderweightCount: number;
  stuntedCount: number;
  severelyStuntedCount: number;
  wastedCount: number;
  severelyWastedCount: number;
  overweightCount: number;
  obeseCount: number;
  selectedCategory: HealthCategoryFilter;
  onSelectCategory: (category: HealthCategoryFilter) => void;
}

export const SucKhoeKpiCards: React.FC<SucKhoeKpiCardsProps> = ({
  totalStudents,
  measuredCount,
  normalCount,
  underweightCount,
  severelyUnderweightCount,
  stuntedCount,
  severelyStuntedCount,
  wastedCount,
  severelyWastedCount,
  overweightCount,
  obeseCount,
  selectedCategory,
  onSelectCategory,
}) => {
  const cards = [
    {
      id: "ALL" as HealthCategoryFilter,
      label: "Tất cả học sinh",
      count: measuredCount,
      subCountText: `/ ${totalStudents} bé`,
      criteria: "Tất cả",
      icon: Users,
      badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
      activeStyle: "border-slate-800 ring-2 ring-slate-800/20 bg-slate-50",
      defaultStyle: "border-slate-200 bg-white hover:border-slate-400",
      iconColor: "text-slate-600 bg-slate-100",
      countColor: "text-slate-900",
    },
    {
      id: "DAT_CHUAN" as HealthCategoryFilter,
      label: "Đạt chuẩn WHO",
      count: normalCount,
      subCountText: "bé",
      criteria: "WHO 2006",
      icon: CheckCircle2,
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      activeStyle:
        "border-emerald-600 ring-2 ring-emerald-600/25 bg-emerald-50/50 shadow-sm",
      defaultStyle: "border-emerald-200/80 bg-white hover:border-emerald-400",
      iconColor: "text-emerald-600 bg-emerald-100",
      countColor: "text-emerald-700",
    },
    {
      id: "THAP_COI" as HealthCategoryFilter,
      label: "Thấp còi",
      count: stuntedCount,
      subCountText: "bé",
      criteria: "HAZ < -2",
      icon: Ruler,
      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
      activeStyle:
        "border-blue-600 ring-2 ring-blue-600/25 bg-blue-50/50 shadow-sm",
      defaultStyle: "border-blue-200/80 bg-white hover:border-blue-400",
      iconColor: "text-blue-600 bg-blue-100",
      countColor: "text-blue-700",
    },
    {
      id: "THAP_COI_NANG" as HealthCategoryFilter,
      label: "Thấp còi nặng",
      count: severelyStuntedCount,
      subCountText: "bé",
      criteria: "HAZ < -3",
      icon: Ruler,
      badgeColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
      activeStyle:
        "border-indigo-600 ring-2 ring-indigo-600/25 bg-indigo-50/50 shadow-sm",
      defaultStyle: "border-indigo-200/80 bg-white hover:border-indigo-400",
      iconColor: "text-indigo-600 bg-indigo-100",
      countColor: "text-indigo-700",
    },
    {
      id: "NHE_CAN" as HealthCategoryFilter,
      label: "Nhẹ cân",
      count: underweightCount,
      subCountText: "bé",
      criteria: "WAZ < -2",
      icon: Scale,
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      activeStyle:
        "border-amber-600 ring-2 ring-amber-600/25 bg-amber-50/50 shadow-sm",
      defaultStyle: "border-amber-200/80 bg-white hover:border-amber-400",
      iconColor: "text-amber-600 bg-amber-100",
      countColor: "text-amber-700",
    },
    {
      id: "NHE_CAN_NANG" as HealthCategoryFilter,
      label: "Nhẹ cân nặng",
      count: severelyUnderweightCount,
      subCountText: "bé",
      criteria: "WAZ < -3",
      icon: Scale,
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200",
      activeStyle:
        "border-rose-600 ring-2 ring-rose-600/25 bg-rose-50/50 shadow-sm",
      defaultStyle: "border-rose-200/80 bg-white hover:border-rose-400",
      iconColor: "text-rose-600 bg-rose-100",
      countColor: "text-rose-700",
    },
    {
      id: "GAY_COM" as HealthCategoryFilter,
      label: "Gầy còm",
      count: wastedCount,
      subCountText: "bé",
      criteria: "WHZ < -2",
      icon: TrendingDown,
      badgeColor: "text-orange-700 bg-orange-50 border-orange-200",
      activeStyle:
        "border-orange-600 ring-2 ring-orange-600/25 bg-orange-50/50 shadow-sm",
      defaultStyle: "border-orange-200/80 bg-white hover:border-orange-400",
      iconColor: "text-orange-600 bg-orange-100",
      countColor: "text-orange-700",
    },
    {
      id: "GAY_COM_NANG" as HealthCategoryFilter,
      label: "Gầy còm nặng",
      count: severelyWastedCount,
      subCountText: "bé",
      criteria: "WHZ < -3",
      icon: TrendingDown,
      badgeColor: "text-red-700 bg-red-50 border-red-200",
      activeStyle:
        "border-red-600 ring-2 ring-red-600/25 bg-red-50/50 shadow-sm",
      defaultStyle: "border-red-200/80 bg-white hover:border-red-400",
      iconColor: "text-red-600 bg-red-100",
      countColor: "text-red-700",
    },
    {
      id: "THUA_CAN" as HealthCategoryFilter,
      label: "Thừa cân",
      count: overweightCount,
      subCountText: "bé",
      criteria: "WHZ > +2",
      icon: AlertTriangle,
      badgeColor: "text-amber-800 bg-amber-50 border-amber-300",
      activeStyle:
        "border-amber-600 ring-2 ring-amber-600/25 bg-amber-50/50 shadow-sm",
      defaultStyle: "border-amber-200/80 bg-white hover:border-amber-400",
      iconColor: "text-amber-600 bg-amber-100",
      countColor: "text-amber-800",
    },
    {
      id: "BEO_PHI" as HealthCategoryFilter,
      label: "Béo phì",
      count: obeseCount,
      subCountText: "bé",
      criteria: "WHZ > +3",
      icon: AlertTriangle,
      badgeColor: "text-rose-800 bg-rose-50 border-rose-300",
      activeStyle:
        "border-rose-600 ring-2 ring-rose-600/25 bg-rose-50/50 shadow-sm",
      defaultStyle: "border-rose-200/80 bg-white hover:border-rose-400",
      iconColor: "text-rose-600 bg-rose-100",
      countColor: "text-rose-700",
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Filter size={14} className="text-indigo-600" />
          Bấm vào từng nhóm thể trạng để lọc ngay danh sách học sinh tương ứng:
        </span>
        {selectedCategory !== "ALL" && (
          <button
            type="button"
            onClick={() => onSelectCategory("ALL")}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
          >
            ✕ Xem tất cả học sinh
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isActive = selectedCategory === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                onSelectCategory(isActive ? "ALL" : c.id);
              }}
              className={`rounded-2xl p-3.5 border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive ? c.activeStyle : c.defaultStyle
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <div className={`p-2 rounded-xl ${c.iconColor}`}>
                    <Icon size={16} />
                  </div>
                  {isActive && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-2xs">
                      Đang lọc
                    </span>
                  )}
                </div>

                <p className="text-xs font-black text-slate-800 mt-2 line-clamp-1">
                  {c.label}
                </p>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-100/80 flex items-baseline gap-1">
                <span className={`text-xl font-black ${c.countColor}`}>
                  {c.count}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {c.subCountText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SucKhoeKpiCards;
