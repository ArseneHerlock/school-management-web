import { useState, useEffect, useMemo } from 'react';
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
import { ChildInfo } from '../../types';

export function useParentDashboardTab(childrenData: ChildInfo[]) {
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
          getCriteria({ page: 1, pageSize: 50 }),
          getActivities({ page: 1, pageSize: 50 }),
          getHealthRecords(activeChild.id),
          fetch(`/api/fcm?childId=${activeChild.id}`).then((r) => (r.ok ? r.json() : null)),
          fetch('/api/activities-with-criteria').then((r) => (r.ok ? r.json() : [])),
        ]);

        if (fcmRes.status === 'fulfilled' && fcmRes.value) {
          const fcmData = fcmRes.value;
          setFcmLatest(fcmData.latest || (fcmData.history?.length ? fcmData.history[fcmData.history.length - 1] : null));
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
              const fallback = await getAssessments({ childId: activeChild.id, page: 1, pageSize: 200 });
              assList = fallback.items;
            } catch {}
          }
          setChildAssessments(assList);
        }

        if (actCritRes.status === 'fulfilled' && Array.isArray(actCritRes.value) && actCritRes.value.length > 0) {
          const actCrits = actCritRes.value;
          setSystemActivities(actCrits);
          const allActivityCriteria = actCrits.flatMap((a: any) =>
            (a.criteria || []).map((c: any) => ({ ...c, activityId: a.id, activityName: a.name }))
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

        fetchParentNotifications([activeChild])
          .then((alerts) => setChildAlerts(alerts))
          .catch(() => {});
      } finally {
        setLoading(false);
      }
    };

    void fetchChildDetails();

    const handleRealtimeRefresh = () => {
      if (!activeChild?.id) return;
      fetchParentNotifications([activeChild]).then((alerts) => setChildAlerts(alerts)).catch(() => {});
      getChildAttendanceHistory(activeChild.id).then((res) => {
        const list = res || [];
        if (Array.isArray(list)) setAttendanceRecords(list);
      }).catch(() => {});
    };

    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    return () => {
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleRealtimeRefresh);
    };
  }, [activeChild?.id, activeChild?.classId]);

  const attendanceStats = useMemo(() => {
    const curDate = new Date();
    let targetYear = curDate.getFullYear();
    let targetMonth = curDate.getMonth() + 1;

    // Kiểm tra xem tháng hiện tại có bản ghi không, nếu chưa có thì lấy tháng mới nhất có dữ liệu
    const hasCurrent = attendanceRecords.some((r) => {
      const parts = String(r.ngay || '').slice(0, 10).split('-');
      return Number(parts[0]) === targetYear && Number(parts[1]) === targetMonth;
    });

    if (!hasCurrent && attendanceRecords.length > 0) {
      const sorted = [...attendanceRecords].sort(
        (a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime()
      );
      const latestParts = String(sorted[0].ngay || '').slice(0, 10).split('-');
      if (latestParts.length >= 2) {
        targetYear = Number(latestParts[0]);
        targetMonth = Number(latestParts[1]);
      }
    }

    const monthRecords = attendanceRecords.filter((r) => {
      const parts = String(r.ngay || '').slice(0, 10).split('-');
      return Number(parts[0]) === targetYear && Number(parts[1]) === targetMonth;
    });

    let onTime = 0, late = 0, absent = 0;
    monthRecords.forEach((r) => {
      if (r.trangThai === 'Có mặt') {
        if (r.gioDen && r.gioDen > '08:30:00') late++;
        else onTime++;
      } else {
        absent++;
      }
    });

    const present = onTime + late;
    const totalScheduled = present + absent;
    const rate = totalScheduled > 0 ? Math.min(100, Math.round((present / totalScheduled) * 100)) : 100;
    const monthLabel = `Tháng ${targetMonth}/${targetYear}`;

    return { present, late, absent, totalScheduled, rate, monthLabel };
  }, [attendanceRecords]);

  const developmentStats = useMemo(() => {
    const activityIds = new Set(childAssessments.filter((a) => Boolean(a.activityId)).map((a) => a.activityId as string));
    const activitiesCount = activityIds.size || (systemActivities.length > 0 ? systemActivities.length : 15);
    const criteriaMap = new Map<string, boolean>();
    childAssessments.forEach((a) => criteriaMap.set(a.developmentCriterionId, a.result));

    let passCount = 0, failCount = 0;
    criteriaMap.forEach((res) => {
      if (res) passCount++;
      else failCount++;
    });

    const totalCrit = systemCriteria.length > 0 ? systemCriteria.length : passCount + failCount || 60;
    const unassessedCount = Math.max(0, totalCrit - (passCount + failCount));
    const passRate = passCount + failCount > 0 ? Math.round((passCount / (passCount + failCount)) * 100) : 0;
    return { activitiesCount, passCount, failCount, unassessedCount, totalCrit, passRate };
  }, [childAssessments, systemCriteria, systemActivities]);

  return {
    selectedChildId,
    setSelectedChildId,
    activeChild,
    loading,
    attendanceRecords,
    classSchedules,
    healthRecord,
    childAlerts,
    fcmLatest,
    attendanceStats,
    developmentStats,
  };
}
