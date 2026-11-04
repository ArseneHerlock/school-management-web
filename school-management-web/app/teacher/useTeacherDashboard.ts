import { useState, useEffect } from 'react';
import { currentUser } from '@/services/client';
import { getStaffByUserId } from '@/services/staff';
import { getClasses } from '@/services/classes';
import { getStudents, Student } from '@/services/students';
import { getDailyAttendance, AttendanceRecord } from '@/services/attendance';
import { getAssessments, getCriteria, getActivities } from '@/services/development';
import {
  fetchTeacherNotifications,
  AppNotification,
  REALTIME_NOTIFICATION_EVENT,
} from '@/services/notifications';
import { getLeaves } from '@/services/leave';
import { getSchedules } from '@/services/schedule';
import { SafetyItem } from './components/dashboard/ClassroomSafetyWatchlist';
import {
  buildTeachersInClass,
  extractSafetyItems,
  extractAssessmentStats,
  calculateAttendanceMetrics,
} from './teacherDashboardHelpers';

export function useTeacherDashboard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [assignedClassInfo, setAssignedClassInfo] = useState<{
    name: string;
    room: string;
    ageGroup: string;
    totalStudents: number;
    currentTeacher: string;
    teachers: Array<{
      id: string;
      name: string;
      role: string;
      avatar: string;
      color?: string;
    }>;
  }>({
    name: 'Đang tải thông tin lớp...',
    room: '',
    ageGroup: '',
    totalStudents: 0,
    currentTeacher: '',
    teachers: [],
  });

  const [classStudentsList, setClassStudentsList] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [pendingLeaveCount, setPendingLeaveCount] = useState<number>(0);
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>([]);
  const [todayScheduleItems, setTodayScheduleItems] = useState<any[]>([]);
  const [teacherAlerts, setTeacherAlerts] = useState<AppNotification[]>([]);
  const [assessmentStatistics, setAssessmentStatistics] = useState({
    totalAssessments: 0,
    passCount: 0,
    failCount: 0,
    totalCriteria: 0,
    totalActivities: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  async function loadTeacherDashboardData(): Promise<void> {
    try {
      const user = currentUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const todayIsoDate = new Date().toISOString().slice(0, 10);

      let cachedStaff: any = null;
      let cachedClass: any = null;
      try {
        const storedStaff = sessionStorage.getItem(`teacher_staff_${user.id}`);
        const storedClass = sessionStorage.getItem(`teacher_class_${user.id}`);
        if (storedStaff && storedClass) {
          cachedStaff = JSON.parse(storedStaff);
          cachedClass = JSON.parse(storedClass);
        }
      } catch {}

      const independentPromises = {
        attendance: getDailyAttendance(todayIsoDate).catch(() => []),
        leaves: getLeaves({ subjectType: 'Child' }).catch(() => []),
        assessments: getAssessments({ page: 1, pageSize: 100 }).catch(() => null),
        criteria: getCriteria({ page: 1, pageSize: 50 }).catch(() => null),
        activities: getActivities({ page: 1, pageSize: 50 }).catch(() => null),
      };

      let activeStaff = cachedStaff;
      let activeClass = cachedClass;

      const staffAndClassPromise = (!activeStaff || !activeClass)
        ? Promise.all([
            getStaffByUserId(user.id).catch(() => null),
            getClasses().catch(() => []),
          ]).then(([staffMember, allClassList]) => {
            activeStaff = staffMember;
            const matched = allClassList.find(
              (classItem: any) =>
                staffMember?.staffId &&
                (classItem.giaoVienChuNhiemId === staffMember.staffId ||
                 classItem.giaoVienPhuId === staffMember.staffId)
            );
            activeClass = matched || null;
            if (activeStaff && activeClass) {
              try {
                sessionStorage.setItem(`teacher_staff_${user.id}`, JSON.stringify(activeStaff));
                sessionStorage.setItem(`teacher_class_${user.id}`, JSON.stringify(activeClass));
              } catch {}
            }
            return { staffMember, matchedClass: activeClass };
          })
        : Promise.resolve({ staffMember: activeStaff, matchedClass: activeClass });

      let studentsPromise: Promise<Student[]>;
      let schedulesPromise: Promise<any[]>;

      if (activeClass?.id) {
        studentsPromise = getStudents({ lopId: activeClass.id }).catch(() => []);
        schedulesPromise = getSchedules({
          from: todayIsoDate,
          to: todayIsoDate,
          classId: activeClass.id,
        }).catch(() => []);
      } else {
        studentsPromise = staffAndClassPromise.then(({ matchedClass }) =>
          matchedClass?.id ? getStudents({ lopId: matchedClass.id }).catch(() => []) : []
        );
        schedulesPromise = staffAndClassPromise.then(({ matchedClass }) =>
          matchedClass?.id
            ? getSchedules({
                from: todayIsoDate,
                to: todayIsoDate,
                classId: matchedClass.id,
              }).catch(() => [])
            : []
        );
      }

      const [
        classIdentity,
        attendanceToday,
        leavesAll,
        assessmentsRes,
        criteriaRes,
        activitiesRes,
        classStudents,
        schedulesToday,
      ] = await Promise.all([
        staffAndClassPromise,
        independentPromises.attendance,
        independentPromises.leaves,
        independentPromises.assessments,
        independentPromises.criteria,
        independentPromises.activities,
        studentsPromise,
        schedulesPromise,
      ]);

      const { staffMember, matchedClass } = classIdentity;

      if (!matchedClass) {
        setAssignedClassInfo({
          name: 'Chưa được phân công lớp',
          room: 'Chưa xếp phòng',
          ageGroup: 'Năm học 2026 - 2027',
          totalStudents: 0,
          currentTeacher: staffMember?.staffId || '',
          teachers: staffMember
            ? [
                {
                  id: staffMember.staffId,
                  name: staffMember.fullName,
                  role: 'Giáo viên',
                  avatar: 'GV',
                  color: '#f97316',
                },
              ]
            : [],
        });
        setIsLoading(false);
        return;
      }

      setClassStudentsList(classStudents);
      setAttendanceRecords(attendanceToday);

      const teachersInClass = buildTeachersInClass(staffMember, matchedClass);
      setAssignedClassInfo({
        name: matchedClass.tenLop,
        room: matchedClass.phongHoc || 'Phòng học chính',
        ageGroup: matchedClass.namHoc ? `Năm học ${matchedClass.namHoc}` : 'Khối mầm non',
        totalStudents: classStudents.length,
        currentTeacher: staffMember?.staffId || '',
        teachers: teachersInClass,
      });

      const { realSafety, pendingCount } = extractSafetyItems(leavesAll, classStudents);
      setPendingLeaveCount(pendingCount);
      setSafetyItems(realSafety);

      if (Array.isArray(schedulesToday)) {
        const classFiltered = schedulesToday.filter(
          (s: any) =>
            s.isSchoolWide ||
            String(s.classId || s.lopId) === String(matchedClass.id)
        );
        setTodayScheduleItems(classFiltered);
      }

      setAssessmentStatistics(
        extractAssessmentStats(assessmentsRes, criteriaRes, activitiesRes, classStudents)
      );

      setIsLoading(false);
      fetchTeacherNotifications()
        .then((notifs) => setTeacherAlerts(notifs))
        .catch(() => {});
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTeacherDashboardData();

    const handleRealtimeRefresh = () => {
      fetchTeacherNotifications()
        .then((notifs) => setTeacherAlerts(notifs))
        .catch(() => {});
      const todayIsoDate = new Date().toISOString().slice(0, 10);
      getDailyAttendance(todayIsoDate)
        .then((records) => {
          if (Array.isArray(records)) setAttendanceRecords(records);
        })
        .catch(() => {});
    };

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    return () => {
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    };
  }, []);

  const { presentCount, absentCount, totalStudents, attendanceRate } =
    calculateAttendanceMetrics(classStudentsList, attendanceRecords);

  const todayDateFormatted = currentTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return {
    currentTime,
    isLoading,
    assignedClassInfo,
    classStudentsList,
    pendingLeaveCount,
    safetyItems,
    todayScheduleItems,
    teacherAlerts,
    assessmentStatistics,
    presentCount,
    absentCount,
    totalStudents,
    attendanceRate,
    todayDateFormatted,
  };
}
