"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Search,
  RefreshCw,
  Send,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  CalendarCheck,
  HeartPulse,
  Award,
  Utensils,
  X,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  Download,
  BookOpen,
} from "lucide-react";
import {
  getAllClassReports,
  reviewClassReport,
  getSchoolWideReport,
  AllClassReportsOverview,
  SchoolWideReportData,
  ReportType,
  REPORT_TYPE_CONFIG,
  REPORT_PERIODS,
} from "@/services/classReports";
import { exportClassReportPdf, exportSchoolWideReportPdf } from "@/utils/exportReportPdf";

export function AdminClassReportsCentral() {
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [reportType, setReportType] = useState<ReportType>("MONTHLY");
  const [period, setPeriod] = useState("thang_10");

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AllClassReportsOverview | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selected class for view/review modal
  const [selectedClassReport, setSelectedClassReport] = useState<any | null>(null);
  const [adminFeedback, setAdminFeedback] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [monthlyReviewTab, setMonthlyReviewTab] = useState<"boarding" | "health" | "attendance" | "activities">("boarding");

  // School-wide report modal
  const [showSchoolSummaryModal, setShowSchoolSummaryModal] = useState(false);
  const [schoolWideData, setSchoolWideData] = useState<SchoolWideReportData | null>(null);
  const [schoolReportLoading, setSchoolReportLoading] = useState(false);

  const activePeriod = reportType === "YEAR_END" ? "cuoi_nam" : period;
  const periodLabel = REPORT_PERIODS.find((p) => p.id === activePeriod)?.name || activePeriod;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllClassReports(schoolYear, activePeriod, reportType);
      setOverview(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách báo cáo lớp:", err);
    } finally {
      setLoading(false);
    }
  }, [schoolYear, activePeriod, reportType]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleTypeChange = (newType: ReportType) => {
    setReportType(newType);
    if (newType === "YEAR_END") {
      setPeriod("cuoi_nam");
    } else if (period === "cuoi_nam") {
      setPeriod("thang_10");
    }
  };

  const filteredClasses = useMemo(() => {
    if (!overview?.classes) return [];
    return overview.classes.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (search.trim()) {
        const kw = search.toLowerCase();
        return (
          c.className.toLowerCase().includes(kw) ||
          c.gradeName.toLowerCase().includes(kw) ||
          (c.teacherName || "").toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [overview, statusFilter, search]);

  const handleReview = async (classId: string, action: "APPROVE_REPORT" | "REQUEST_REVISION") => {
    setActionLoading(true);
    try {
      await reviewClassReport({
        action,
        classId,
        schoolYear,
        period: activePeriod,
        reportType,
        adminFeedback: action === "REQUEST_REVISION" ? adminFeedback : undefined,
      });

      setSelectedClassReport(null);
      setAdminFeedback("");
      await loadData();
    } catch (err: any) {
      alert(err.message || "Lỗi khi xử lý báo cáo.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenSchoolWideReport = async () => {
    setShowSchoolSummaryModal(true);
    setSchoolReportLoading(true);
    try {
      const data = await getSchoolWideReport(schoolYear, activePeriod, reportType);
      setSchoolWideData(data);
    } catch (err) {
      console.error("Lỗi khi lấy báo cáo toàn trường:", err);
    } finally {
      setSchoolReportLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Filter Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              <Layers size={16} />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
              TRUNG TÂM TIẾP NHẬN & ĐIỀU PHỐI BÁO CÁO CÁC LỚP
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Quản Lý & Tiếp Nhận Báo Cáo Định Kỳ Từ Giáo Viên
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tiếp nhận báo cáo tháng/kỳ và báo cáo cuối năm từ các lớp, phê duyệt nội dung và tổng hợp báo cáo toàn trường.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Report Type Selector */}
          <select
            value={reportType}
            onChange={(e) => handleTypeChange(e.target.value as ReportType)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-800 outline-none bg-slate-50 cursor-pointer focus:border-indigo-500"
          >
            {Object.values(REPORT_TYPE_CONFIG).map((cfg) => (
              <option key={cfg.key} value={cfg.key}>
                {cfg.name}
              </option>
            ))}
          </select>

          {/* Period Selector */}
          <select
            value={activePeriod}
            disabled={reportType === "YEAR_END"}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none bg-slate-50 cursor-pointer focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          >
            {reportType === "YEAR_END" ? (
              <option value="cuoi_nam">Tổng kết cuối năm ({schoolYear})</option>
            ) : (
              REPORT_PERIODS.filter((p) => p.id !== "cuoi_nam").map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))
            )}
          </select>

          {/* School Year */}
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 outline-none bg-slate-50 cursor-pointer"
          >
            {["2025-2026", "2026-2027", "2027-2028"].map((y) => (
              <option key={y} value={y}>
                Năm học {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => void loadData()}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-indigo-600" : ""} />
          </button>

          {/* Button Tổng hợp Toàn trường */}
          <button
            onClick={handleOpenSchoolWideReport}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white px-4 py-2 text-xs font-black shadow-md shadow-indigo-600/25 transition cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Xem Báo Cáo Tổng Hợp Toàn Trường</span>
          </button>
        </div>
      </div>

      {/* Overview Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng số nhóm lớp</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{overview?.totalClasses || 0} lớp</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Quy mô mạng lưới toàn trường</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Đã nộp báo cáo</span>
          <div className="text-2xl font-black text-blue-700 mt-1">{overview?.submittedCount || 0} lớp</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Giáo viên đã gửi về Ban Giám Hiệu</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">BGH Đã phê duyệt</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{overview?.approvedCount || 0} lớp</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Đạt yêu cầu & đã xác nhận</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Chưa nộp / Đang soạn</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {(overview?.totalClasses || 0) - (overview?.submittedCount || 0)} lớp
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Cần đôn đốc giáo viên hoàn thiện</div>
        </div>
      </div>

      {/* Class List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên lớp, khối học, giáo viên..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Lọc trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none bg-slate-50 cursor-pointer"
            >
              <option value="ALL">Tất cả ({overview?.classes?.length || 0} lớp)</option>
              <option value="SUBMITTED">Chờ duyệt</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REVISION_REQUESTED">Yêu cầu sửa</option>
              <option value="NOT_SUBMITTED">Chưa nộp</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-700 border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Lớp / Khối</th>
                <th className="py-3 px-4">Giáo viên phụ trách</th>
                <th className="py-3 px-4">Trạng thái nộp</th>
                <th className="py-3 px-4 text-center">Sĩ số</th>
                <th className="py-3 px-4 text-center">Chuyên cần</th>
                <th className="py-3 px-4 text-center">Sức khỏe WHO</th>
                <th className="py-3 px-4 text-center">Đạt Hoạt động</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không có lớp nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((item) => {
                  const m = item.metricsSnapshot;
                  return (
                    <tr key={item.classId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-800 text-sm">{item.className}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{item.gradeName || "Khối mầm non"}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {item.teacherName || "(Chưa phân công)"}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} /> Đã duyệt
                          </span>
                        )}
                        {item.status === "SUBMITTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800">
                            <Clock size={12} /> Chờ duyệt
                          </span>
                        )}
                        {item.status === "REVISION_REQUESTED" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800">
                            <AlertCircle size={12} /> Yêu cầu sửa
                          </span>
                        )}
                        {(item.status === "NOT_SUBMITTED" || item.status === "DRAFT") && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                            Chưa nộp
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                        {m ? `${m.totalStudents} trẻ` : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {m ? (
                          <span className="font-extrabold text-emerald-700">{m.attendance?.attendanceRate}%</span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {m ? (
                          <span className="font-extrabold text-blue-700">{m.health?.normalRate}%</span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {m ? (
                          <span className="font-extrabold text-indigo-700">{m.activities?.activityPassRate}%</span>
                        ) : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {item.hasSubmitted ? (
                          <button
                            onClick={() => setSelectedClassReport(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                          >
                            <Eye size={13} />
                            <span>Xem & Duyệt</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Chưa nộp</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal for a Single Class Report */}
      {selectedClassReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <FileText size={18} className="text-indigo-600" />
                <h3 className="text-sm font-black text-slate-800">
                  Phê Duyệt Báo Cáo: {selectedClassReport.className}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassReport(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <div className="font-black text-slate-800 text-sm">{selectedClassReport.title}</div>
                  <div className="text-slate-500">
                    Giáo viên: <strong>{selectedClassReport.teacherName}</strong> — Khối: <strong>{selectedClassReport.gradeName}</strong>
                  </div>
                </div>
                <button
                  onClick={() =>
                    exportClassReportPdf(
                      {
                        title: selectedClassReport.title,
                        classId: selectedClassReport.classId,
                        className: selectedClassReport.className,
                        gradeName: selectedClassReport.gradeName,
                        schoolYear,
                        period: activePeriod,
                        reportType,
                        teacherName: selectedClassReport.teacherName,
                        status: selectedClassReport.status,
                        metricsSnapshot: selectedClassReport.metricsSnapshot,
                        teacherNotes: selectedClassReport.teacherNotes,
                        teacherProposals: selectedClassReport.teacherProposals,
                      },
                      { className: selectedClassReport.className, gradeName: selectedClassReport.gradeName }
                    )
                  }
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black shadow-sm shadow-red-500/20 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Xuất File PDF (.pdf)</span>
                </button>
              </div>

              {/* Snapshot Metrics */}
              {selectedClassReport.metricsSnapshot && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <span className="text-[11px] font-bold text-sky-700">Sĩ số</span>
                    <div className="text-base font-black text-sky-950">
                      {selectedClassReport.metricsSnapshot.totalStudents} trẻ
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-[11px] font-bold text-emerald-700">Chuyên cần</span>
                    <div className="text-base font-black text-emerald-950">
                      {selectedClassReport.metricsSnapshot.attendance?.attendanceRate}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-[11px] font-bold text-amber-700">Sức khỏe WHO</span>
                    <div className="text-base font-black text-amber-950">
                      {selectedClassReport.metricsSnapshot.health?.normalRate}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                    <span className="text-[11px] font-bold text-indigo-700">Hoàn tiền ăn</span>
                    <div className="text-sm font-black text-indigo-950">
                      {selectedClassReport.metricsSnapshot.boarding?.totalRefundAmount?.toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                </div>
              )}

              {/* DETAILED STUDENT TABLES */}
              {selectedClassReport.metricsSnapshot && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-black text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <BookOpen size={14} className="text-indigo-600" />
                      Bảng số liệu chi tiết danh sách học sinh:
                    </span>

                    {/* Monthly tab switcher inside modal */}
                    {reportType === "MONTHLY" && (
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setMonthlyReviewTab("boarding")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            monthlyReviewTab === "boarding" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Bán trú
                        </button>
                        <button
                          type="button"
                          onClick={() => setMonthlyReviewTab("health")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            monthlyReviewTab === "health" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Sức khỏe WHO
                        </button>
                        <button
                          type="button"
                          onClick={() => setMonthlyReviewTab("attendance")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            monthlyReviewTab === "attendance" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Chuyên cần
                        </button>
                        <button
                          type="button"
                          onClick={() => setMonthlyReviewTab("activities")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            monthlyReviewTab === "activities" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600"
                          }`}
                        >
                          Hoạt động
                        </button>
                      </div>
                    )}
                  </div>

                  {/* NUTRITION TABLE */}
                  {(reportType === "NUTRITION_BOARDING" || (reportType === "MONTHLY" && monthlyReviewTab === "boarding")) && (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2 w-8 text-center">STT</th>
                            <th className="p-2">Họ và tên</th>
                            <th className="p-2 text-center">Tổng ngày</th>
                            <th className="p-2 text-center">Ăn thực tế</th>
                            <th className="p-2 text-center text-emerald-700">Nghỉ phép (hoàn)</th>
                            <th className="p-2 text-center text-rose-700">K.phép</th>
                            <th className="p-2 text-right">Tiền hoàn trả</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedClassReport.metricsSnapshot.studentBoardingList || []).map((s: any, idx: number) => (
                            <tr key={s.childId} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800">{s.childName}</td>
                              <td className="p-2 text-center">{s.totalDays}</td>
                              <td className="p-2 text-center font-medium">{s.presentDays} buổi</td>
                              <td className="p-2 text-center font-bold text-emerald-700">{s.excusedDays} buổi</td>
                              <td className="p-2 text-center text-rose-600 font-medium">{s.unexcusedDays || 0}</td>
                              <td className="p-2 text-right font-black text-emerald-700">{(s.refundAmount || 0).toLocaleString("vi-VN")} đ</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* HEALTH TABLE */}
                  {(reportType === "HEALTH_GROWTH" || (reportType === "MONTHLY" && monthlyReviewTab === "health")) && (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2 w-8 text-center">STT</th>
                            <th className="p-2">Họ và tên</th>
                            <th className="p-2 text-center">Cân nặng</th>
                            <th className="p-2 text-center">Chiều cao</th>
                            <th className="p-2 text-center">BMI</th>
                            <th className="p-2 text-center">Thể lực WHO</th>
                            <th className="p-2">Biện pháp can thiệp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedClassReport.metricsSnapshot.studentHealthList || []).map((s: any, idx: number) => (
                            <tr key={s.childId} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800">{s.childName}</td>
                              <td className="p-2 text-center font-bold">{s.weight} kg</td>
                              <td className="p-2 text-center font-bold">{s.height} cm</td>
                              <td className="p-2 text-center text-indigo-700">{s.bmi}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${s.whoStatus?.includes("Bình thường") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                  {s.whoStatus}
                                </span>
                              </td>
                              <td className="p-2 text-[10px] text-slate-600">{s.interventionPlan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ATTENDANCE TABLE */}
                  {(reportType === "ATTENDANCE" || (reportType === "MONTHLY" && monthlyReviewTab === "attendance")) && (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2 w-8 text-center">STT</th>
                            <th className="p-2">Họ và tên</th>
                            <th className="p-2 text-center">Tổng ngày</th>
                            <th className="p-2 text-center">Có mặt</th>
                            <th className="p-2 text-center text-emerald-700">Nghỉ phép</th>
                            <th className="p-2 text-center text-rose-700">K.phép</th>
                            <th className="p-2 text-center font-black">Chuyên cần</th>
                            <th className="p-2">Đánh giá GV</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedClassReport.metricsSnapshot.studentAttendanceList || []).map((s: any, idx: number) => (
                            <tr key={s.childId} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800">{s.childName}</td>
                              <td className="p-2 text-center">{s.totalDays}</td>
                              <td className="p-2 text-center font-bold">{s.presentDays}</td>
                              <td className="p-2 text-center text-emerald-700">{s.excusedDays}</td>
                              <td className="p-2 text-center text-rose-700">{s.unexcusedDays}</td>
                              <td className="p-2 text-center font-black text-emerald-700">{s.attendanceRate}%</td>
                              <td className="p-2 text-[10px] text-slate-600">{s.evaluation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ACTIVITY EVALUATION TABLE */}
                  {(reportType === "ACTIVITY_EVALUATION" || (reportType === "MONTHLY" && monthlyReviewTab === "activities")) && (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2 w-8 text-center">STT</th>
                            <th className="p-2">Họ và tên</th>
                            <th className="p-2 text-center">Hoạt động tham gia</th>
                            <th className="p-2 text-center text-emerald-700">Hoạt động Đạt</th>
                            <th className="p-2 text-center text-indigo-700">Tỷ lệ đạt (%)</th>
                            <th className="p-2">Nhận xét của giáo viên</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedClassReport.metricsSnapshot.studentActivityList || []).map((s: any, idx: number) => (
                            <tr key={s.childId} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800">{s.childName}</td>
                              <td className="p-2 text-center font-medium">{s.activitiesTotal} bài</td>
                              <td className="p-2 text-center font-bold text-emerald-700">{s.activitiesPassed} bài</td>
                              <td className="p-2 text-center font-black text-indigo-700">{s.passRate}%</td>
                              <td className="p-2 text-[10px] text-slate-600">{s.remark}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* YEAR_END TABLE */}
                  {reportType === "YEAR_END" && (
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead className="bg-slate-100 sticky top-0">
                          <tr className="text-slate-700 font-bold border-b border-slate-200">
                            <th className="p-2 w-8 text-center">STT</th>
                            <th className="p-2">Họ và tên</th>
                            <th className="p-2 text-center">Chuyên cần</th>
                            <th className="p-2 text-center">Sức khỏe WHO</th>
                            <th className="p-2 text-center">Hoạt động cả năm</th>
                            <th className="p-2 text-center">Danh hiệu đề xuất</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {(selectedClassReport.metricsSnapshot.yearEndAwards || []).map((s: any, idx: number) => (
                            <tr key={s.childId} className="hover:bg-slate-50">
                              <td className="p-2 text-center text-slate-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-800">{s.childName}</td>
                              <td className="p-2 text-center">{s.attendanceRate}%</td>
                              <td className="p-2 text-center">{s.quartersNormal}/{s.quartersEvaluated} quý đạt</td>
                              <td className="p-2 text-center font-bold text-indigo-700">{s.activityPassRate}%</td>
                              <td className="p-2 text-center font-black text-amber-800">★ {s.suggestedAward}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Notes & Proposals */}
              <div className="space-y-1.5">
                <span className="font-black text-slate-700">Nhận xét của giáo viên chủ nhiệm:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-line font-medium">
                  {selectedClassReport.teacherNotes || "Không có ghi chú thêm."}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-black text-slate-700">Kiến nghị, đề xuất của lớp:</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-line font-medium">
                  {selectedClassReport.teacherProposals || "Không có đề xuất thêm."}
                </p>
              </div>

              {/* Admin feedback input */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="font-black text-slate-700">Ý kiến chỉ đạo / Nhận xét của Ban Giám Hiệu:</span>
                <textarea
                  rows={3}
                  value={adminFeedback}
                  onChange={(e) => setAdminFeedback(e.target.value)}
                  placeholder="Nhập nhận xét hoặc lý do yêu cầu điều chỉnh báo cáo..."
                  className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Trạng thái hiện tại: <strong>{selectedClassReport.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReview(selectedClassReport.classId, "REQUEST_REVISION")}
                  disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer"
                >
                  Yêu Cầu Chỉnh Sửa
                </button>
                <button
                  onClick={() => handleReview(selectedClassReport.classId, "APPROVE_REPORT")}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Phê Duyệt Báo Cáo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* School-Wide Summary Modal */}
      {showSchoolSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Sparkles size={18} className="text-indigo-600" />
                <h3 className="text-sm font-black text-slate-800">
                  Báo Cáo Tổng Hợp Toàn Trường — Chuẩn Thể Thức Sư Phạm
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSchoolWideReportPdf(schoolWideData!)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-black transition shadow-sm shadow-red-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} /> Xuất File PDF (.pdf)
                </button>
                <button
                  onClick={() => setShowSchoolSummaryModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 sm:p-12 text-slate-900 font-serif leading-relaxed max-h-[75vh] overflow-y-auto text-xs sm:text-sm space-y-6">
              {schoolReportLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                  <RefreshCw size={28} className="animate-spin text-indigo-600" />
                  <span className="text-xs font-bold text-slate-600">Đang tổng hợp dữ liệu toàn trường...</span>
                </div>
              ) : schoolWideData ? (
                <>
                  {/* Administrative Header */}
                  <div className="grid grid-cols-2 text-center text-xs font-bold leading-normal">
                    <div>
                      <p className="uppercase">ỦY BAN NHÂN DÂN</p>
                      <p className="uppercase font-black">TRƯỜNG MẦM NON</p>
                      <p className="italic font-normal">Năm học: {schoolYear}</p>
                    </div>
                    <div>
                      <p className="uppercase font-black">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                      <p className="font-bold underline decoration-1 underline-offset-4">Độc lập - Tự do - Hạnh phúc</p>
                    </div>
                  </div>

                  <div className="text-center space-y-1 pt-4">
                    <h1 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900">
                      {REPORT_TYPE_CONFIG[reportType].defaultTitle(periodLabel, schoolYear)}
                    </h1>
                    <p className="italic text-xs text-slate-600">
                      (Tổng hợp quy mô 12 nhóm lớp — Kỳ báo cáo: {periodLabel})
                    </p>
                  </div>

                  {/* Section 1: Quy mô trường lớp */}
                  <div className="space-y-3 pt-2">
                    <h2 className="font-bold text-sm uppercase">I. QUY MÔ TRƯỜNG LỚP & HỌC SINH</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tổng số lớp học: <strong>{schoolWideData.overview.totalClasses}</strong> lớp.</li>
                      <li>Tổng số học sinh toàn trường: <strong>{schoolWideData.overview.totalStudents}</strong> học sinh (Nam: {schoolWideData.overview.maleCount}, Nữ: {schoolWideData.overview.femaleCount}).</li>
                    </ul>

                    {/* Breakdown by Grade */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 mt-2 font-sans text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-700 font-black">
                          <tr>
                            <th className="py-2 px-3">Khối Học</th>
                            <th className="py-2 px-3 text-center">Tổng Số Trẻ</th>
                            <th className="py-2 px-3 text-center">Nam</th>
                            <th className="py-2 px-3 text-center">Nữ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {schoolWideData.overview.gradeBreakdown.map((gr, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-bold text-slate-800">{gr.gradeName}</td>
                              <td className="py-2 px-3 text-center font-bold">{gr.studentCount}</td>
                              <td className="py-2 px-3 text-center">{gr.maleCount}</td>
                              <td className="py-2 px-3 text-center">{gr.femaleCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: Chuyên cần & Phổ cập 5T */}
                  <div className="space-y-2 pt-2">
                    <h2 className="font-bold text-sm uppercase">II. CÔNG TÁC DUY TRÌ SĨ SỐ, CHUYÊN CẦN & PHỔ CẬP 5 TUỔI</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tỷ lệ chuyên cần chung toàn trường: <strong>{schoolWideData.overview.attendance.attendanceRate}%</strong>.</li>
                      <li>Tỷ lệ trẻ 5 tuổi (Khối Lá) đi học chuyên cần: <strong>{schoolWideData.overview.attendance.attendanceRate5T}%</strong>.</li>
                      <li>Đánh giá phổ cập GDMN trẻ 5 tuổi: <strong className="text-emerald-700">{schoolWideData.overview.attendance.universal5TQualified ? "ĐẠT CHUẨN PHỔ CẬP QUỐC GIA (>= 95%)" : "CHƯA ĐẠT CHUẨN"}</strong>.</li>
                    </ul>
                  </div>

                  {/* Section 3: Sức khỏe & Bán trú */}
                  <div className="space-y-2 pt-2">
                    <h2 className="font-bold text-sm uppercase">III. CÔNG TÁC CHĂM SÓC SỨC KHỎE & QUẢN LÝ BÁN TRÚ</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tỷ lệ trẻ phát triển bình thường theo chuẩn WHO: <strong>{schoolWideData.overview.health.normalRate}%</strong> ({schoolWideData.overview.health.normalHealthCount}/{schoolWideData.overview.health.totalHealth} trẻ).</li>
                      <li>Tỷ lệ suy dinh dưỡng / thấp còi toàn trường: <strong>{schoolWideData.overview.health.malnutritionRate}%</strong> ({schoolWideData.overview.health.malnutritionCount} trẻ).</li>
                      <li>Tổng số ngày nghỉ có phép toàn trường: <strong>{schoolWideData.overview.boarding.totalExcusedDays}</strong> lượt.</li>
                      <li>Quyết toán tiền ăn hoàn trả bán trú cho phụ huynh: <strong>{schoolWideData.overview.boarding.totalRefundAmount.toLocaleString("vi-VN")} đ</strong> (theo định mức 45.000 đ/ngày).</li>
                    </ul>
                  </div>

                  {/* Section 4: Tiến độ báo cáo */}
                  <div className="space-y-2 pt-2">
                    <h2 className="font-bold text-sm uppercase">IV. TIẾN ĐỘ THỰC HIỆN CỦA CÁC LỚP</h2>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Tổng số lớp đã nộp báo cáo: <strong>{schoolWideData.overview.submissionProgress.submittedCount}/{schoolWideData.overview.submissionProgress.totalClasses}</strong> lớp.</li>
                      <li>Ban Giám Hiệu đã phê duyệt: <strong>{schoolWideData.overview.submissionProgress.approvedCount}</strong> lớp.</li>
                    </ul>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 text-center pt-8 text-xs font-bold">
                    <div>
                      <p className="uppercase font-black">NGƯỜI TỔNG HỢP</p>
                      <p className="italic text-slate-400 font-normal mt-1">(Ký và ghi rõ họ tên)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="font-bold text-slate-800">Bộ phận Chuyên môn Mầm non</span>
                      </div>
                    </div>
                    <div>
                      <p className="italic font-normal">Hà Nội, ngày ... tháng ... năm 2026</p>
                      <p className="uppercase font-black mt-1">HIỆU TRƯỞNG / BAN GIÁM HIỆU</p>
                      <p className="italic text-slate-400 font-normal mt-1">(Ký, đóng dấu)</p>
                      <div className="h-16 flex items-center justify-center">
                        <span className="text-emerald-700 font-black border border-emerald-500 px-3 py-1 rounded-sm">XÁC NHẬN BAN GIÁM HIỆU</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
