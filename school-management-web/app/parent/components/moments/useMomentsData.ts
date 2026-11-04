import { useState, useEffect } from 'react';
import { getMediaUrl } from '@/services';
import { getAllLearningProducts } from '@/services/learning';
import { getActivities, ActivityItem } from '@/services/development';
import {
  parseMomentDescription,
  extractMonthKey,
  toIsoDateString,
} from '@/lib/moments';
import { MediaItem } from './types';
import { ChildInfo } from '../../types';

export function useMomentsData(child?: ChildInfo | any) {
  const [classMoments, setClassMoments] = useState<MediaItem[]>([]);
  const [childMoments, setChildMoments] = useState<MediaItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMoments = async () => {
      setLoading(true);
      const childId = String(child?.id || child?.childId || child?.hocSinhId || '').toLowerCase();
      const classId = String(child?.classId || child?.lopId || '').toLowerCase();
      const className = String(child?.lop || child?.className || child?.tenLop || '').trim().toLowerCase();

      try {
        const [res, actRes] = await Promise.all([
          getAllLearningProducts(100).catch(() => []),
          getActivities({ page: 1, pageSize: 100 }).catch(() => ({ items: [] })),
        ]);
        const fetchedItems = Array.isArray(res) ? res : [];
        const actList: ActivityItem[] = actRes?.items || [];

        if (isMounted) {
          setActivities(actList);
        }

        const mapped: MediaItem[] = fetchedItems.map((item: any) => {
          const rawDesc = String(item.description || item.Description || '');
          const itemChildId = String(item.childId || item.ChildId || '');
          const meta = parseMomentDescription(rawDesc, itemChildId);

          const mediaId = item.mediaId || item.MediaId || '';
          const rawUrl = mediaId
            ? getMediaUrl(mediaId)
            : item.url
            ? getMediaUrl(item.url)
            : '';
          const mediaUrl = rawUrl && !rawUrl.includes('unsplash.com') ? rawUrl : '';

          const rawCreated = item.createdAtUtc || item.CreatedAtUtc || item.createdAt || item.date || '';
          const itemDate = meta.date || toIsoDateString(rawCreated);
          const monthKey = extractMonthKey(itemDate) || extractMonthKey(rawCreated);

          let resolvedActivityTitle = meta.activityTitle || '';
          const resolvedActivityId = meta.activityId || item.activityId || item.ActivityId || '';
          if (!resolvedActivityTitle && resolvedActivityId) {
            const matchedAct = actList.find(
              (a) => String(a.id).toLowerCase() === String(resolvedActivityId).toLowerCase()
            );
            if (matchedAct) resolvedActivityTitle = matchedAct.name;
          }

          const category = meta.category || 'Hoạt động học tập';
          let rawTitle = String(item.title || item.tieuDe || '').trim();
          if (!rawTitle || /^\d{6,}$/.test(rawTitle) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(rawTitle)) {
            rawTitle = resolvedActivityTitle || `${category}${itemDate ? ` (${itemDate})` : ''}`;
          }

          const isClassScope =
            meta.scope === 'class' || (Boolean(classId) && itemChildId.toLowerCase() === classId);

          return {
            id: String(item.id || ''),
            url: mediaUrl,
            title: rawTitle,
            description: meta.cleanText,
            date: itemDate,
            monthKey,
            type: rawDesc.toLowerCase().includes('video') || String(mediaUrl).match(/\.(mp4|webm|ogg|mov)$/i) ? 'video' : 'image',
            category,
            scope: isClassScope ? 'class' : 'child',
            childId: String(meta.childId || itemChildId || ''),
            childName: meta.childName || child?.hoTen || '',
            classId: String(meta.classId || (isClassScope ? itemChildId : '') || ''),
            activityId: resolvedActivityId,
            activityTitle: resolvedActivityTitle,
            likes: Number(item.likes || 0),
            isLiked: false,
            _rawDesc: rawDesc,
            _itemClassName: (meta.className || '').trim().toLowerCase(),
          } as any;
        });

        if (!isMounted) return;

        const filteredClass = mapped.filter((m: any) => {
          if (m.scope !== 'class') return false;
          const mClassId = String(m.classId || '').toLowerCase();
          const mChildId = String(m.childId || '').toLowerCase();
          if (classId && mClassId && mClassId === classId) return true;
          if (classId && mChildId === classId) return true;
          if (className && m._itemClassName && m._itemClassName.includes(className)) return true;
          if (className && m._rawDesc && m._rawDesc.toLowerCase().includes(className)) return true;
          return false;
        });

        const filteredChild = mapped.filter((m: any) => {
          if (m.scope === 'class') return false;
          const mChildId = String(m.childId || '').toLowerCase();
          if (childId && mChildId === childId) return true;
          if (childId && m._rawDesc && m._rawDesc.toLowerCase().includes(`[child:${childId}`)) return true;
          return false;
        });

        setClassMoments(filteredClass);
        setChildMoments(filteredChild);
      } catch {
        if (isMounted) {
          setClassMoments([]);
          setChildMoments([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadMoments();
    return () => {
      isMounted = false;
    };
  }, [child]);

  return {
    classMoments,
    setClassMoments,
    childMoments,
    setChildMoments,
    activities,
    loading,
  };
}
