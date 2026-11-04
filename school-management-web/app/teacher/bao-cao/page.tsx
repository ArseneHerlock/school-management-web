'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Send,
  Save,
  RefreshCw,
  Printer,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
  CalendarCheck,
  HeartPulse,
  Award,
  Utensils,
  ChevronDown,
  MessageSquare,
  ShieldCheck,
  Info,
  Calendar,
  X,
  Check,
  Download,
  BookOpen,
} from 'lucide-react';
import { loadLiveTeacherContext } from '../data';
import {
  getClassReport,
  getClassReportAutoFill,
  saveOrSubmitClassReport,
  ClassReportItem,
  ClassReportMetrics,
  ReportType,
  REPORT_TYPE_CONFIG,
  REPORT_PERIODS,
} from '@/services/classReports';
import { exportClassReportPdf } from '@/utils/exportReportPdf';

export default function TeacherClassReportPage() {
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('Lớp học');
  const [gradeName, setGradeName] = useState<string>('Khối Mầm');
  const [teacherName, setTeacherName] = useState<string>('Giáo viên');
  const [schoolYear, setSchoolYear] = useState<string>('2026-2027');
  const [reportType, setReportType] = useState<ReportType>('MONTHLY');
  const [period, setPeriod] = useState<string>('thang_10');

  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [report, setReport] = useState<ClassReportItem | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [metrics, setMetrics] = useState<ClassReportMetrics>({
    totalStudents: 0,
    maleCount: 0,
    femaleCount: 0,
    attendance: { totalAttendance: 0, presentDays: 0, excusedDays: 0, unexcusedDays: 0, attendanceRate: 0 },
    health: { totalHealth: 0, normalHealthCount: 0, malnutritionCount: 0, overweightCount: 0, normalRate: 0 },
    activities: { totalActivities: 0, totalEvaluations: 0, passedEvaluations: 0, activityPassRate: 0 },
    boarding: { excusedAbsentDays: 0, refundPerDay: 45000, totalRefundAmount: 0 },
  });
  const [teacherNotes, setTeacherNotes] = useState<string>('');
  const [teacherProposals, setTeacherProposals] = useState<string>('');
  const [monthlyActiveTab, setMonthlyActiveTab] = useState<'boarding' | 'health' | 'attendance' | 'activities'>('boarding');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      const cId = (ctx?.cls as any)?.id || (ctx?.cls as any)?.Id || '';
      const cName = ctx?.cls?.tenLop || 'Lớp Mầm 1';
      const gName = (ctx?.cls as any)?.khoi?.tenKhoi || (ctx?.cls as any)?.tenKhoi || 'Khối Mầm';
      const tName = (ctx?.me as any)?.name || (ctx?.me as any)?.fullName || (ctx?.me as any)?.hoTen || 'Giáo viên chủ nhiệm';

      setClassId(cId);
      setClassName(cName);
      setGradeName(gName);
      setTeacherName(tName);

      if (!cId) {
        setLoading(false);
        return;
      }

      const activePeriod = reportType === 'YEAR_END' ? 'cuoi_nam' : period;
      const periodLabel = REPORT_PERIODS.find((p) => p.id === activePeriod)?.name || activePeriod;

      // 1. Kiểm tra xem lớp đã có báo cáo đã nộp/lưu trong CSDL chưa
      const existing = await getClassReport(cId, schoolYear, activePeriod, reportType).catch(() => null);

      if (existing) {
        setReport(existing);
        setTitle(existing.title || `${REPORT_TYPE_CONFIG[reportType].defaultTitle(periodLabel, schoolYear)} - ${cName}`);
        if (existing.metricsSnapshot) setMetrics(existing.metricsSnapshot);
        setTeacherNotes(existing.teacherNotes || '');
        setTeacherProposals(existing.teacherProposals || '');
      } else {
        // 2. Chưa có báo cáo: Tự động trích xuất số liệu thực tế từ cơ sở dữ liệu
        setReport(null);
        const auto = await getClassReportAutoFill(cId, schoolYear, activePeriod, reportType).catch(() => null);
        if (auto?.metrics) {
          setMetrics(auto.metrics);
        }
        setTitle(`${REPORT_TYPE_CONFIG[reportType].defaultTitle(periodLabel, schoolYear)} - ${cName}`);
        setTeacherNotes(
          'Tình hình nền nếp lớp học ổn định, trẻ đi học đều và hào hứng tham gia các hoạt động giáo dục. Đảm bảo an toàn tuyệt đối cho trẻ trong các giờ ăn và sinh hoạt bán trú.'
        );
        setTeacherProposals(
          'Kính đề nghị Ban Giám hiệu tiếp tục hỗ trợ bổ sung thêm học liệu tạo hình và kiểm tra đồ dùng đồ chơi ngoài trời phục vụ giờ học thể chất của các bé.'
        );
      }
    } catch (err: any) {
      showToast('Không thể nạp dữ liệu báo cáo từ máy chủ.', 'error');
    } finally {
      setLoading(false);
    }
  }, [reportType, period, schoolYear]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleTypeChange = (newType: ReportType) => {
    setReportType(newType);
    if (newType === 'YEAR_END') {
      setPeriod('cuoi_nam');
    } else if (period === 'cuoi_nam') {
      setPeriod('thang_10');
    }
  };

  const handleRefreshAutoFill = async () => {
    if (!classId) return;
    setActionLoading(true);
    try {
      const activePeriod = reportType === 'YEAR_END' ? 'cuoi_nam' : period;
      const auto = await getClassReportAutoFill(classId, schoolYear, activePeriod, reportType);
      if (auto?.metrics) {
        setMetrics(auto.metrics);
        showToast('Đã trích xuất số liệu thực tế mới nhất từ CSDL thành công!');
      }
    } catch {
      showToast('Lỗi khi tính toán số liệu từ máy chủ.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveOrSubmit = async (action: 'SAVE_DRAFT' | 'SUBMIT_REPORT') => {
    if (!classId) {
      showToast('Chưa xác định được mã lớp học.', 'error');
      return;
    }
    setActionLoading(true);
    try {
      const activePeriod = reportType === 'YEAR_END' ? 'cuoi_nam' : period;
      const res = await saveOrSubmitClassReport({
        action,
        classId,
        schoolYear,
        period: activePeriod,
        reportType,
        title: title.trim() || `${REPORT_TYPE_CONFIG[reportType].name} - ${className}`,
        teacherName,
        metricsSnapshot: metrics,
        teacherNotes,
        teacherProposals,
      });

      if (res.success) {
        showToast(
          action === 'SUBMIT_REPORT'
            ? 'Đã nộp báo cáo chính thức lên Ban Giám Hiệu xét duyệt!'
            : 'Đã lưu bản nháp báo cáo thành công!'
        );
        await loadData();
      } else {
        showToast(res.message || 'Thao tác không thành công.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Lỗi kết nối khi gửi báo cáo.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportPdf = () => {
    const activePeriod = reportType === 'YEAR_END' ? 'cuoi_nam' : period;
    exportClassReportPdf(
      {
        title: title || `${REPORT_TYPE_CONFIG[reportType].name} - ${className}`,
        classId,
        className,
        gradeName,
        schoolYear,
        period: activePeriod,
        reportType,
        teacherName,
        status: report?.status || 'DRAFT',
        metricsSnapshot: metrics,
        teacherNotes,
        teacherProposals,
      },
      { className, gradeName }
    );
  };

  const activePeriod = reportType === 'YEAR_END' ? 'cuoi_nam' : period;
  const periodLabel = REPORT_PERIODS.find((p) => p.id === activePeriod)?.name || activePeriod;
  const isApproved = report?.status === 'APPROVED';
  const isSubmitted = report?.status === 'SUBMITTED';
  const isRevision = report?.status === 'REVISION_REQUESTED';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-xs font-black transition animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-rose-600 text-white shadow-rose-600/20'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
            <FileText size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-800">Hệ Thống Báo Cáo Chuyên Môn Của Lớp</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                {className} ({gradeName})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Báo cáo định kỳ hàng tháng, báo cáo chuyên đề và báo cáo tổng kết cuối năm nộp Ban Giám Hiệu
            </p>
          </div>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {report && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isSubmitted
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : isRevision
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {isApproved && <CheckCircle2 size={14} className="text-emerald-600" />}
              {isSubmitted && <Clock size={14} className="text-amber-600" />}
              {isRevision && <AlertCircle size={14} className="text-rose-600" />}
              <span>
                {isApproved
                  ? 'BGH Đã Phê Duyệt'
                  : isSubmitted
                  ? 'Đang Chờ BGH Duyệt'
                  : isRevision
                  ? 'Yêu Cầu Chỉnh Sửa'
                  : 'Bản Nháp (Chưa Nộp)'}
              </span>
            </div>
          )}

          {/* Dedicated PDF Export Button */}
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black transition shadow-sm shadow-red-500/20 cursor-pointer"
          >
            <Download size={15} />
            <span>Xuất File PDF (.pdf)</span>
          </button>
        </div>
      </div>

      {/* Admin Revision Feedback Notice if requested */}
      {isRevision && report?.adminFeedback && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-in fade-in">
          <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Ý kiến chỉ đạo / Yêu cầu điều chỉnh từ Ban Giám Hiệu:</span>
            <p className="text-rose-700 italic">"{report.adminFeedback}"</p>
          </div>
        </div>
      )}

      {/* Filter and Category Selection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        {/* Report Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Loại báo cáo nghiệp vụ:</label>
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => handleTypeChange(e.target.value as ReportType)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
            >
              {Object.values(REPORT_TYPE_CONFIG).map((cfg) => (
                <option key={cfg.key} value={cfg.key}>
                  {cfg.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Period Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Kỳ báo cáo:</label>
          <div className="relative">
            <select
              value={activePeriod}
              disabled={reportType === 'YEAR_END'}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
            >
              {reportType === 'YEAR_END' ? (
                <option value="cuoi_nam">Tổng kết cuối năm học ({schoolYear})</option>
              ) : (
                REPORT_PERIODS.filter((p) => p.id !== 'cuoi_nam').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* School Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-600">Năm học:</label>
          <div className="relative">
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-black text-slate-800 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="2026-2027">Năm học 2026 - 2027</option>
              <option value="2025-2026">Năm học 2025 - 2026</option>
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400 gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">Đang tổng hợp số liệu thực tế từ cơ sở dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Form Container */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
            {/* Title Input */}
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tiêu đề báo cáo chính thức:
                </label>
                <button
                  onClick={handleRefreshAutoFill}
                  disabled={actionLoading || isApproved}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer disabled:text-slate-400"
                >
                  <RefreshCw size={13} className={actionLoading ? 'animate-spin' : ''} />
                  <span>Cập nhật số liệu mới nhất từ CSDL</span>
                </button>
              </div>
              <input
                type="text"
                value={title}
                disabled={isApproved}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-black text-slate-800 bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* KPI Cards: Auto-aggregated from Real Database */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-indigo-600" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  I. Số liệu tổng quan của lớp ({periodLabel}):
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* 1. Sĩ số */}
                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                  <div className="flex items-center justify-between text-sky-800">
                    <span className="text-xs font-bold">Sĩ số học sinh</span>
                    <Users size={16} />
                  </div>
                  <div className="text-2xl font-black text-sky-950">
                    {metrics.totalStudents} <span className="text-xs font-bold text-sky-700">trẻ</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-sky-700 font-bold border-t border-sky-200/40 pt-1.5">
                    <span>Nam: {metrics.maleCount}</span>
                    <span>Nữ: {metrics.femaleCount}</span>
                  </div>
                </div>

                {/* 2. Chuyên cần */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <div className="flex items-center justify-between text-emerald-800">
                    <span className="text-xs font-bold">Tỷ lệ chuyên cần</span>
                    <CalendarCheck size={16} />
                  </div>
                  <div className="text-2xl font-black text-emerald-950">
                    {metrics.attendance.attendanceRate}%
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold border-t border-emerald-200/40 pt-1.5">
                    <span>Có mặt: {metrics.attendance.presentDays}</span>
                    <span>Nghỉ: {metrics.attendance.excusedDays + metrics.attendance.unexcusedDays}</span>
                  </div>
                </div>

                {/* 3. Sức khỏe thể trạng WHO */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <div className="flex items-center justify-between text-amber-800">
                    <span className="text-xs font-bold">Thể trạng chuẩn WHO</span>
                    <HeartPulse size={16} />
                  </div>
                  <div className="text-2xl font-black text-amber-950">
                    {metrics.health.normalRate}%
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-amber-700 font-bold border-t border-amber-200/40 pt-1.5">
                    <span>Bình thường: {metrics.health.normalHealthCount}</span>
                    <span className="text-rose-600">SDD: {metrics.health.malnutritionCount}</span>
                  </div>
                </div>

                {/* 4. Hoàn tiền bán trú */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                  <div className="flex items-center justify-between text-indigo-800">
                    <span className="text-xs font-bold">Hoàn tiền bán trú</span>
                    <Utensils size={16} />
                  </div>
                  <div className="text-xl font-black text-indigo-950">
                    {metrics.boarding.totalRefundAmount.toLocaleString('vi-VN')} <span className="text-xs font-bold">đ</span>
                  </div>
                  <div className="text-[11px] text-indigo-700 font-bold border-t border-indigo-200/40 pt-1.5">
                    <span>{metrics.boarding.excusedAbsentDays} ngày nghỉ có phép</span>
                  </div>
                </div>
              </div>
            </div>

            {/* II. DETAILED STUDENT TABLES (Render based on reportType) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-600" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    II. Bảng Số Liệu Chi Tiết Danh Sách Từng Học Sinh ({metrics.totalStudents} em):
                  </h2>
                </div>

                {/* Monthly tab switch */}
                {reportType === 'MONTHLY' && (
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
                    <button
                      onClick={() => setMonthlyActiveTab('boarding')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        monthlyActiveTab === 'boarding' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Bán trú & Tiền ăn
                    </button>
                    <button
                      onClick={() => setMonthlyActiveTab('health')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        monthlyActiveTab === 'health' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Sức khỏe WHO
                    </button>
                    <button
                      onClick={() => setMonthlyActiveTab('attendance')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        monthlyActiveTab === 'attendance' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Chuyên cần & 5T
                    </button>
                    <button
                      onClick={() => setMonthlyActiveTab('activities')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                        monthlyActiveTab === 'activities' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Hoạt động
                    </button>
                  </div>
                )}
              </div>

              {/* TABLE: NUTRITION & BOARDING */}
              {(reportType === 'NUTRITION_BOARDING' || (reportType === 'MONTHLY' && monthlyActiveTab === 'boarding')) && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                        <th className="py-2.5 px-3 text-center">Giới tính</th>
                        <th className="py-2.5 px-3 text-center">Tổng ngày học</th>
                        <th className="py-2.5 px-3 text-center">Ăn bán trú (ngày)</th>
                        <th className="py-2.5 px-3 text-center text-emerald-800">Nghỉ phép (hoàn tiền)</th>
                        <th className="py-2.5 px-3 text-center text-rose-800">Nghỉ không phép</th>
                        <th className="py-2.5 px-3 text-right">Mức hoàn/ngày</th>
                        <th className="py-2.5 px-3 text-right font-black text-emerald-800">Tiền hoàn trả (VNĐ)</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(metrics.studentBoardingList || []).map((s, idx) => (
                        <tr key={s.childId} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.childName}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{s.gender}</td>
                          <td className="py-2.5 px-3 text-center font-medium">{s.totalDays}</td>
                          <td className="py-2.5 px-3 text-center font-bold">{s.presentDays}</td>
                          <td className="py-2.5 px-3 text-center font-black text-emerald-700">
                            {s.excusedDays > 0 ? `${s.excusedDays} buổi` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-center text-rose-600 font-medium">
                            {s.unexcusedDays > 0 ? `${s.unexcusedDays} buổi` : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-600">45.000 đ</td>
                          <td className="py-2.5 px-3 text-right font-black text-emerald-700">
                            {(s.refundAmount || 0).toLocaleString('vi-VN')} đ
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                s.refundAmount > 0
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE: HEALTH & GROWTH WHO */}
              {(reportType === 'HEALTH_GROWTH' || (reportType === 'MONTHLY' && monthlyActiveTab === 'health')) && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                        <th className="py-2.5 px-3 text-center">Giới tính</th>
                        <th className="py-2.5 px-3 text-center">Ngày sinh</th>
                        <th className="py-2.5 px-3 text-center">Cân nặng (kg)</th>
                        <th className="py-2.5 px-3 text-center">Chiều cao (cm)</th>
                        <th className="py-2.5 px-3 text-center">Chỉ số BMI</th>
                        <th className="py-2.5 px-3 text-center">Đánh giá thể lực WHO</th>
                        <th className="py-2.5 px-3">Kế hoạch can thiệp chăm sóc</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(metrics.studentHealthList || []).map((s, idx) => (
                        <tr key={s.childId} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.childName}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{s.gender}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                            {s.dob ? new Date(s.dob).toLocaleDateString('vi-VN') : '—'}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{s.weight} kg</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{s.height} cm</td>
                          <td className="py-2.5 px-3 text-center font-bold text-indigo-700">{s.bmi}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                s.whoStatus?.includes('Bình thường')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {s.whoStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">{s.interventionPlan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE: ATTENDANCE & UNIVERSAL 5T */}
              {(reportType === 'ATTENDANCE' || (reportType === 'MONTHLY' && monthlyActiveTab === 'attendance')) && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                        <th className="py-2.5 px-3 text-center">Giới tính</th>
                        <th className="py-2.5 px-3 text-center">Tổng ngày</th>
                        <th className="py-2.5 px-3 text-center">Có mặt</th>
                        <th className="py-2.5 px-3 text-center text-emerald-700">Nghỉ phép</th>
                        <th className="py-2.5 px-3 text-center text-rose-700">Nghỉ K.phép</th>
                        <th className="py-2.5 px-3 text-center font-black">Tỷ lệ chuyên cần</th>
                        <th className="py-2.5 px-3 text-center">Phổ cập 5T</th>
                        <th className="py-2.5 px-3">Đánh giá của giáo viên</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(metrics.studentAttendanceList || []).map((s, idx) => (
                        <tr key={s.childId} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.childName}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{s.gender}</td>
                          <td className="py-2.5 px-3 text-center text-slate-600">{s.totalDays}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">{s.presentDays}</td>
                          <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">{s.excusedDays}</td>
                          <td className="py-2.5 px-3 text-center text-rose-700 font-bold">{s.unexcusedDays}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                                s.attendanceRate >= 90
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {s.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {s.is5YearsOld ? (
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  s.universal5TQualified ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                                }`}
                              >
                                {s.universal5TQualified ? 'Đạt chuẩn 5T' : 'Chưa đạt'}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">{s.evaluation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE: ACTIVITY EVALUATION */}
              {(reportType === 'ACTIVITY_EVALUATION' || (reportType === 'MONTHLY' && monthlyActiveTab === 'activities')) && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                        <th className="py-2.5 px-3 text-center">Giới tính</th>
                        <th className="py-2.5 px-3 text-center">Hoạt động tham gia</th>
                        <th className="py-2.5 px-3 text-center">Hoạt động Đạt</th>
                        <th className="py-2.5 px-3 text-center">Tỷ lệ đạt (%)</th>
                        <th className="py-2.5 px-3">Nhận xét năng lực & thái độ của trẻ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(metrics.studentActivityList || []).map((s, idx) => (
                        <tr key={s.childId} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{s.childName}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500">{s.gender}</td>
                          <td className="py-2.5 px-3 text-center font-medium">{s.activitiesTotal} bài</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{s.activitiesPassed} bài</td>
                          <td className="py-2.5 px-3 text-center font-black text-indigo-700">{s.passRate}%</td>
                          <td className="py-2.5 px-3 text-slate-600 text-[11px]">{s.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TABLE: YEAR_END PROCESS AWARDS (3 Criteria) */}
              {reportType === 'YEAR_END' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                        <th className="py-2.5 px-3 w-10 text-center">STT</th>
                        <th className="py-2.5 px-3">Họ và Tên Học Sinh</th>
                        <th className="py-2.5 px-3 text-center">1. Chuyên Cần Cả Năm</th>
                        <th className="py-2.5 px-3 text-center">2. Sức Khỏe 4 Quý (WHO)</th>
                        <th className="py-2.5 px-3 text-center">3. Hoạt Động Cả Năm</th>
                        <th className="py-2.5 px-3 text-center">Danh Hiệu Khen Thưởng Đề Xuất</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(metrics.yearEndAwards || []).map((child, idx) => (
                        <tr key={child.childId} className="hover:bg-slate-50/80 transition font-medium">
                          <td className="py-2.5 px-3 text-slate-400 font-bold text-center">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">{child.childName}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                child.attendanceRate >= 95
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : child.attendanceRate >= 85
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {child.attendanceRate}% ({child.presentDays}/{child.totalAttendanceDays} ngày)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                child.quartersNormal >= 3
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {child.quartersNormal}/{child.quartersEvaluated} quý bình thường
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-indigo-50 text-indigo-700">
                              {child.activityPassRate}% ({child.passedActivities}/{child.totalActivities} đạt)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2.5 py-1 rounded-full font-black text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                              ★ {child.suggestedAward}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* III. Teacher Comments and Proposals */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-indigo-600" />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  III. Đánh giá chuyên môn & Đề xuất kiến nghị của Giáo viên:
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    1. Đánh giá chung tình hình của lớp:
                  </label>
                  <textarea
                    rows={4}
                    value={teacherNotes}
                    disabled={isApproved}
                    onChange={(e) => setTeacherNotes(e.target.value)}
                    placeholder="Ghi nhận xét về chuyên cần, ăn ngủ bán trú, mức độ tiếp thu bài học..."
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    2. Đề xuất, kiến nghị với Ban Giám Hiệu:
                  </label>
                  <textarea
                    rows={4}
                    value={teacherProposals}
                    disabled={isApproved}
                    onChange={(e) => setTeacherProposals(e.target.value)}
                    placeholder="Đề xuất bổ sung đồ dùng học liệu, sửa chữa trang thiết bị, hỗ trợ dinh dưỡng..."
                    className="w-full text-xs font-medium text-slate-800 bg-slate-50/50 border border-slate-200 rounded-2xl p-3.5 outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-indigo-600" />
                <span>
                  Báo cáo ký bởi: <strong>{teacherName}</strong> — Lưu trữ hệ số minh chứng kiểm định chất lượng
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleSaveOrSubmit('SAVE_DRAFT')}
                  disabled={actionLoading || isApproved}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer disabled:text-slate-400 disabled:bg-slate-100"
                >
                  <Save size={15} />
                  <span>Lưu Bản Nháp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveOrSubmit('SUBMIT_REPORT')}
                  disabled={actionLoading || isApproved}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition shadow-sm shadow-indigo-600/30 cursor-pointer disabled:bg-slate-300"
                >
                  <Send size={15} />
                  <span>{isSubmitted ? 'Cập Nhật & Gửi Lại BGH' : 'Ký & Nộp Báo Cáo Lên BGH'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
