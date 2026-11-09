/**
 * Service Xử lý Dữ liệu Báo cáo Lớp Học của Giáo Viên
 * File size: < 120 dòng (Tuân thủ quy tắc kiến trúc dự án)
 */

import { TeacherReportId, TeacherContextInfo } from './types';
import {
  ClassReportItem,
  getClassReport,
  getClassReportAutoFill,
  saveOrSubmitClassReport,
  getRealDatabaseClasses,
  DatabaseClassInfo,
} from '@/services/classReports';

export function getAllAvailableClasses(): DatabaseClassInfo[] {
  return getRealDatabaseClasses();
}

export async function getLiveTeacherContext(customClassId?: string): Promise<TeacherContextInfo> {
  const classes = getRealDatabaseClasses();

  if (customClassId) {
    const found = classes.find((c) => c.id === customClassId);
    if (found) {
      return {
        teacherId: found.teacherId,
        teacherName: found.teacherName,
        classId: found.id,
        className: found.name,
        gradeName: found.gradeName,
        schoolYear: found.schoolYear,
        totalStudents: found.totalStudents,
      };
    }
  }

  // Check localStorage if teacher selected a class previously
  if (typeof window !== 'undefined') {
    try {
      const savedClassId = localStorage.getItem('teacher_selected_class_id');
      if (savedClassId) {
        const found = classes.find((c) => c.id === savedClassId);
        if (found) {
          return {
            teacherId: found.teacherId,
            teacherName: found.teacherName,
            classId: found.id,
            className: found.name,
            gradeName: found.gradeName,
            schoolYear: found.schoolYear,
            totalStudents: found.totalStudents,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  // Fallback to first class
  const defaultClass = classes[0] || {
    id: '6aed31d3-bfb0-4c19-838a-6413c9f3cd51',
    name: 'Lớp Mầm 1',
    gradeName: 'Khối Mầm',
    teacherName: 'Cô Đỗ Khánh Ly',
    teacherId: '20c6ed16-9479-4d2e-964e-2a9588a067ef',
    totalStudents: 25,
    schoolYear: '2026-2027',
  };

  return {
    teacherId: defaultClass.teacherId,
    teacherName: defaultClass.teacherName,
    classId: defaultClass.id,
    className: defaultClass.name,
    gradeName: defaultClass.gradeName,
    schoolYear: defaultClass.schoolYear,
    totalStudents: defaultClass.totalStudents,
  };
}

export async function fetchOrCreateTeacherReport(
  teacherCtx: TeacherContextInfo,
  reportId: TeacherReportId,
  period: string,
): Promise<ClassReportItem> {
  const existing = await getClassReport(teacherCtx.classId, reportId, period);
  if (existing) {
    return existing;
  }
  return await getClassReportAutoFill(
    teacherCtx.classId,
    reportId,
    period,
    teacherCtx.className,
    teacherCtx.gradeName,
    teacherCtx.teacherName,
  );
}

export async function submitTeacherReportToAdmin(
  report: ClassReportItem,
): Promise<ClassReportItem> {
  return await saveOrSubmitClassReport(report, 'SUBMITTED');
}

export async function saveTeacherReportDraft(
  report: ClassReportItem,
): Promise<ClassReportItem> {
  return await saveOrSubmitClassReport(report, 'DRAFT');
}

export function getReportStatusBadge(status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED') {
  switch (status) {
    case 'SUBMITTED':
      return { label: 'Đã gửi BGH', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'APPROVED':
      return { label: 'BGH đã duyệt', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'REJECTED':
      return { label: 'Cần sửa đổi', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    default:
      return { label: 'Bản nháp', color: 'bg-amber-100 text-amber-800 border-amber-200' };
  }
}
