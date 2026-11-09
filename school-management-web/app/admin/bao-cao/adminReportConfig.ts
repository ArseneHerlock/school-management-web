/**
 * Danh mục 8 Báo cáo Quản trị Ban Giám Hiệu theo Chuẩn Bộ GD&ĐT
 * File size: < 150 dòng (Tuân thủ quy tắc kiến trúc dự án)
 */

import { AdminReportMeta } from './types';

export const ADMIN_REPORTS_CONFIG: AdminReportMeta[] = [
  {
    id: 'BGH_SI_SO',
    title: 'Báo cáo tổng hợp sĩ số trẻ',
    cycle: 'Hằng ngày / tháng',
    category: 'DAILY_MONTH',
    summary: 'Tổng số trẻ toàn trường, theo khối Mầm/Chồi/Lá, số lớp, số trẻ từng lớp, trẻ mới nhập học, chuyển trường, nghỉ học.',
    iconName: 'Users',
    colorScheme: {
      bg: 'bg-blue-50/70',
      border: 'border-blue-200',
      text: 'text-blue-700',
      badge: 'bg-blue-100 text-blue-800',
    },
  },
  {
    id: 'BGH_CHUYEN_CAN',
    title: 'Báo cáo tình hình chuyên cần',
    cycle: 'Hằng ngày / tháng',
    category: 'DAILY_MONTH',
    summary: 'Số trẻ đi học, nghỉ học, nghỉ có phép, nghỉ không phép, tỷ lệ chuyên cần theo từng lớp và toàn trường.',
    iconName: 'CalendarCheck',
    colorScheme: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'BGH_PHAT_TRIEN',
    title: 'Báo cáo tình hình phát triển trẻ',
    cycle: 'Tháng / học kỳ',
    category: 'PERIODIC',
    summary: 'Tổng hợp kết quả phát triển thể chất, nhận thức, ngôn ngữ, tình cảm – xã hội, thẩm mỹ; số trẻ đạt và chưa đạt từng lĩnh vực.',
    iconName: 'TrendingUp',
    colorScheme: {
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-200',
      text: 'text-indigo-700',
      badge: 'bg-indigo-100 text-indigo-800',
    },
  },
  {
    id: 'BGH_SUC_KHOE',
    title: 'Báo cáo sức khỏe trẻ',
    cycle: 'Tháng / quý',
    category: 'PERIODIC',
    summary: 'Chiều cao, cân nặng, BMI, tình trạng dinh dưỡng, trẻ suy dinh dưỡng, thấp còi, thừa cân, béo phì theo chuẩn WHO/Bộ Y tế.',
    iconName: 'HeartPulse',
    colorScheme: {
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  },
  {
    id: 'BGH_KHEN_THUONG',
    title: 'Báo cáo thi đua – khen thưởng',
    cycle: 'Tháng / học kỳ / năm học',
    category: 'PERIODIC',
    summary: 'Danh sách trẻ đạt danh hiệu Bé chăm ngoan xuất sắc, thành tích tốt, kết quả chuyên cần, kết quả phát triển và tiêu chí xét thưởng.',
    iconName: 'Award',
    colorScheme: {
      bg: 'bg-amber-50/70',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
    },
  },
  {
    id: 'BGH_HOAT_DONG',
    title: 'Báo cáo tình hình hoạt động giáo dục',
    cycle: 'Tháng / học kỳ',
    category: 'PERIODIC',
    summary: 'Các hoạt động đã tổ chức, kế hoạch giáo dục đã thực hiện, hoạt động ngoại khóa trải nghiệm, kết quả thực hiện chương trình.',
    iconName: 'BookOpen',
    colorScheme: {
      bg: 'bg-cyan-50/70',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      badge: 'bg-cyan-100 text-cyan-800',
    },
  },
  {
    id: 'BGH_AN_TOAN',
    title: 'Báo cáo tình hình an toàn trẻ',
    cycle: 'Khi phát sinh / tháng',
    category: 'DAILY_MONTH',
    summary: 'Số trường hợp tai nạn, chấn thương, sự cố phát sinh, trẻ bị ốm tại trường, biện pháp xử lý kịp thời và kết quả giải quyết.',
    iconName: 'ShieldAlert',
    colorScheme: {
      bg: 'bg-orange-50/70',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-800',
    },
  },
  {
    id: 'BGH_TONG_KET_NAM',
    title: 'Báo cáo tổng kết năm học',
    cycle: 'Cuối năm học',
    category: 'YEAR_END',
    summary: 'Tổng số trẻ, kết quả chăm sóc nuôi dưỡng và giáo dục, sức khỏe, chuyên cần, thi đua, đội ngũ giáo viên và cơ sở vật chất.',
    iconName: 'Trophy',
    colorScheme: {
      bg: 'bg-purple-50/70',
      border: 'border-purple-200',
      text: 'text-purple-700',
      badge: 'bg-purple-100 text-purple-800',
    },
  },
];
