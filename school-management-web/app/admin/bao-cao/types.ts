/**
 * Kiểu dữ liệu cho Trung tâm Báo cáo Quản trị Ban Giám Hiệu
 * File size: < 120 dòng (Tuân thủ quy tắc kiến trúc dự án)
 */

export type AdminReportId =
  | 'BGH_SI_SO'
  | 'BGH_CHUYEN_CAN'
  | 'BGH_PHAT_TRIEN'
  | 'BGH_SUC_KHOE'
  | 'BGH_KHEN_THUONG'
  | 'BGH_HOAT_DONG'
  | 'BGH_AN_TOAN'
  | 'BGH_TONG_KET_NAM';

export type ReportCategory = 'ALL' | 'DAILY_MONTH' | 'PERIODIC' | 'YEAR_END';

export interface AdminReportMeta {
  id: AdminReportId;
  title: string;
  cycle: string;
  category: ReportCategory;
  summary: string;
  iconName: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
}

export interface AdminFilterState {
  gradeId: string;
  classId: string;
  period: string;
  schoolYear: string;
  searchKeyword: string;
}

export interface GradeClassSummaryRow {
  gradeName: string;
  className: string;
  teacherName: string;
  totalStudents: number;
  // 1. Sĩ số & Giới tính
  maleCount: number;
  femaleCount: number;
  newEnrolled: number;
  transferred: number;
  dropped: number;
  // 2. Chuyên cần
  presentCount: number;
  absentExcused: number;
  absentUnexcused: number;
  attendanceRate: number;
  // 3. Phát triển 5 lĩnh vực
  passPhysical: number;
  passCognitive: number;
  passLanguage: number;
  passSocial: number;
  passAesthetic: number;
  passedDevRate: number;
  // 4. Sức khỏe
  normalNutritionCount: number;
  malnutritionCount: number;
  stuntedCount: number;
  overweightCount: number;
  normalNutritionRate: number;
  // 5. Khen thưởng định kỳ (tháng/kỳ)
  monthlyGoodChildCount: number;
  exemplaryCount: number;
  awardRate: number;
  // 6. Hoạt động giáo dục
  educationTheme: string;
  activityCount: number;
  outdoorActivityCount: number;
  activityPassRate: number;
  // 7. An toàn
  feverSickCount: number;
  firstAidCount: number;
  incidentCount: number;
  safetyStatus: string;
  // 8. Đánh giá sơ kết
  termRank: string;
}

export interface AdminReportStatMetrics {
  totalSchoolStudents: number;
  totalClasses: number;
  schoolAttendanceRate: number;
  normalNutritionRate: number;
  holisticDevRate: number;
  totalIncidents: number;
  totalAwards: number;
}
