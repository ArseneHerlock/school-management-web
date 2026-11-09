/**
 * Khởi tạo bảng biểu in ấn cho 8 loại Báo cáo Ban Giám Hiệu
 * File size: < 220 dòng (Tuân thủ nghiêm ngặt quy tắc kiến trúc dự án)
 */

import { AdminReportId, GradeClassSummaryRow } from '../types';

export function buildAdminPrintTableHtml(id: AdminReportId, rows: GradeClassSummaryRow[]): string {
  if (id === 'BGH_SI_SO') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center font-bold" style="color: #059669;">+${r.newEnrolled}</td>
        <td class="text-center">${r.transferred}</td>
        <td class="text-center">${r.dropped}</td>
        <td class="text-center">${r.maleCount} Nam / ${r.femaleCount} Nữ</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th style="width: 60px;">Sĩ số</th>
            <th style="width: 85px;">Mới nhập học</th>
            <th style="width: 80px;">Chuyển trường</th>
            <th style="width: 70px;">Nghỉ học</th>
            <th style="width: 120px;">Tỷ lệ Nam / Nữ</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  if (id === 'BGH_CHUYEN_CAN') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center">${r.presentCount}</td>
        <td class="text-center">${r.absentExcused}</td>
        <td class="text-center">${r.absentUnexcused}</td>
        <td class="text-center font-bold" style="color: #059669;">${r.attendanceRate}%</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th style="width: 60px;">Sĩ số</th>
            <th style="width: 65px;">Có mặt</th>
            <th style="width: 75px;">Nghỉ phép</th>
            <th style="width: 80px;">Không phép</th>
            <th style="width: 85px;">Chuyên cần</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  if (id === 'BGH_PHAT_TRIEN') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center">${r.passPhysical}</td>
        <td class="text-center">${r.passCognitive}</td>
        <td class="text-center">${r.passLanguage}</td>
        <td class="text-center">${r.passSocial}</td>
        <td class="text-center">${r.passAesthetic}</td>
        <td class="text-center font-bold" style="color: #4338ca;">${r.passedDevRate}%</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên</th>
            <th style="width: 50px;">Sĩ số</th>
            <th style="width: 55px;">Thể chất</th>
            <th style="width: 60px;">Nhận thức</th>
            <th style="width: 60px;">Ngôn ngữ</th>
            <th style="width: 55px;">TC-XH</th>
            <th style="width: 55px;">Thẩm mỹ</th>
            <th style="width: 80px;">Đạt 5 lĩnh vực</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  if (id === 'BGH_SUC_KHOE') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center font-bold" style="color: #059669;">${r.normalNutritionCount}</td>
        <td class="text-center" style="color: #d97706;">${r.malnutritionCount}</td>
        <td class="text-center">${r.stuntedCount}</td>
        <td class="text-center font-bold">${r.normalNutritionRate}%</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th style="width: 60px;">Sĩ số</th>
            <th style="width: 90px;">Dinh dưỡng chuẩn</th>
            <th style="width: 90px;">Suy dinh dưỡng</th>
            <th style="width: 70px;">Thấp còi</th>
            <th style="width: 85px;">Tỷ lệ đạt chuẩn</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  if (id === 'BGH_KHEN_THUONG') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center font-bold" style="color: #d97706;">${r.monthlyGoodChildCount}</td>
        <td class="text-center">${r.exemplaryCount}</td>
        <td class="text-center font-bold" style="color: #059669;">${r.awardRate}%</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th style="width: 60px;">Sĩ số</th>
            <th style="width: 120px;">Bé Chăm Ngoan Tháng</th>
            <th style="width: 120px;">Chuyên cần xuất sắc</th>
            <th style="width: 100px;">Tỷ lệ khen thưởng</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>
      <div style="margin-top: 8px; font-size: 9.5pt; color: #6b7280; font-style: italic;">
        * Ghi chú: Khen thưởng định kỳ hàng tháng theo phong trào Bé Chăm Ngoan.
      </div>`;
  }

  if (id === 'BGH_HOAT_DONG') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td>${r.educationTheme}</td>
        <td class="text-center font-bold">${r.activityCount}</td>
        <td class="text-center">${r.outdoorActivityCount}</td>
        <td class="text-center font-bold" style="color: #059669;">${r.activityPassRate}%</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th>Chủ đề giáo dục trọng tâm</th>
            <th style="width: 80px;">Số hoạt động</th>
            <th style="width: 80px;">Ngoại khóa</th>
            <th style="width: 85px;">Đạt mục tiêu</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  if (id === 'BGH_AN_TOAN') {
    const trs = rows.map((r, i) => `
      <tr>
        <td class="text-center">${i + 1}</td>
        <td><b>${r.className}</b> (${r.gradeName})</td>
        <td>${r.teacherName}</td>
        <td class="text-center font-bold">${r.totalStudents}</td>
        <td class="text-center">${r.feverSickCount}</td>
        <td class="text-center">${r.firstAidCount}</td>
        <td class="text-xs">${r.safetyStatus}</td>
      </tr>
    `).join('');
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 35px;">STT</th>
            <th>Khối / Lớp</th>
            <th>Giáo viên phụ trách</th>
            <th style="width: 60px;">Sĩ số</th>
            <th style="width: 90px;">Sốt / Ốm tại lớp</th>
            <th style="width: 90px;">Sơ cứu trầy xước</th>
            <th>Tình trạng an toàn & Biện pháp</th>
          </tr>
        </thead>
        <tbody>${trs}</tbody>
      </table>`;
  }

  // BGH_TONG_KET_NAM (Sơ kết giữa năm)
  const trs = rows.map((r, i) => `
    <tr>
      <td class="text-center">${i + 1}</td>
      <td><b>${r.className}</b> (${r.gradeName})</td>
      <td>${r.teacherName}</td>
      <td class="text-center font-bold">${r.totalStudents}</td>
      <td class="text-center font-bold">${r.attendanceRate}%</td>
      <td class="text-center font-bold">${r.passedDevRate}%</td>
      <td class="text-center font-bold">${r.normalNutritionRate}%</td>
      <td class="text-center font-bold" style="color: #6d28d9;">${r.termRank}</td>
    </tr>
  `).join('');
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 35px;">STT</th>
          <th>Khối / Lớp</th>
          <th>Giáo viên phụ trách</th>
          <th style="width: 55px;">Sĩ số</th>
          <th style="width: 75px;">Chuyên cần</th>
          <th style="width: 80px;">Đạt phát triển</th>
          <th style="width: 80px;">Sức khỏe tốt</th>
          <th style="width: 95px;">Xếp loại sơ kết</th>
        </tr>
      </thead>
      <tbody>${trs}</tbody>
    </table>
    <div style="margin-top: 8px; font-size: 9.5pt; color: #b45309; background: #fffbeb; padding: 6px 10px; border-radius: 4px; border: 1px solid #fde68a;">
      <b>Lưu ý:</b> Báo cáo phản ánh dữ liệu sơ kết Học kỳ I - Năm học 2026-2027 đang diễn ra.
    </div>`;
}
