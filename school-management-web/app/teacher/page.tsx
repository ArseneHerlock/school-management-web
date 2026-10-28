'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Award,
  ChevronRight,
  BellRing,
  AlertTriangle,
} from 'lucide-react'
import { currentUser } from '@/services/client'
import { getStaffByUserId } from '@/services/staff'
import { getClasses } from '@/services/classes'
import { getStudents, Student } from '@/services/students'
import { getDailyAttendance, AttendanceRecord } from '@/services/attendance'
import { getAssessments, getCriteria, getActivities } from '@/services/development'
import {
  fetchTeacherNotifications,
  AppNotification,
  REALTIME_NOTIFICATION_EVENT,
} from '@/services/notifications'
import { getLeaves } from '@/services/leave'
import { getSchedules } from '@/services/schedule'
import LoadingScreen from '@/app/components/LoadingScreen'
import { TeacherHeroCard } from './components/dashboard/TeacherHeroCard'
import { TeacherQuickActions } from './components/dashboard/TeacherQuickActions'
import { TeacherAssessmentWidget } from './components/dashboard/TeacherAssessmentWidget'
import { TeacherTodaySchedule } from './components/dashboard/TeacherTodaySchedule'

export default function TeacherDashboard() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Thông tin lớp học và học sinh được phân công
  const [assignedClassInfo, setAssignedClassInfo] = useState<{
    name: string
    room: string
    ageGroup: string
    totalStudents: number
    currentTeacher: string
    teachers: Array<{
      id: string
      name: string
      role: string
      avatar: string
      color?: string
    }>
  }>({
    name: 'Đang tải thông tin lớp...',
    room: '',
    ageGroup: '',
    totalStudents: 0,
    currentTeacher: '',
    teachers: [],
  })

  const [classStudentsList, setClassStudentsList] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [pendingLeaveCount, setPendingLeaveCount] = useState<number>(0)
  const [todayScheduleItems, setTodayScheduleItems] = useState<any[]>([])
  const [teacherAlerts, setTeacherAlerts] = useState<AppNotification[]>([])
  const [assessmentStatistics, setAssessmentStatistics] = useState({
    totalAssessments: 0,
    passCount: 0,
    failCount: 0,
    totalCriteria: 0,
    totalActivities: 0,
  })

  // Cập nhật đồng hồ thời gian thực
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  /**
   * Tải toàn bộ dữ liệu thực tế cho bàn làm việc của giáo viên (Phá vỡ bẫy Waterfall & Tối ưu song song)
   */
  async function loadTeacherDashboardData(): Promise<void> {
    try {
      const user = currentUser()
      if (!user) {
        setIsLoading(false)
        return
      }

      const todayIsoDate = new Date().toISOString().slice(0, 10)

      // 1. Tận dụng Cache Session để lấy nhanh lớp học đã lưu, triệt tiêu tầng 1 của Waterfall
      let cachedStaff: any = null
      let cachedClass: any = null
      try {
        const storedStaff = sessionStorage.getItem(`teacher_staff_${user.id}`)
        const storedClass = sessionStorage.getItem(`teacher_class_${user.id}`)
        if (storedStaff && storedClass) {
          cachedStaff = JSON.parse(storedStaff)
          cachedClass = JSON.parse(storedClass)
        }
      } catch {}

      // 2. Kích hoạt NGAY LẬP TỨC toàn bộ các API độc lập (không bắt chờ lớp học)
      const independentPromises = {
        attendance: getDailyAttendance(todayIsoDate).catch(() => []),
        leaves: getLeaves({ subjectType: 'Child' }).catch(() => []),
        assessments: getAssessments({ page: 1, pageSize: 100 }).catch(() => null),
        criteria: getCriteria({ page: 1, pageSize: 50 }).catch(() => null),
        activities: getActivities({ page: 1, pageSize: 50 }).catch(() => null),
      }

      // 3. Xác định lớp học của giáo viên (Dùng cache có sẵn hoặc fetch song song)
      let activeStaff = cachedStaff
      let activeClass = cachedClass

      const staffAndClassPromise = (!activeStaff || !activeClass)
        ? Promise.all([
            getStaffByUserId(user.id).catch(() => null),
            getClasses().catch(() => []),
          ]).then(([staffMember, allClassList]) => {
            activeStaff = staffMember
            const matched = allClassList.find(
              (classItem: any) => staffMember?.staffId && classItem.giaoVienChuNhiemId === staffMember.staffId
            )
            activeClass = matched || null
            if (activeStaff && activeClass) {
              try {
                sessionStorage.setItem(`teacher_staff_${user.id}`, JSON.stringify(activeStaff))
                sessionStorage.setItem(`teacher_class_${user.id}`, JSON.stringify(activeClass))
              } catch {}
            }
            return { staffMember, matchedClass: activeClass }
          })
        : Promise.resolve({ staffMember: activeStaff, matchedClass: activeClass })

      // Nếu đã có cache lớp, có thể bắn luôn danh sách học sinh và lịch dạy song song ngay từ đầu!
      let studentsPromise: Promise<Student[]>
      let schedulesPromise: Promise<any[]>

      if (activeClass?.id) {
        studentsPromise = getStudents({ lopId: activeClass.id }).catch(() => [])
        schedulesPromise = getSchedules({
          from: todayIsoDate,
          to: todayIsoDate,
          classId: activeClass.id,
        }).catch(() => [])
      } else {
        // Chưa có cache: đợi định danh lớp xong mới bắn học sinh và lịch dạy
        studentsPromise = staffAndClassPromise.then(({ matchedClass }) =>
          matchedClass?.id ? getStudents({ lopId: matchedClass.id }).catch(() => []) : []
        )
        schedulesPromise = staffAndClassPromise.then(({ matchedClass }) =>
          matchedClass?.id
            ? getSchedules({
                from: todayIsoDate,
                to: todayIsoDate,
                classId: matchedClass.id,
              }).catch(() => [])
            : []
        )
      }

      // 4. Chờ tất cả hoàn tất song song
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
      ])

      const { staffMember, matchedClass } = classIdentity

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
        })
        setIsLoading(false)
        return
      }

      // Cập nhật State Học sinh & Điểm danh
      setClassStudentsList(classStudents)
      setAttendanceRecords(attendanceToday)

      setAssignedClassInfo({
        name: matchedClass.tenLop,
        room: matchedClass.phongHoc || 'Phòng học chính',
        ageGroup: matchedClass.namHoc ? `Năm học ${matchedClass.namHoc}` : 'Khối mầm non',
        totalStudents: classStudents.length,
        currentTeacher: staffMember?.staffId || '',
        teachers: staffMember
          ? [
              {
                id: staffMember.staffId,
                name: staffMember.fullName,
                role: 'Giáo viên chủ nhiệm',
                avatar: staffMember.fullName
                  .split(' ')
                  .map((word: string) => word[0])
                  .join('')
                  .slice(-2)
                  .toUpperCase(),
                color: '#f97316',
              },
            ]
          : [],
      })

      // Xử lý đơn xin nghỉ của lớp
      if (Array.isArray(leavesAll)) {
        const studentIdsSet = new Set(classStudents.map((s) => s.id))
        const pendingForMyClass = leavesAll.filter((leaveItem: any) => {
          const isPending =
            String(leaveItem.status).toLowerCase() === '0' ||
            String(leaveItem.status).toLowerCase() === 'pending'
          return isPending && studentIdsSet.has(leaveItem.childId)
        })
        setPendingLeaveCount(pendingForMyClass.length)
      }

      // Xử lý lịch dạy hôm nay
      if (Array.isArray(schedulesToday)) {
        const classFiltered = schedulesToday.filter(
          (s: any) =>
            s.isSchoolWide ||
            String(s.classId || s.lopId) === String(matchedClass.id)
        )
        setTodayScheduleItems(classFiltered)
      }

      // Xử lý thống kê đánh giá
      if (assessmentsRes?.items) {
        const studentIdsSet = new Set(classStudents.map((s) => s.id))
        const assessmentList = assessmentsRes.items.filter((item: any) =>
          studentIdsSet.has(item.childId)
        )
        const passCount = assessmentList.filter((item: any) => item.result === true).length
        const failCount = assessmentList.filter((item: any) => item.result === false).length
        const totalCrit = criteriaRes?.total || criteriaRes?.items?.length || 0
        const totalAct = activitiesRes?.total || activitiesRes?.items?.length || 0

        setAssessmentStatistics({
          totalAssessments: assessmentList.length,
          passCount,
          failCount,
          totalCriteria: totalCrit,
          totalActivities: totalAct,
        })
      }

      // Mở khóa giao diện ngay lập tức
      setIsLoading(false)

      // Tải thông báo ngầm
      fetchTeacherNotifications()
        .then((notifs) => setTeacherAlerts(notifs))
        .catch(() => {})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeacherDashboardData()

    const handleRealtimeRefresh = () => {
      fetchTeacherNotifications()
        .then((notifs) => setTeacherAlerts(notifs))
        .catch(() => {})
      const todayIsoDate = new Date().toISOString().slice(0, 10)
      getDailyAttendance(todayIsoDate)
        .then((records) => {
          if (Array.isArray(records)) setAttendanceRecords(records)
        })
        .catch(() => {})
    }

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh)
    return () => {
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh)
    }
  }, [])

  if (isLoading) {
    return (
      <LoadingScreen
        message="Đang tải dữ liệu bàn làm việc..."
        subMessage="Đang đồng bộ lớp học, sĩ số trẻ và nề nếp giảng dạy"
        theme="orange"
      />
    )
  }

  // Tính toán số liệu chuyên cần thực tế của lớp
  const studentIdsOfClass = new Set(classStudentsList.map((student) => student.id))
  const classAttendanceToday = attendanceRecords.filter((record) =>
    studentIdsOfClass.has(record.hocSinhId)
  )

  const presentCount = classAttendanceToday.filter(function (record) {
    const status = String(record.trangThai).toLowerCase()
    return status.includes('có mặt') || status.includes('muộn')
  }).length

  const absentCount = classAttendanceToday.filter(function (record) {
    const status = String(record.trangThai).toLowerCase()
    return status.includes('vắng') || status.includes('nghỉ')
  }).length

  const totalStudents = classStudentsList.length
  const attendanceRate =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0

  const todayDateFormatted = currentTime.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* 1. Hero Card: Thông tin lớp học và thời gian */}
      <TeacherHeroCard
        today={todayDateFormatted}
        time={currentTime}
        classInfo={assignedClassInfo}
      />

      {/* 2. Thống kê 4 chỉ số KPI chính */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Có mặt */}
        <Link
          href="/teacher/attendance"
          className="group rounded-3xl border border-emerald-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Có mặt hôm nay</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800">{presentCount}</span>
            <span className="text-xs font-bold text-emerald-600">/ {totalStudents} trẻ</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tỷ lệ chuyên cần</span>
            <span className="font-extrabold text-emerald-600">{attendanceRate}%</span>
          </div>
        </Link>

        {/* Vắng mặt */}
        <Link
          href="/teacher/attendance"
          className="group rounded-3xl border border-rose-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Vắng mặt</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <UserX size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">{absentCount}</span>
            <span className="text-xs text-slate-400">trẻ</span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 truncate">
            {absentCount > 0 ? 'Cần kiểm tra đơn nghỉ' : 'Sĩ số đầy đủ'}
          </div>
        </Link>

        {/* Đơn xin nghỉ chờ duyệt */}
        <Link
          href="/teacher/leave"
          className="group rounded-3xl border border-orange-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Đơn xin nghỉ</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-orange-600">{pendingLeaveCount}</span>
            <span className="text-xs text-slate-400">chờ duyệt</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Xác nhận ngay</span>
            <ChevronRight size={13} className="text-orange-500 group-hover:translate-x-0.5 transition" />
          </div>
        </Link>

        {/* Tin nhắn phụ huynh */}
        <Link
          href="/teacher/messages"
          className="group rounded-3xl border border-blue-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tin nhắn phụ huynh</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">Hộp thư</span>
            <span className="text-xs text-slate-400">trực tuyến</span>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
            <span>Mở khung chat</span>
            <ArrowRight size={13} />
          </div>
        </Link>
      </div>

      {/* 3. Khung 2 cột: Thao tác nhanh & Lịch trình hôm nay */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái (7 phần): Thao tác nhanh + Đánh giá + Bé ngoan */}
        <div className="lg:col-span-7 space-y-6">
          {/* Thao tác nhanh */}
          <TeacherQuickActions onNavigate={(targetPath) => router.push(targetPath)} />

          {/* Widget đánh giá phát triển */}
          <TeacherAssessmentWidget
            stats={assessmentStatistics}
            onNavigate={(targetPath) => router.push(targetPath)}
          />

          {/* Danh sách học sinh của lớp */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Users size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Danh sách học sinh trong lớp ({classStudentsList.length} trẻ)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Theo phân bổ của lớp {assignedClassInfo.name}
                  </p>
                </div>
              </div>
              <Link
                href="/teacher/attendance"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
              >
                <span>Xem danh sách</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {classStudentsList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                Chưa có học sinh nào được xếp vào lớp này.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                {classStudentsList.map((studentItem) => {
                  const studentInitials = studentItem.tenHocSinh
                    .split(' ')
                    .map((word) => word[0])
                    .join('')
                    .slice(-2)
                    .toUpperCase()

                  return (
                    <div
                      key={studentItem.id}
                      className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-orange-50/40 transition"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-black text-xs text-white">
                        {studentInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">
                          {studentItem.tenHocSinh}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {studentItem.gioiTinh} • {studentItem.ngaySinh?.slice(0, 4) || '2022'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải (5 phần): Thời khóa biểu trong ngày & Thông báo mới */}
        <div className="lg:col-span-5 space-y-6">
          <TeacherTodaySchedule
            schedule={todayScheduleItems.map((scheduleItem) => {
              const startTimeStr = String(
                scheduleItem.startTime || scheduleItem.gioBatDau || '08:00'
              ).slice(0, 5)
              const endTimeStr = scheduleItem.endTime || scheduleItem.gioKetThuc
                ? ` - ${String(scheduleItem.endTime || scheduleItem.gioKetThuc).slice(0, 5)}`
                : ''

              return {
                time: `${startTimeStr}${endTimeStr}`,
                activity: scheduleItem.title || scheduleItem.tieuDe || scheduleItem.tenSuKien || 'Hoạt động học tập',
                room: scheduleItem.room || scheduleItem.phongHoc || '',
                done: false,
                current: false,
              }
            })}
          />

          {/* Bảng Thông báo & Cảnh báo mới dành cho Giáo viên */}
          <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs">
            <div className="mb-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <BellRing size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Thông báo & Cảnh báo mới ({teacherAlerts.length})
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Tin nhắn phụ huynh, đơn nghỉ, lịch mới & thông báo trường
                  </p>
                </div>
              </div>
            </div>

            {teacherAlerts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                Hiện chưa có thông báo hoặc cảnh báo mới.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {teacherAlerts.slice(0, 6).map((alertItem) => {
                  const isDanger = alertItem.severity === 'danger'
                  const isWarning = alertItem.severity === 'warning'
                  return (
                    <div
                      key={alertItem.id}
                      onClick={() => {
                        if (alertItem.targetRoute) router.push(alertItem.targetRoute)
                      }}
                      className={`group flex items-start justify-between gap-2.5 rounded-2xl border p-3 transition cursor-pointer ${
                        isDanger
                          ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-50'
                          : isWarning
                          ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-50'
                          : 'border-slate-100 bg-slate-50/80 hover:bg-orange-50/50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {alertItem.badgeText && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${
                                isDanger
                                  ? 'bg-rose-600 text-white'
                                  : isWarning
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-orange-500 text-white'
                              }`}
                            >
                              {(isDanger || isWarning) && <AlertTriangle size={9} />}
                              <span>{alertItem.badgeText}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                          {alertItem.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-600 line-clamp-2">
                          {alertItem.message}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="mt-1 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-orange-600 transition"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
