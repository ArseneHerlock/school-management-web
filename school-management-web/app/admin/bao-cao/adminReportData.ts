/**
 * Dữ liệu thống kê tổng hợp Ban Giám Hiệu cho 8 Báo cáo
 * File size: < 90 dòng (Tuân thủ nghiêm ngặt quy tắc kiến trúc dự án)
 * Sử dụng 100% dữ liệu thực từ 12 Lớp học và 360 học sinh trong CSDL
 */

import { GradeClassSummaryRow, AdminReportStatMetrics } from './types';
import { buildRealAdminClasses } from './adminReportClasses';

export const REAL_ADMIN_CLASSES: GradeClassSummaryRow[] = buildRealAdminClasses();

export function getFilteredAdminClasses(
  gradeId: string,
  classId: string,
  searchKeyword: string,
): GradeClassSummaryRow[] {
  return REAL_ADMIN_CLASSES.filter((row) => {
    if (gradeId !== 'all') {
      const gNorm = gradeId.toLowerCase().replace(/khối\s*/, '').trim();
      const rowNorm = row.gradeName.toLowerCase().replace(/khối\s*/, '').trim();
      if (!rowNorm.includes(gNorm)) return false;
    }
    if (classId !== 'all') {
      if (!row.className.toLowerCase().includes(classId.toLowerCase())) return false;
    }
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const match =
        row.className.toLowerCase().includes(kw) ||
        row.gradeName.toLowerCase().includes(kw) ||
        row.teacherName.toLowerCase().includes(kw);
      if (!match) return false;
    }
    return true;
  });
}

export function calculateAdminReportMetrics(rows: GradeClassSummaryRow[]): AdminReportStatMetrics {
  const totalSchoolStudents = rows.reduce((acc, r) => acc + r.totalStudents, 0);
  const totalClasses = rows.length;

  if (totalClasses === 0 || totalSchoolStudents === 0) {
    return {
      totalSchoolStudents: 0,
      totalClasses: 0,
      schoolAttendanceRate: 0,
      normalNutritionRate: 0,
      holisticDevRate: 0,
      totalIncidents: 0,
      totalAwards: 0,
    };
  }

  const avgAttendance = rows.reduce((acc, r) => acc + r.attendanceRate, 0) / totalClasses;
  const avgNutrition = rows.reduce((acc, r) => acc + r.normalNutritionRate, 0) / totalClasses;
  const avgDev = rows.reduce((acc, r) => acc + r.passedDevRate, 0) / totalClasses;
  const totalIncidents = rows.reduce((acc, r) => acc + r.incidentCount, 0);
  const totalAwards = rows.reduce((acc, r) => acc + r.monthlyGoodChildCount, 0);

  return {
    totalSchoolStudents,
    totalClasses,
    schoolAttendanceRate: Number(avgAttendance.toFixed(1)),
    normalNutritionRate: Number(avgNutrition.toFixed(1)),
    holisticDevRate: Number(avgDev.toFixed(1)),
    totalIncidents,
    totalAwards,
  };
}

export const calculateAdminStatMetrics = calculateAdminReportMetrics;
