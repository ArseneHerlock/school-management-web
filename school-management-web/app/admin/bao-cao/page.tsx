"use client";

import React, { useState, useMemo } from "react";
import {
  REPORT_DEFINITIONS,
  ReportFilterState,
} from "./types";
import { useReportData, calculateReportMetrics } from "./reportService";
import { ReportHeader, ReportFilters } from "./components/ReportFilters";
import { ReportKpiCards, ReportBatchSelector } from "./components/ReportOverview";
import { ReportDetailTables } from "./components/ReportTables";
import {
  generateReportHtml,
  printOrDownloadPdf,
  ReportPreviewModal,
} from "./components/ReportExport";
import { AdminClassReportsCentral } from "./components/AdminClassReportsCentral";
import { AdminSchoolExecutiveReport } from "./components/AdminSchoolExecutiveReport";

export default function BaoCaoPage() {
  const [selectedReports, setSelectedReports] = useState<string[]>(() =>
    REPORT_DEFINITIONS.filter((r) => r.defaultChecked).map((r) => r.id),
  );

  const [viewMode, setViewMode] = useState<"admin-school" | "teacher-classes" | "detail">("admin-school");
  const [previewOpen, setPreviewOpen] = useState(false);

  const [filters, setFilters] = useState<ReportFilterState>({
    scope: "school",
    selectedGradeId: "all",
    selectedClassId: "all",
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    periodScope: "month",
    searchKeyword: "",
  });

  const { data, loading, reloadData, monthsWithData } = useReportData(
    filters.selectedMonth,
    filters.selectedYear,
  );

  const { metrics } = useMemo(
    () => calculateReportMetrics(data, filters),
    [data, filters],
  );

  const handleToggleReport = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const previewHtml = useMemo(
    () =>
      generateReportHtml(
        selectedReports,
        metrics,
        data,
        filters.selectedMonth,
        filters.selectedYear,
      ),
    [selectedReports, metrics, data, filters.selectedMonth, filters.selectedYear],
  );

  const handleDownloadPdf = () => {
    if (selectedReports.length === 0) {
      alert("Vui lòng tích chọn ít nhất một báo cáo để tải về / in!");
      return;
    }
    printOrDownloadPdf(previewHtml);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50/50 min-h-[calc(100vh-4rem)] font-sans">
      <ReportHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        loading={loading}
        onRefresh={() => void reloadData()}
        onOpenPreview={() => setPreviewOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        selectedCount={selectedReports.length}
      />

      {viewMode === "admin-school" ? (
        <AdminSchoolExecutiveReport
          onSwitchToClassesManagement={() => setViewMode("teacher-classes")}
        />
      ) : viewMode === "teacher-classes" ? (
        <AdminClassReportsCentral />
      ) : (
        <>
          <ReportFilters
            filters={filters}
            onChangeFilters={setFilters}
            grades={data.grades}
            classes={data.classes}
            monthsWithData={monthsWithData}
          />

          <ReportKpiCards metrics={metrics} />

          <ReportDetailTables
            metrics={metrics}
            data={data}
            selectedMonth={filters.selectedMonth}
            selectedYear={filters.selectedYear}
          />
        </>
      )}

      <ReportPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        htmlContent={previewHtml}
        onDownloadPdf={handleDownloadPdf}
        selectedCount={selectedReports.length}
      />
    </div>
  );
}
