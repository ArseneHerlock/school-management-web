/**
 * Kiểu dữ liệu cho Trung tâm Báo cáo Giáo viên Lớp học
 * File size: < 120 dòng (Tuân thủ quy tắc kiến trúc dự án)
 */

export type TeacherReportId =
  | 'GV_DIEM_DANH'
  | 'GV_SUC_KHOE'
  | 'GV_CHIEU_CAO_CAN_NANG'
  | 'GV_DANH_GIA_PHAT_TRIEN'
  | 'GV_HOAT_DONG_LOP'
  | 'GV_TINH_HINH_LOP'
  | 'GV_BAN_GIAO_TRE';

export type TeacherReportCategory = 'ALL' | 'DAILY' | 'WEEK_MONTH' | 'PERIODIC';

export interface TeacherReportMeta {
  id: TeacherReportId;
  title: string;
  cycle: string;
  category: TeacherReportCategory;
  summary: string;
  iconName: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
}

export interface TeacherContextInfo {
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  gradeName: string;
  schoolYear: string;
  totalStudents: number;
}
