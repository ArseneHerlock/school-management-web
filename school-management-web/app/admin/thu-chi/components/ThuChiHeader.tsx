"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { AdminBillingTab } from "../types";

interface ThuChiHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  tabs: TabItem<AdminBillingTab>[];
  activeTab: AdminBillingTab;
  onTabChange: (tab: AdminBillingTab) => void;
  notice: string;
  onClearNotice: () => void;
}

export default function ThuChiHeader({
  loading,
  onRefresh,
  tabs,
  activeTab,
  onTabChange,
  notice,
  onClearNotice,
}: ThuChiHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">
            Tài chính mầm non
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Quản lý Thu chi học phí
          </h1>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Cập
          nhật
        </button>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          <span>{notice}</span>
          <button onClick={onClearNotice}>×</button>
        </div>
      )}
    </div>
  );
}
