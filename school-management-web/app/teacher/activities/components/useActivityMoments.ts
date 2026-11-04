import { useState, useEffect, useMemo } from 'react';
import { api, getMediaUrl, normalizeList } from '@/services';
import { ActivityItem } from '@/services/development';
import {
  parseMomentDescription,
  extractMonthKey,
  formatMonthLabel,
  toIsoDateString,
} from '@/lib/moments';

export interface ActivityMomentItem {
  id: string;
  url: string;
  title: string;
  cleanNote?: string;
  date: string;
  monthKey: string;
  type: 'image' | 'video';
  category: string;
  scope: 'class' | 'child';
  childName?: string;
}

export function useActivityMoments(isOpen: boolean, activity: ActivityItem | null) {
  const [moments, setMoments] = useState<ActivityMomentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedScope, setSelectedScope] = useState<'ALL' | 'class' | 'child'>('ALL');

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  useEffect(() => {
    if (!isOpen || !activity) return;

    let isMounted = true;
    setLoading(true);
    setSelectedMonth('ALL');
    setSelectedScope('ALL');

    const loadActivityMoments = async () => {
      try {
        const res = await api
          .get<any>('learning', '/api/learning/products?pageSize=100')
          .catch(() => []);
        const rawList = normalizeList<any>(res);

        const actId = String(activity.id || '').toLowerCase();
        const actName = String(activity.name || '').trim().toLowerCase();

        const matched = rawList
          .filter((item: any) => {
            const rawDesc = String(item.description || item.Description || '');
            const itemChildId = String(item.childId || item.ChildId || '');
            const meta = parseMomentDescription(rawDesc, itemChildId);

            const itemActId = String(meta.activityId || item.activityId || item.ActivityId || '').toLowerCase();
            if (actId && itemActId && itemActId === actId) return true;

            if (
              meta.activityTitle &&
              meta.activityTitle.toLowerCase().includes(actName)
            ) {
              return true;
            }

            const itemTitle = String(item.title || item.Title || item.tieuDe || item.TieuDe || '').toLowerCase();
            if (actName && itemTitle.includes(actName)) return true;

            if (actName && rawDesc.toLowerCase().includes(actName)) return true;

            return false;
          })
          .map((item: any) => {
            const rawDesc = String(item.description || item.Description || '');
            const itemChildId = String(item.childId || item.ChildId || '');
            const meta = parseMomentDescription(rawDesc, itemChildId);

            const mediaIdentifier =
              item.mediaId || item.MediaId || item.mediaUrl || item.MediaUrl || item.url || item.Url || '';
            const url = getMediaUrl(mediaIdentifier);
            const isVideo = String(url).match(/\.(mp4|webm|ogg|mov)$/i);

            const rawCreated =
              item.createdAtUtc || item.CreatedAtUtc || item.createdAt || item.CreatedAt;
            const itemDate = meta.date || toIsoDateString(rawCreated);
            const monthKey = extractMonthKey(itemDate) || extractMonthKey(rawCreated);

            return {
              id: String(item.id || item.Id),
              url,
              title: item.title || item.Title || activity.name,
              cleanNote: meta.cleanText,
              date: itemDate,
              monthKey,
              type: isVideo ? ('video' as const) : ('image' as const),
              category: meta.category || 'Hoạt động học tập',
              scope: meta.scope,
              childName: meta.childName,
            };
          });

        if (isMounted) {
          setMoments(matched);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadActivityMoments();

    return () => {
      isMounted = false;
    };
  }, [isOpen, activity]);

  const availableMonths = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const monthsMap = new Map<string, { key: string; label: string; count: number }>();

    for (let m = 12; m >= 1; m--) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      const key = `${currentYear}-${monthStr}`;
      monthsMap.set(key, {
        key,
        label: `Tháng ${monthStr}/${currentYear}`,
        count: 0,
      });
    }

    moments.forEach((m) => {
      const key = m.monthKey || extractMonthKey(m.date);
      if (key) {
        if (!monthsMap.has(key)) {
          monthsMap.set(key, {
            key,
            label: formatMonthLabel(key),
            count: 0,
          });
        }
        monthsMap.get(key)!.count += 1;
      }
    });

    return Array.from(monthsMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [moments]);

  const filteredMoments = useMemo(() => {
    return moments.filter((m) => {
      if (selectedMonth !== 'ALL') {
        const pMonth = m.monthKey || extractMonthKey(m.date);
        if (pMonth !== selectedMonth && !m.date.startsWith(selectedMonth)) {
          return false;
        }
      }
      if (selectedScope !== 'ALL' && m.scope !== selectedScope) return false;
      return true;
    });
  }, [moments, selectedMonth, selectedScope]);

  const lightboxItems = filteredMoments.map((m) => ({
    id: m.id,
    url: m.url,
    title: m.title,
    date: m.date,
    type: m.type,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return {
    moments,
    loading,
    selectedMonth,
    setSelectedMonth,
    selectedScope,
    setSelectedScope,
    availableMonths,
    filteredMoments,
    lightboxOpen,
    lightboxIndex,
    lightboxItems,
    openLightbox,
    closeLightbox,
  };
}
