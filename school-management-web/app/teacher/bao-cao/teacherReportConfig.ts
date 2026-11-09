/**
 * Danh mục 7 Báo cáo Sư phạm Dành cho Giáo viên Lớp học
 * File size: < 130 dòng (Tuân thủ quy tắc kiến trúc dự án)
 */

import { TeacherReportMeta } from './types';

export const TEACHER_REPORTS_CONFIG: TeacherReportMeta[] = [
  {
    id: 'GV_DIEM_DANH',
    title: 'Báo cáo điểm danh trẻ',
    cycle: 'Hằng ngày',
    category: 'DAILY',
    summary: 'Danh sách trẻ đi học, nghỉ học, nghỉ có phép, nghỉ không phép và tỷ lệ chuyên cần của lớp trong ngày/tháng.',
    iconName: 'CalendarCheck',
    colorScheme: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'GV_SUC_KHOE',
    title: 'Báo cáo tình hình sức khỏe trẻ',
    cycle: 'Hằng ngày / khi phát sinh',
    category: 'DAILY',
    summary: 'Tình trạng sức khỏe, biểu hiện bất thường, trẻ sốt, ho, mệt mỏi, chấn thương hoặc dặn dò thuốc uống từ phụ huynh.',
    iconName: 'HeartPulse',
    colorScheme: {
      bg: 'bg-rose-50/70',
      border: 'border-rose-200',
      text: 'text-rose-700',
      badge: 'bg-rose-100 text-rose-800',
    },
  },
  {
    id: 'GV_CHIEU_CAO_CAN_NANG',
    title: 'Báo cáo theo dõi chiều cao – cân nặng',
    cycle: 'Tháng / quý',
    category: 'PERIODIC',
    summary: 'Kết quả cân đo chiều cao, cân nặng từng trẻ, đối chiếu chuẩn tăng trưởng định kỳ và xác định trẻ cần theo dõi đặc biệt.',
    iconName: 'TrendingUp',
    colorScheme: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
  },
  {
    id: 'GV_DANH_GIA_PHAT_TRIEN',
    title: 'Báo cáo đánh giá sự phát triển của trẻ',
    cycle: 'Tháng / học kỳ',
    category: 'PERIODIC',
    summary: 'Kết quả quan sát và đánh giá trẻ theo 5 lĩnh vực phát triển GDMN, tiêu chí đạt/chưa đạt, nhận xét và đề xuất hỗ trợ.',
    iconName: 'Sparkles',
    colorScheme: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-800',
    },
  },
  {
    id: 'GV_HOAT_DONG_LOP',
    title: 'Báo cáo hoạt động lớp',
    cycle: 'Tuần / tháng',
    category: 'WEEK_MONTH',
    summary: 'Các hoạt động học tập, vui chơi ngoài trời, trải nghiệm đã thực hiện, mức độ tham gia và kết quả đạt của trẻ.',
    iconName: 'BookOpen',
    colorScheme: {
      bg: 'bg-cyan-50/70',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      badge: 'bg-cyan-100 text-cyan-800',
    },
  },
  {
    id: 'GV_TINH_HINH_LOP',
    title: 'Báo cáo tình hình lớp học',
    cycle: 'Tuần / tháng',
    category: 'WEEK_MONTH',
    summary: 'Sĩ số biến động, tình trạng thích nghi của trẻ, tình hình trao đổi phối hợp với phụ huynh và các vấn đề phát sinh.',
    iconName: 'Users',
    colorScheme: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'GV_BAN_GIAO_TRE',
    title: 'Báo cáo bàn giao trẻ',
    cycle: 'Hằng ngày',
    category: 'DAILY',
    summary: 'Danh sách trẻ được bàn giao cuối buổi, thời gian đón trả, người đón hợp lệ, các lưu ý về sức khỏe và tư trang.',
    iconName: 'ShieldCheck',
    colorScheme: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
    },
  },
];
