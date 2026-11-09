'use client';

import React, { useState, useMemo } from 'react';
import { ADMIN_REPORTS_CONFIG } from './adminReportConfig';
import { AdminReportId, AdminFilterState } from './types';
import { getFilteredAdminClasses, calculateAdminStatMetrics } from './adminReportData';
import { AdminReportCardGrid } from './components/AdminReportCardGrid';
import { AdminReportFilterBar } from './components/AdminReportFilterBar';
import { AdminReportDetailView } from './components/AdminReportDetailView';
import { AdminReportPrintModal } from './components/AdminReportPrintModal';

export default function AdminBaoCaoPage() {
  const [selectedReportId, setSelectedReportId] = useState<AdminReportId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [printModalReportId, setPrintModalReportId] = useState<AdminReportId | null>(null);

  const [filters, setFilters] = useState<AdminFilterState>({
    gradeId: 'all',
    classId: 'all',
    period: 'thang_10',
    schoolYear: '2026-2027',
    searchKeyword: '',
  });

  const filteredRows = useMemo(
    () => getFilteredAdminClasses(filters.gradeId, filters.classId, filters.searchKeyword),
    [filters.gradeId, filters.classId, filters.searchKeyword],
  );

  const statMetrics = useMemo(
    () => calculateAdminStatMetrics(filteredRows),
    [filteredRows],
  );

  const handleFilterChange = (key: keyof AdminFilterState, val: string) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      gradeId: 'all',
      classId: 'all',
      period: 'thang_10',
      schoolYear: '2026-2027',
      searchKeyword: '',
    });
  };

  const currentReportMeta = useMemo(() => {
    if (!selectedReportId) return null;
    return ADMIN_REPORTS_CONFIG.find((r) => r.id === selectedReportId) || null;
  }, [selectedReportId]);

  const modalReportMeta = useMemo(() => {
    if (!printModalReportId) return null;
    return ADMIN_REPORTS_CONFIG.find((r) => r.id === printModalReportId) || null;
  }, [printModalReportId]);

  const periodLabelMap: Record<string, string> = {
    today: 'Hôm nay',
    thang_10: 'Tháng 10 / 2026',
    thang_11: 'Tháng 11 / 2026',
    hoc_ky_1: 'Học kỳ I (2026-2027)',
    ca_nam: 'Cả năm học (2026-2027)',
  };

  const currentPeriodText = periodLabelMap[filters.period] || filters.period;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Báo cáo quản trị
          </h1>
        </div>
      </div>

      {/* Filter Toolbar */}
      <AdminReportFilterBar
        filters={filters}
        onChangeFilter={handleFilterChange}
        onReset={handleResetFilters}
        onExportAll={() => setPrintModalReportId(selectedReportId || 'BGH_TONG_KET_NAM')}
      />

      {/* Main Content Area */}
      {!currentReportMeta ? (
        <AdminReportCardGrid
          reports={ADMIN_REPORTS_CONFIG}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenReport={(id) => setSelectedReportId(id)}
          onQuickPrint={(id) => setPrintModalReportId(id)}
        />
      ) : (
        <AdminReportDetailView
          reportMeta={currentReportMeta}
          rows={filteredRows}
          metrics={statMetrics}
          periodText={currentPeriodText}
          onBack={() => setSelectedReportId(null)}
          onPrint={() => setPrintModalReportId(currentReportMeta.id)}
        />
      )}

      {/* Print / Export Modal */}
      {modalReportMeta && (
        <AdminReportPrintModal
          isOpen={!!printModalReportId}
          onClose={() => setPrintModalReportId(null)}
          reportMeta={modalReportMeta}
          rows={filteredRows}
          metrics={statMetrics}
          periodText={currentPeriodText}
        />
      )}
    </div>
  );
}
