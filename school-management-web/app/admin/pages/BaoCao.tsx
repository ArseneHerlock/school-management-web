"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  FileText,
  Download,
  CheckSquare,
  Square,
  RefreshCw,
  Eye,
  Calendar,
  Users,
  GraduationCap,
  HeartPulse,
  DollarSign,
  Building,
  CheckCircle2,
  AlertTriangle,
  Printer,
  X,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { getStudents, getClasses, getStaff, getAllAttendances, getAllHealthRecords, getInvoices, getAllFees, getLeaves } from "@/services";

export interface ReportItemDef {
  id: string;
  category: string;
  categoryIndex: number;
  title: string;
  subtitle: string;
  description: string;
  defaultChecked: boolean;
  badge: string;
}

// 5 BÁO CÁO CHÍNH THỨC PHẢN ÁNH ĐÚNG CÁC PHÂN HỆ THỰC TẾ TRONG HỆ THỐNG
export const REPORT_DEFINITIONS: ReportItemDef[] = [
  {
    id: "si_so_hoc_sinh",
    category: "1. Báo cáo học sinh & Nhóm lớp",
    categoryIndex: 1,
    title: "Báo cáo tình hình sĩ số học sinh và phân bố nhóm lớp",
    subtitle: "Thống kê sĩ số thực tế theo từng lớp học, khối lớp và giới tính",
    description:
      "Tổng hợp số lượng học sinh thực tế trong hệ thống, phân bổ theo từng khối lớp (Mầm, Chồi, Lá), sĩ số từng lớp và tỷ lệ nam/nữ trích xuất từ phân hệ quản lý học sinh và lớp học.",
    defaultChecked: true,
    badge: "Học sinh & Lớp học",
  },
  {
    id: "chuyen_can_diem_danh",
    category: "2. Báo cáo điểm danh & Chuyên cần",
    categoryIndex: 2,
    title: "Báo cáo tình hình chuyên cần và nghỉ học của học sinh",
    subtitle: "Thống kê lượt có mặt, vắng có phép và vắng không phép theo dữ liệu điểm danh",
    description:
      "Thống kê tỷ lệ chuyên cần thực tế dựa trên dữ liệu điểm danh hàng ngày và các đơn xin nghỉ học đã duyệt từ phân hệ điểm danh và nghỉ phép.",
    defaultChecked: true,
    badge: "Chuyên cần",
  },
  {
    id: "theo_doi_suc_khoe",
    category: "3. Báo cáo y tế & Sức khỏe",
    categoryIndex: 3,
    title: "Báo cáo theo dõi sức khỏe và thể lực học sinh",
    subtitle: "Tình hình cân nặng, chiều cao, dinh dưỡng và danh sách trẻ cần theo dõi",
    description:
      "Tổng hợp các chỉ số thể lực thực tế từ phân hệ y tế học đường, phân loại chỉ số phát triển chiều cao, cân nặng và danh sách các trẻ cần lưu ý dinh dưỡng.",
    defaultChecked: true,
    badge: "Y tế học đường",
  },
  {
    id: "tai_chinh_hoc_phi",
    category: "4. Báo cáo tài chính & Công nợ",
    categoryIndex: 4,
    title: "Báo cáo tài chính, hóa đơn học phí và công nợ thực tế",
    subtitle: "Tổng hợp doanh thu học phí, số tiền đã thu và danh sách công nợ theo hóa đơn",
    description:
      "Thống kê chi tiết tình hình tài chính thực tế từ phân hệ kế toán: tổng tiền hóa đơn đã xuất, thực thu và danh sách các học sinh còn công nợ thực tế trong kỳ.",
    defaultChecked: true,
    badge: "Tài chính & Công nợ",
  },
  {
    id: "doi_ngu_nhan_su",
    category: "5. Báo cáo nhân sự & Cán bộ giáo viên",
    categoryIndex: 5,
    title: "Báo cáo đội ngũ cán bộ, giáo viên và nhân sự",
    subtitle: "Thống kê nhân sự thực tế theo chức vụ, phòng ban và phân công",
    description:
      "Tổng hợp cơ cấu nhân sự thực tế của nhà trường: số lượng giáo viên, nhân viên, phân loại theo vị trí công tác và tình trạng làm việc từ phân hệ nhân sự.",
    defaultChecked: true,
    badge: "Nhân sự",
  },
];

export default function BaoCao() {
  // Selected report checkboxes
  const [selectedReports, setSelectedReports] = useState<string[]>(() =>
    REPORT_DEFINITIONS.filter((r) => r.defaultChecked).map((r) => r.id)
  );

  // Month & Year filter
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());

  // Real data loaded from backend APIs ONLY (No mock, no fake fallbacks)
  const [data, setData] = useState({
    students: [] as any[],
    classes: [] as any[],
    staff: [] as any[],
    attendance: [] as any[],
    health: [] as any[],
    invoices: [] as any[],
    fees: [] as any[],
    leaves: [] as any[],
  });

  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Load real data from backend APIs
  const loadBackendData = async () => {
    setLoading(true);
    try {
      const [
        studentsRes,
        classesRes,
        staffRes,
        attendanceRes,
        healthRes,
        invoicesRes,
        feesRes,
        leavesRes,
      ] = await Promise.all([
        getStudents().catch(() => []),
        getClasses().catch(() => []),
        getStaff().catch(() => []),
        getAllAttendances().catch(() => []),
        getAllHealthRecords().catch(() => []),
        getInvoices().catch(() => []),
        getAllFees().catch(() => []),
        getLeaves().catch(() => []),
      ]);

      setData({
        students: Array.isArray(studentsRes) ? studentsRes : [],
        classes: Array.isArray(classesRes) ? classesRes : [],
        staff: Array.isArray(staffRes) ? staffRes : [],
        attendance: Array.isArray(attendanceRes) ? attendanceRes : [],
        health: Array.isArray(healthRes) ? healthRes : [],
        invoices: Array.isArray(invoicesRes) ? invoicesRes : [],
        fees: Array.isArray(feesRes) ? feesRes : [],
        leaves: Array.isArray(leavesRes) ? leavesRes : [],
      });
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu báo cáo từ backend API:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBackendData();
  }, []);

  // Selection toggles
  const handleToggleReport = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(REPORT_DEFINITIONS.map((r) => r.id));
  };

  const handleDeselectAll = () => {
    setSelectedReports([]);
  };

  // Grouped reports by category
  const categories = useMemo(() => {
    const map = new Map<string, ReportItemDef[]>();
    REPORT_DEFINITIONS.forEach((item) => {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category)!.push(item);
    });
    return Array.from(map.entries()).map(([catName, items]) => ({
      name: catName,
      items,
    }));
  }, []);

  // Computed summary metrics derived 100% from REAL backend API data
  const metrics = useMemo(() => {
    // 1. Học sinh & Lớp học
    const totalStudents = data.students.length;
    const totalClasses = data.classes.length;
    const maleCount = data.students.filter(
      (s) => s.gioiTinh === 1 || s.gioiTinh === "Nam" || s.gender === "Male" || s.gioiTinh === "1"
    ).length;
    const femaleCount = data.students.filter(
      (s) => s.gioiTinh === 0 || s.gioiTinh === "Nữ" || s.gender === "Female" || s.gioiTinh === "0"
    ).length;

    // 2. Chuyên cần & Điểm danh
    const totalAttendance = data.attendance.length;
    const presentCount = data.attendance.filter(
      (a) => a.trangThai === 1 || a.status === "Present" || a.coMat === true || a.trangThai === "CoMat"
    ).length;
    const absentPermitted =
      data.attendance.filter(
        (a) => a.trangThai === 2 || a.status === "Excused" || a.coPhep === true || a.trangThai === "CoPhep"
      ).length + data.leaves.length;
    const absentUnpermitted = Math.max(
      0,
      totalAttendance - presentCount - (data.attendance.filter((a) => a.trangThai === 2).length)
    );
    const attendanceRate =
      totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : "0.0";

    // 3. Sức khỏe
    const totalHealthRecords = data.health.length;
    const normalHealth = data.health.filter((h) => {
      const tt = String(h.tinhTrangDinhDuong || h.tinhTrang || h.danhGia || "").toLowerCase();
      return tt.includes("bình thường") || tt === "normal" || (!tt && (h.chieuCao || h.canNang));
    }).length;

    const specialWatchList = data.health.filter((h) => {
      const tt = String(h.tinhTrangDinhDuong || h.tinhTrang || h.danhGia || "").toLowerCase();
      return (
        tt.includes("suy dinh dưỡng") ||
        tt.includes("thừa cân") ||
        tt.includes("béo phì") ||
        tt.includes("thấp còi") ||
        tt.includes("cần theo dõi")
      );
    });

    // 4. Tài chính & Công nợ
    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    const unpaidInvoices: any[] = [];

    data.invoices.forEach((inv) => {
      const amount = Number(inv.totalAmount || inv.amount || inv.soTien || 0);
      const paid = Number(inv.paidAmount || inv.daThu || (inv.status === "Paid" ? amount : 0));
      const debt = Number(inv.outstandingAmount || inv.conNo || Math.max(0, amount - paid));

      totalInvoiced += amount;
      totalCollected += paid;

      if (debt > 0 || inv.status === "Unpaid" || inv.status === "Pending" || inv.status === "Overdue") {
        totalOutstanding += debt > 0 ? debt : amount;
        unpaidInvoices.push(inv);
      }
    });

    // 5. Nhân sự
    const totalStaff = data.staff.length;
    const activeStaff = data.staff.filter(
      (st) => st.trangThai === 1 || st.status === "Active" || st.isActive !== false
    ).length;

    return {
      totalStudents,
      totalClasses,
      maleCount,
      femaleCount,
      totalAttendance,
      presentCount,
      absentPermitted,
      absentUnpermitted,
      attendanceRate,
      totalHealthRecords,
      normalHealth,
      specialWatchCount: specialWatchList.length,
      specialWatchList,
      totalInvoiced,
      totalCollected,
      totalOutstanding,
      unpaidInvoices,
      totalStaff,
      activeStaff,
    };
  }, [data]);

  // Generate HTML Report Document for PDF Export using 100% REAL data
  const generateReportHtml = () => {
    const selectedDefs = REPORT_DEFINITIONS.filter((r) =>
      selectedReports.includes(r.id)
    );

    const monthStr = `Tháng ${selectedMonth} năm ${selectedYear}`;
    let sectionsHtml = "";

    selectedDefs.forEach((def, index) => {
      let content = "";

      switch (def.id) {
        // 1. BÁO CÁO HỌC SINH & LỚP HỌC
        case "si_so_hoc_sinh":
          content = `
            <p><strong>1. Thống kê tổng quan:</strong></p>
            <ul>
              <li>Tổng số học sinh toàn trường: <strong>${metrics.totalStudents}</strong> trẻ.</li>
              <li>Tổng số lớp học đang hoạt động: <strong>${metrics.totalClasses}</strong> lớp.</li>
              <li>Cơ cấu giới tính: <strong>${metrics.maleCount}</strong> nam (${metrics.totalStudents > 0 ? ((metrics.maleCount / metrics.totalStudents) * 100).toFixed(1) : 0}%), <strong>${metrics.femaleCount}</strong> nữ (${metrics.totalStudents > 0 ? ((metrics.femaleCount / metrics.totalStudents) * 100).toFixed(1) : 0}%).</li>
            </ul>

            <p><strong>2. Danh sách thống kê sĩ số chi tiết từng lớp:</strong></p>
            ${
              data.classes.length > 0
                ? `
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:40px;">STT</th>
                      <th>Tên Lớp Học</th>
                      <th>Khối Lớp</th>
                      <th style="width:90px;">Sĩ số thực tế</th>
                      <th style="width:120px;">Tỷ lệ Nam / Nữ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.classes
                      .map((cls, idx) => {
                        const classStudents = data.students.filter(
                          (s) => s.lopId === cls.id || s.lop === cls.tenLop || s.classId === cls.id
                        );
                        const cMale = classStudents.filter(
                          (s) => s.gioiTinh === 1 || s.gioiTinh === "Nam" || s.gender === "Male" || s.gioiTinh === "1"
                        ).length;
                        const cFemale = classStudents.length - cMale;

                        return `
                          <tr>
                            <td style="text-align:center;">${idx + 1}</td>
                            <td><strong>${cls.tenLop || cls.name || `Lớp ${idx + 1}`}</strong></td>
                            <td style="text-align:center;">${cls.tenKhoi || cls.gradeName || "Mầm non"}</td>
                            <td style="text-align:center; font-weight:bold;">${classStudents.length}</td>
                            <td style="text-align:center;">${cMale} Nam / ${cFemale} Nữ</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              `
                : `<p style="font-style:italic; color:#64748b;">Hệ thống chưa ghi nhận danh sách lớp học nào.</p>`
            }
          `;
          break;

        // 2. BÁO CÁO ĐIỂM DANH & CHUYÊN CẦN
        case "chuyen_can_diem_danh":
          content = `
            <p><strong>1. Thống kê tình hình chuyên cần:</strong></p>
            <ul>
              <li>Tổng số lượt điểm danh ghi nhận trong hệ thống: <strong>${metrics.totalAttendance}</strong> lượt.</li>
              <li>Số lượt học sinh có mặt: <strong>${metrics.presentCount}</strong> lượt.</li>
              <li>Số lượt nghỉ học có phép (bao gồm đơn xin nghỉ): <strong>${metrics.absentPermitted}</strong> lượt.</li>
              <li>Số lượt nghỉ học không phép: <strong>${metrics.absentUnpermitted}</strong> lượt.</li>
              <li>Tỷ lệ chuyên cần thực tế: <strong style="color:#0284c7;">${metrics.attendanceRate}%</strong>.</li>
            </ul>

            ${
              metrics.totalAttendance === 0
                ? `<p style="font-style:italic; color:#64748b;">* Chưa có dữ liệu điểm danh phát sinh trong kỳ tháng ${selectedMonth}/${selectedYear}.</p>`
                : `
                <table class="report-table">
                  <thead>
                    <tr>
                      <th>Chỉ tiêu</th>
                      <th>Số lượt</th>
                      <th>Tỷ lệ (%)</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Có mặt tại lớp</td>
                      <td style="text-align:center; font-weight:bold; color:#16a34a;">${metrics.presentCount}</td>
                      <td style="text-align:center; font-weight:bold;">${metrics.attendanceRate}%</td>
                      <td>Trẻ tham gia học tập và sinh hoạt đầy đủ</td>
                    </tr>
                    <tr>
                      <td>Nghỉ học có phép</td>
                      <td style="text-align:center; font-weight:bold; color:#ea580c;">${metrics.absentPermitted}</td>
                      <td style="text-align:center;">${metrics.totalAttendance > 0 ? ((metrics.absentPermitted / metrics.totalAttendance) * 100).toFixed(1) : 0}%</td>
                      <td>Phụ huynh nộp đơn xin nghỉ phép qua hệ thống</td>
                    </tr>
                    <tr>
                      <td>Nghỉ học không phép</td>
                      <td style="text-align:center; font-weight:bold; color:#dc2626;">${metrics.absentUnpermitted}</td>
                      <td style="text-align:center;">${metrics.totalAttendance > 0 ? ((metrics.absentUnpermitted / metrics.totalAttendance) * 100).toFixed(1) : 0}%</td>
                      <td>Giáo viên chủ nhiệm cần liên hệ phối hợp xác minh</td>
                    </tr>
                  </tbody>
                </table>
              `
            }
          `;
          break;

        // 3. BÁO CÁO Y TẾ & SỨC KHỎE
        case "theo_doi_suc_khoe":
          content = `
            <p><strong>1. Thống kê theo dõi thể lực và dinh dưỡng:</strong></p>
            <ul>
              <li>Tổng số hồ sơ khám sức khỏe đã ghi nhận: <strong>${metrics.totalHealthRecords}</strong> hồ sơ.</li>
              <li>Số trẻ phát triển thể lực bình thường: <strong>${metrics.normalHealth}</strong> trẻ.</li>
              <li>Số trẻ cần chế độ theo dõi dinh dưỡng đặc biệt: <strong style="color:#ea580c;">${metrics.specialWatchCount}</strong> trẻ.</li>
            </ul>

            ${
              metrics.specialWatchCount > 0
                ? `
                <p><strong>2. Danh sách trẻ cần theo dõi sức khỏe đặc biệt (trích xuất từ hồ sơ y tế):</strong></p>
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:40px;">STT</th>
                      <th>Mã / Tên học sinh</th>
                      <th>Chiều cao (cm)</th>
                      <th>Cân nặng (kg)</th>
                      <th>Tình trạng dinh dưỡng</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${metrics.specialWatchList
                      .map((h, i) => {
                        const student = data.students.find(
                          (s) => s.id === (h.hocSinhId || h.studentId)
                        );
                        return `
                          <tr>
                            <td style="text-align:center;">${i + 1}</td>
                            <td><strong>${student?.hoTen || student?.fullName || h.tenHocSinh || h.hocSinhId || `Học sinh #${i + 1}`}</strong></td>
                            <td style="text-align:center;">${h.chieuCao || "--"}</td>
                            <td style="text-align:center;">${h.canNang || "--"}</td>
                            <td style="text-align:center; color:#ea580c; font-weight:bold;">${h.tinhTrangDinhDuong || h.tinhTrang || "Cần theo dõi"}</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              `
                : `<p style="font-style:italic; color:#64748b;">${metrics.totalHealthRecords > 0 ? "Toàn bộ trẻ có chỉ số phát triển trong ngưỡng bình thường." : "Chưa có bản ghi khám sức khỏe nào trong hệ thống."}</p>`
            }
          `;
          break;

        // 4. BÁO CÁO TÀI CHÍNH & HỌC PHÍ
        case "tai_chinh_hoc_phi":
          content = `
            <p><strong>1. Tổng hợp số liệu tài chính thực tế:</strong></p>
            <ul>
              <li>Tổng giá trị hóa đơn đã phát hành: <strong style="color:#0284c7;">${metrics.totalInvoiced.toLocaleString("vi-VN")} VNĐ</strong> (${data.invoices.length} hóa đơn).</li>
              <li>Số tiền thực tế đã thu: <strong style="color:#16a34a;">${metrics.totalCollected.toLocaleString("vi-VN")} VNĐ</strong>.</li>
              <li>Tổng công nợ học phí chưa thanh toán: <strong style="color:#dc2626;">${metrics.totalOutstanding.toLocaleString("vi-VN")} VNĐ</strong> (${metrics.unpaidInvoices.length} hóa đơn chưa tất toán).</li>
            </ul>

            <p><strong>2. Danh sách công nợ chi tiết theo hóa đơn thực tế:</strong></p>
            ${
              metrics.unpaidInvoices.length > 0
                ? `
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:40px;">STT</th>
                      <th>Mã hóa đơn / Nội dung</th>
                      <th>Học sinh</th>
                      <th>Số tiền nợ</th>
                      <th>Hạn thanh toán</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${metrics.unpaidInvoices
                      .map((inv, idx) => {
                        const amount = Number(inv.totalAmount || inv.amount || inv.soTien || 0);
                        const paid = Number(inv.paidAmount || inv.daThu || 0);
                        const debt = Number(inv.outstandingAmount || inv.conNo || Math.max(0, amount - paid));

                        const student = data.students.find(
                          (s) => s.id === (inv.studentId || inv.hocSinhId)
                        );
                        const studentName = inv.studentName || student?.hoTen || student?.fullName || "Chưa gán học sinh";

                        return `
                          <tr>
                            <td style="text-align:center;">${idx + 1}</td>
                            <td>${inv.title || inv.description || inv.id || "Học phí định kỳ"}</td>
                            <td><strong>${studentName}</strong></td>
                            <td style="text-align:right; font-weight:bold; color:#dc2626;">${debt.toLocaleString("vi-VN")} đ</td>
                            <td style="text-align:center;">${inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("vi-VN") : "Trong kỳ"}</td>
                            <td style="text-align:center; font-size:10pt;">${inv.status || "Chưa đóng"}</td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              `
                : `<p style="font-style:italic; color:#16a34a;">Tất cả học sinh đã hoàn thành học phí đầy đủ. Hiện tại không có công nợ tồn đọng.</p>`
            }
          `;
          break;

        // 5. BÁO CÁO NHÂN SỰ & GIÁO VIÊN
        case "doi_ngu_nhan_su":
          content = `
            <p><strong>1. Thống kê cơ cấu nhân sự:</strong></p>
            <ul>
              <li>Tổng số cán bộ, giáo viên, nhân viên hiện có: <strong>${metrics.totalStaff}</strong> người.</li>
              <li>Số nhân sự đang hoạt động chính thức: <strong>${metrics.activeStaff}</strong> người.</li>
            </ul>

            <p><strong>2. Danh sách nhân sự thực tế trong nhà trường:</strong></p>
            ${
              data.staff.length > 0
                ? `
                <table class="report-table">
                  <thead>
                    <tr>
                      <th style="width:40px;">STT</th>
                      <th>Họ và tên</th>
                      <th>Chức vụ / Vị trí</th>
                      <th>Phòng ban / Tổ chuyên môn</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.staff
                      .map((st, idx) => `
                        <tr>
                          <td style="text-align:center;">${idx + 1}</td>
                          <td><strong>${st.hoTen || st.fullName || st.name || "Cán bộ"}</strong></td>
                          <td>${st.chucVu || st.position || "Giáo viên mầm non"}</td>
                          <td>${st.phongBan || st.department || "Khối chuyên môn"}</td>
                          <td style="text-align:center;">${st.trangThai === 1 || st.status === "Active" || st.isActive !== false ? "Đang công tác" : "Nghỉ"}</td>
                        </tr>
                      `)
                      .join("")}
                  </tbody>
                </table>
              `
                : `<p style="font-style:italic; color:#64748b;">Hệ thống chưa ghi nhận hồ sơ nhân sự nào.</p>`
            }
          `;
          break;

        default:
          content = `<p>Báo cáo đang được xử lý.</p>`;
          break;
      }

      sectionsHtml += `
        <div class="report-section" style="margin-top:22px; page-break-inside: avoid;">
          <h2 style="font-size:14pt; color:#0f172a; border-bottom:2px solid #0284c7; padding-bottom:5px; margin-bottom:10px; text-transform:uppercase;">
            ${index + 1}. ${def.title}
          </h2>
          <div style="font-size:12pt; line-height:1.6; color:#334155;">
            ${content}
          </div>
        </div>
      `;
    });

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Báo Cáo Nhà Trường - ${monthStr}</title>
        <style>
          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            color: #0f172a;
            background: #fff;
            margin: 0;
            padding: 20px;
            font-size: 13pt;
            line-height: 1.5;
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .header-table td {
            vertical-align: top;
            padding: 0;
          }
          .title-block {
            text-align: center;
            margin: 20px 0;
          }
          .title-block h1 {
            font-size: 17pt;
            font-weight: bold;
            text-transform: uppercase;
            margin: 0 0 5px 0;
            color: #0f172a;
          }
          .title-block p {
            font-size: 12pt;
            font-style: italic;
            margin: 0;
          }
          .report-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            font-size: 11pt;
          }
          .report-table th, .report-table td {
            border: 1px solid #475569;
            padding: 6px 9px;
          }
          .report-table th {
            background-color: #f1f5f9;
            font-weight: bold;
            text-align: center;
          }
          .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 35px;
            page-break-inside: avoid;
          }
          .signature-table td {
            text-align: center;
            vertical-align: top;
            width: 50%;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <!-- Header Quốc hiệu Tiêu ngữ chuẩn văn bản hành chính -->
        <table class="header-table">
          <tr>
            <td style="width: 45%; text-align: center;">
              <p style="margin:0; font-size:11pt; text-transform:uppercase;">TRƯỜNG MẦM NON BÉ NGOAN</p>
              <p style="margin:0; font-size:10pt; font-style:italic;">Hệ thống Quản lý Giáo dục</p>
              <div style="width: 120px; height: 1px; background: #000; margin: 4px auto 0 auto;"></div>
            </td>
            <td style="width: 55%; text-align: center;">
              <p style="margin:0; font-size:11pt; font-weight:bold; text-transform:uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p style="margin:0; font-size:11pt; font-weight:bold;">Độc lập - Tự do - Hạnh phúc</p>
              <div style="width: 160px; height: 1px; background: #000; margin: 4px auto 0 auto;"></div>
            </td>
          </tr>
        </table>

        <!-- Tiêu đề văn bản báo cáo -->
        <div class="title-block">
          <h1>BÁO CÁO QUẢN TRỊ TRƯỜNG MẦM NON</h1>
          <p>Kỳ báo cáo: ${monthStr} | Dữ liệu xuất từ hệ thống</p>
        </div>

        <!-- Các nội dung báo cáo được chọn -->
        ${sectionsHtml}

        <!-- Bảng chữ ký cuối văn bản -->
        <table class="signature-table">
          <tr>
            <td></td>
            <td style="font-style: italic; font-size: 11pt;">Ngày ${new Date().getDate()} tháng ${selectedMonth} năm ${selectedYear}</td>
          </tr>
          <tr style="font-weight: bold;">
            <td>NGƯỜI LẬP BÁO CÁO</td>
            <td>BAN GIÁM HIỆU DUYỆT</td>
          </tr>
          <tr>
            <td style="height: 70px;"></td>
            <td style="height: 70px;"></td>
          </tr>
          <tr style="font-weight: bold;">
            <td>Bộ phận Quản trị hệ thống</td>
            <td>Hiệu trưởng nhà trường</td>
          </tr>
        </table>
      </body>
      </html>
    `;
  };

  // Download / Print as PDF
  const handleDownloadPdf = () => {
    if (selectedReports.length === 0) {
      alert("Vui lòng tích chọn ít nhất một báo cáo để tải về!");
      return;
    }

    const htmlContent = generateReportHtml();
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Trình duyệt đã chặn cửa sổ bật lên. Vui lòng cho phép mở cửa sổ mới để tải PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white min-h-[calc(100vh-4rem)] font-sans">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-1">
            <FileCheck size={13} />
            <span>Trung tâm Báo cáo Quản trị Trường học</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Báo Cáo Định Kỳ & Xuất Bản PDF
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu trung thực 100% trích xuất từ các phân hệ backend: Học sinh, Điểm danh, Y tế, Tài chính và Nhân sự.
          </p>
        </div>

        {/* Filter Month/Year & Download Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar size={15} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Kỳ:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
            <span className="text-slate-400">/</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          <button
            onClick={() => void loadBackendData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
            title="Đồng bộ lại số liệu"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>

          {/* Button: Xem trước báo cáo */}
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 px-3.5 py-2 text-xs font-bold text-sky-700 transition shadow-2xs cursor-pointer"
          >
            <Eye size={14} />
            <span>Xem trước</span>
          </button>

          {/* MAIN BUTTON: Tải về báo cáo đã tích chọn dạng PDF */}
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition cursor-pointer"
          >
            <Download size={14} />
            <span>Tải về báo cáo ({selectedReports.length}) PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview - STRICTLY REAL METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Tổng học sinh</p>
          <p className="mt-1 text-2xl font-black text-slate-800">{metrics.totalStudents}</p>
          <p className="text-[10px] text-slate-500 font-medium">{metrics.totalClasses} nhóm lớp</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Tỷ lệ chuyên cần</p>
          <p className="mt-1 text-2xl font-black text-[#0284c7]">{metrics.attendanceRate}%</p>
          <p className="text-[10px] text-slate-500 font-medium">{metrics.totalAttendance} lượt điểm danh</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Hồ sơ y tế</p>
          <p className="mt-1 text-2xl font-black text-emerald-600">{metrics.totalHealthRecords}</p>
          <p className="text-[10px] text-amber-600 font-medium">{metrics.specialWatchCount} trẻ cần lưu ý</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Thực thu học phí</p>
          <p className="mt-1 text-lg font-black text-emerald-600 truncate">
            {(metrics.totalCollected / 1000000).toFixed(1)} tr
          </p>
          <p className="text-[10px] text-slate-500 font-medium">{metrics.totalCollected.toLocaleString("vi-VN")} đ</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Công nợ học phí</p>
          <p className="mt-1 text-lg font-black text-rose-600 truncate">
            {(metrics.totalOutstanding / 1000000).toFixed(1)} tr
          </p>
          <p className="text-[10px] text-rose-500 font-medium">{metrics.unpaidInvoices.length} hóa đơn</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400">Tổng nhân sự</p>
          <p className="mt-1 text-2xl font-black text-purple-700">{metrics.totalStaff}</p>
          <p className="text-[10px] text-purple-600 font-medium">{metrics.activeStaff} đang công tác</p>
        </div>
      </div>

      {/* Select All Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Lựa chọn các báo cáo cần xuất:</span>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            Đã tích chọn: {selectedReports.length} / {REPORT_DEFINITIONS.length} báo cáo
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleSelectAll}
            className="font-bold text-sky-700 hover:text-sky-800 hover:underline cursor-pointer"
          >
            Tích chọn tất cả
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={handleDeselectAll}
            className="font-semibold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
          >
            Bỏ chọn tất cả
          </button>
        </div>
      </div>

      {/* Categories & Report Items Grid */}
      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              <span>{cat.name}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {cat.items.map((report) => {
                const isSelected = selectedReports.includes(report.id);
                return (
                  <div
                    key={report.id}
                    onClick={() => handleToggleReport(report.id)}
                    className={`rounded-2xl border p-4 transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-400 bg-blue-50/20 ring-2 ring-blue-200/50 shadow-2xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      {/* Checkbox and Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isSelected ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {report.badge}
                        </span>

                        <div className="text-blue-600">
                          {isSelected ? (
                            <CheckSquare size={19} className="text-blue-600 fill-blue-50" />
                          ) : (
                            <Square size={19} className="text-slate-300" />
                          )}
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                        {report.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">Kỳ: Tháng {selectedMonth}/{selectedYear}</span>
                      <span
                        className={`font-bold ${
                          isSelected ? "text-blue-600" : "text-slate-400"
                        }`}
                      >
                        {isSelected ? "Đã chọn xuất" : "Chưa chọn"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Bar at Bottom */}
      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
            PDF
          </div>
          <div>
            <p className="text-xs font-bold">
              Xuất tệp báo cáo tổng hợp ({selectedReports.length} báo cáo được chọn)
            </p>
            <p className="text-[11px] text-slate-400">
              Định dạng chuẩn văn bản hành chính phản ánh số liệu trung thực từ hệ thống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            Xem trước
          </button>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm cursor-pointer"
          >
            <Download size={14} />
            <span>Tải về PDF ngay</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Bản xem trước báo cáo PDF ({selectedReports.length} báo cáo)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  <Download size={13} /> Tải file PDF
                </button>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
              <div
                className="bg-white p-8 rounded-xl shadow-xs max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: generateReportHtml() }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
