/**
 * Dữ liệu 12 Lớp học thực tế cho Ban Giám Hiệu
 * File size: < 160 dòng (Tuân thủ nghiêm ngặt quy tắc kiến trúc dự án)
 */

import { GradeClassSummaryRow } from './types';

interface ClassSeed {
  gradeName: string;
  className: string;
  teacherName: string;
  totalStudents: number;
  maleCount: number;
  newEnrolled: number;
  educationTheme: string;
  activityCount: number;
  outdoorCount: number;
  firstAidCount: number;
  feverCount: number;
  safetyStatus: string;
  termRank: string;
}

const CLASS_SEEDS: ClassSeed[] = [
  // Khối Mầm (4 lớp, 25 trẻ/lớp = 100 trẻ)
  { gradeName: 'Khối Mầm', className: 'Lớp Mầm 1', teacherName: 'Cô Đỗ Khánh Ly', totalStudents: 25, maleCount: 13, newEnrolled: 25, educationTheme: 'Bé làm quen trường lớp Mầm non', activityCount: 14, outdoorCount: 3, firstAidCount: 1, feverCount: 1, safetyStatus: 'An toàn tuyệt đối - Đã sơ cứu nhẹ', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Mầm', className: 'Lớp Mầm 2', teacherName: 'Cô Ngô Minh Trang', totalStudents: 25, maleCount: 12, newEnrolled: 25, educationTheme: 'Đồ chơi và những người bạn thân', activityCount: 15, outdoorCount: 3, firstAidCount: 0, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Mầm', className: 'Lớp Mầm 3', teacherName: 'Cô Dương Kim Ngân', totalStudents: 25, maleCount: 14, newEnrolled: 25, educationTheme: 'Bé và các con vật nuôi dễ thương', activityCount: 14, outdoorCount: 2, firstAidCount: 0, feverCount: 1, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Mầm', className: 'Lớp Mầm 4', teacherName: 'Cô Trịnh Mỹ Duyên', totalStudents: 25, maleCount: 13, newEnrolled: 25, educationTheme: 'Sắc màu thiên nhiên quanh em', activityCount: 15, outdoorCount: 3, firstAidCount: 0, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Xuất Sắc' },
  // Khối Chồi (4 lớp, 30 trẻ/lớp = 120 trẻ)
  { gradeName: 'Khối Chồi', className: 'Lớp Chồi 1', teacherName: 'Cô Nguyễn Thị Mai', totalStudents: 30, maleCount: 16, newEnrolled: 1, educationTheme: 'Thế giới thực vật và bốn mùa', activityCount: 16, outdoorCount: 4, firstAidCount: 0, feverCount: 1, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Xuất Sắc' },
  { gradeName: 'Khối Chồi', className: 'Lớp Chồi 2', teacherName: 'Cô Trần Thu Hà', totalStudents: 30, maleCount: 15, newEnrolled: 0, educationTheme: 'Phương tiện giao thông quanh ta', activityCount: 16, outdoorCount: 3, firstAidCount: 1, feverCount: 0, safetyStatus: 'An toàn - Đã sát khuẩn nhẹ', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Chồi', className: 'Lớp Chồi 3', teacherName: 'Cô Lê Hồng Nhung', totalStudents: 30, maleCount: 14, newEnrolled: 0, educationTheme: 'Những nghề nghiệp bé yêu thích', activityCount: 15, outdoorCount: 3, firstAidCount: 0, feverCount: 1, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Chồi', className: 'Lớp Chồi 4', teacherName: 'Cô Phạm Thùy Linh', totalStudents: 30, maleCount: 15, newEnrolled: 1, educationTheme: 'Nước và các hiện tượng tự nhiên', activityCount: 17, outdoorCount: 4, firstAidCount: 0, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Xuất Sắc' },
  // Khối Lá (4 lớp, 35 trẻ/lớp = 140 trẻ)
  { gradeName: 'Khối Lá', className: 'Lớp Lá 1', teacherName: 'Cô Hoàng Bích Ngọc', totalStudents: 35, maleCount: 18, newEnrolled: 0, educationTheme: 'Hành trang sẵn sàng vào lớp 1', activityCount: 18, outdoorCount: 5, firstAidCount: 1, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Xuất Sắc' },
  { gradeName: 'Khối Lá', className: 'Lớp Lá 2', teacherName: 'Cô Vũ Phương Thảo', totalStudents: 35, maleCount: 17, newEnrolled: 0, educationTheme: 'Khám phá khoa học diệu kỳ', activityCount: 18, outdoorCount: 4, firstAidCount: 0, feverCount: 1, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Lá', className: 'Lớp Lá 3', teacherName: 'Cô Bùi Thanh Hương', totalStudents: 35, maleCount: 19, newEnrolled: 0, educationTheme: 'Quê hương và Bác Hồ kính yêu', activityCount: 17, outdoorCount: 4, firstAidCount: 0, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Tiên Tiến' },
  { gradeName: 'Khối Lá', className: 'Lớp Lá 4', teacherName: 'Cô Đặng Thùy Dương', totalStudents: 35, maleCount: 18, newEnrolled: 0, educationTheme: 'Toán học vui và tư duy sáng tạo', activityCount: 19, outdoorCount: 5, firstAidCount: 0, feverCount: 0, safetyStatus: 'An toàn tuyệt đối', termRank: 'Lớp Xuất Sắc' },
];

export function buildRealAdminClasses(): GradeClassSummaryRow[] {
  return CLASS_SEEDS.map((s, idx) => {
    const female = s.totalStudents - s.maleCount;
    const isPerfect = idx % 3 === 0;
    const present = isPerfect ? s.totalStudents : s.totalStudents - 1;
    const excused = isPerfect ? 0 : 1;
    const attRate = Number(((present / s.totalStudents) * 100).toFixed(1));

    const normalNutr = s.totalStudents - (idx % 2 === 0 ? 2 : 1);
    const nutrRate = Number(((normalNutr / s.totalStudents) * 100).toFixed(1));

    const passDev = s.totalStudents - (idx % 3 === 0 ? 1 : 2);
    const devRate = Number(((passDev / s.totalStudents) * 100).toFixed(1));

    const goodChild = Math.round(s.totalStudents * 0.9);
    const awardRate = Number(((goodChild / s.totalStudents) * 100).toFixed(1));

    return {
      gradeName: s.gradeName,
      className: s.className,
      teacherName: s.teacherName,
      totalStudents: s.totalStudents,
      maleCount: s.maleCount,
      femaleCount: female,
      newEnrolled: s.newEnrolled,
      transferred: 0,
      dropped: 0,
      presentCount: present,
      absentExcused: excused,
      absentUnexcused: 0,
      attendanceRate: attRate,
      passPhysical: s.totalStudents - 1,
      passCognitive: s.totalStudents - 1,
      passLanguage: s.totalStudents - 2,
      passSocial: s.totalStudents - 1,
      passAesthetic: s.totalStudents - 1,
      passedDevRate: devRate,
      normalNutritionCount: normalNutr,
      malnutritionCount: s.totalStudents - normalNutr,
      stuntedCount: 0,
      overweightCount: 0,
      normalNutritionRate: nutrRate,
      monthlyGoodChildCount: goodChild,
      exemplaryCount: Math.round(s.totalStudents * 0.15),
      awardRate,
      educationTheme: s.educationTheme,
      activityCount: s.activityCount,
      outdoorActivityCount: s.outdoorCount,
      activityPassRate: Number((95 + (idx % 4)).toFixed(1)),
      feverSickCount: s.feverCount,
      firstAidCount: s.firstAidCount,
      incidentCount: 0,
      safetyStatus: s.safetyStatus,
      termRank: s.termRank,
    };
  });
}
