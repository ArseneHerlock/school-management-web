import { useState, useEffect, useMemo } from 'react';
import { getActivitiesWithCriteria, ActivityItem } from '@/services/development';
import { loadLiveTeacherContext } from '../data';

export function useTeacherActivities() {
  const [activities, setActivities] = useState<any[]>([]);
  const [teacherClassInfo, setTeacherClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'CLASS' | 'SCHOOL'>('ALL');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedActivityForMoments, setSelectedActivityForMoments] =
    useState<ActivityItem | null>(null);
  const [postMomentActivity, setPostMomentActivity] =
    useState<ActivityItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const load = async () => {
    setLoading(true);
    try {
      const ctx = await loadLiveTeacherContext().catch(() => null);
      if (ctx?.cls) setTeacherClassInfo(ctx.cls);

      const items = await getActivitiesWithCriteria({
        classId: ctx?.cls?.id,
      });

      setActivities(items || []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (scopeFilter === 'CLASS' && a.scope !== 'CLASS') return false;
      if (scopeFilter === 'SCHOOL' && a.scope === 'CLASS') return false;
      if (search.trim()) {
        const kw = search.toLowerCase();
        return (
          a.name.toLowerCase().includes(kw) ||
          (a.code || '').toLowerCase().includes(kw) ||
          (a.description || '').toLowerCase().includes(kw) ||
          (a.domainName || '').toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [activities, scopeFilter, search]);

  return {
    activities,
    teacherClassInfo,
    loading,
    search,
    setSearch,
    scopeFilter,
    setScopeFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedActivityForMoments,
    setSelectedActivityForMoments,
    postMomentActivity,
    setPostMomentActivity,
    toastMessage,
    setToastMessage,
    load,
    filtered,
  };
}
