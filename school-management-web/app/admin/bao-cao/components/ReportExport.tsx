"use client";

import React, { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import {
  ReportCalculatedMetrics,
  ReportRawData,
  REPORT_DEFINITIONS,
} from "../types";

export function generateReportHtml(
  selectedReportIds: string[],
  metrics: ReportCalculatedMetrics,
  data: ReportRawData,
  selectedMonth: number,
  selectedYear: number,
): string {
  const selectedDefs = REPORT_DEFINITIONS.filter((r) => selectedReportIds.includes(r.id));
  const monthStr = `Tháng ${selectedMonth} năm ${selectedYear}`;

  const renderSection = (defId: string, idx: number) => {
    let body = "";
    if (defId === "si_so_hoc_sinh") {
      body = `
        <p>Phạm vi: <strong>${metrics.scopeLabel}</strong>. Tổng: <strong>${metrics.totalStudents}</strong> học sinh (${metrics.maleCount} Nam, ${metrics.femaleCount} Nữ) trên <strong>${metrics.totalClasses}</strong> lớp.</p>
        <table class="report-table">
          <thead><tr><th>STT</th><th>Lớp</th><th>Khối</th><th>Sĩ số</th><th>Tỷ lệ N/F</th><th>GVCN</th></tr></thead>
          <tbody>${metrics.classesBreakdown.map((c, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${c.name}</strong></td><td style="text-align:center">${c.gradeName}</td><td style="text-align:center; font-weight:bold">${c.studentCount}</td><td style="text-align:center">${c.maleCount}N/${c.femaleCount}F</td><td>${c.teacherName}</td></tr>`).join("")}</tbody>
        </table>`;
    } else if (defId === "chuyen_can_diem_danh") {
      body = `
        <p>Ghi nhận: <strong>${metrics.totalAttendance}</strong> lượt. Có mặt: <strong style="color:#16a34a">${metrics.presentCount} (${metrics.attendanceRate}%)</strong>. Nghỉ có phép: <strong>${metrics.absentPermitted}</strong>. Nghỉ không phép: <strong style="color:#dc2626">${metrics.absentUnpermitted}</strong>.</p>
        <table class="report-table">
          <thead><tr><th>Chỉ tiêu</th><th>Số lượt</th><th>Tỷ lệ</th><th>Đánh giá</th></tr></thead>
          <tbody>
            <tr><td>Có mặt</td><td style="text-align:center">${metrics.presentCount}</td><td style="text-align:center">${metrics.attendanceRate}%</td><td>Đạt chỉ tiêu chuyên cần</td></tr>
            <tr><td>Nghỉ có phép</td><td style="text-align:center">${metrics.absentPermitted}</td><td style="text-align:center">${metrics.totalAttendance > 0 ? ((metrics.absentPermitted / metrics.totalAttendance) * 100).toFixed(1) : 0}%</td><td>Đã duyệt đơn trực tuyến</td></tr>
            <tr><td>Nghỉ không phép</td><td style="text-align:center">${metrics.absentUnpermitted}</td><td style="text-align:center">${metrics.totalAttendance > 0 ? ((metrics.absentUnpermitted / metrics.totalAttendance) * 100).toFixed(1) : 0}%</td><td>Cần GV liên hệ gia đình</td></tr>
          </tbody>
        </table>`;
    } else if (defId === "theo_doi_suc_khoe") {
      body = `
        <p>Thể lực WHO: <strong>${metrics.normalHealth}</strong> bình thường, <strong>${metrics.specialWatchCount}</strong> cần can thiệp dinh dưỡng.</p>
        ${metrics.specialWatchList.length > 0 ? `
          <table class="report-table">
            <thead><tr><th>STT</th><th>Học sinh</th><th>Cao</th><th>Nặng</th><th>Đánh giá WHO</th><th>Trạng thái theo dõi</th></tr></thead>
            <tbody>${metrics.specialWatchList.slice(0, 25).map((h, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${h.tenHocSinh || `Học sinh #${i + 1}`}</strong></td><td style="text-align:center">${h.chieuCao || "--"}</td><td style="text-align:center">${h.canNang || "--"}</td><td style="color:#ea580c; font-weight:bold">${h.ketLuanTongThe || "Cần theo dõi"}</td><td>Theo dõi sức khỏe định kỳ</td></tr>`).join("")}</tbody>
          </table>` : `<p style="color:#16a34a">100% trẻ có thể lực bình thường theo chuẩn WHO.</p>`}`;
    } else if (defId === "y_te_don_thuoc") {
      body = `
        <p>Ghi nhận: <strong>${metrics.relevantSpecialCond.length}</strong> ca bệnh lý đặc biệt / dị ứng và <strong>${metrics.relevantMeds.length}</strong> đơn thuốc gửi trong kỳ.</p>
        ${metrics.relevantSpecialCond.length > 0 ? `
          <table class="report-table">
            <thead><tr><th>STT</th><th>Học sinh</th><th>Bệnh lý / Dị ứng</th><th>Mức độ</th><th>Lưu ý</th></tr></thead>
            <tbody>${metrics.relevantSpecialCond.map((s, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${s.TenHocSinh}</strong></td><td style="color:#dc2626; font-weight:bold">${s.TenBenh || s.LoaiBenh}</td><td style="text-align:center">${s.MucDoNguyHiem === 3 ? "Nguy hiểm" : "Lưu ý"}</td><td>${s.LuuYAnUong || s.PhacDoSoCuu || "Theo dõi"}</td></tr>`).join("")}</tbody>
          </table>` : `<p style="color:#16a34a">Không có trẻ nào mắc bệnh lý nền nguy hiểm.</p>`}`;
    } else if (defId === "ban_tru_hoan_tien_an") {
      const msList = metrics.relevantMealStudents.filter((m) => m.deductionAmount > 0);
      body = `
        <p>Quyết toán hoàn tiền ăn (45.000 đ/ngày): <strong>${metrics.totalMealAbsentDays}</strong> ngày nghỉ, tổng hoàn trả: <strong style="color:#0284c7">${metrics.totalMealDeduction.toLocaleString("vi-VN")} đ</strong>.</p>
        ${msList.length > 0 ? `
          <table class="report-table">
            <thead><tr><th>STT</th><th>Học sinh</th><th>Lớp</th><th>Ngày nghỉ</th><th>Tiền hoàn</th><th>Xử lý</th></tr></thead>
            <tbody>${msList.slice(0, 25).map((m, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${m.studentName}</strong></td><td style="text-align:center">${m.className || "--"}</td><td style="text-align:center">${m.absentDays} ngày</td><td style="text-align:right; font-weight:bold; color:#0284c7">${Number(m.deductionAmount).toLocaleString("vi-VN")} đ</td><td style="text-align:center">Trừ vào hóa đơn sau</td></tr>`).join("")}</tbody>
          </table>` : `<p>Không phát sinh hoàn tiền ăn trong kỳ.</p>`}`;
    } else if (defId === "an_toan_dua_don") {
      body = `
        <p>Tổng: <strong>${metrics.pickupRecordsCount}</strong> lượt đưa đón | Ca đón muộn sau 17h00: <strong style="color:#ea580c">${metrics.latePickupsCount}</strong> lượt.</p>
        ${metrics.latePickups.length > 0 ? `
          <table class="report-table">
            <thead><tr><th>STT</th><th>Học sinh</th><th>Giờ về</th><th>Người đón</th><th>Ghi chú</th></tr></thead>
            <tbody>${metrics.latePickups.slice(0, 20).map((lp, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${lp.hocSinhId}</strong></td><td style="text-align:center; color:#ea580c; font-weight:bold">${String(lp.gioVe).slice(0, 5)}</td><td>${lp.nguoiDon || "Phụ huynh"}</td><td>${lp.ghiChu || "Đón trễ"}</td></tr>`).join("")}</tbody>
          </table>` : `<p style="color:#16a34a">100% học sinh được trả trẻ đúng giờ quy định.</p>`}`;
    } else if (defId === "tai_chinh_hoc_phi") {
      body = `
        <p>Phát hành: <strong>${metrics.totalInvoiced.toLocaleString("vi-VN")} đ</strong> | Đã thu: <strong style="color:#16a34a">${metrics.totalCollected.toLocaleString("vi-VN")} đ</strong> | Còn nợ: <strong style="color:#dc2626">${metrics.totalOutstanding.toLocaleString("vi-VN")} đ</strong> (${metrics.unpaidInvoices.length} hóa đơn).</p>
        ${metrics.unpaidInvoices.length > 0 ? `
          <table class="report-table">
            <thead><tr><th>STT</th><th>Học sinh</th><th>Khoản thu</th><th>Số tiền nợ</th><th>Trạng thái</th></tr></thead>
            <tbody>${metrics.unpaidInvoices.slice(0, 25).map((inv, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${inv.studentName || "Học sinh"}</strong></td><td>${inv.title || "Học phí"}</td><td style="text-align:right; color:#dc2626; font-weight:bold">${Number(inv.outstandingAmount || inv.totalAmount || 0).toLocaleString("vi-VN")} đ</td><td style="text-align:center">${inv.status || "Chưa đóng"}</td></tr>`).join("")}</tbody>
          </table>` : `<p style="color:#16a34a">Đã hoàn thành nghĩa vụ học phí, không còn công nợ tồn đọng.</p>`}`;
    } else if (defId === "doi_ngu_nhan_su") {
      body = `
        <p>Tổng nhân sự: <strong>${metrics.totalStaff}</strong> cán bộ, giáo viên (${metrics.activeStaff} đang công tác).</p>
        <table class="report-table">
          <thead><tr><th>STT</th><th>Họ và tên</th><th>Chức vụ</th><th>Phòng ban</th><th>Trạng thái</th></tr></thead>
          <tbody>${data.staff.map((s, i) => `<tr><td style="text-align:center">${i + 1}</td><td><strong>${s.hoTen || s.fullName}</strong></td><td>${s.chucVu || "Giáo viên"}</td><td>${s.phongBan || "Khối mầm non"}</td><td style="text-align:center">${s.trangThai === 1 || s.status === "Active" ? "Đang công tác" : "Nghỉ"}</td></tr>`).join("")}</tbody>
        </table>`;
    }

    return `
      <div class="report-section" style="page-break-inside: avoid; margin-bottom: 20px;">
        <h2 style="font-size:11.5pt; color:#0f172a; border-bottom:2px solid #0284c7; padding-bottom:3px; margin-bottom:8px; text-transform:uppercase;">
          ${idx + 1}. ${REPORT_DEFINITIONS.find((r) => r.id === defId)?.title || defId}
        </h2>
        <div style="font-size:10pt; line-height:1.45; color:#334155;">${body}</div>
      </div>
    `;
  };

  const sectionsHtml = selectedDefs.map((def, idx) => renderSection(def.id, idx)).join("");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo Cáo Quản Trị - ${metrics.scopeLabel} - ${monthStr}</title>
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm 16mm 14mm; }
    body { font-family: 'Times New Roman', Times, serif; color: #0f172a; background: #fff; margin: 0; padding: 15px; font-size: 11pt; line-height: 1.45; }
    .header-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .header-table td { vertical-align: top; padding: 0; }
    .title-block { text-align: center; margin: 12px 0 16px 0; }
    .title-block h1 { font-size: 14pt; font-weight: bold; text-transform: uppercase; margin: 0 0 4px 0; }
    .title-block .scope { font-size: 11pt; font-weight: bold; color: #0284c7; text-transform: uppercase; margin: 2px 0; }
    .title-block p { font-size: 10pt; font-style: italic; margin: 0; color: #475569; }
    .report-table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 9.5pt; }
    .report-table th, .report-table td { border: 1px solid #475569; padding: 4px 6px; }
    .report-table th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
    .signature-table { width: 100%; border-collapse: collapse; margin-top: 25px; page-break-inside: avoid; }
    .signature-table td { text-align: center; vertical-align: top; width: 25%; font-size: 9.5pt; }
    @media print { body { padding: 0; } .no-print { display: none !important; } }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 45%; text-align: center;">
        <p style="margin:0; font-size:10pt; font-weight:bold;">TRƯỜNG MẦM NON BÉ NGOAN</p>
        <p style="margin:0; font-size:9pt; font-style:italic;">Bộ phận Quản lý & Bán trú</p>
        <div style="width: 100px; height: 1px; background: #000; margin: 2px auto 0 auto;"></div>
      </td>
      <td style="width: 55%; text-align: center;">
        <p style="margin:0; font-size:10pt; font-weight:bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p style="margin:0; font-size:10pt; font-weight:bold;">Độc lập - Tự do - Hạnh phúc</p>
        <div style="width: 140px; height: 1px; background: #000; margin: 2px auto 0 auto;"></div>
      </td>
    </tr>
  </table>
  <div class="title-block">
    <h1>BÁO CÁO TỔNG HỢP QUẢN TRỊ MẦM NON</h1>
    <div class="scope">PHẠM VI: ${metrics.scopeLabel.toUpperCase()}</div>
    <p>Kỳ báo cáo: ${monthStr} | Xuất ngày: ${new Date().toLocaleDateString("vi-VN")}</p>
  </div>
  ${sectionsHtml}
  <table class="signature-table">
    <tr><td colspan="4" style="text-align: right; font-style: italic; padding-bottom: 6px;">TP. Hồ Chí Minh, ngày ${new Date().getDate()} tháng ${selectedMonth} năm ${selectedYear}</td></tr>
    <tr style="font-weight: bold;"><td>NGƯỜI LẬP BIỂU</td><td>KẾ TOÁN TRƯỞNG</td><td>CÁN BỘ Y TẾ</td><td>HIỆU TRƯỞNG DUYỆT</td></tr>
    <tr style="font-style: italic; font-size: 8.5pt; color: #64748b;"><td>(Ký, họ tên)</td><td>(Ký, họ tên)</td><td>(Ký, họ tên)</td><td>(Ký tên, đóng dấu)</td></tr>
    <tr><td style="height: 50px;"></td><td style="height: 50px;"></td><td style="height: 50px;"></td><td style="height: 50px;"></td></tr>
    <tr style="font-weight: bold; font-size: 9pt;"><td>Bộ phận Quản trị</td><td>Tổ Tài chính</td><td>Y tế học đường</td><td>Ban Giám Hiệu</td></tr>
  </table>
</body>
</html>`;
}

export function printOrDownloadPdf(htmlContent: string) {
  const win = window.open("", "_blank");
  if (!win) {
    alert("Vui lòng cho phép mở popup để in / lưu PDF.");
    return;
  }
  win.document.open();
  win.document.write(htmlContent);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}

export function ReportPreviewModal({
  isOpen, onClose, htmlContent, onDownloadPdf, selectedCount,
}: {
  isOpen: boolean; onClose: () => void; htmlContent: string; onDownloadPdf: () => void; selectedCount: number;
}) {
  const [zoom, setZoom] = useState(100);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="w-full max-w-5xl max-h-[92vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between p-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700"><FileText size={16} /></div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800">Xem trước báo cáo đa trang ({selectedCount} báo cáo)</h3>
              <p className="text-[10px] text-slate-500">Mô phỏng khổ giấy in chuẩn A4 đa trang theo quy chuẩn hành chính</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <button type="button" onClick={() => setZoom((z) => Math.max(70, z - 10))} className="px-1.5 font-bold">-</button>
              <span className="w-10 text-center font-semibold">{zoom}%</span>
              <button type="button" onClick={() => setZoom((z) => Math.min(130, z + 10))} className="px-1.5 font-bold">+</button>
            </div>
            <button type="button" onClick={onDownloadPdf} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer">
              <Download size={13} /> In / Lưu PDF
            </button>
            <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/80">
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }} className="max-w-3xl mx-auto transition-transform">
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-lg border border-slate-300 min-h-[1050px]" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </div>
      </div>
    </div>
  );
}
