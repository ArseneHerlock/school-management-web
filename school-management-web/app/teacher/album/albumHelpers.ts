import { getMediaUrl } from '@/services';
import { ActivityItem } from '@/services/development';
import { Child } from '../data';
import {
  parseMomentDescription,
  extractMonthKey,
  formatMonthLabel,
  toIsoDateString,
} from '@/lib/moments';
import { AlbumItem } from './types';

export function mapAlbumItems(
  list: any[],
  kids: Child[],
  actList: ActivityItem[],
  currentClassId: string,
  currentClassName: string
): AlbumItem[] {
  const classStudentIds = new Set(
    (kids || []).map((k: any) => String(k.apiId || k.id).toLowerCase())
  );

  return list
    .filter((item: any) => {
      const rawDesc = String(item.description || item.Description || '');
      const itemChildId = String(item.childId || item.ChildId || '');
      const meta = parseMomentDescription(rawDesc, itemChildId);

      if (currentClassId) {
        const isClassTagMatched =
          meta.classId && String(meta.classId).toLowerCase() === currentClassId.toLowerCase();
        const isClassIdDirect =
          itemChildId && itemChildId.toLowerCase() === currentClassId.toLowerCase();
        const isClassNameMatched =
          currentClassName &&
          (meta.className?.toLowerCase().includes(currentClassName) ||
            rawDesc.toLowerCase().includes(currentClassName));
        const isStudentMatched =
          itemChildId && classStudentIds.has(itemChildId.toLowerCase());

        return isClassTagMatched || isClassIdDirect || isClassNameMatched || isStudentMatched;
      }

      return true;
    })
    .map((item: any) => {
      const rawDesc = String(item.description || item.Description || '');
      const itemChildId = String(item.childId || item.ChildId || '');
      const meta = parseMomentDescription(rawDesc, itemChildId);

      const mediaIdentifier =
        item.mediaId ||
        item.MediaId ||
        item.mediaUrl ||
        item.MediaUrl ||
        item.url ||
        item.Url ||
        '';
      const url = getMediaUrl(mediaIdentifier);
      const isVideo = String(url).match(/\.(mp4|webm|ogg|mov)$/i);

      const rawCreated =
        item.createdAtUtc || item.CreatedAtUtc || item.createdAt || item.CreatedAt;
      const itemDate = meta.date || toIsoDateString(rawCreated);
      const monthKey = extractMonthKey(itemDate) || extractMonthKey(rawCreated);

      let resolvedActivityTitle = meta.activityTitle || '';
      const resolvedActivityId = meta.activityId || item.activityId || item.ActivityId || '';
      if (!resolvedActivityTitle && resolvedActivityId) {
        const matchedAct = actList.find(
          (a: any) => String(a.id).toLowerCase() === String(resolvedActivityId).toLowerCase()
        );
        if (matchedAct) resolvedActivityTitle = matchedAct.name;
      }

      let resolvedChildName = meta.childName || '';
      if (!resolvedChildName && itemChildId) {
        const matchedKid = kids.find(
          (k: any) => String(k.apiId || k.id).toLowerCase() === itemChildId.toLowerCase()
        );
        if (matchedKid) resolvedChildName = matchedKid.name;
      }

      let rawTitle = String(
        item.title || item.Title || item.tieuDe || item.TieuDe || ''
      ).trim();
      if (
        !rawTitle ||
        /^\d{6,}$/.test(rawTitle) ||
        /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(rawTitle)
      ) {
        rawTitle = resolvedActivityTitle
          ? resolvedActivityTitle
          : `${meta.category} (${itemDate})`;
      }

      return {
        id: String(item.id || item.Id),
        url,
        title: rawTitle,
        cleanNote: meta.cleanText,
        date: itemDate,
        monthKey,
        type: isVideo ? ('video' as const) : ('image' as const),
        category: meta.category || 'Hoạt động học tập',
        scope: meta.scope,
        childId: itemChildId,
        childName: resolvedChildName,
        activityId: resolvedActivityId,
        activityTitle: resolvedActivityTitle,
        createdBy: item.createdBy
          ? String(item.createdBy)
          : item.CreatedBy
          ? String(item.CreatedBy)
          : undefined,
      };
    });
}

export function getAvailableActivities(photos: AlbumItem[], activities: ActivityItem[]) {
  const actMap = new Map<string, { id: string; title: string; count: number }>();
  photos.forEach((p) => {
    if (p.activityTitle) {
      const key = p.activityId || p.activityTitle;
      if (!actMap.has(key)) {
        actMap.set(key, { id: key, title: p.activityTitle, count: 0 });
      }
      actMap.get(key)!.count += 1;
    }
  });

  activities.forEach((a) => {
    if (!actMap.has(a.id)) {
      actMap.set(a.id, { id: a.id, title: a.name, count: 0 });
    }
  });

  return Array.from(actMap.values()).sort((a, b) => b.count - a.count);
}

export function getAvailableMonths(photos: AlbumItem[]) {
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

  photos.forEach((p) => {
    const key = p.monthKey || extractMonthKey(p.date);
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
}
