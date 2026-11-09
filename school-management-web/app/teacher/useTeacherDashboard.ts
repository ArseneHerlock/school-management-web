import { useState, useEffect } from 'react';
import { currentUser } from '@/services/client';
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
  getInitialDashboardCache,
} from './teacherDashboardHelpers';
import { loadLiveTeacherContext, loadLiveTeacherChildren } from './data';

function getInitialMetricsCache() {
  if (typeof window === 'undefined') return null;
  try {
    const user = currentUser();
    if (!user?.id) return null;
    const stored = sessionStorage.getItem(`teacher_today_metrics_${user.id}`);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

export function useTeacherDashboard() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const initialCache = getInitialDashboardCache();
  const initialMetrics = getInitialMetricsCache();
  const [isLoading, setIsLoading] = useState<boolean>(!initialCache);

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
  }>(() => {
    if (initialCache?.classItem) {
      const c = initialCache.classItem;
      const s = initialCache.staff;
      return {
        name: c.tenLop,
        room: c.phongHoc || 'Phòng học chính',
        ageGroup: c.namHoc ? `Năm học ${c.namHoc}` : 'Khối mầm non',
        totalStudents: initialCache.students?.length || 0,
        currentTeacher: s?.staffId || '',
        teachers: buildTeachersInClass(s, c),
      };
    }
    return {
      name: 'Đang tải thông tin lớp...',
      room: '',
      ageGroup: '',
      totalStudents: 0,
      currentTeacher: '',
      teachers: [],
    };
  });

  const [classStudentsList, setClassStudentsList] = useState<Student[]>(
    initialCache?.students || []
  );
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(
    initialMetrics?.attendanceRecords || []
  );
  const [pendingLeaveCount, setPendingLeaveCount] = useState<number>(
    initialMetrics?.pendingLeaveCount || 0
  );
  const [safetyItems, setSafetyItems] = useState<SafetyItem[]>(
    initialMetrics?.safetyItems || []
  );
  const [todayScheduleItems, setTodayScheduleItems] = useState<any[]>(
    initialMetrics?.todayScheduleItems || []
  );
  const [teacherAlerts, setTeacherAlerts] = useState<AppNotification[]>(
    initialMetrics?.teacherAlerts || []
  );
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
    const user = currentUser();
    if (!user) {
      setIsLoading(false);
      return;
    }

    const todayIsoDate = new Date().toISOString().slice(0, 10);

    try {
      let activeStaff = initialCache?.staff;
      let activeClass = initialCache?.classItem;

      // 1. Phân giải Thông tin Giáo viên & Lớp học qua bộ đệm đa tầng (0ms nếu có cache)
      if (!activeStaff || !activeClass) {
        try {
          const context = await loadLiveTeacherContext();
          activeStaff = context.me;
          activeClass = context.cls;
          if (activeStaff && activeClass) {
            try {
              sessionStorage.setItem(`teacher_staff_${user.id}`, JSON.stringify(activeStaff));
              sessionStorage.setItem(`teacher_class_${user.id}`, JSON.stringify(activeClass));
            } catch {}
          }
        } catch {}
      }

      if (!activeClass) {
        setAssignedClassInfo({
          name: 'Chưa được phân công lớp',
          room: 'Chưa xếp phòng',
          ageGroup: 'Năm học 2026 - 2027',
          totalStudents: 0,
          currentTeacher: activeStaff?.staffId || '',
          teachers: activeStaff
            ? [
                {
                  id: activeStaff.staffId,
                  name: activeStaff.fullName,
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

      // 2. Tải danh sách Học sinh của lớp (Nếu cache đã có thì dùng ngay 0ms)
      let students = classStudentsList;
      if (!students || students.length === 0) {
        students = await getStudents({ lopId: activeClass.id }).catch(() => []);
        setClassStudentsList(students);
        try {
          sessionStorage.setItem(`teacher_students_${user.id}`, JSON.stringify(students));
        } catch {}
      }

      const teachersInClass = buildTeachersInClass(activeStaff, activeClass);
      setAssignedClassInfo({
        name: activeClass.tenLop,
        room: activeClass.phongHoc || 'Phòng học chính',
        ageGroup: activeClass.namHoc ? `Năm học ${activeClass.namHoc}` : 'Khối mầm non',
        totalStudents: students.length,
        currentTeacher: activeStaff?.staffId || '',
        teachers: teachersInClass,
      });

      // GIẢI PHÓNG MÀN HÌNH CHỜ NGAY LẬP TỨC (0ms - 50ms)
      setIsLoading(false);

      // 3. Tải song song ngầm các thông số hoạt động, điểm danh, đơn từ (Non-blocking)
      const attendancePromise = getDailyAttendance(todayIsoDate)
        .then((records) => {
          if (Array.isArray(records)) {
            setAttendanceRecords(records);
            return records;
          }
          return [];
        })
        .catch(() => []);

      const leavesPromise = getLeaves({ subjectType: 'Child' })
        .then((leavesAll) => {
          const { realSafety, pendingCount } = extractSafetyItems(leavesAll, students);
          setPendingLeaveCount(pendingCount);
          setSafetyItems(realSafety);
          return { realSafety, pendingCount };
        })
        .catch(() => ({ realSafety: [], pendingCount: 0 }));

      const schedulesPromise = getSchedules({
        from: todayIsoDate,
        to: todayIsoDate,
        classId: activeClass.id,
      })
        .then((schedulesToday) => {
          if (Array.isArray(schedulesToday)) {
            const classFiltered = schedulesToday.filter(
              (s: any) =>
                s.isSchoolWide ||
                String(s.classId || s.lopId) === String(activeClass.id)
            );
            setTodayScheduleItems(classFiltered);
            return classFiltered;
          }
          return [];
        })
        .catch(() => []);

      const notifsPromise = fetchTeacherNotifications()
        .then((notifs) => {
          setTeacherAlerts(notifs);
          return notifs;
        })
        .catch(() => []);

      // Lưu kết quả vào SessionStorage để lần mở tiếp theo tải trong 0ms
      void Promise.allSettled([
        attendancePromise,
        leavesPromise,
        schedulesPromise,
        notifsPromise,
      ]).then(([attRes, lveRes, schRes, ntfRes]) => {
        try {
          const metricsPayload = {
            attendanceRecords: attRes.status === 'fulfilled' ? attRes.value : [],
            pendingLeaveCount: lveRes.status === 'fulfilled' ? lveRes.value.pendingCount : 0,
            safetyItems: lveRes.status === 'fulfilled' ? lveRes.value.realSafety : [],
            todayScheduleItems: schRes.status === 'fulfilled' ? schRes.value : [],
            teacherAlerts: ntfRes.status === 'fulfilled' ? ntfRes.value : [],
          };
          sessionStorage.setItem(`teacher_today_metrics_${user.id}`, JSON.stringify(metricsPayload));
        } catch {}
      });

      // 4. Lazy-load các số liệu đánh giá (chạy sau khi các tác vụ quan trọng đã hoàn tất)
      setTimeout(() => {
        Promise.all([
          getAssessments({ page: 1, pageSize: 30 }).catch(() => null),
          getCriteria({ page: 1, pageSize: 30 }).catch(() => null),
          getActivities({ page: 1, pageSize: 30 }).catch(() => null),
        ])
          .then(([assessmentsRes, criteriaRes, activitiesRes]) => {
            setAssessmentStatistics(
              extractAssessmentStats(assessmentsRes, criteriaRes, activitiesRes, students)
            );
          })
          .catch(() => {});
      }, 300);

    } catch {
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
