'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  Sparkles,
  Loader2,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react'
import { getChildAttendanceHistory, getParentSchedules, getHealthRecords } from '@/services'
import {
  getChildAssessmentHistory,
  getAssessments,
  getCriteria,
  getActivities,
  CriterionItem,
  ActivityItem,
  AssessmentItem,
} from '@/lib/development'
import {
  fetchParentNotifications,
  AppNotification,
  REALTIME_NOTIFICATION_EVENT,
} from '@/services/notifications'
import { ChildInfo, ParentProfile } from '../types'
import { AttendanceStatCards } from './dashboard/AttendanceStatCards'
import { DevelopmentProgressCard } from './dashboard/DevelopmentProgressCard'
import { ChildHealthTeacherSummary } from './dashboard/ChildHealthTeacherSummary'

export default function DashboardTab({
  childrenData,
  parent,
  onNavigateTab,
}: {
  childrenData: ChildInfo[]
  parent: ParentProfile
  onNavigateTab: (tab: string) => void
}) {
  const [selectedChildId, setSelectedChildId] = useState<string>(childrenData[0]?.id || '')
  const [loading, setLoading] = useState(false)

  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [classSchedules, setClassSchedules] = useState<any[]>([])
  const [childAssessments, setChildAssessments] = useState<AssessmentItem[]>([])
  const [systemCriteria, setSystemCriteria] = useState<CriterionItem[]>([])
  const [systemActivities, setSystemActivities] = useState<ActivityItem[]>([])
  const [healthRecord, setHealthRecord] = useState<any>(null)
  const [childAlerts, setChildAlerts] = useState<AppNotification[]>([])

  const activeChild = useMemo(() => {
    return childrenData.find((c) => c.id === selectedChildId) || childrenData[0]
  }, [childrenData, selectedChildId])

  useEffect(() => {
    if (!activeChild?.id) return
    setLoading(true)

    const fetchChildDetails = async () => {
      try {
        const [attRes, schRes, hisRes, criRes, actRes, heaRes] = await Promise.allSettled([
          getChildAttendanceHistory(activeChild.id),
          getParentSchedules({
            classId: activeChild.classId || '',
            thang: new Date().getMonth() + 1,
            nam: new Date().getFullYear(),
          }),
          getChildAssessmentHistory(activeChild.id),
          getCriteria({ page: 1, pageSize: 500 }),
          getActivities({ page: 1, pageSize: 200 }),
          getHealthRecords(activeChild.id),
        ])

        if (attRes.status === 'fulfilled') {
          const attendancePayload: any = attRes.value
          const list = attendancePayload?.data || attendancePayload || []
          setAttendanceRecords(Array.isArray(list) ? list : [])
        }

        if (schRes.status === 'fulfilled') {
          setClassSchedules(Array.isArray(schRes.value) ? schRes.value : [])
        }

        if (hisRes.status === 'fulfilled') {
          let assList = hisRes.value
          if (assList.length === 0) {
            try {
              const fallback = await getAssessments({ childId: activeChild.id, page: 1, pageSize: 200 })
              assList = fallback.items
            } catch {}
          }
          setChildAssessments(assList)
        }

        if (criRes.status === 'fulfilled') setSystemCriteria(criRes.value.items)
        if (actRes.status === 'fulfilled') setSystemActivities(actRes.value.items)
        if (heaRes.status === 'fulfilled' && Array.isArray(heaRes.value) && heaRes.value.length > 0) {
          setHealthRecord(heaRes.value[0])
        }

        const alerts = await fetchParentNotifications([activeChild]).catch(() => [])
        setChildAlerts(alerts)
      } catch {
      } finally {
        setLoading(false)
      }
    }

    void fetchChildDetails()

    const handleRealtimeRefresh = () => {
      if (!activeChild?.id) return
      fetchParentNotifications([activeChild])
        .then((alerts) => setChildAlerts(alerts))
        .catch(() => {})
      getChildAttendanceHistory(activeChild.id)
        .then((res) => {
          const list = res || []
          if (Array.isArray(list)) setAttendanceRecords(list)
        })
        .catch(() => {})
    }

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh)
    return () => {
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh)
    }
  }, [activeChild?.id, activeChild?.classId])

  const attendanceStats = useMemo(() => {
    let present = 0
    let late = 0
    let absent = 0

    attendanceRecords.forEach((r) => {
      if (r.trangThai === 'Có mặt') {
        present++
        if (r.gioDen && r.gioDen > '08:30:00') late++
      } else {
        absent++
      }
    })

    const totalScheduled = classSchedules.length > 0 ? classSchedules.length : attendanceRecords.length
    const rate = totalScheduled > 0 ? Math.min(100, Math.round((present / totalScheduled) * 100)) : 100

    return { present, late, absent, totalScheduled, rate }
  }, [attendanceRecords, classSchedules])

  const developmentStats = useMemo(() => {
    const activityIds = new Set(
      childAssessments.filter((a) => Boolean(a.activityId)).map((a) => a.activityId as string)
    )
    const activitiesCount = activityIds.size

    const criteriaMap = new Map<string, boolean>()
    childAssessments.forEach((a) => {
      criteriaMap.set(a.developmentCriterionId, a.result)
    })

    let passCount = 0
    let failCount = 0
    criteriaMap.forEach((res) => {
      if (res) passCount++
      else failCount++
    })

    const totalCrit = systemCriteria.length
    const unassessedCount = Math.max(0, totalCrit - (passCount + failCount))
    const passRate = passCount + failCount > 0 ? Math.round((passCount / (passCount + failCount)) * 100) : 0

    return { activitiesCount, passCount, failCount, unassessedCount, totalCrit, passRate }
  }, [childAssessments, systemCriteria])

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-4 sm:p-6 lg:p-8 text-white shadow-lg shadow-blue-500/15">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl mix-blend-overlay"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-blue-200 font-bold tracking-wide uppercase text-[10px] sm:text-xs mb-1">
              CỔNG THÔNG TIN PHỤ HUYNH
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Xin chào, {parent.hoTen || 'Phụ huynh'}!
            </h2>
            <p className="text-blue-100 mt-1 sm:mt-2 text-xs sm:text-sm max-w-lg leading-relaxed">
              Theo dõi toàn diện quá trình điểm danh chuyên cần, lịch học và các đánh giá phát triển của con tại trường mầm non.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('attendance')}
              className="flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <CalendarDays size={15} />
              <span>Xem Điểm danh</span>
            </button>
            <button
              onClick={() => onNavigateTab('assessment')}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-xs cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Đánh giá của con</span>
            </button>
          </div>
        </div>
      </div>

      {childrenData.length > 1 && (
        <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-blue-100 shadow-xs overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 shrink-0 ml-1">Chọn bé theo dõi:</span>
          <div className="flex gap-2">
            {childrenData.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChildId(c.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-all cursor-pointer ${
                  c.id === activeChild?.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                    c.id === activeChild?.id ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {c.avatar}
                </div>
                <span>{c.hoTen}</span>
                <span className="text-[10px] opacity-80">({c.lop})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-blue-50">
          <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
          <p className="text-slate-500 font-bold text-sm">Đang tổng hợp dữ liệu của bé {activeChild?.hoTen}...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bảng Cảnh báo & Thông báo quan trọng theo thời gian thực của bé */}
          {childAlerts.length > 0 && (
            <div className="rounded-3xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs">
              <div className="mb-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                    <BellRing size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
                      Cảnh báo & Thông báo mới của bé {activeChild?.hoTen}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Cập nhật trực tiếp từ điểm danh, đánh giá hoạt động, sức khỏe và học phí
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700">
                  {childAlerts.length} thông báo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {childAlerts.slice(0, 6).map((alertItem) => {
                  const isDanger = alertItem.severity === 'danger'
                  const isWarning = alertItem.severity === 'warning'
                  const isSuccess = alertItem.severity === 'success'

                  const boxClass = isDanger
                    ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-50'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-50'
                    : isSuccess
                    ? 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'

                  const badgeClass = isDanger
                    ? 'bg-rose-600 text-white'
                    : isWarning
                    ? 'bg-amber-500 text-white'
                    : isSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white'

                  return (
                    <div
                      key={alertItem.id}
                      onClick={() => {
                        if (alertItem.targetTab) onNavigateTab(alertItem.targetTab)
                      }}
                      className={`group flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition cursor-pointer ${boxClass}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          {alertItem.badgeText && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${badgeClass}`}
                            >
                              {(isDanger || isWarning) && <AlertTriangle size={10} />}
                              {isSuccess && <CheckCircle2 size={10} />}
                              <span>{alertItem.badgeText}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                          {alertItem.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {alertItem.message}
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="mt-1 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-700 transition"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <AttendanceStatCards
            stats={attendanceStats}
            childName={activeChild?.hoTen}
            className={activeChild?.lop}
            onNavigateDetail={() => onNavigateTab('attendance')}
          />

          <DevelopmentProgressCard
            stats={developmentStats}
            childName={activeChild?.hoTen}
            onNavigateDetail={() => onNavigateTab('assessment')}
          />

          <ChildHealthTeacherSummary
            healthRecord={healthRecord}
            teacherName={activeChild?.giaoVienChuNhiem}
            teacherPhone={activeChild?.sdtGiaoVien}
            className={activeChild?.lop}
            onNavigateHealth={() => onNavigateTab('health')}
            onNavigateMessages={() => onNavigateTab('messages')}
          />
        </div>
      )}
    </section>
  )
}
