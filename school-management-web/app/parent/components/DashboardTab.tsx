'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles, Award, HeartPulse } from 'lucide-react';
import { getChildAttendanceHistory, getParentSchedules, getHealthRecords } from '@/services';
import {
  getChildAssessmentHistory,
  getAssessments,
  getCriteria,
  getActivities,
  CriterionItem,
  ActivityItem,
  AssessmentItem,
} from '@/services/development';
import {
  fetchParentNotifications,
  AppNotification,
  REALTIME_NOTIFICATION_EVENT,
} from '@/services/notifications';
import { ChildInfo, ParentProfile } from '../types';
import { AttendanceStatCards } from './dashboard/AttendanceStatCards';
import { DevelopmentProgressCard } from './dashboard/DevelopmentProgressCard';
import { ChildHealthTeacherSummary } from './dashboard/ChildHealthTeacherSummary';
import { ParentQuickActionsDock } from './dashboard/ParentQuickActionsDock';
import { ChildDailyStoryFeed } from './dashboard/ChildDailyStoryFeed';
import { DashboardHeroBanner } from './dashboard/DashboardHeroBanner';
import { DashboardChildSelector } from './dashboard/DashboardChildSelector';
import { ChildAlertsBanner } from './dashboard/ChildAlertsBanner';

export default function DashboardTab({
  childrenData,
  parent,
  onNavigateTab,
}: {
  childrenData: ChildInfo[];
  parent: ParentProfile;
  onNavigateTab: (tab: string) => void;
}) {
  const [selectedChildId, setSelectedChildId] = useState<string>(childrenData[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [classSchedules, setClassSchedules] = useState<any[]>([]);
  const [childAssessments, setChildAssessments] = useState<AssessmentItem[]>([]);
  const [systemCriteria, setSystemCriteria] = useState<CriterionItem[]>([]);
  const [systemActivities, setSystemActivities] = useState<ActivityItem[]>([]);
  const [healthRecord, setHealthRecord] = useState<any>(null);
  const [childAlerts, setChildAlerts] = useState<AppNotification[]>([]);
  const [fcmLatest, setFcmLatest] = useState<any>(null);

  const activeChild = useMemo(() => {
    return childrenData.find((c) => c.id === selectedChildId) || childrenData[0];
  }, [childrenData, selectedChildId]);

  useEffect(() => {
    if (!activeChild?.id) return;
    setLoading(true);

    const fetchChildDetails = async () => {
      try {
        const [attRes, schRes, hisRes, criRes, actRes, heaRes, fcmRes, actCritRes] = await Promise.allSettled([
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
          fetch(`/api/fcm?childId=${activeChild.id}`).then((r) => (r.ok ? r.json() : null)),
          fetch('/api/activities-with-criteria').then((r) => (r.ok ? r.json() : [])),
        ]);

        if (fcmRes.status === 'fulfilled' && fcmRes.value) {
          const fcmData = fcmRes.value;
          setFcmLatest(
            fcmData.latest ||
              (fcmData.history?.length ? fcmData.history[fcmData.history.length - 1] : null)
          );
        } else {
          setFcmLatest(null);
        }

        if (attRes.status === 'fulfilled') {
          const attendancePayload: any = attRes.value;
          const list = attendancePayload?.data || attendancePayload || [];
          setAttendanceRecords(Array.isArray(list) ? list : []);
        }

        if (schRes.status === 'fulfilled') {
          setClassSchedules(Array.isArray(schRes.value) ? schRes.value : []);
        }

        if (hisRes.status === 'fulfilled') {
          let assList = hisRes.value;
          if (assList.length === 0) {
            try {
              const fallback = await getAssessments({
                childId: activeChild.id,
                page: 1,
                pageSize: 200,
              });
              assList = fallback.items;
            } catch {}
          }
          setChildAssessments(assList);
        }

        if (
          actCritRes.status === 'fulfilled' &&
          Array.isArray(actCritRes.value) &&
          actCritRes.value.length > 0
        ) {
          const actCrits = actCritRes.value;
          setSystemActivities(actCrits);
          const allActivityCriteria = actCrits.flatMap((a: any) =>
            (a.criteria || []).map((c: any) => ({
              ...c,
              activityId: a.id,
              activityName: a.name,
            }))
          );
          if (allActivityCriteria.length > 0) {
            setSystemCriteria(allActivityCriteria);
          } else if (criRes.status === 'fulfilled') {
            setSystemCriteria(criRes.value.items);
          }
        } else {
          if (criRes.status === 'fulfilled') setSystemCriteria(criRes.value.items);
          if (actRes.status === 'fulfilled') setSystemActivities(actRes.value.items);
        }
        if (heaRes.status === 'fulfilled' && Array.isArray(heaRes.value) && heaRes.value.length > 0) {
          setHealthRecord(heaRes.value[0]);
        }

        const alerts = await fetchParentNotifications([activeChild]).catch(() => []);
        setChildAlerts(alerts);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    void fetchChildDetails();

    const handleRealtimeRefresh = () => {
      if (!activeChild?.id) return;
      fetchParentNotifications([activeChild])
        .then((alerts) => setChildAlerts(alerts))
        .catch(() => {});
      getChildAttendanceHistory(activeChild.id)
        .then((res) => {
          const list = res || [];
          if (Array.isArray(list)) setAttendanceRecords(list);
        })
        .catch(() => {});
    };

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    return () => {
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    };
  }, [activeChild?.id, activeChild?.classId]);

  const attendanceStats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;

    attendanceRecords.forEach((r) => {
      if (r.trangThai === 'Có mặt') {
        present++;
        if (r.gioDen && r.gioDen > '08:30:00') late++;
      } else {
        absent++;
      }
    });

    const totalScheduled =
      classSchedules.length > 0 ? classSchedules.length : attendanceRecords.length;
    const rate =
      totalScheduled > 0 ? Math.min(100, Math.round((present / totalScheduled) * 100)) : 100;

    return { present, late, absent, totalScheduled, rate };
  }, [attendanceRecords, classSchedules]);

  const developmentStats = useMemo(() => {
    const activityIds = new Set(
      childAssessments
        .filter((a) => Boolean(a.activityId))
        .map((a) => a.activityId as string)
    );
    const activitiesCount =
      activityIds.size || (systemActivities.length > 0 ? systemActivities.length : 15);

    const criteriaMap = new Map<string, boolean>();
    childAssessments.forEach((a) => {
      criteriaMap.set(a.developmentCriterionId, a.result);
    });

    let passCount = 0;
    let failCount = 0;
    criteriaMap.forEach((res) => {
      if (res) passCount++;
      else failCount++;
    });

    const totalCrit =
      systemCriteria.length > 0 ? systemCriteria.length : passCount + failCount || 60;
    const unassessedCount = Math.max(0, totalCrit - (passCount + failCount));
    const passRate =
      passCount + failCount > 0
        ? Math.round((passCount / (passCount + failCount)) * 100)
        : 0;

    return { activitiesCount, passCount, failCount, unassessedCount, totalCrit, passRate };
  }, [childAssessments, systemCriteria, systemActivities]);

  const [activeTab, setActiveTab] = useState<'today' | 'assessment' | 'health'>('today');

  const parentTabs = [
    {
      id: 'today' as const,
      label: 'Hôm nay của bé',
      mobileLabel: 'Hôm nay',
      icon: Sparkles,
      badge: childAlerts.length > 0 ? `${childAlerts.length}` : undefined,
    },
    {
      id: 'assessment' as const,
      label: 'Đánh giá 5 lĩnh vực',
      mobileLabel: 'Đánh giá',
      icon: Award,
    },
    {
      id: 'health' as const,
      label: 'Sức khỏe WHO & Cô',
      mobileLabel: 'Sức khỏe',
      icon: HeartPulse,
    },
  ];

  return (
    <section className="space-y-4 sm:space-y-6 max-w-full min-w-0">
      {/* 1. Header Chào mừng Phụ huynh */}
      <DashboardHeroBanner
        parentName={parent.hoTen}
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Bộ chọn Bé (nếu gia đình có nhiều trẻ theo học) */}
      <DashboardChildSelector
        childrenData={childrenData}
        selectedChildId={activeChild?.id}
        onSelectChild={setSelectedChildId}
      />

      {/* 3. Bàn Tiện Ích Phụ Huynh 1-Chạm (8 Icons: Nghỉ học, Dặn thuốc, Đón hộ, Học phí...) */}
      <ParentQuickActionsDock onNavigateTab={onNavigateTab} />

      {/* 4. Bộ Chuyển Chuyên Mục Thông Minh (Segmented Tabs - Co giãn hoàn hảo trên mọi kích thước màn hình) */}
      <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1.5 bg-blue-100/60 rounded-2xl max-w-full">
        {parentTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm shadow-blue-300/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon size={14} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black shrink-0 ${
                  isActive ? 'bg-rose-100 text-rose-700' : 'bg-blue-200 text-blue-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xs border border-blue-50">
          <Loader2 className="animate-spin text-blue-500 mb-3" size={36} />
          <p className="text-slate-500 font-bold text-sm">
            Đang tổng hợp dữ liệu của bé {activeChild?.hoTen}...
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {activeTab === 'today' && (
            <>
              {/* Cảnh báo & Thông báo quan trọng */}
              <ChildAlertsBanner
                childAlerts={childAlerts}
                childName={activeChild?.hoTen}
                onNavigateTab={onNavigateTab}
              />

              {/* Nhật ký Hôm nay ở trường của con */}
              <ChildDailyStoryFeed
                childName={activeChild?.hoTen || 'Bé'}
                className={activeChild?.lop}
                todayAttendance={attendanceRecords.find(
                  (r) =>
                    String(r.ngay || '').slice(0, 10) === new Date().toISOString().slice(0, 10)
                )}
                todaySchedules={classSchedules}
              />

              {/* Thống kê Chuyên cần & Điểm danh */}
              <AttendanceStatCards
                stats={attendanceStats}
                childName={activeChild?.hoTen}
                className={activeChild?.lop}
                onNavigateDetail={() => onNavigateTab('attendance')}
              />
            </>
          )}

          {activeTab === 'assessment' && (
            <>
              {/* Tiến trình Phát triển 5 Lĩnh vực */}
              <DevelopmentProgressCard
                stats={developmentStats}
                childName={activeChild?.hoTen}
                clusterId={fcmLatest?.ClusterId || fcmLatest?.clusterId}
                clusterName={fcmLatest?.ClusterName || fcmLatest?.clusterName}
                trend={fcmLatest?.Trend || fcmLatest?.trend}
                onNavigateDetail={() => onNavigateTab('assessment')}
              />
            </>
          )}

          {activeTab === 'health' && (
            <>
              {/* Tóm tắt Sức khỏe WHO & Thông tin Giáo viên Chủ nhiệm */}
              <ChildHealthTeacherSummary
                healthRecord={healthRecord}
                teacherName={activeChild?.giaoVienChuNhiem}
                teacherPhone={activeChild?.sdtGiaoVien}
                className={activeChild?.lop}
                onNavigateHealth={() => onNavigateTab('health')}
                onNavigateMessages={() => onNavigateTab('messages')}
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}
