'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TEACHER_REPORTS_CONFIG } from './teacherReportConfig';
import { TeacherReportId, TeacherContextInfo } from './types';
import {
  getLiveTeacherContext,
  getAllAvailableClasses,
  fetchOrCreateTeacherReport,
  saveTeacherReportDraft,
  submitTeacherReportToAdmin,
} from './teacherReportService';
import { ClassReportItem, REPORT_PERIODS } from '@/services/classReports';
import { TeacherReportCardGrid } from './components/TeacherReportCardGrid';
import { TeacherReportActionBar } from './components/TeacherReportActionBar';
import { TeacherReportDetailView } from './components/TeacherReportDetailView';
import { TeacherReportPrintModal } from './components/TeacherReportPrintModal';

export default function TeacherBaoCaoPage() {
  const allClasses = useMemo(() => getAllAvailableClasses(), []);
  const [teacherCtx, setTeacherCtx] = useState<TeacherContextInfo>({
    teacherId: '20c6ed16-9479-4d2e-964e-2a9588a067ef',
    teacherName: 'Cô Đỗ Khánh Ly',
    classId: '6aed31d3-bfb0-4c19-838a-6413c9f3cd51',
    className: 'Lớp Mầm 1',
    gradeName: 'Khối Mầm',
    schoolYear: '2026-2027',
    totalStudents: 25,
  });

  const [period, setPeriod] = useState<string>('thang_10');
  const [selectedReportId, setSelectedReportId] = useState<TeacherReportId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentReport, setCurrentReport] = useState<ClassReportItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [printModalReportId, setPrintModalReportId] = useState<TeacherReportId | null>(null);

  useEffect(() => {
    getLiveTeacherContext().then(setTeacherCtx);
  }, []);

  const handleClassChange = async (newClassId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('teacher_selected_class_id', newClassId);
    }
    const updatedCtx = await getLiveTeacherContext(newClassId);
    setTeacherCtx(updatedCtx);
    if (selectedReportId) {
      loadReportWithContext(updatedCtx, selectedReportId, period);
    }
  };

  const loadReportWithContext = async (
    ctx: TeacherContextInfo,
    reportId: TeacherReportId,
    currentPeriod: string,
  ) => {
    setLoading(true);
    try {
      const rep = await fetchOrCreateTeacherReport(ctx, reportId, currentPeriod);
      setCurrentReport(rep);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReport = (id: TeacherReportId) => {
    setSelectedReportId(id);
    loadReportWithContext(teacherCtx, id, period);
  };

  const handleAutoFill = async () => {
    if (!selectedReportId) return;
    setIsSaving(true);
    try {
      const rep = await fetchOrCreateTeacherReport(teacherCtx, selectedReportId, period);
      setCurrentReport(rep);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentReport) return;
    setIsSaving(true);
    try {
      const saved = await saveTeacherReportDraft(currentReport);
      setCurrentReport(saved);
      alert('Đã lưu bản nháp báo cáo thành công.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentReport) return;
    setIsSaving(true);
    try {
      const submitted = await submitTeacherReportToAdmin(currentReport);
      setCurrentReport(submitted);
      alert('Báo cáo đã được gửi lên Ban Giám Hiệu duyệt thành công!');
    } finally {
      setIsSaving(false);
    }
  };

  const activeMeta = useMemo(() => {
    if (!selectedReportId) return null;
    return TEACHER_REPORTS_CONFIG.find((r) => r.id === selectedReportId) || null;
  }, [selectedReportId]);

  const modalMeta = useMemo(() => {
    if (!printModalReportId) return null;
    return TEACHER_REPORTS_CONFIG.find((r) => r.id === printModalReportId) || null;
  }, [printModalReportId]);

  const periodLabel = REPORT_PERIODS.find((p) => p.id === period)?.label || period;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header with Class & Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Báo cáo lớp học
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
              {teacherCtx.className} • {teacherCtx.gradeName} ({teacherCtx.totalStudents} trẻ)
            </span>
          </div>
        </div>

        {/* Controls: Class Selector & Period Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Lớp:</label>
            <select
              value={teacherCtx.classId}
              onChange={(e) => handleClassChange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.gradeName} - {cls.totalStudents} trẻ)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Kỳ:</label>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                if (selectedReportId) loadReportWithContext(teacherCtx, selectedReportId, e.target.value);
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REPORT_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {!selectedReportId || !currentReport || !activeMeta ? (
        <TeacherReportCardGrid
          reports={TEACHER_REPORTS_CONFIG}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenReport={handleOpenReport}
          onQuickPrint={(id) => {
            fetchOrCreateTeacherReport(teacherCtx, id, period).then((rep) => {
              setCurrentReport(rep);
              setPrintModalReportId(id);
            });
          }}
        />
      ) : (
        <div className="space-y-4">
          <TeacherReportActionBar
            title={activeMeta.title}
            cycle={activeMeta.cycle}
            periodText={periodLabel}
            status={currentReport.status}
            isSaving={isSaving}
            onBack={() => setSelectedReportId(null)}
            onAutoFill={handleAutoFill}
            onSaveDraft={handleSaveDraft}
            onSubmitToAdmin={handleSubmit}
            onPrint={() => setPrintModalReportId(activeMeta.id)}
          />

          {loading ? (
            <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
              Đang nạp dữ liệu báo cáo từ CSDL...
            </div>
          ) : (
            <TeacherReportDetailView
              report={currentReport}
              onChangeRemarks={(val) => setCurrentReport({ ...currentReport, teacherRemarks: val })}
              onChangeRecommendations={(val) => setCurrentReport({ ...currentReport, recommendations: val })}
            />
          )}
        </div>
      )}

      {/* Print / Export Modal */}
      {modalMeta && currentReport && (
        <TeacherReportPrintModal
          isOpen={!!printModalReportId}
          onClose={() => setPrintModalReportId(null)}
          reportMeta={modalMeta}
          report={currentReport}
          periodText={periodLabel}
        />
      )}
    </div>
  );
}
