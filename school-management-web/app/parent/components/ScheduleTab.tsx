'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { ChildInfo } from '../types';
import WeeklyTimetable, { TimetableScheduleItem } from '@/app/components/schedule/WeeklyTimetable';
import { getParentSchedules, getSchedules, getEvaluationsForSchedule, ActivityChildEvaluation } from '@/services/schedule';
import { getAllLearningProducts } from '@/services/learning';
import { getMediaUrl } from '@/services';
import { parseMomentDescription, toIsoDateString } from '@/lib/moments';
import { MediaItem } from './moments/types';
import { MomentLightbox } from './moments/MomentLightbox';
import { normalizeTitleForMatch } from './schedule/types';
import { ActivityDetailModal } from './schedule/ActivityDetailModal';

export default function ScheduleTab({ child }: { child: ChildInfo }) {
  const [refreshKey] = useState(0);
  const [selectedItem, setSelectedItem] = useState<TimetableScheduleItem | null>(null);
  const [childEvaluations, setChildEvaluations] = useState<ActivityChildEvaluation[]>([]);

  // Khoảnh khắc của hoạt động được chọn ngay trên Thời khóa biểu
  const [activityMoments, setActivityMoments] = useState<MediaItem[]>([]);
  const [loadingMoments, setLoadingMoments] = useState(false);
  const [momentScopeFilter, setMomentScopeFilter] = useState<'ALL' | 'class' | 'child'>('ALL');
  const [previewMoment, setPreviewMoment] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (!selectedItem) {
      setChildEvaluations([]);
      setActivityMoments([]);
      setMomentScopeFilter('ALL');
      return;
    }

    // 1. Tải đánh giá của bé trong hoạt động
    const targetActId = selectedItem.activityId || selectedItem.id;
    getEvaluationsForSchedule(targetActId)
      .then((evals) => {
        const filtered = evals.filter(
          (e: ActivityChildEvaluation) =>
            String(e.childId) === String(child.id) ||
            (e.childName &&
              child.hoTen &&
              e.childName.trim().toLowerCase() === child.hoTen.trim().toLowerCase())
        );
        setChildEvaluations(filtered);
      })
      .catch(() => setChildEvaluations([]));

    // 2. Tải khoảnh khắc của lớp & của bé tại chính hoạt động này
    let isMounted = true;
    setLoadingMoments(true);
    const childId = String(child.id || '').toLowerCase();
    const classId = String(child.classId || (child as any).lopId || '').toLowerCase();
    const className = String(child.lop || '').trim().toLowerCase();

    const scheduleId = String(selectedItem.id || '').toLowerCase();
    const linkedActId = String(selectedItem.activityId || '').toLowerCase();
    const scheduleTitleRaw = String(selectedItem.title || '').trim().toLowerCase();
    const scheduleTitleNorm = normalizeTitleForMatch(selectedItem.title);
    const scheduleDate = String(selectedItem.date || '').slice(0, 10);

    getAllLearningProducts(100)
      .then((res) => {
        if (!isMounted) return;
        const rawList = Array.isArray(res) ? res : [];

        const matched: MediaItem[] = rawList
          .map((item: any) => {
            const rawDesc = String(item.description || item.Description || '');
            const itemChildId = String(item.childId || item.ChildId || '');
            const meta = parseMomentDescription(rawDesc, itemChildId);

            const mediaId = item.mediaId || item.MediaId || item.url || '';
            const url = mediaId ? getMediaUrl(mediaId) : '';
            const rawCreated = item.createdAtUtc || item.CreatedAtUtc || item.createdAt || '';
            const itemDate = meta.date || toIsoDateString(rawCreated);

            const isClassScope =
              meta.scope === 'class' || (Boolean(classId) && itemChildId.toLowerCase() === classId);

            return {
              id: String(item.id || item.Id || ''),
              url,
              title: String(item.title || item.Title || meta.activityTitle || selectedItem.title),
              description: meta.cleanText,
              date: itemDate,
              type: String(url).match(/\.(mp4|webm|ogg|mov)$/i) ? ('video' as const) : ('image' as const),
              category: meta.category || 'Hoạt động học tập',
              scope: isClassScope ? ('class' as const) : ('child' as const),
              childId: String(meta.childId || itemChildId || ''),
              childName: meta.childName || child.hoTen,
              classId: String(meta.classId || (isClassScope ? itemChildId : '') || ''),
              activityId: String(meta.activityId || item.activityId || item.ActivityId || ''),
              activityTitle: meta.activityTitle || '',
              likes: Number(item.likes || 0),
              _rawDesc: rawDesc,
              _itemClassName: (meta.className || '').trim().toLowerCase(),
            };
          })
          .filter((m: any) => {
            const mClassId = String(m.classId || '').toLowerCase();
            const mChildId = String(m.childId || '').toLowerCase();

            let belongsToChildOrClass = false;
            if (m.scope === 'class') {
              if (classId && (mClassId === classId || mChildId === classId)) belongsToChildOrClass = true;
              else if (className && (m._itemClassName.includes(className) || m._rawDesc.toLowerCase().includes(className))) belongsToChildOrClass = true;
            } else {
              if (childId && (mChildId === childId || m._rawDesc.toLowerCase().includes(`[child:${childId}`))) belongsToChildOrClass = true;
            }

            if (!belongsToChildOrClass) return false;

            const mActId = String(m.activityId || '').toLowerCase();
            if (mActId && (mActId === scheduleId || (linkedActId && mActId === linkedActId))) {
              return true;
            }

            const mActTitleNorm = normalizeTitleForMatch(m.activityTitle);
            const mTitleNorm = normalizeTitleForMatch(m.title);

            if (scheduleTitleNorm && scheduleTitleNorm.length >= 3) {
              if (
                mActTitleNorm &&
                (mActTitleNorm.includes(scheduleTitleNorm) || scheduleTitleNorm.includes(mActTitleNorm))
              ) {
                return true;
              }
              if (
                mTitleNorm &&
                (mTitleNorm.includes(scheduleTitleNorm) || scheduleTitleNorm.includes(mTitleNorm))
              ) {
                return true;
              }
            }

            if (scheduleTitleRaw && m._rawDesc.toLowerCase().includes(scheduleTitleRaw)) {
              return true;
            }

            if (scheduleDate && m.date === scheduleDate && !mActId && !m.activityTitle) {
              return true;
            }

            return false;
          });

        setActivityMoments(matched);
      })
      .catch(() => {
        if (isMounted) setActivityMoments([]);
      })
      .finally(() => {
        if (isMounted) setLoadingMoments(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedItem, child.id, child.hoTen, child.classId, child.lop]);

  const classActivityMoments = useMemo(
    () => activityMoments.filter((m) => m.scope === 'class'),
    [activityMoments]
  );
  const childActivityMoments = useMemo(
    () => activityMoments.filter((m) => m.scope === 'child'),
    [activityMoments]
  );
  const displayedMoments = useMemo(() => {
    if (momentScopeFilter === 'class') return classActivityMoments;
    if (momentScopeFilter === 'child') return childActivityMoments;
    return activityMoments;
  }, [activityMoments, classActivityMoments, childActivityMoments, momentScopeFilter]);

  const childRef = React.useRef(child);
  childRef.current = child;

  const fetchParentSchedules = useCallback(
    async (params: {
      from: string;
      to: string;
      type?: number;
      classId?: string;
    }): Promise<TimetableScheduleItem[]> => {
      const currentChild = childRef.current;
      const targetClassId = currentChild.classId || (currentChild as any).lopId || currentChild.lop || '';
      const q = new URLSearchParams();
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      if (params.type !== undefined) q.set('type', String(params.type));
      if (targetClassId) q.set('classId', targetClassId);
      if (currentChild.id) q.set('childId', currentChild.id);

      let fetchedList: any[] = [];
      try {
        const localRes = await fetch(`/api/schedule?${q.toString()}`, { cache: 'no-store' });
        if (localRes.ok) {
          fetchedList = await localRes.json();
        }
      } catch (err) {
        console.warn('Fallback to microservice schedule:', err);
      }

      if (!Array.isArray(fetchedList) || fetchedList.length === 0) {
        const scheduleParams = {
          from: params.from,
          to: params.to,
          type: params.type,
          classId: targetClassId || undefined,
        };
        const res = await getParentSchedules(scheduleParams).catch(() =>
          getSchedules(scheduleParams).catch(() => [])
        );
        fetchedList = Array.isArray(res) ? res : [];
      }

      const childClass = (currentChild.lop || '').trim().toLowerCase();

      const filtered = fetchedList.filter((x: any) => {
        if (x.isSchoolWide) return true;
        const itemClassId = x.classId || x.lopId;
        if (targetClassId && itemClassId && String(targetClassId).includes('-')) {
          return String(itemClassId).toLowerCase() === String(targetClassId).toLowerCase();
        }
        if (!childClass) return true;
        const itemClass = (x.className || x.tenLop || '').trim().toLowerCase();
        return (
          !itemClass ||
          itemClass === childClass ||
          itemClass === 'toàn trường' ||
          itemClass.includes(childClass) ||
          childClass.includes(itemClass)
        );
      });

      return filtered.map((x: any) => {
        const subjectStr = String(x.teachers?.[0]?.subject || '');
        const linkedActivityId = subjectStr.startsWith('ACT:')
          ? subjectStr.slice(4)
          : x.activityId || '';

        return {
          id: String(x.id || ''),
          title: x.title || x.tieuDe || x.tenSuKien || 'Hoạt động của bé',
          description: x.description || x.moTa || '',
          type: Number(x.type ?? x.loai ?? 1),
          date: String(x.date || x.ngay || new Date().toISOString()).slice(0, 10),
          startTime: String(x.startTime || x.gioBatDau || '07:30').slice(0, 5),
          endTime: String(x.endTime || x.gioKetThuc || '09:30').slice(0, 5),
          location: x.location || x.diaDiem || 'Phòng học',
          className: x.isSchoolWide ? 'Toàn trường' : currentChild.lop || x.className || 'Lớp của bé',
          status: x.status || 'Approved',
          teacherName:
            x.teacherName ||
            x.teachers?.[0]?.teacherId ||
            currentChild.giaoVienChuNhiem ||
            'Cô giáo phụ trách',
          teachers: x.teachers,
          isSchoolWide: Boolean(x.isSchoolWide),
          isActivity: Boolean(x.isActivity || x.type === 2 || x.type === 4),
          activityId: linkedActivityId,
          criteria: x.criteria,
        };
      });
    },
    []
  );

  const teacherComment = childEvaluations.find(
    (e: ActivityChildEvaluation) => Boolean(e.comment?.trim())
  )?.comment;

  return (
    <section className="space-y-4">
      <WeeklyTimetable
        key={refreshKey}
        userRole="parent"
        fetchSchedules={fetchParentSchedules}
        onItemClick={(item) => setSelectedItem(item)}
        extraHeaderInfo={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Học sinh:</span>
            <span className="font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded border border-sky-200">
              {child.hoTen}
            </span>
            <span className="font-semibold text-slate-500 ml-1">Lớp:</span>
            <span className="font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200">
              {child.lop || 'Lớp của bé'}
            </span>
            {child.giaoVienChuNhiem && (
              <>
                <span className="font-semibold text-slate-500 ml-1">GVCN:</span>
                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {child.giaoVienChuNhiem}
                </span>
              </>
            )}
          </div>
        }
      />

      {/* Parent Activity Detail Modal */}
      <ActivityDetailModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        childName={child.hoTen}
        activityMoments={activityMoments}
        classActivityMoments={classActivityMoments}
        childActivityMoments={childActivityMoments}
        displayedMoments={displayedMoments}
        loadingMoments={loadingMoments}
        momentScopeFilter={momentScopeFilter}
        setMomentScopeFilter={setMomentScopeFilter}
        onPreviewMoment={setPreviewMoment}
        childEvaluations={childEvaluations}
        teacherComment={teacherComment}
      />

      {/* Lightbox phóng to ảnh khoảnh khắc */}
      <MomentLightbox
        item={previewMoment}
        isOpen={Boolean(previewMoment)}
        onClose={() => setPreviewMoment(null)}
      />
    </section>
  );
}
