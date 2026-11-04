"use client";

import React from "react";
import {
  Users,
  CheckCircle2,
  HeartPulse,
  Pill,
  Utensils,
  ShieldCheck,
  DollarSign,
  Building,
  FileText,
  CheckSquare,
  Square,
  Download,
} from "lucide-react";
import { ReportCalculatedMetrics, REPORT_DEFINITIONS } from "../types";

export function renderReportIcon(name: string, size = 18) {
  switch (name) {
    case "students": return <Users size={size} className="text-blue-600" />;
    case "attendance": return <CheckCircle2 size={size} className="text-emerald-600" />;
    case "health": return <HeartPulse size={size} className="text-rose-600" />;
    case "meds": return <Pill size={size} className="text-purple-600" />;
    case "meals": return <Utensils size={size} className="text-amber-600" />;
    case "pickup": return <ShieldCheck size={size} className="text-cyan-600" />;
    case "finance": return <DollarSign size={size} className="text-indigo-600" />;
    case "staff": return <Building size={size} className="text-teal-600" />;
    default: return <FileText size={size} className="text-slate-600" />;
  }
}

export function ReportKpiCards({ metrics }: { metrics: ReportCalculatedMetrics }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <div className="rounded-2xl border border-blue-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Sĩ số ({metrics.scopeLabel})</span>
        <p className="text-2xl font-black text-slate-800">{metrics.totalStudents}</p>
        <p className="text-[10px] text-slate-500 font-medium">{metrics.maleCount} Nam / {metrics.femaleCount} Nữ</p>
      </div>
      <div className="rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Chuyên cần</span>
        <p className="text-2xl font-black text-emerald-600">{metrics.attendanceRate}%</p>
        <p className="text-[10px] text-slate-500 font-medium">{metrics.presentCount} lượt có mặt</p>
      </div>
      <div className="rounded-2xl border border-rose-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Thể lực WHO</span>
        <p className="text-2xl font-black text-rose-600">{metrics.normalHealth}</p>
        <p className="text-[10px] text-amber-600 font-medium">{metrics.specialWatchCount} trẻ cần can thiệp</p>
      </div>
      <div className="rounded-2xl border border-amber-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Khấu trừ tiền ăn</span>
        <p className="text-xl font-black text-amber-600 truncate">{(metrics.totalMealDeduction / 1000).toLocaleString("vi-VN")} k</p>
        <p className="text-[10px] text-slate-500 font-medium">{metrics.totalMealAbsentDays} bữa hoàn trả</p>
      </div>
      <div className="rounded-2xl border border-indigo-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Công nợ học phí</span>
        <p className="text-xl font-black text-rose-600 truncate">{(metrics.totalOutstanding / 1000000).toFixed(1)} tr</p>
        <p className="text-[10px] text-slate-500 font-medium">{metrics.unpaidInvoices.length} hóa đơn nợ</p>
      </div>
      <div className="rounded-2xl border border-teal-100 bg-white p-3.5 shadow-2xs">
        <span className="text-[11px] font-semibold text-slate-400">Cán bộ - GV</span>
        <p className="text-2xl font-black text-teal-700">{metrics.totalStaff}</p>
        <p className="text-[10px] text-teal-600 font-medium">{metrics.activeStaff} đang công tác</p>
      </div>
    </div>
  );
}

export function ReportBatchSelector({
  selectedReports,
  onToggleReport,
  onSelectAll,
  onDeselectAll,
  onOpenPreview,
  onDownloadPdf,
  selectedMonth,
  selectedYear,
}: {
  selectedReports: string[];
  onToggleReport: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenPreview: () => void;
  onDownloadPdf: () => void;
  selectedMonth: number;
  selectedYear: number;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Tích chọn các báo cáo muốn xuất in đa trang:</span>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
            {selectedReports.length} / {REPORT_DEFINITIONS.length} báo cáo
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button type="button" onClick={onSelectAll} className="font-bold text-blue-600 hover:underline">Tích chọn tất cả</button>
          <span className="text-slate-300">|</span>
          <button type="button" onClick={onDeselectAll} className="font-semibold text-slate-500 hover:underline">Bỏ chọn</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {REPORT_DEFINITIONS.map((r) => {
          const isSelected = selectedReports.includes(r.id);
          return (
            <div
              key={r.id}
              onClick={() => onToggleReport(r.id)}
              className={`rounded-2xl border p-4 transition cursor-pointer flex flex-col justify-between ${
                isSelected ? "border-blue-400 bg-blue-50/20 ring-2 ring-blue-200/50 shadow-2xs" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {renderReportIcon(r.iconName, 16)}
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{r.badge}</span>
                  </div>
                  {isSelected ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-300" />}
                </div>
                <h3 className="text-xs font-bold text-slate-800 line-clamp-2">{r.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">{r.description}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                Kỳ T{selectedMonth}/{selectedYear}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-xs">PDF</div>
          <div>
            <p className="text-xs font-bold">Xuất tệp báo cáo đa trang ({selectedReports.length} loại đã chọn)</p>
            <p className="text-[11px] text-slate-400">Chuẩn hóa văn bản hành chính Việt Nam</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenPreview} className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700">Xem trước</button>
          <button type="button" onClick={onDownloadPdf} className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white">
            <Download size={14} /> Xuất PDF
          </button>
        </div>
      </div>
    </div>
  );
}
