"use client";

import React from "react";
import { Sparkles, RefreshCw, Plus, Layers, LayoutGrid } from "lucide-react";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { TabType } from "../types";

interface DanhGiaHeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  loading: boolean;
  onRefresh: () => void;
  activitiesCount: number;
  criteriaCount: number;
  notice: string;
  onClearNotice: () => void;
  onOpenCreateActivity: () => void;
}

export default function DanhGiaHeader({
  activeTab,
  setActiveTab,
  loading,
  onRefresh,
  activitiesCount,
  criteriaCount,
  notice,
  onClearNotice,
  onOpenCreateActivity,
}: DanhGiaHeaderProps) {
  const tabs: TabItem<TabType>[] = [
    { id: "dashboard", label: "Tổng quan trường & Lớp", icon: LayoutGrid },
    {
      id: "activities",
      label: "Hoạt động phát triển",
      icon: Sparkles,
      badge: activitiesCount,
    },
    {
      id: "criteria",
      label: "Tiêu chí & Lĩnh vực",
      icon: Layers,
      badge: criteriaCount,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Đánh giá sự phát triển của trẻ
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 transition cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Làm mới
          </button>
          {activeTab === "activities" && (
            <button
              onClick={onOpenCreateActivity}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-emerald-600 hover:to-emerald-700 transition cursor-pointer"
            >
              <Plus size={15} /> Thêm Hoạt động
            </button>
          )}
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          {notice}{" "}
          <button onClick={onClearNotice} className="cursor-pointer">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
