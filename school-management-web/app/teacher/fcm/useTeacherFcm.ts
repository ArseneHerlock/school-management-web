import { useState, useEffect } from 'react';
import { loadLiveTeacherContext, loadLiveTeacherChildren } from '../data';
import { getClassFCM, getChildFCMHistory } from '@/services/awards';

export function useTeacherFcm() {
  const [classId, setClassId] = useState<string>('');
  const [className, setClassName] = useState<string>('Lớp học');
  const [teacherUserId, setTeacherUserId] = useState<string>('');

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [loading, setLoading] = useState<boolean>(true);
  const [successToast, setSuccessToast] = useState<string>('');

  const [fcmData, setFcmData] = useState<{
    stats: {
      cluster1Count: number;
      cluster2Count: number;
      cluster3Count: number;
      cluster4Count: number;
      unclusteredCount: number;
      totalChildren: number;
    };
    children: any[];
  } | null>(null);

  const [selectedChild, setSelectedChild] = useState<any | null>(null);
  const [childHistory, setChildHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      const cId = (ctx?.cls as any)?.id || (ctx?.cls as any)?.Id || '';
      setClassId(cId);
      setClassName(ctx?.cls?.tenLop || 'Lớp Mầm 1');
      setTeacherUserId(ctx?.me?.userId || (ctx?.me as any)?.UserId || '');

      await loadLiveTeacherChildren().catch(() => null);

      if (cId) {
        const data = await getClassFCM(cId, month, year).catch(() => null);
        if (data) {
          setFcmData(data);
        }
      }
    } catch (err) {
      console.error('Error loading FCM data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [month, year]);

  const handleViewChildTimeline = async (child: any) => {
    setSelectedChild(child);
    setLoadingHistory(true);
    try {
      const res = await getChildFCMHistory(child.ChildId);
      setChildHistory(res.history || []);
    } catch (err) {
      console.error('Error loading child history:', err);
      setChildHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  return {
    className,
    month,
    setMonth,
    year,
    setYear,
    loading,
    successToast,
    fcmData,
    selectedChild,
    setSelectedChild,
    childHistory,
    loadingHistory,
    handleViewChildTimeline,
  };
}
