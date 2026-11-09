/**
 * Định nghĩa Types & Metadata cho Nghiệp vụ Báo cáo Lớp và Toàn trường
 * File size: < 150 dòng (Tuân thủ nghiêm ngặt quy tắc kiến trúc dự án)
 */

export type ReportType =
  | 'MONTHLY'
  | 'YEAR_END'
  | 'NUTRITION_BOARDING'
  | 'HEALTH_GROWTH'
  | 'ATTENDANCE'
  | 'ACTIVITY_EVALUATION'
  // 1. Nhóm 8 Báo cáo dành cho Ban Giám Hiệu
  | 'BGH_SI_SO'
  | 'BGH_CHUYEN_CAN'
  | 'BGH_PHAT_TRIEN'
  | 'BGH_SUC_KHOE'
  | 'BGH_KHEN_THUONG'
  | 'BGH_HOAT_DONG'
  | 'BGH_AN_TOAN'
  | 'BGH_TONG_KET_NAM'
  // 2. Nhóm 7 Báo cáo dành cho Giáo Viên
  | 'GV_DIEM_DANH'
  | 'GV_SUC_KHOE'
  | 'GV_CHIEU_CAO_CAN_NANG'
  | 'GV_DANH_GIA_PHAT_TRIEN'
  | 'GV_HOAT_DONG_LOP'
  | 'GV_TINH_HINH_LOP'
  | 'GV_BAN_GIAO_TRE';

export interface StudentBoardingItem {
  childId: string;
  childName: string;
  gender: string;
  totalDays: number;
  presentDays: number;
  excusedDays: number;
  unexcusedDays: number;
  refundPerDay: number;
  refundAmount: number;
  notes?: string;
}

export interface StudentHealthItem {
  childId: string;
  childName: string;
  heightCm: number;
  weightKg: number;
  nutritionStatus: 'Bình thường' | 'Suy dinh dưỡng' | 'Thấp còi' | 'Thừa cân' | 'Béo phì';
  symptoms?: string;
  notes?: string;
}

export interface StudentAttendanceItem {
  childId: string;
  childName: string;
  status: 'Có mặt' | 'Nghỉ có phép' | 'Nghỉ không phép';
  attendanceRate: number;
  notes?: string;
}

export interface StudentDevelopmentItem {
  childId: string;
  childName: string;
  physical: boolean;
  cognitive: boolean;
  language: boolean;
  socialEmotional: boolean;
  aesthetic: boolean;
  overallRating: 'Đạt' | 'Chưa đạt';
  notes?: string;
}

export interface StudentAwardItem {
  childId: string;
  childName: string;
  title: string;
  attendanceRank: string;
  growthRank: string;
  rewardCategory: string;
}

export interface StudentHandoverItem {
  childId: string;
  childName: string;
  handoverTime: string;
  receiverName: string;
  relationship: string;
  healthNote: string;
}

export interface ClassActivityItem {
  activityId: string;
  title: string;
  domain: string;
  date: string;
  participantCount: number;
  passRate: number;
}

export interface ClassIncidentItem {
  id: string;
  incidentType: string;
  childName: string;
  date: string;
  description: string;
  resolution: string;
  status: 'Đã xử lý' | 'Đang theo dõi';
}

export interface ClassReportMetrics {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  attendanceRate: number;
  presentAvg: number;
  absentExcusedAvg: number;
  absentUnexcusedAvg: number;
  normalNutritionCount: number;
  malnutritionCount: number;
  stuntedCount: number;
  overweightCount: number;
  passedEvaluationCount: number;
  needsSupportCount: number;
  totalBoardingRefund: number;
}

export interface ClassReportItem {
  id: string;
  reportType: ReportType;
  classId: string;
  className: string;
  gradeName: string;
  period: string;
  schoolYear: string;
  title: string;
  teacherId: string;
  teacherName: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  metrics: ClassReportMetrics;
  boardingDetails?: StudentBoardingItem[];
  healthDetails?: StudentHealthItem[];
  attendanceDetails?: StudentAttendanceItem[];
  developmentDetails?: StudentDevelopmentItem[];
  awardDetails?: StudentAwardItem[];
  handoverDetails?: StudentHandoverItem[];
  activityDetails?: ClassActivityItem[];
  incidentDetails?: ClassIncidentItem[];
  teacherRemarks?: string;
  recommendations?: string;
}

export const REPORT_PERIODS = [
  { id: 'today', label: 'Hôm nay (Hằng ngày)' },
  { id: 'tuan_nay', label: 'Tuần này' },
  { id: 'thang_10', label: 'Tháng 10 / 2026' },
  { id: 'thang_11', label: 'Tháng 11 / 2026' },
  { id: 'hoc_ky_1', label: 'Học kỳ I (2026 - 2027)' },
  { id: 'ca_nam', label: 'Tổng kết Cả năm học (2026 - 2027)' },
];
