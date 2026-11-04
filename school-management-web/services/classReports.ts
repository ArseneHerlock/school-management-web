/**
 * Client service cho Nghiệp vụ Báo cáo Lớp (Giáo viên) và Báo cáo Toàn trường (Admin)
 * Định danh và thể thức văn bản hành chính sư phạm mầm non chuẩn theo Bộ GD&ĐT
 */

export type ReportType = 'MONTHLY' | 'YEAR_END' | 'NUTRITION_BOARDING' | 'HEALTH_GROWTH' | 'ATTENDANCE' | 'ACTIVITY_EVALUATION';

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
  status: string;
}

export interface StudentHealthItem {
  childId: string;
  childName: string;
  gender: string;
  dob: string;
  weight: number;
  height: number;
  bmi: number;
  whoStatus: string;
  interventionPlan: string;
}

export interface StudentAttendanceItem {
  childId: string;
  childName: string;
  gender: string;
  dob: string;
  totalDays: number;
  presentDays: number;
  excusedDays: number;
  unexcusedDays: number;
  attendanceRate: number;
  is5YearsOld: boolean;
  universal5TQualified: boolean;
  evaluation: string;
}

export interface StudentActivityItem {
  childId: string;
  childName: string;
  gender: string;
  activitiesTotal: number;
  activitiesPassed: number;
  passRate: number;
  remark: string;
}

export interface YearEndAwardChild {
  childId: string;
  childName: string;
  attendanceRate: number;
  presentDays: number;
  totalAttendanceDays: number;
  quartersEvaluated: number;
  quartersNormal: number;
  activityPassRate: number;
  totalActivities: number;
  passedActivities: number;
  suggestedAward: string;
}

export interface ClassReportMetrics {
  totalStudents: number;
  maleCount: number;
  femaleCount: number;
  attendance: {
    totalAttendance: number;
    presentDays: number;
    excusedDays: number;
    unexcusedDays: number;
    attendanceRate: number;
  };
  health: {
    totalHealth: number;
    normalHealthCount: number;
    malnutritionCount: number;
    overweightCount: number;
    normalRate: number;
  };
  activities: {
    totalActivities: number;
    totalEvaluations: number;
    passedEvaluations: number;
    activityPassRate: number;
  };
  boarding: {
    excusedAbsentDays: number;
    refundPerDay: number;
    totalRefundAmount: number;
  };
  studentBoardingList?: StudentBoardingItem[];
  studentHealthList?: StudentHealthItem[];
  studentAttendanceList?: StudentAttendanceItem[];
  studentActivityList?: StudentActivityItem[];
  yearEndAwards?: YearEndAwardChild[];
}

export interface ClassReportItem {
  id?: string;
  classId: string;
  className?: string;
  gradeName?: string;
  schoolYear: string;
  period: string;
  reportType?: ReportType;
  title: string;
  teacherId?: string;
  teacherName?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED';
  metricsSnapshot?: ClassReportMetrics;
  teacherNotes?: string;
  teacherProposals?: string;
  adminFeedback?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt?: string;
}

export interface AllClassReportsOverview {
  schoolYear: string;
  period: string;
  reportType?: ReportType;
  totalClasses: number;
  submittedCount: number;
  approvedCount: number;
  classes: Array<{
    classId: string;
    className: string;
    gradeName: string;
    reportType?: string;
    hasSubmitted: boolean;
    status: 'NOT_SUBMITTED' | 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED';
    reportId?: string | null;
    title?: string | null;
    teacherName?: string | null;
    submittedAt?: string | null;
    metricsSnapshot?: ClassReportMetrics | null;
    teacherNotes?: string | null;
    teacherProposals?: string | null;
    adminFeedback?: string | null;
  }>;
}

export interface SchoolWideReportData {
  schoolYear: string;
  period: string;
  reportType: ReportType;
  overview: {
    totalClasses: number;
    totalStudents: number;
    maleCount: number;
    femaleCount: number;
    gradeBreakdown: Array<{
      gradeName: string;
      studentCount: number;
      maleCount: number;
      femaleCount: number;
    }>;
    attendance: {
      totalAttendance: number;
      presentDays: number;
      excusedDays: number;
      unexcusedDays: number;
      attendanceRate: number;
      attendanceRate5T: number;
      universal5TQualified: boolean;
    };
    health: {
      totalHealth: number;
      normalHealthCount: number;
      malnutritionCount: number;
      overweightCount: number;
      normalRate: number;
      malnutritionRate: number;
    };
    boarding: {
      totalExcusedDays: number;
      refundPerDay: number;
      totalRefundAmount: number;
    };
    submissionProgress: {
      totalClasses: number;
      submittedCount: number;
      approvedCount: number;
      pendingCount: number;
    };
  };
}

export const REPORT_TYPE_CONFIG: Record<ReportType, {
  key: ReportType;
  name: string;
  shortName: string;
  defaultTitle: (periodName: string, schoolYear?: string) => string;
}> = {
  MONTHLY: {
    key: 'MONTHLY',
    name: 'Báo cáo công tác chăm sóc, nuôi dưỡng và giáo dục trẻ hàng tháng',
    shortName: 'Báo cáo hàng tháng',
    defaultTitle: (periodName: string) => `Báo cáo công tác chăm sóc, nuôi dưỡng và giáo dục trẻ ${periodName}`,
  },
  YEAR_END: {
    key: 'YEAR_END',
    name: 'Báo cáo tổng kết thực hiện nhiệm vụ năm học và thi đua khen thưởng',
    shortName: 'Báo cáo tổng kết cuối năm',
    defaultTitle: (_: string, schoolYear = '2026-2027') => `Báo cáo tổng kết thực hiện nhiệm vụ năm học và công tác thi đua khen thưởng năm học ${schoolYear}`,
  },
  NUTRITION_BOARDING: {
    key: 'NUTRITION_BOARDING',
    name: 'Báo cáo công tác quản lý nuôi dưỡng bán trú và quyết toán tiền ăn hoàn trả',
    shortName: 'Báo cáo bán trú & tiền ăn',
    defaultTitle: (periodName: string) => `Báo cáo công tác quản lý nuôi dưỡng bán trú và quyết toán tiền ăn hoàn trả ${periodName}`,
  },
  HEALTH_GROWTH: {
    key: 'HEALTH_GROWTH',
    name: 'Báo cáo kết quả theo dõi sức khỏe và tình trạng dinh dưỡng trẻ',
    shortName: 'Báo cáo sức khỏe & dinh dưỡng',
    defaultTitle: (periodName: string) => `Báo cáo kết quả theo dõi sức khỏe và tình trạng dinh dưỡng trẻ ${periodName}`,
  },
  ATTENDANCE: {
    key: 'ATTENDANCE',
    name: 'Báo cáo công tác duy trì sĩ số, tỷ lệ chuyên cần và phổ cập GDMN trẻ 5 tuổi',
    shortName: 'Báo cáo chuyên cần & phổ cập 5T',
    defaultTitle: (periodName: string) => `Báo cáo duy trì sĩ số, tỷ lệ chuyên cần và phổ cập GDMN trẻ 5 tuổi ${periodName}`,
  },
  ACTIVITY_EVALUATION: {
    key: 'ACTIVITY_EVALUATION',
    name: 'Báo cáo đánh giá chất lượng thực hiện các hoạt động giáo dục trong tháng',
    shortName: 'Báo cáo hoạt động giáo dục',
    defaultTitle: (periodName: string) => `Báo cáo đánh giá chất lượng thực hiện các hoạt động giáo dục ${periodName}`,
  },
};

export const REPORT_PERIODS = [
  { id: 'thang_09', name: 'Tháng 9 (Đầu năm học)' },
  { id: 'thang_10', name: 'Tháng 10' },
  { id: 'thang_11', name: 'Tháng 11' },
  { id: 'thang_12', name: 'Tháng 12 (Sơ kết HKI)' },
  { id: 'thang_01', name: 'Tháng 1' },
  { id: 'thang_02', name: 'Tháng 2' },
  { id: 'thang_03', name: 'Tháng 3' },
  { id: 'thang_04', name: 'Tháng 4' },
  { id: 'thang_05', name: 'Tháng 5' },
  { id: 'cuoi_nam', name: 'Tổng kết cuối năm học' },
];

export async function getClassReport(
  classId: string,
  schoolYear = '2026-2027',
  period = 'thang_10',
  reportType: ReportType = 'MONTHLY'
): Promise<ClassReportItem | null> {
  const q = new URLSearchParams({ classId, schoolYear, period, reportType });
  const res = await fetch(`/api/class-reports?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

export async function getClassReportAutoFill(
  classId: string,
  schoolYear = '2026-2027',
  period = 'thang_10',
  reportType: ReportType = 'MONTHLY'
): Promise<{ metrics: ClassReportMetrics }> {
  const q = new URLSearchParams({ classId, schoolYear, period, reportType });
  const res = await fetch(`/api/class-reports/auto-fill?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tính toán tự động số liệu báo cáo lớp.');
  return await res.json();
}

export async function saveOrSubmitClassReport(data: {
  action: 'SAVE_DRAFT' | 'SUBMIT_REPORT';
  classId: string;
  schoolYear: string;
  period: string;
  reportType?: ReportType;
  title?: string;
  teacherName?: string;
  metricsSnapshot: ClassReportMetrics;
  teacherNotes?: string;
  teacherProposals?: string;
}): Promise<{ success: boolean; status: string; message: string }> {
  const res = await fetch('/api/class-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi lưu/nộp báo cáo lớp.');
  }
  return await res.json();
}

export async function reviewClassReport(data: {
  action: 'APPROVE_REPORT' | 'REQUEST_REVISION';
  classId: string;
  schoolYear: string;
  period: string;
  reportType?: ReportType;
  adminFeedback?: string;
}): Promise<{ success: boolean; status: string; message: string }> {
  const res = await fetch('/api/class-reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi phê duyệt/phản hồi báo cáo lớp.');
  }
  return await res.json();
}

export async function getAllClassReports(
  schoolYear = '2026-2027',
  period = 'thang_10',
  reportType: ReportType = 'MONTHLY'
): Promise<AllClassReportsOverview> {
  const q = new URLSearchParams({ schoolYear, period, reportType });
  const res = await fetch(`/api/class-reports/all?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách báo cáo các lớp.');
  return await res.json();
}

export async function getSchoolWideReport(
  schoolYear = '2026-2027',
  period = 'thang_10',
  reportType: ReportType = 'MONTHLY'
): Promise<SchoolWideReportData> {
  const q = new URLSearchParams({ schoolYear, period, reportType });
  const res = await fetch(`/api/class-reports/school-wide?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải báo cáo tổng hợp toàn trường.');
  return await res.json();
}
