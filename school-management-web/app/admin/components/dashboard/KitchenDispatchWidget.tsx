"use client";

import React from "react";
import {
  Soup,
  Coffee,
  Cookie,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  ChefHat,
} from "lucide-react";
import { KitchenDispatchStats, AllergyDietAlert } from "@/services/adminDashboardTypes";

interface KitchenDispatchWidgetProps {
  dispatch: KitchenDispatchStats;
  onNavigateHealth?: () => void;
}

export const KitchenDispatchWidget: React.FC<KitchenDispatchWidgetProps> = ({
  dispatch,
}) => {
  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
              <ChefHat size={16} />
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 truncate">
              Điều phối Bếp ăn Bán trú & An toàn Dị ứng
            </h2>
          </div>
          <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate">
            Tổng hợp suất ăn thực tế hôm nay & theo dõi dị ứng nghiêm ngặt
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 self-start sm:self-auto shrink-0 max-w-full">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <span className="truncate max-w-[240px] sm:max-w-none">{dispatch.statusText}</span>
        </div>
      </div>

      {/* 3 Khối Suất Ăn: 3 Cột Ngang Gọn Gàng Chuẩn Mobile */}
      <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-3.5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-amber-100 bg-amber-50/50 p-2.5 sm:p-3.5">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500 text-white shadow-xs">
            <Coffee size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Bữa sáng</p>
            <p className="text-base sm:text-xl font-black text-slate-800">
              {dispatch.breakfastCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">suất</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-orange-100 bg-orange-50/50 p-2.5 sm:p-3.5">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-orange-500 text-white shadow-xs">
            <Soup size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Bữa trưa</p>
            <p className="text-base sm:text-xl font-black text-slate-800">
              {dispatch.lunchCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">suất</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-emerald-100 bg-emerald-50/50 p-2.5 sm:p-3.5">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500 text-white shadow-xs">
            <Cookie size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase truncate">Bữa xế</p>
            <p className="text-base sm:text-xl font-black text-slate-800">
              {dispatch.afternoonSnackCount} <span className="text-[10px] sm:text-xs font-semibold text-slate-400">suất</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sổ cảnh báo Dị ứng & Chế độ ăn kiêng hôm nay */}
      <div className="mt-3.5 rounded-xl sm:rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-3 sm:p-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-100">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert size={15} className="text-emerald-600 shrink-0" />
            <h3 className="text-xs sm:text-sm font-black text-slate-800 truncate">
              Sổ Dị ứng Thực phẩm & Lưu ý ({dispatch.allergyWatchlist.length} trẻ)
            </h3>
          </div>
          {dispatch.allergyWatchlist.length > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 shrink-0 ml-1">Tuân thủ 100%</span>
          )}
        </div>

        {dispatch.allergyWatchlist.length === 0 ? (
          <div className="rounded-xl border border-dashed border-emerald-200 bg-white/70 p-3 text-center text-xs text-slate-500 font-medium">
            ✅ Hiện tại toàn trường không có ghi nhận dị ứng thực phẩm hoặc chế độ ăn kiêng đặc biệt.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {dispatch.allergyWatchlist.map((item: AllergyDietAlert) => (
              <div
                key={item.childId}
                className="flex items-start justify-between gap-2.5 rounded-xl border border-emerald-200 bg-white p-2.5 sm:p-3 shadow-2xs"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-slate-800 truncate">{item.childName}</p>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 shrink-0">
                      {item.className}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <AlertOctagon size={11} className="shrink-0" />
                    <span className="truncate">{item.allergen}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{item.notes}</p>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase shrink-0 ${
                    item.severity === "high"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-amber-100 text-amber-800 border border-amber-300"
                  }`}
                >
                  {item.severity === "high" ? "Nghiêm ngặt" : "Lưu ý"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
