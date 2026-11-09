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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Hoạt động & Sự kiện
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Cập nhật
          </button>
          <button
            onClick={onOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-emerald-600 hover:to-emerald-700 transition cursor-pointer"
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
