"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";
import {
  ReportCalculatedMetrics,
  ReportRawData,
  REPORT_DEFINITIONS,
  exportToCsv,
} from "../types";
import { renderReportIcon } from "./ReportOverview";

export function ReportPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange?: (s: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 rounded-b-xl">
      <div className="flex items-center gap-2">
        <span>Hiển thị <strong>{start}</strong> - <strong>{end}</strong> / <strong>{totalItems}</strong> dòng</span>
        {onPageSizeChange && (
          <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-3">
            <span className="text-[11px] text-slate-400">Trang:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-semibold"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[11px] mr-1">Trang <strong>{currentPage}</strong>/{totalPages}</span>
        <button type="button" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)} className="p-1 rounded border bg-white disabled:opacity-40">
          <ChevronLeft size={14} />
        </button>
        <button type="button" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="p-1 rounded border bg-white disabled:opacity-40">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function TableBox({
  title, headers, rows, page, pageSize, totalItems, onPageChange, onPageSizeChange, onExportCsv,
}: {
  title: string; headers: string[]; rows: (React.ReactNode | string | number)[][];
  page: number; pageSize: number; totalItems: number;
  onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void; onExportCsv: () => void;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <button type="button" onClick={onExportCsv} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold cursor-pointer">
          <FileSpreadsheet size={13} /> Excel
        </button>
      </div>
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
            <tr>{headers.map((h, i) => <th key={i} className={`p-2.5 ${i === 0 ? "text-center w-12" : ""}`}>{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length > 0 ? rows.map((r, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50">{r.map((c, cIdx) => <td key={cIdx} className={`p-2.5 ${cIdx === 0 ? "text-center text-slate-400" : ""}`}>{c}</td>)}</tr>
            )) : <tr><td colSpan={headers.length} className="p-4 text-center text-slate-400 italic">Không có dữ liệu phát sinh.</td></tr>}
          </tbody>
        </table>
        <ReportPagination currentPage={page} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      </div>
    </>
  );
}

export function ReportDetailTables({
  metrics, data, selectedMonth, selectedYear,
}: {
  metrics: ReportCalculatedMetrics; data: ReportRawData; selectedMonth: number; selectedYear: number;
}) {
  const [activeTab, setActiveTab] = useState<string>("si_so_hoc_sinh");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const start = (page - 1) * pageSize;
  const suffix = `T${selectedMonth}_${selectedYear}`;

  const renderContent = () => {
    switch (activeTab) {
      case "si_so_hoc_sinh": {
        const list = metrics.classesBreakdown;
        return (
          <TableBox
            title={`Sĩ số (${metrics.scopeLabel}: ${metrics.totalStudents} học sinh / ${metrics.totalClasses} nhóm lớp)`}
            headers={["STT", "Lớp học", "Khối", "Sĩ số", "Nam/Nữ", "GV Chủ nhiệm"]}
            rows={list.slice(start, start + pageSize).map((c, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{c.name}</span>, c.gradeName,
              <span className="font-black text-blue-600">{c.studentCount}</span>, `${c.maleCount}N / ${c.femaleCount}F`, c.teacherName,
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Si_So", ["STT", "Lớp", "Khối", "Sĩ số", "Nam", "Nữ", "GVCN"], list.map((c, i) => [i + 1, c.name, c.gradeName, c.studentCount, c.maleCount, c.femaleCount, c.teacherName]), suffix)}
          />
        );
      }
      case "chuyen_can_diem_danh": {
        const list = metrics.classesBreakdown;
        return (
          <TableBox
            title={`Chuyên cần (${metrics.attendanceRate}% có mặt: ${metrics.presentCount}/${metrics.totalAttendance} lượt)`}
            headers={["STT", "Lớp", "Khối", "Sĩ số", "Phụ trách", "Đánh giá"]}
            rows={list.slice(start, start + pageSize).map((c, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{c.name}</span>, c.gradeName,
              <span className="font-bold text-blue-600">{c.studentCount}</span>, c.teacherName,
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Đạt chỉ tiêu ({metrics.attendanceRate}%)</span>,
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Chuyen_Can", ["Chỉ tiêu", "Số lượt", "Tỷ lệ"], [["Có mặt", metrics.presentCount, `${metrics.attendanceRate}%`], ["Vắng có phép", metrics.absentPermitted, "--"], ["Vắng không phép", metrics.absentUnpermitted, "--"]], suffix)}
          />
        );
      }
      case "theo_doi_suc_khoe": {
        const list = metrics.specialWatchList;
        return (
          <TableBox
            title={`Thể lực WHO (${metrics.normalHealth} bình thường, ${metrics.specialWatchCount} trẻ cần can thiệp)`}
            headers={["STT", "Học sinh", "Cao (cm)", "Nặng (kg)", "Đánh giá WHO", "Trạng thái theo dõi"]}
            rows={list.slice(start, start + pageSize).map((h, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{h.tenHocSinh || `Học sinh #${start + i + 1}`}</span>,
              h.chieuCao || "--", h.canNang || "--",
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">{h.ketLuanTongThe || "Cần theo dõi"}</span>,
              "Theo dõi sức khỏe định kỳ",
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("The_Luc_WHO", ["STT", "Học sinh", "Cao", "Nặng", "Thể trạng", "Ghi chú theo dõi"], list.map((h, i) => [i + 1, h.tenHocSinh || "Học sinh", h.chieuCao || "--", h.canNang || "--", h.ketLuanTongThe || "Theo dõi", "Theo dõi sức khỏe định kỳ"]), suffix)}
          />
        );
      }
      case "y_te_don_thuoc": {
        const list = metrics.relevantSpecialCond;
        return (
          <TableBox
            title={`Y tế đặc biệt (${list.length} ca bệnh lý, ${metrics.relevantMeds.length} đơn thuốc)`}
            headers={["STT", "Học sinh", "Bệnh lý / Dị ứng", "Mức độ", "Lưu ý chăm sóc"]}
            rows={list.slice(start, start + pageSize).map((s, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{s.TenHocSinh}</span>,
              <span className="font-bold text-rose-600">{s.TenBenh || s.LoaiBenh}</span>,
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">{s.MucDoNguyHiem === 3 ? "Nguy hiểm" : "Cần lưu ý"}</span>,
              s.LuuYAnUong || s.PhacDoSoCuu || "Theo dõi ăn uống",
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Y_Te", ["STT", "Học sinh", "Bệnh lý", "Mức độ", "Lưu ý"], list.map((s, i) => [i + 1, s.TenHocSinh, s.TenBenh || s.LoaiBenh, s.MucDoNguyHiem === 3 ? "Nguy hiểm" : "Lưu ý", s.LuuYAnUong || "--"]), suffix)}
          />
        );
      }
      case "ban_tru_hoan_tien_an": {
        const list = metrics.relevantMealStudents.filter((m) => m.deductionAmount > 0);
        return (
          <TableBox
            title={`Khấu trừ tiền ăn (${metrics.totalMealAbsentDays} ngày nghỉ, hoàn ${metrics.totalMealDeduction.toLocaleString("vi-VN")} đ)`}
            headers={["STT", "Học sinh", "Ngày nghỉ hợp lệ", "Tiền hoàn trả", "Phương thức"]}
            rows={list.slice(start, start + pageSize).map((m, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{m.studentName}</span>,
              <span className="font-bold text-amber-600">{m.absentDays} ngày</span>,
              <span className="font-black text-blue-600">{Number(m.deductionAmount).toLocaleString("vi-VN")} đ</span>,
              "Cấn trừ hóa đơn sau",
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Hoan_Tien_An", ["STT", "Học sinh", "Số ngày", "Tiền hoàn"], list.map((m, i) => [i + 1, m.studentName, m.absentDays, m.deductionAmount]), suffix)}
          />
        );
      }
      case "an_toan_dua_don": {
        const list = metrics.latePickups;
        return (
          <TableBox
            title={`An toàn đưa đón (${metrics.pickupRecordsCount} lượt, ${metrics.latePickupsCount} ca đón trễ)`}
            headers={["STT", "Học sinh", "Giờ về", "Người đón", "Ghi chú"]}
            rows={list.slice(start, start + pageSize).map((lp, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{lp.hocSinhId}</span>,
              <span className="font-bold text-rose-600">{String(lp.gioVe).slice(0, 5)}</span>, lp.nguoiDon || "Phụ huynh", lp.ghiChu || "Đón trễ",
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Don_Muon", ["STT", "Học sinh", "Giờ về", "Người đón"], list.map((lp, i) => [i + 1, lp.hocSinhId, lp.gioVe, lp.nguoiDon]), suffix)}
          />
        );
      }
      case "tai_chinh_hoc_phi": {
        const list = metrics.unpaidInvoices;
        return (
          <TableBox
            title={`Công nợ học phí (${metrics.unpaidInvoices.length} hóa đơn nợ, tổng ${metrics.totalOutstanding.toLocaleString("vi-VN")} đ)`}
            headers={["STT", "Khoản thu", "Học sinh", "Số tiền nợ", "Trạng thái"]}
            rows={list.slice(start, start + pageSize).map((inv, i) => [
              start + i + 1, inv.title || "Học phí", <span className="font-bold text-slate-900">{inv.studentName || "Học sinh"}</span>,
              <span className="font-black text-rose-600">{Number(inv.outstandingAmount || inv.totalAmount || 0).toLocaleString("vi-VN")} đ</span>,
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700">{inv.status || "Chưa đóng"}</span>,
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Cong_No", ["STT", "Khoản thu", "Học sinh", "Tiền nợ"], list.map((inv, i) => [i + 1, inv.title || "Học phí", inv.studentName || "Học sinh", inv.outstandingAmount || inv.totalAmount]), suffix)}
          />
        );
      }
      case "doi_ngu_nhan_su": {
        const list = data.staff;
        return (
          <TableBox
            title={`Cán bộ & Giáo viên (${metrics.totalStaff} nhân sự, ${metrics.activeStaff} đang công tác)`}
            headers={["STT", "Họ và tên", "Chức vụ", "Phòng ban", "Trạng thái"]}
            rows={list.slice(start, start + pageSize).map((st, i) => [
              start + i + 1, <span className="font-bold text-slate-800">{st.hoTen || st.fullName}</span>,
              st.chucVu || "Giáo viên", st.phongBan || "Khối mầm non",
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Đang công tác</span>,
            ])}
            page={page} pageSize={pageSize} totalItems={list.length} onPageChange={setPage} onPageSizeChange={setPageSize}
            onExportCsv={() => exportToCsv("Nhan_Su", ["STT", "Họ tên", "Chức vụ", "Phòng ban"], list.map((st, i) => [i + 1, st.hoTen, st.chucVu, st.phongBan]), suffix)}
          />
        );
      }
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {REPORT_DEFINITIONS.map((def) => (
          <button
            key={def.id}
            type="button"
            onClick={() => { setActiveTab(def.id); setPage(1); }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === def.id ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
            }`}
          >
            {renderReportIcon(def.iconName, 14)}
            <span>{def.badge}</span>
          </button>
        ))}
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        {renderContent()}
      </div>
    </div>
  );
}
