"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  Download,
  Printer,
  RefreshCw,
  Users,
  CalendarCheck,
  HeartPulse,
  Utensils,
  BookOpen,
  Award,
  ShieldCheck,
  TrendingUp,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronDown,
  Building,
} from "lucide-react";
import {
  getSchoolWideReport,
  getAllClassReports,
  SchoolWideReportData,
  AllClassReportsOverview,
  ReportType,
  REPORT_TYPE_CONFIG,
  REPORT_PERIODS,
} from "@/services/classReports";
import { exportSchoolWideReportPdf } from "@/utils/exportReportPdf";

interface AdminSchoolExecutiveReportProps {
  onSwitchToClassesManagement?: () => void;
}

export function AdminSchoolExecutiveReport({
  onSwitchToClassesManagement,
}: AdminSchoolExecutiveReportProps) {
  const [schoolYear, setSchoolYear] = useState("2026-2027");
  const [reportType, setReportType] = useState<ReportType>("MONTHLY");
  const [period, setPeriod] = useState("thang_10");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SchoolWideReportData | null>(null);
  const [classesOverview, setClassesOverview] = useState<AllClassReportsOverview | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "boarding" | "attendance" | "health" | "classes_matrix"
  >("overview");

  const activePeriod = reportType === "YEAR_END" ? "cuoi_nam" : period;
  const periodLabel =
    REPORT_PERIODS.find((p) => p.id === activePeriod)?.name || activePeriod;

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [swData, clsData] = await Promise.all([
        getSchoolWideReport(schoolYear, activePeriod, reportType).catch(() => null),
        getAllClassReports(schoolYear, activePeriod, reportType).catch(() => null),
      ]);
      setData(swData);
      setClassesOverview(clsData);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo toàn trường:", err);
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

  const handleExportPdf = () => {
    if (!data) return;
    exportSchoolWideReportPdf(data);
  };

  const o = data?.overview;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Controls Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-bold">
              <Building size={16} />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
              BÁO CÁO QUẢN TRỊ CẤP TRƯỜNG (DÀNH RIÊNG BAN GIÁM HIỆU)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            {REPORT_TYPE_CONFIG[reportType].defaultTitle(periodLabel, schoolYear)}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng hợp dữ liệu vĩ mô toàn trường: Sĩ số các khối, tỷ lệ chuyên cần & phổ cập 5T, sức khỏe WHO, quyết toán tiền ăn bán trú và phân bổ năng lực học sinh.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
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
            title="Làm mới dữ liệu từ CSDL"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-indigo-600" : ""} />
          </button>

          <button
            onClick={handleExportPdf}
            disabled={!data}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2 text-xs font-black shadow-md shadow-rose-600/20 transition cursor-pointer disabled:opacity-50"
          >
            <Download size={14} />
            <span>Xuất File PDF Chuẩn Bộ GD&ĐT</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 text-slate-400 gap-3">
          <RefreshCw size={32} className="animate-spin text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">Đang tổng hợp số liệu báo cáo toàn trường từ CSDL...</span>
        </div>
      ) : !data || !o ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
          <AlertCircle size={36} className="mx-auto text-amber-500 mb-3" />
          <p className="font-bold">Chưa có dữ liệu báo cáo toàn trường cho kỳ này.</p>
        </div>
      ) : (
        <>
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Sĩ số toàn trường */}
            <div className="rounded-3xl border border-sky-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-sky-700">
                <span className="text-[11px] font-black uppercase">Quy mô học sinh</span>
                <Users size={16} />
              </div>
              <div className="text-2xl font-black text-slate-800">
                {o.totalStudents} <span className="text-xs font-bold text-slate-500">trẻ</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {o.maleCount} Nam / {o.femaleCount} Nữ ({o.totalClasses} nhóm lớp)
              </p>
            </div>

            {/* 2. Chuyên cần toàn trường */}
            <div className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-emerald-700">
                <span className="text-[11px] font-black uppercase">Chuyên cần chung</span>
                <CalendarCheck size={16} />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                {o.attendance.attendanceRate}%
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {o.attendance.presentDays} lượt / {o.attendance.totalAttendance} lượt học
              </p>
            </div>

            {/* 3. Phổ cập GDMN Trẻ 5 Tuổi */}
            <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-blue-700">
                <span className="text-[11px] font-black uppercase">Phổ cập 5T (Khối Lá)</span>
                <ShieldCheck size={16} />
              </div>
              <div className="text-2xl font-black text-blue-700">
                {o.attendance.attendanceRate5T}%
              </div>
              <p className={`text-[10px] font-bold ${o.attendance.universal5TQualified ? "text-emerald-600" : "text-amber-600"}`}>
                {o.attendance.universal5TQualified ? "Đạt chuẩn Bộ GD&ĐT (>= 95%)" : "Chưa đạt ngưỡng 95%"}
              </p>
            </div>

            {/* 4. Sức khỏe chuẩn WHO */}
            <div className="rounded-3xl border border-rose-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-rose-700">
                <span className="text-[11px] font-black uppercase">Thể lực chuẩn WHO</span>
                <HeartPulse size={16} />
              </div>
              <div className="text-2xl font-black text-rose-600">
                {o.health.normalRate}%
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {o.health.normalHealthCount} bình thường / {o.health.malnutritionCount} SDD
              </p>
            </div>

            {/* 5. Quyết toán tiền ăn bán trú */}
            <div className="rounded-3xl border border-amber-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-amber-700">
                <span className="text-[11px] font-black uppercase">Hoàn ăn bán trú</span>
                <Utensils size={16} />
              </div>
              <div className="text-xl font-black text-amber-600 truncate">
                {(o.boarding.totalRefundAmount / 1000).toLocaleString("vi-VN")} k
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {o.boarding.totalExcusedDays} ngày nghỉ x 45.000 đ
              </p>
            </div>

            {/* 6. Tiến độ nộp báo cáo các lớp */}
            <div className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-indigo-700">
                <span className="text-[11px] font-black uppercase">Tiến độ nộp báo cáo</span>
                <Layers size={16} />
              </div>
              <div className="text-2xl font-black text-indigo-700">
                {o.submissionProgress.submittedCount}/{o.submissionProgress.totalClasses}
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                {o.submissionProgress.approvedCount} lớp đã được BGH duyệt
              </p>
            </div>
          </div>

          {/* Navigation Tabs for Deep Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  1. Cơ cấu Quy mô Khối & Lớp
                </button>
                <button
                  onClick={() => setActiveTab("boarding")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "boarding"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  2. Quyết toán Bán trú Toàn trường
                </button>
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "attendance"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  3. Chuyên cần & Phổ cập 5 Tuổi
                </button>
                <button
                  onClick={() => setActiveTab("health")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "health"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  4. Y tế & Thể chất WHO
                </button>
                <button
                  onClick={() => setActiveTab("classes_matrix")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === "classes_matrix"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  5. Ma trận Tổng hợp 12 Lớp
                </button>
              </div>

              {onSwitchToClassesManagement && (
                <button
                  onClick={onSwitchToClassesManagement}
                  className="text-xs font-black text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Mở trung tâm duyệt bài nộp của GV &rarr;</span>
                </button>
              )}
            </div>

            <div className="p-6">
              {/* TAB 1: Cơ cấu Quy mô */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase">
                        Bảng Thống Kê Phân Bổ Quy Mô Học Sinh Theo Khối Lớp
                      </h3>
                      <p className="text-xs text-slate-500">
                        Căn cứ xác định định mức biên chế giáo viên và chỉ tiêu ăn bán trú
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                          <th className="py-3 px-4">Khối Học Mầm Non</th>
                          <th className="py-3 px-4 text-center">Tổng Số Trẻ</th>
                          <th className="py-3 px-4 text-center">Số Trẻ Nam</th>
                          <th className="py-3 px-4 text-center">Số Trẻ Nữ</th>
                          <th className="py-3 px-4 text-center">Tỷ Lệ / Toàn Trường</th>
                          <th className="py-3 px-4 text-center">Định Mức Quy Định</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {o.gradeBreakdown.map((gr, idx) => {
                          const pct = o.totalStudents > 0 ? Math.round((gr.studentCount / o.totalStudents) * 100) : 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-3 px-4 font-black text-slate-800">{gr.gradeName}</td>
                              <td className="py-3 px-4 text-center font-black text-indigo-700 text-sm">
                                {gr.studentCount}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-sky-700">{gr.maleCount}</td>
                              <td className="py-3 px-4 text-center font-bold text-rose-700">{gr.femaleCount}</td>
                              <td className="py-3 px-4 text-center font-bold text-slate-600">{pct}%</td>
                              <td className="py-3 px-4 text-center text-slate-500">
                                2 cô / lớp (theo chuẩn Bộ GD&ĐT)
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                          <td className="py-3 px-4">TỔNG TOÀN TRƯỜNG</td>
                          <td className="py-3 px-4 text-center text-indigo-800 text-base">{o.totalStudents} trẻ</td>
                          <td className="py-3 px-4 text-center text-sky-800">{o.maleCount} nam</td>
                          <td className="py-3 px-4 text-center text-rose-800">{o.femaleCount} nữ</td>
                          <td className="py-3 px-4 text-center">100%</td>
                          <td className="py-3 px-4 text-center text-emerald-700">Đạt chuẩn mạng lưới trường lớp</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: Quyết toán Bán trú */}
              {activeTab === "boarding" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 flex items-start gap-3">
                    <Utensils size={20} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-amber-950 uppercase">Nguyên tắc quyết toán bán trú cấp trường:</span>{" "}
                      Định mức tiền ăn: <strong>45.000 đ/ngày/trẻ</strong>. Số ngày nghỉ học có phép được giáo viên phê duyệt hợp lệ trên hệ thống sẽ được tính hoàn trả tiền ăn cho phụ huynh vào kỳ thu học phí tiếp theo.
                      Học phí được miễn 100% theo Nghị định số 238/2025/NĐ-CP; toàn bộ tiền bán trú được hạch toán minh bạch.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Tổng ngày nghỉ có phép</span>
                      <div className="text-2xl font-black text-slate-800 mt-1">{o.boarding.totalExcusedDays} ngày</div>
                      <span className="text-[10px] text-slate-400">Được phê duyệt cắt suất ăn</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Mức hoàn trả chuẩn</span>
                      <div className="text-2xl font-black text-slate-800 mt-1">45.000 đ/ngày</div>
                      <span className="text-[10px] text-slate-400">Bữa sáng, trưa, xế & nước</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-800 uppercase">Tổng tiền hoàn toàn trường</span>
                      <div className="text-2xl font-black text-amber-700 mt-1">
                        {o.boarding.totalRefundAmount.toLocaleString("vi-VN")} đ
                      </div>
                      <span className="text-[10px] text-amber-600 font-bold">Phòng tài vụ xuất hóa đơn khấu trừ</span>
                    </div>
                  </div>

                  {/* Bảng chi tiết hoàn ăn theo từng lớp */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 mt-2">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                          <th className="py-2.5 px-3">Tên Lớp Học</th>
                          <th className="py-2.5 px-3">Khối</th>
                          <th className="py-2.5 px-3 text-center">Sĩ Số Ăn Bán Trú</th>
                          <th className="py-2.5 px-3 text-center text-amber-800">Số Ngày Nghỉ Có Phép</th>
                          <th className="py-2.5 px-3 text-right">Đơn Giá Hoàn</th>
                          <th className="py-2.5 px-3 text-right font-black text-amber-800">Tổng Tiền Hoàn Trả (VNĐ)</th>
                          <th className="py-2.5 px-3 text-center">Trạng Thái Báo Cáo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classesOverview?.classes.map((cls, idx) => {
                          const snap = cls.metricsSnapshot;
                          const excusedDays = snap?.boarding?.excusedAbsentDays || snap?.attendance?.excusedDays || 0;
                          const refundAmt = snap?.boarding?.totalRefundAmount || excusedDays * 45000;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{cls.className}</td>
                              <td className="py-2.5 px-3 text-slate-600">{cls.gradeName}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{snap?.totalStudents || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-amber-700">{excusedDays}</td>
                              <td className="py-2.5 px-3 text-right text-slate-600">45.000 đ</td>
                              <td className="py-2.5 px-3 text-right font-black text-amber-800">
                                {refundAmt.toLocaleString("vi-VN")} đ
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    cls.status === "APPROVED"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : cls.status === "SUBMITTED"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {cls.status === "APPROVED" ? "Đã duyệt" : cls.status === "SUBMITTED" ? "Chờ duyệt" : "Đang soạn"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: Chuyên cần & Phổ cập 5T */}
              {activeTab === "attendance" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-blue-950 uppercase">Tiêu chí Phổ cập Giáo dục Mầm non Trẻ 5 Tuổi (Khối Lá):</span>{" "}
                      Theo quy định của Bộ GD&ĐT, tỷ lệ chuyên cần của trẻ 5 tuổi phải đạt từ <strong>95% trở lên</strong> để hoàn thành tiêu chí phổ cập quốc gia.
                      Hiện tại khối Lá đạt <strong>{o.attendance.attendanceRate5T}%</strong> ({o.attendance.universal5TQualified ? "ĐẠT CHUẨN" : "CẦN TĂNG CƯỜNG VẬN ĐỘNG PHỤ HUYNH"}).
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                          <th className="py-2.5 px-3">Tên Lớp Học</th>
                          <th className="py-2.5 px-3">Khối Học</th>
                          <th className="py-2.5 px-3 text-center">Sĩ Số</th>
                          <th className="py-2.5 px-3 text-center text-emerald-800">Có Mặt (lượt)</th>
                          <th className="py-2.5 px-3 text-center text-amber-800">Nghỉ Phép</th>
                          <th className="py-2.5 px-3 text-center text-rose-800">Không Phép</th>
                          <th className="py-2.5 px-3 text-center font-black">Tỷ Lệ Chuyên Cần (%)</th>
                          <th className="py-2.5 px-3 text-center">Đánh Giá Phổ Cập 5T</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classesOverview?.classes.map((cls, idx) => {
                          const snap = cls.metricsSnapshot?.attendance;
                          const rate = snap?.attendanceRate || 0;
                          const is5T = cls.gradeName.includes("Lá") || cls.gradeName.includes("5");
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{cls.className}</td>
                              <td className="py-2.5 px-3 text-slate-600">{cls.gradeName}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{cls.metricsSnapshot?.totalStudents || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{snap?.presentDays || 0}</td>
                              <td className="py-2.5 px-3 text-center text-amber-700">{snap?.excusedDays || 0}</td>
                              <td className="py-2.5 px-3 text-center text-rose-700">{snap?.unexcusedDays || 0}</td>
                              <td className="py-2.5 px-3 text-center font-black text-slate-800">
                                <span className={rate >= 90 ? "text-emerald-700" : rate >= 80 ? "text-amber-700" : "text-rose-700"}>
                                  {rate}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {is5T ? (
                                  rate >= 95 ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Đạt chuẩn Phổ cập 5T
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                      Cần nâng cao tỷ lệ
                                    </span>
                                  )
                                ) : (
                                  <span className="text-slate-400 text-[10px]">Chưa đến tuổi phổ cập</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: Sức khỏe WHO */}
              {activeTab === "health" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 flex items-start gap-3">
                    <HeartPulse size={20} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-700 leading-relaxed">
                      <span className="font-bold text-rose-950 uppercase">Chỉ tiêu Dinh dưỡng & Y tế Học đường WHO:</span>{" "}
                      Đạt chuẩn thể lực WHO toàn trường: <strong>{o.health.normalRate}%</strong> ({o.health.normalHealthCount} trẻ bình thường).
                      Trẻ có nguy cơ suy dinh dưỡng nhẹ cân/thấp còi: <strong>{o.health.malnutritionCount} trẻ ({o.health.malnutritionRate}%)</strong>.
                      Y tế học đường phối hợp với giáo viên chủ nhiệm và phụ huynh tăng cường chế độ sữa dinh dưỡng và bữa ăn phụ giàu canxi.
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                          <th className="py-2.5 px-3">Tên Lớp Học</th>
                          <th className="py-2.5 px-3">Khối</th>
                          <th className="py-2.5 px-3 text-center">Tổng Kiểm Tra</th>
                          <th className="py-2.5 px-3 text-center text-emerald-800">Bình Thường (WHO)</th>
                          <th className="py-2.5 px-3 text-center text-rose-800">Suy Dinh Dưỡng</th>
                          <th className="py-2.5 px-3 text-center text-amber-800">Thừa Cân / Béo Phì</th>
                          <th className="py-2.5 px-3 text-center font-black">Tỷ Lệ Đạt Chuẩn (%)</th>
                          <th className="py-2.5 px-3 text-center">Kế Hoạch Can Thiệp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classesOverview?.classes.map((cls, idx) => {
                          const snap = cls.metricsSnapshot?.health;
                          const normRate = snap?.normalRate || 0;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-3 font-bold text-slate-800">{cls.className}</td>
                              <td className="py-2.5 px-3 text-slate-600">{cls.gradeName}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{snap?.totalHealth || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{snap?.normalHealthCount || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-rose-700">{snap?.malnutritionCount || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-amber-700">{snap?.overweightCount || 0}</td>
                              <td className="py-2.5 px-3 text-center font-black text-slate-800">{normRate}%</td>
                              <td className="py-2.5 px-3 text-center">
                                {(snap?.malnutritionCount || 0) > 0 ? (
                                  <span className="text-rose-600 font-bold text-[10px]">Tăng cường khẩu phần xế</span>
                                ) : (
                                  <span className="text-emerald-600 font-bold text-[10px]">Duy trì chế độ ăn chuẩn</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: Ma trận tổng hợp 12 lớp */}
              {activeTab === "classes_matrix" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase">
                        Bảng Ma Trận Tổng Hợp Chỉ Số 12 Nhóm Lớp Toàn Trường
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tổng hợp đầy đủ các tiêu chí: Chuyên cần, Dinh dưỡng, Học tập và Trạng thái nộp báo cáo
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                          <th className="py-2.5 px-3">Lớp Học</th>
                          <th className="py-2.5 px-3">Giáo Viên Chủ Nhiệm</th>
                          <th className="py-2.5 px-3 text-center">Sĩ Số</th>
                          <th className="py-2.5 px-3 text-center text-emerald-800">Chuyên Cần (%)</th>
                          <th className="py-2.5 px-3 text-center text-rose-800">Sức Khỏe Chuẩn (%)</th>
                          <th className="py-2.5 px-3 text-center text-sky-800">Hoạt Động Đạt (%)</th>
                          <th className="py-2.5 px-3 text-right text-amber-800">Tiền Hoàn Ăn (VNĐ)</th>
                          <th className="py-2.5 px-3 text-center">Trạng Thái BGH</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {classesOverview?.classes.map((cls, idx) => {
                          const snap = cls.metricsSnapshot;
                          const excusedDays = snap?.boarding?.excusedAbsentDays || snap?.attendance?.excusedDays || 0;
                          const refundAmt = snap?.boarding?.totalRefundAmount || excusedDays * 45000;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-3 font-black text-slate-800">
                                {cls.className} <span className="text-[10px] text-slate-400 font-normal">({cls.gradeName})</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700 font-bold">{cls.teacherName || "Chưa phân công"}</td>
                              <td className="py-2.5 px-3 text-center font-bold">{snap?.totalStudents || 0}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                                {snap?.attendance?.attendanceRate || 0}%
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-rose-700">
                                {snap?.health?.normalRate || 0}%
                              </td>
                              <td className="py-2.5 px-3 text-center font-bold text-sky-700">
                                {snap?.activities?.activityPassRate || 0}%
                              </td>
                              <td className="py-2.5 px-3 text-right font-black text-amber-800">
                                {refundAmt.toLocaleString("vi-VN")} đ
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                    cls.status === "APPROVED"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : cls.status === "SUBMITTED"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {cls.status === "APPROVED"
                                    ? "ĐÃ DUYỆT"
                                    : cls.status === "SUBMITTED"
                                    ? "CHỜ DUYỆT"
                                    : "ĐANG SOẠN"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
