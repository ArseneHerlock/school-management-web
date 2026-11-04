import { Student } from '@/services/students';
import { AttendanceRecord } from '@/services/attendance';
import { SafetyItem } from './components/dashboard/ClassroomSafetyWatchlist';

export function buildTeachersInClass(staffMember: any, matchedClass: any) {
  const teachersInClass: Array<{ id: string; name: string; role: string; avatar: string; color?: string }> = [];
  if (staffMember) {
    const isHead = matchedClass.giaoVienChuNhiemId === staffMember.staffId;
    teachersInClass.push({
      id: staffMember.staffId,
      name: staffMember.fullName,
      role: isHead ? 'Giáo viên chủ nhiệm (GV1)' : 'Giáo viên đồng phụ trách (GV2)',
      avatar: staffMember.fullName
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .slice(-2)
        .toUpperCase(),
      color: isHead ? '#f97316' : '#0ea5e9',
    });
  }
  if (matchedClass.tenGiaoVienPhu && matchedClass.giaoVienPhuId !== staffMember?.staffId) {
    teachersInClass.push({
      id: matchedClass.giaoVienPhuId || 'gv2',
      name: matchedClass.tenGiaoVienPhu,
      role: 'Giáo viên đồng phụ trách (GV2)',
      avatar: matchedClass.tenGiaoVienPhu
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .slice(-2)
        .toUpperCase(),
      color: '#0ea5e9',
    });
  } else if (matchedClass.tenGiaoVienChuNhiem && matchedClass.giaoVienChuNhiemId !== staffMember?.staffId) {
    teachersInClass.unshift({
      id: matchedClass.giaoVienChuNhiemId || 'gv1',
      name: matchedClass.tenGiaoVienChuNhiem,
      role: 'Giáo viên chủ nhiệm (GV1)',
      avatar: matchedClass.tenGiaoVienChuNhiem
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .slice(-2)
        .toUpperCase(),
      color: '#f97316',
    });
  }
  return teachersInClass;
}

export function extractSafetyItems(leavesAll: any[], classStudents: Student[]) {
  if (!Array.isArray(leavesAll)) return { realSafety: [], pendingCount: 0 };

  const studentMap = new Map(classStudents.map((s) => [s.id, s.tenHocSinh]));
  const studentIdsSet = new Set(classStudents.map((s) => s.id));
  const pendingForMyClass = leavesAll.filter((leaveItem: any) => {
    const isPending =
      String(leaveItem.status).toLowerCase() === '0' ||
      String(leaveItem.status).toLowerCase() === 'pending';
    return isPending && studentIdsSet.has(leaveItem.childId);
  });

  const realSafety: SafetyItem[] = [];
  leavesAll.forEach((l: any) => {
    if (studentIdsSet.has(l.childId)) {
      const isMed = String(l.type || l.loaiDon || '').toLowerCase().includes('thuốc');
      realSafety.push({
        id: String(l.id || Math.random()),
        childName: studentMap.get(l.childId) || 'Học sinh',
        type: isMed ? 'medication' : 'leave',
        title: isMed ? 'Đơn dặn thuốc' : 'Đơn xin nghỉ học',
        detail: l.reason || l.lyDo || 'Đơn gửi từ phụ huynh qua cổng dịch vụ',
        timeBadge: l.startDate ? String(l.startDate).slice(0, 10) : undefined,
        status: l.status === 1 || l.status === 'Approved' ? 'completed' : 'pending',
      });
    }
  });

  return { realSafety, pendingCount: pendingForMyClass.length };
}

export function extractAssessmentStats(
  assessmentsRes: any,
  criteriaRes: any,
  activitiesRes: any,
  classStudents: Student[]
) {
  if (!assessmentsRes?.items) {
    return {
      totalAssessments: 0,
      passCount: 0,
      failCount: 0,
      totalCriteria: 0,
      totalActivities: 0,
    };
  }

  const studentIdsSet = new Set(classStudents.map((s) => s.id));
  const assessmentList = assessmentsRes.items.filter((item: any) =>
    studentIdsSet.has(item.childId)
  );
  const passCount = assessmentList.filter((item: any) => item.result === true).length;
  const failCount = assessmentList.filter((item: any) => item.result === false).length;
  const totalCrit = criteriaRes?.total || criteriaRes?.items?.length || 0;
  const totalAct = activitiesRes?.total || activitiesRes?.items?.length || 0;

  return {
    totalAssessments: assessmentList.length,
    passCount,
    failCount,
    totalCriteria: totalCrit,
    totalActivities: totalAct,
  };
}

export function calculateAttendanceMetrics(
  classStudentsList: Student[],
  attendanceRecords: AttendanceRecord[]
) {
  const studentIdsOfClass = new Set(classStudentsList.map((student) => student.id));
  const classAttendanceToday = attendanceRecords.filter((record) =>
    studentIdsOfClass.has(record.hocSinhId)
  );

  const presentCount = classAttendanceToday.filter(function (record) {
    const status = String(record.trangThai).toLowerCase();
    return status.includes('có mặt') || status.includes('muộn');
  }).length;

  const absentCount = classAttendanceToday.filter(function (record) {
    const status = String(record.trangThai).toLowerCase();
    return status.includes('vắng') || status.includes('nghỉ');
  }).length;

  const totalStudents = classStudentsList.length;
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return { presentCount, absentCount, totalStudents, attendanceRate };
}
