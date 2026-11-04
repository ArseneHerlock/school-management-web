/**
 * Tiện ích xuất file PDF / In báo cáo chuẩn thể thức văn bản hành chính sư phạm
 * Tuân thủ Nghị định 30/2020/NĐ-CP về công tác văn thư & quy định của Bộ Giáo dục và Đào tạo
 */

import { ClassReportItem, SchoolWideReportData, REPORT_TYPE_CONFIG, REPORT_PERIODS } from "@/services/classReports";

export function exportClassReportPdf(
  report: ClassReportItem,
  classInfo?: { className?: string; gradeName?: string }
) {
  const rType = report.reportType || "MONTHLY";
  const typeConfig = REPORT_TYPE_CONFIG[rType] || REPORT_TYPE_CONFIG.MONTHLY;
  const periodConfig = REPORT_PERIODS.find((p) => p.id === report.period);
  const periodLabel = periodConfig?.name || report.period;
  const className = classInfo?.className || report.className || "Lớp Mầm non";
  const gradeName = classInfo?.gradeName || report.gradeName || "Khối Mẫu giáo";
  const teacherName = report.teacherName || "Giáo viên chủ nhiệm";
  const m = report.metricsSnapshot || ({} as any);

  const isWideTable = rType === "NUTRITION_BOARDING" || rType === "HEALTH_GROWTH" || rType === "YEAR_END" || rType === "ATTENDANCE";
  const pageOrientation = isWideTable ? "landscape" : "portrait";

  // Build Student Table Rows based on reportType
  let studentTableHead = "";
  let studentTableBody = "";

  if (rType === "NUTRITION_BOARDING") {
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 60px;">Giới tính</th>
        <th style="width: 90px;">Tổng ngày học</th>
        <th style="width: 90px;">Ăn thực tế (ngày)</th>
        <th style="width: 90px;">Nghỉ có phép (hoàn tiền)</th>
        <th style="width: 90px;">Nghỉ không phép</th>
        <th style="width: 100px;">Đơn giá ăn/ngày</th>
        <th style="width: 120px;">Tiền hoàn trả (VNĐ)</th>
        <th style="width: 130px;">Ký nhận của PH</th>
      </tr>
    `;
    const list = m.studentBoardingList || [];
    studentTableBody = list.map((s: any, idx: number) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 500;">${s.childName}</td>
        <td style="text-align: center;">${s.gender}</td>
        <td style="text-align: center;">${s.totalDays}</td>
        <td style="text-align: center;">${s.presentDays}</td>
        <td style="text-align: center; font-weight: bold; color: #166534;">${s.excusedDays}</td>
        <td style="text-align: center; color: #991b1b;">${s.unexcusedDays}</td>
        <td style="text-align: right;">45.000 đ</td>
        <td style="text-align: right; font-weight: bold; color: #15803d;">${(s.refundAmount || 0).toLocaleString("vi-VN")} đ</td>
        <td style="text-align: center; font-size: 11px; color: #666;">${s.refundAmount > 0 ? "..................." : "Không hoàn trả"}</td>
      </tr>
    `).join("");
  } else if (rType === "HEALTH_GROWTH") {
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 60px;">Giới tính</th>
        <th style="width: 100px;">Ngày sinh</th>
        <th style="width: 80px;">Cân nặng (kg)</th>
        <th style="width: 80px;">Chiều cao (cm)</th>
        <th style="width: 70px;">Chỉ số BMI</th>
        <th style="width: 160px;">Đánh giá thể lực WHO</th>
        <th>Biện pháp can thiệp chăm sóc</th>
      </tr>
    `;
    const list = m.studentHealthList || [];
    studentTableBody = list.map((s: any, idx: number) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 500;">${s.childName}</td>
        <td style="text-align: center;">${s.gender}</td>
        <td style="text-align: center;">${s.dob ? new Date(s.dob).toLocaleDateString("vi-VN") : "—"}</td>
        <td style="text-align: center; font-weight: bold;">${s.weight}</td>
        <td style="text-align: center; font-weight: bold;">${s.height}</td>
        <td style="text-align: center;">${s.bmi}</td>
        <td style="text-align: center;">
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; ${
            s.whoStatus?.includes("Bình thường") ? "background: #dcfce7; color: #166534;" : "background: #fee2e2; color: #991b1b;"
          }">${s.whoStatus}</span>
        </td>
        <td style="font-size: 12px;">${s.interventionPlan}</td>
      </tr>
    `).join("");
  } else if (rType === "ATTENDANCE") {
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 60px;">Giới tính</th>
        <th style="width: 100px;">Ngày sinh</th>
        <th style="width: 80px;">Tổng ngày học</th>
        <th style="width: 80px;">Có mặt (ngày)</th>
        <th style="width: 80px;">Nghỉ có phép</th>
        <th style="width: 80px;">Nghỉ K.phép</th>
        <th style="width: 90px;">Tỷ lệ chuyên cần</th>
        <th style="width: 100px;">Phổ cập 5T</th>
        <th>Đánh giá chuyên cần</th>
      </tr>
    `;
    const list = m.studentAttendanceList || [];
    studentTableBody = list.map((s: any, idx: number) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 500;">${s.childName}</td>
        <td style="text-align: center;">${s.gender}</td>
        <td style="text-align: center;">${s.dob ? new Date(s.dob).toLocaleDateString("vi-VN") : "—"}</td>
        <td style="text-align: center;">${s.totalDays}</td>
        <td style="text-align: center; font-weight: bold;">${s.presentDays}</td>
        <td style="text-align: center; color: #15803d;">${s.excusedDays}</td>
        <td style="text-align: center; color: #b91c1c;">${s.unexcusedDays}</td>
        <td style="text-align: center; font-weight: bold; color: ${s.attendanceRate >= 90 ? "#166534" : "#b45309"};">${s.attendanceRate}%</td>
        <td style="text-align: center; font-size: 11px;">${s.is5YearsOld ? (s.universal5TQualified ? "Đạt chuẩn 5T" : "Chưa đạt") : "—"}</td>
        <td style="font-size: 12px;">${s.evaluation}</td>
      </tr>
    `).join("");
  } else if (rType === "ACTIVITY_EVALUATION") {
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 60px;">Giới tính</th>
        <th style="width: 120px;">Hoạt động tham gia</th>
        <th style="width: 120px;">Hoạt động Đạt</th>
        <th style="width: 100px;">Tỷ lệ đạt (%)</th>
        <th>Nhận xét năng lực & thái độ của giáo viên</th>
      </tr>
    `;
    const list = m.studentActivityList || [];
    studentTableBody = list.map((s: any, idx: number) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 500;">${s.childName}</td>
        <td style="text-align: center;">${s.gender}</td>
        <td style="text-align: center;">${s.activitiesTotal} bài</td>
        <td style="text-align: center; font-weight: bold; color: #15803d;">${s.activitiesPassed} bài</td>
        <td style="text-align: center; font-weight: bold;">${s.passRate}%</td>
        <td style="font-size: 12px;">${s.remark}</td>
      </tr>
    `).join("");
  } else if (rType === "YEAR_END") {
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 100px;">Chuyên cần cả năm</th>
        <th style="width: 100px;">Sức khỏe 4 Quý (WHO)</th>
        <th style="width: 100px;">Hoạt động cả năm</th>
        <th style="width: 180px;">Danh hiệu khen thưởng đề xuất</th>
        <th>Nhận xét quá trình rèn luyện</th>
      </tr>
    `;
    const list = m.yearEndAwards || [];
    studentTableBody = list.map((s: any, idx: number) => `
      <tr>
        <td style="text-align: center;">${idx + 1}</td>
        <td style="font-weight: 500;">${s.childName}</td>
        <td style="text-align: center; font-weight: bold;">${s.attendanceRate}% <span style="font-size: 11px; font-weight: normal; color: #666;">(${s.presentDays}/${s.totalAttendanceDays}d)</span></td>
        <td style="text-align: center;">${s.quartersNormal}/${s.quartersEvaluated} quý đạt WHO</td>
        <td style="text-align: center; font-weight: bold;">${s.activityPassRate}% <span style="font-size: 11px; font-weight: normal; color: #666;">(${s.passedActivities}/${s.totalActivities})</span></td>
        <td style="text-align: center;">
          <strong style="color: #1e3a8a; font-size: 12px;">${s.suggestedAward}</strong>
        </td>
        <td style="font-size: 12px; color: #444;">Chăm ngoan, biết vâng lời cô giáo, hoàn thành các mục tiêu rèn luyện trong năm.</td>
      </tr>
    `).join("");
  } else {
    // MONTHLY tổng quát
    studentTableHead = `
      <tr>
        <th style="width: 40px;">STT</th>
        <th>Họ và tên học sinh</th>
        <th style="width: 60px;">Giới tính</th>
        <th style="width: 100px;">Chuyên cần</th>
        <th style="width: 120px;">Thể lực WHO</th>
        <th style="width: 110px;">Hoàn tiền ăn</th>
        <th>Nhận xét công tác chăm sóc & giáo dục tháng</th>
      </tr>
    `;
    const attList = m.studentAttendanceList || [];
    const healthList = m.studentHealthList || [];
    const boardList = m.studentBoardingList || [];
    const actList = m.studentActivityList || [];

    studentTableBody = attList.map((s: any, idx: number) => {
      const h = healthList[idx] || {};
      const b = boardList[idx] || {};
      const a = actList[idx] || {};
      return `
        <tr>
          <td style="text-align: center;">${idx + 1}</td>
          <td style="font-weight: 500;">${s.childName}</td>
          <td style="text-align: center;">${s.gender}</td>
          <td style="text-align: center; font-weight: bold;">${s.attendanceRate}%</td>
          <td style="text-align: center;">${h.whoStatus || "Bình thường"}</td>
          <td style="text-align: right; color: #15803d; font-weight: bold;">${(b.refundAmount || 0).toLocaleString("vi-VN")} đ</td>
          <td style="font-size: 12px;">${a.remark || "Nền nếp tốt, tích cực tham gia các hoạt động cùng cô và các bạn."}</td>
        </tr>
      `;
    }).join("");
  }

  const currentDateStr = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${report.title || typeConfig.name} - ${className}</title>
  <style>
    @page {
      size: A4 ${pageOrientation};
      margin: 12mm 15mm;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 13pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .header-table td {
      vertical-align: top;
      text-align: center;
      padding: 0;
    }
    .org-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .org-sub {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .motto-country {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .motto-sub {
      font-size: 13pt;
      font-weight: bold;
    }
    .hr-center {
      width: 120px;
      border: 0;
      border-top: 1px solid #000;
      margin: 4px auto 0 auto;
    }
    .report-title-box {
      text-align: center;
      margin: 20px 0 15px 0;
    }
    .report-main-title {
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 6px 0;
    }
    .report-subtitle {
      font-size: 13pt;
      font-style: italic;
      margin: 0;
    }
    .class-info-box {
      margin: 15px 0;
      font-size: 13pt;
    }
    .class-info-box table {
      width: 100%;
      border-collapse: collapse;
    }
    .class-info-box td {
      padding: 3px 0;
    }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 16px 0 8px 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 12pt;
    }
    .data-table th, .data-table td {
      border: 1px solid #000;
      padding: 6px 8px;
    }
    .data-table th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    .summary-grid {
      display: table;
      width: 100%;
      margin: 10px 0;
      border: 1px solid #000;
      border-collapse: collapse;
    }
    .summary-grid td {
      border: 1px solid #000;
      padding: 6px 10px;
      font-size: 12pt;
    }
    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .signature-table td {
      width: 50%;
      text-align: center;
      vertical-align: top;
      font-size: 13pt;
    }
    .sig-date {
      font-style: italic;
      margin-bottom: 5px;
    }
    .sig-role {
      font-weight: bold;
      text-transform: uppercase;
    }
    .sig-space {
      height: 80px;
    }
    .sig-name {
      font-weight: bold;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #1e293b; color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
    <div style="font-weight: bold; font-size: 16px; font-family: sans-serif;">
      📄 BẢN XEM TRƯỚC VĂN BẢN XUẤT FILE PDF
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()" style="background: #2563eb; color: #fff; border: 0; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; font-family: sans-serif; display: flex; align-items: center; gap: 6px;">
        🖨️ Xuất File PDF / In Ngay
      </button>
      <button onclick="window.close()" style="background: #475569; color: #fff; border: 0; padding: 8px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; font-family: sans-serif;">
        Đóng cửa sổ
      </button>
    </div>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <div class="org-title">SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI</div>
        <div class="org-sub">TRƯỜNG MẦM NON MỸ HƯNG</div>
        <div style="font-size: 11pt; margin-top: 4px;">Số: ....../BC-${className.replace(/\s+/g, '')}</div>
        <div class="hr-center" style="width: 80px;"></div>
      </td>
      <td style="width: 55%;">
        <div class="motto-country">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="motto-sub">Độc lập - Tự do - Hạnh phúc</div>
        <div class="hr-center" style="width: 140px;"></div>
        <div class="sig-date" style="margin-top: 6px;">Hà Nội, ngày ...... tháng ...... năm 2026</div>
      </td>
    </tr>
  </table>

  <div class="report-title-box">
    <div class="report-main-title">${report.title || typeConfig.name}</div>
    <div class="report-subtitle">Kỳ báo cáo: ${periodLabel} - Năm học 2026 - 2027</div>
  </div>

  <div class="class-info-box">
    <table>
      <tr>
        <td style="width: 50%;"><strong>Lớp:</strong> ${className} (${gradeName})</td>
        <td style="width: 50%;"><strong>Giáo viên chủ nhiệm:</strong> ${teacherName}</td>
      </tr>
      <tr>
        <td><strong>Tổng số học sinh:</strong> ${m.totalStudents || 30} trẻ (Nam: ${m.maleCount || 15}, Nữ: ${m.femaleCount || 15})</td>
        <td><strong>Thời điểm kết xuất dữ liệu:</strong> ${currentDateStr}</td>
      </tr>
    </table>
  </div>

  <div class="section-title">I. TỔNG HỢP CÁC CHỈ SỐ CƠ BẢN</div>
  <table class="data-table" style="margin-bottom: 20px;">
    <tr>
      <th style="width: 25%;">Chuyên cần toàn lớp</th>
      <th style="width: 25%;">Sức khỏe chuẩn WHO</th>
      <th style="width: 25%;">Đánh giá hoạt động</th>
      <th style="width: 25%;">Quyết toán bán trú</th>
    </tr>
    <tr>
      <td style="text-align: center;">
        <strong style="font-size: 14pt; color: #166534;">${m.attendance?.attendanceRate || 0}%</strong><br>
        <span style="font-size: 11px; color: #555;">Có mặt: ${m.attendance?.presentDays || 0} / Tổng ${m.attendance?.totalAttendance || 0} lượt</span>
      </td>
      <td style="text-align: center;">
        <strong style="font-size: 14pt; color: #15803d;">${m.health?.normalRate || 0}%</strong><br>
        <span style="font-size: 11px; color: #555;">Bình thường: ${m.health?.normalHealthCount || 0} trẻ (SDD: ${m.health?.malnutritionCount || 0})</span>
      </td>
      <td style="text-align: center;">
        <strong style="font-size: 14pt; color: #1e40af;">${m.activities?.activityPassRate || 0}%</strong><br>
        <span style="font-size: 11px; color: #555;">Đạt: ${m.activities?.passedEvaluations || 0} lượt đánh giá</span>
      </td>
      <td style="text-align: center;">
        <strong style="font-size: 14pt; color: #b45309;">${(m.boarding?.totalRefundAmount || 0).toLocaleString("vi-VN")} đ</strong><br>
        <span style="font-size: 11px; color: #555;">Nghỉ phép hoàn tiền: ${m.boarding?.excusedAbsentDays || 0} ngày</span>
      </td>
    </tr>
  </table>

  <div class="section-title">II. BẢNG SỐ LIỆU CHI TIẾT DANH SÁCH HỌC SINH</div>
  <table class="data-table">
    <thead>
      ${studentTableHead}
    </thead>
    <tbody>
      ${studentTableBody}
    </tbody>
  </table>

  <div class="section-title">III. ĐÁNH GIÁ VÀ ĐỀ XUẤT CỦA GIÁO VIÊN CHỦ NHIỆM</div>
  <div style="margin: 6px 0 12px 0; font-size: 13pt;">
    <p style="margin: 4px 0;"><strong>1. Đánh giá chung tình hình của lớp:</strong></p>
    <div style="border: 1px dashed #999; padding: 8px 12px; min-height: 40px; background: #fafafa; font-style: italic;">
      ${report.teacherNotes || "Tình hình lớp học duy trì nền nếp ổn định, trẻ đi học đều và hào hứng tham gia các hoạt động giáo dục. Công tác phối hợp chăm sóc bán trú với cha mẹ học sinh đạt hiệu quả tốt."}
    </div>

    <p style="margin: 8px 0 4px 0;"><strong>2. Đề xuất, kiến nghị với Ban Giám Hiệu:</strong></p>
    <div style="border: 1px dashed #999; padding: 8px 12px; min-height: 40px; background: #fafafa; font-style: italic;">
      ${report.teacherProposals || "Kính đề nghị Ban Giám hiệu tiếp tục hỗ trợ bổ sung thêm học liệu tạo hình và bảo dưỡng thiết bị đồ chơi ngoài trời phục vụ các hoạt động học tập của trẻ."}
    </div>
  </div>

  <table class="signature-table">
    <tr>
      <td>
        <div class="sig-role">DUYỆT CỦA BAN GIÁM HIỆU</div>
        <div style="font-size: 11pt; color: #555;">(Ký, đóng dấu và ghi rõ họ tên)</div>
        <div class="sig-space"></div>
        <div class="sig-name">HIỆU TRƯỞNG</div>
      </td>
      <td>
        <div class="sig-date">Hà Nội, ngày ...... tháng ...... năm 2026</div>
        <div class="sig-role">NGƯỜI LẬP BÁO CÁO</div>
        <div style="font-size: 11pt; color: #555;">(Ký và ghi rõ họ tên)</div>
        <div class="sig-space"></div>
        <div class="sig-name">${teacherName}</div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}

export function exportSchoolWideReportPdf(data: SchoolWideReportData) {
  const o = data.overview;
  const currentDateStr = new Date().toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const periodConfig = REPORT_PERIODS.find((p) => p.id === data.period);
  const periodLabel = periodConfig?.name || data.period;

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo Cáo Tổng Hợp Toàn Trường - ${periodLabel}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 13pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 0;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .header-table td {
      vertical-align: top;
      text-align: center;
      padding: 0;
    }
    .org-title {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .org-sub {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .motto-country {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .motto-sub {
      font-size: 13pt;
      font-weight: bold;
    }
    .hr-center {
      width: 120px;
      border: 0;
      border-top: 1px solid #000;
      margin: 4px auto 0 auto;
    }
    .report-title-box {
      text-align: center;
      margin: 20px 0 15px 0;
    }
    .report-main-title {
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 6px 0;
    }
    .report-subtitle {
      font-size: 13pt;
      font-style: italic;
      margin: 0;
    }
    .section-title {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 16px 0 8px 0;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 12pt;
    }
    .data-table th, .data-table td {
      border: 1px solid #000;
      padding: 6px 8px;
    }
    .data-table th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    .signature-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .signature-table td {
      width: 50%;
      text-align: center;
      vertical-align: top;
      font-size: 13pt;
    }
    .sig-date {
      font-style: italic;
      margin-bottom: 5px;
    }
    .sig-role {
      font-weight: bold;
      text-transform: uppercase;
    }
    .sig-space {
      height: 80px;
    }
    .sig-name {
      font-weight: bold;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="no-print" style="background: #1e293b; color: #fff; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100;">
    <div style="font-weight: bold; font-size: 16px; font-family: sans-serif;">
      📄 BẢN XEM TRƯỚC BÁO CÁO TỔNG HỢP TOÀN TRƯỜNG
    </div>
    <div style="display: flex; gap: 10px;">
      <button onclick="window.print()" style="background: #2563eb; color: #fff; border: 0; padding: 8px 16px; font-weight: bold; border-radius: 6px; cursor: pointer; font-family: sans-serif;">
        🖨️ Xuất File PDF / In Báo Cáo
      </button>
      <button onclick="window.close()" style="background: #475569; color: #fff; border: 0; padding: 8px 14px; font-weight: bold; border-radius: 6px; cursor: pointer; font-family: sans-serif;">
        Đóng cửa sổ
      </button>
    </div>
  </div>

  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <div class="org-title">SỞ GIÁO DỤC VÀ ĐÀO TẠO HÀ NỘI</div>
        <div class="org-sub">TRƯỜNG MẦM NON MỸ HƯNG</div>
        <div style="font-size: 11pt; margin-top: 4px;">Số: ....../BC-MNMH</div>
        <div class="hr-center" style="width: 80px;"></div>
      </td>
      <td style="width: 55%;">
        <div class="motto-country">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div class="motto-sub">Độc lập - Tự do - Hạnh phúc</div>
        <div class="hr-center" style="width: 140px;"></div>
        <div class="sig-date" style="margin-top: 6px;">Hà Nội, ngày ...... tháng ...... năm 2026</div>
      </td>
    </tr>
  </table>

  <div class="report-title-box">
    <div class="report-main-title">BÁO CÁO TỔNG HỢP CÔNG TÁC CHĂM SÓC, NUÔI DƯỠNG VÀ GIÁO DỤC TOÀN TRƯỜNG</div>
    <div class="report-subtitle">Kỳ báo cáo: ${periodLabel} - Năm học 2026 - 2027</div>
  </div>

  <div class="section-title">I. QUY MÔ TRƯỜNG LỚP VÀ SĨ SỐ HỌC SINH</div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Khối Lớp</th>
        <th style="width: 100px;">Tổng số lớp</th>
        <th style="width: 120px;">Tổng học sinh</th>
        <th style="width: 100px;">Học sinh Nam</th>
        <th style="width: 100px;">Học sinh Nữ</th>
        <th>Ghi chú</th>
      </tr>
    </thead>
    <tbody>
      ${o.gradeBreakdown.map((g) => `
        <tr>
          <td style="font-weight: bold;">${g.gradeName}</td>
          <td style="text-align: center;">4 lớp</td>
          <td style="text-align: center; font-weight: bold;">${g.studentCount} trẻ</td>
          <td style="text-align: center;">${g.maleCount}</td>
          <td style="text-align: center;">${g.femaleCount}</td>
          <td style="font-size: 12px; color: #666;">Đảm bảo định mức điều lệ trường MN</td>
        </tr>
      `).join("")}
      <tr style="background: #f8fafc; font-weight: bold;">
        <td style="text-align: center;">TỔNG CỘNG TOÀN TRƯỜNG</td>
        <td style="text-align: center;">${o.totalClasses} lớp</td>
        <td style="text-align: center; color: #1e3a8a;">${o.totalStudents} trẻ</td>
        <td style="text-align: center;">${o.maleCount}</td>
        <td style="text-align: center;">${o.femaleCount}</td>
        <td>100% học sinh ăn bán trú tại trường</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">II. TỔNG HỢP CHUYÊN CẦN VÀ PHỔ CẬP TRẺ 5 TUỔI</div>
  <table class="data-table">
    <tr>
      <th style="width: 50%;">Tỷ lệ chuyên cần chung toàn trường</th>
      <th style="width: 50%;">Tỷ lệ chuyên cần trẻ 5 tuổi (Khối Lá)</th>
    </tr>
    <tr>
      <td style="text-align: center;">
        <div style="font-size: 20pt; font-weight: bold; color: #166534;">${o.attendance.attendanceRate}%</div>
        <div style="font-size: 11pt; color: #555;">Có mặt: ${o.attendance.presentDays} / Tổng số ${o.attendance.totalAttendance} lượt điểm danh</div>
      </td>
      <td style="text-align: center;">
        <div style="font-size: 20pt; font-weight: bold; color: #1e40af;">${o.attendance.attendanceRate5T}%</div>
        <div style="font-size: 11pt; font-weight: bold; color: #166534;">
          ${o.attendance.universal5TQualified ? "✓ ĐẠT CHỈ TIÊU PHỔ CẬP GDMN TRẺ 5 TUỔI (≥ 90%)" : "⚠ CHƯA ĐẠT CHỈ TIÊU"}
        </div>
      </td>
    </tr>
  </table>

  <div class="section-title">III. TỔNG HỢP SỨC KHỎE VÀ BIỂU ĐỒ TĂNG TRƯỞNG WHO</div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Chỉ số thể lực WHO</th>
        <th style="width: 120px;">Số lượng trẻ</th>
        <th style="width: 100px;">Tỷ lệ (%)</th>
        <th>Đánh giá & Kế hoạch can thiệp dinh dưỡng toàn trường</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold; color: #166534;">Trẻ phát triển bình thường</td>
        <td style="text-align: center; font-weight: bold;">${o.health.normalHealthCount} trẻ</td>
        <td style="text-align: center; font-weight: bold; color: #166534;">${o.health.normalRate}%</td>
        <td style="font-size: 12px;">Đảm bảo khẩu phần calo và vi chất dinh dưỡng hợp lý.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #b91c1c;">Trẻ suy dinh dưỡng (thể nhẹ cân / thấp còi)</td>
        <td style="text-align: center; font-weight: bold;">${o.health.malnutritionCount} trẻ</td>
        <td style="text-align: center; font-weight: bold; color: #b91c1c;">${o.health.malnutritionRate}%</td>
        <td style="font-size: 12px;">Phối hợp nhân viên y tế học đường lập chế độ ăn phục hồi riêng.</td>
      </tr>
      <tr>
        <td style="font-weight: bold; color: #b45309;">Trẻ thừa cân / nguy cơ béo phì</td>
        <td style="text-align: center; font-weight: bold;">${o.health.overweightCount} trẻ</td>
        <td style="text-align: center; font-weight: bold; color: #b45309;">${(100 - o.health.normalRate - o.health.malnutritionRate).toFixed(1)}%</td>
        <td style="font-size: 12px;">Tăng cường vận động thể chất ngoài trời, giảm lượng đường bột.</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">IV. QUYẾT TOÁN CÔNG TÁC BÁN TRÚ TOÀN TRƯỜNG</div>
  <table class="data-table">
    <tr>
      <td style="width: 60%;"><strong>Tổng số ngày nghỉ có phép hợp lệ được hoàn tiền ăn toàn trường:</strong></td>
      <td style="width: 40%; text-align: right; font-weight: bold;">${o.boarding.totalExcusedDays} ngày</td>
    </tr>
    <tr>
      <td><strong>Đơn giá hoàn trả theo quy định của nhà trường:</strong></td>
      <td style="text-align: right; font-weight: bold;">45.000 đ/ngày</td>
    </tr>
    <tr style="background: #f1f5f9;">
      <td><strong style="text-transform: uppercase;">Tổng số tiền ăn hoàn trả cho toàn bộ phụ huynh học sinh:</strong></td>
      <td style="text-align: right; font-size: 14pt; font-weight: bold; color: #15803d;">
        ${o.boarding.totalRefundAmount.toLocaleString("vi-VN")} VNĐ
      </td>
    </tr>
  </table>

  <div class="section-title">V. TIẾN ĐỘ THU NẬP BÁO CÁO CÁC LỚP</div>
  <p style="margin: 4px 0 10px 0; font-size: 12pt;">
    Toàn trường có <strong>${o.submissionProgress.totalClasses} lớp</strong>. 
    Số lớp đã nộp: <strong>${o.submissionProgress.submittedCount}/${o.submissionProgress.totalClasses}</strong> 
    (Trong đó đã phê duyệt: <strong style="color: #166534;">${o.submissionProgress.approvedCount} lớp</strong>, 
    chờ nộp/duyệt: <strong style="color: #b45309;">${o.submissionProgress.pendingCount} lớp</strong>).
  </p>

  <table class="signature-table">
    <tr>
      <td>
        <div class="sig-role">NGƯỜI TỔNG HỢP BÁO CÁO</div>
        <div style="font-size: 11pt; color: #555;">(Ký và ghi rõ họ tên)</div>
        <div class="sig-space"></div>
        <div class="sig-name">CÁN BỘ QUẢN LÝ ĐÀO TẠO</div>
      </td>
      <td>
        <div class="sig-date">Hà Nội, ngày ...... tháng ...... năm 2026</div>
        <div class="sig-role">HIỆU TRƯỞNG TRƯỜNG MẦM NON MỸ HƯNG</div>
        <div style="font-size: 11pt; color: #555;">(Ký, đóng dấu và ghi rõ họ tên)</div>
        <div class="sig-space"></div>
        <div class="sig-name">HIỆU TRƯỞNG</div>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
