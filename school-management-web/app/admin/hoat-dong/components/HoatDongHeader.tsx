"use client";

import { Sparkles, RefreshCw, Plus, CalendarDays } from "lucide-react";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { HoatDongTab } from "../types";

interface HoatDongHeaderProps {
  activeTab: HoatDongTab;
  setActiveTab: (tab: HoatDongTab) => void;
  activitiesCount: number;
  scheduledCount: number;
  loading: boolean;
  onRefresh: () => void;
  onOpenCreate: () => void;
  notice: string;
  onClearNotice: () => void;
}

export default function HoatDongHeader({
  activeTab,
  setActiveTab,
  activitiesCount,
  scheduledCount,
  loading,
  onRefresh,
  onOpenCreate,
  notice,
  onClearNotice,
}: HoatDongHeaderProps) {
  const tabs: TabItem<HoatDongTab>[] = [
    {
      id: "catalog",
      label: "Ngân hàng hoạt động",
      icon: Sparkles,
      badge: activitiesCount,
    },
    {
      id: "scheduled",
      label: "Lịch hoạt động đã xếp",
      icon: CalendarDays,
      badge: scheduledCount,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">
            Hoạt động trải nghiệm
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Hoạt động toàn trường & Kỹ năng
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Cập nhật
          </button>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-rose-700 transition cursor-pointer"
          >
            <Plus size={15} /> Thêm hoạt động mới
          </button>
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          {notice}{" "}
          <button
            onClick={onClearNotice}
            className="font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
