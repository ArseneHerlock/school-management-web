import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getTeacherSchedules, getSchedules } from '@/services';
import { loadLiveTeacherContext, CLASS_INFO } from '../data';
import { TimetableScheduleItem, isEvaluableActivity } from '@/app/components/schedule/WeeklyTimetable';
import { ActivityItem } from '@/services/development';

export function useTeacherSchedulePage() {
  const router = useRouter();
  const [teacherContext, setTeacherContext] = useState<any>(null);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [actionModalItem, setActionModalItem] = useState<TimetableScheduleItem | null>(null);
  const [viewMomentsActivity, setViewMomentsActivity] = useState<ActivityItem | null>(null);

  const [postMomentModalData, setPostMomentModalData] = useState<{
    open: boolean;
    activityId: string;
    activityTitle: string;
    date: string;
    classId: string;
    className: string;
  }>({
    open: false,
    activityId: '',
    activityTitle: '',
    date: '',
    classId: '',
    className: '',
  });

  useEffect(() => {
    loadLiveTeacherContext()
      .then((ctx) => {
        setTeacherContext(ctx);
        if (Array.isArray(ctx.classes)) {
          setAllClasses(ctx.classes);
        }
      })
      .catch(() => {});
  }, []);

  const teacherContextRef = useRef(teacherContext);
  teacherContextRef.current = teacherContext;
  const allClassesRef = useRef(allClasses);
  allClassesRef.current = allClasses;

  const fetchTeacherSchedules = useCallback(
    async (params: {
      from: string;
      to: string;
      type?: number;
      classId?: string;
    }): Promise<TimetableScheduleItem[]> => {
      let assignedCls = teacherContextRef.current?.cls;
      let classesList = allClassesRef.current;
      if (!assignedCls || classesList.length === 0) {
        const ctx = await loadLiveTeacherContext().catch(() => null);
        if (ctx) {
          assignedCls = ctx.cls;
          classesList = ctx.classes || [];
          setTeacherContext(ctx);
          setAllClasses(classesList);
        }
      }

      const assignedClassId = assignedCls?.id || assignedCls?.Id;
      const assignedClassName = (assignedCls?.tenLop || CLASS_INFO.name || '').trim().toLowerCase();

      const scheduleParams = {
        from: params.from,
        to: params.to,
        classId: assignedClassId || undefined,
      };
      const res = await getTeacherSchedules(scheduleParams).catch(() =>
        getSchedules(scheduleParams).catch(() => [])
      );

      const fetchedList = Array.isArray(res) ? res : [];

      const filtered = fetchedList.filter((item: any) => {
        if (item.isSchoolWide) return true;
        const itemClassId = item.classId || item.lopId;
        if (assignedClassId && itemClassId) {
          return String(itemClassId).toLowerCase() === String(assignedClassId).toLowerCase();
        }
        if (assignedClassName) {
          const itemClass = (item.className || '').trim().toLowerCase();
          return itemClass === assignedClassName || itemClass === 'toàn trường';
        }
        return false;
      });

      return filtered.map((item: any) => {
        const itemClassId = item.classId || item.lopId;
        const matchedClass = classesList.find(
          (c: any) => String(c.id).toLowerCase() === String(itemClassId).toLowerCase()
        );
        const resolvedClassName = item.isSchoolWide
          ? 'Toàn trường'
          : matchedClass?.tenLop || item.className || assignedCls?.tenLop || CLASS_INFO.name || 'Lớp phụ trách';

        const subjectStr = String(item.teachers?.[0]?.subject || '');
        const linkedActivityId = subjectStr.startsWith('ACT:')
          ? subjectStr.slice(4)
          : item.activityId || '';

        const mappedItem = {
          id: String(item.id || ''),
          title: item.title || item.tieuDe || 'Hoạt động lớp',
          description: item.description || item.moTa || '',
          type: Number(item.type ?? item.loai ?? 1),
          date: String(item.date || item.ngay || new Date().toISOString()).slice(0, 10),
          startTime: String(item.startTime || item.gioBatDau || '07:30').slice(0, 5),
          endTime: String(item.endTime || item.gioKetThuc || '09:30').slice(0, 5),
          location: item.location || item.diaDiem || assignedCls?.phongHoc || 'Phòng học',
          classId: itemClassId || assignedClassId,
          className: resolvedClassName,
          isSchoolWide: Boolean(item.isSchoolWide),
          status: item.status || 'Approved',
          teacherName:
            item.teacherName ||
            item.teachers?.[0]?.teacherId ||
            CLASS_INFO.teachers?.[0]?.name ||
            teacherContextRef.current?.me?.fullName ||
            'Giáo viên phụ trách',
          teachers: item.teachers,
          criteria: item.criteria,
          activityId: linkedActivityId,
          isActivity: false,
        };
        mappedItem.isActivity = isEvaluableActivity(mappedItem);
        return mappedItem;
      });
    },
    []
  );

  const handleItemClick = (item: TimetableScheduleItem) => {
    setActionModalItem(item);
  };

  const handleExecuteEvaluate = (item: TimetableScheduleItem) => {
    setActionModalItem(null);
    const clsId = item.classId || teacherContext?.cls?.id || '';
    try {
      sessionStorage.setItem(
        'teacher_focused_activity',
        JSON.stringify({
          scheduleId: item.id,
          activityId: item.activityId || '',
          title: item.title,
          classId: clsId,
          date: item.date,
        })
      );
    } catch {}
    router.push('/teacher/assessment');
  };

  const handleExecutePostMoment = (item: TimetableScheduleItem) => {
    setActionModalItem(null);
    setPostMomentModalData({
      open: true,
      activityId: item.activityId || item.id,
      activityTitle: item.title,
      date: item.date,
      classId: item.classId || teacherContext?.cls?.id || '',
      className: item.className || teacherContext?.cls?.tenLop || '',
    });
  };

  const handleExecuteViewMoments = (item: TimetableScheduleItem) => {
    setActionModalItem(null);
    setViewMomentsActivity({
      id: item.activityId || item.id,
      code: item.date,
      name: item.title,
      description: item.description || `${item.className || ''} • ${item.startTime} - ${item.endTime}`,
      createdAt: item.date,
      isActive: true,
      developmentCriteria: [],
    });
  };

  const currentClassName = teacherContext?.cls?.tenLop || CLASS_INFO.name || 'Lớp phụ trách';
  const currentRoom = teacherContext?.cls?.phongHoc || CLASS_INFO.room || '';

  return {
    teacherContext,
    noticeMessage,
    setNoticeMessage,
    refreshKey,
    setRefreshKey,
    actionModalItem,
    setActionModalItem,
    viewMomentsActivity,
    setViewMomentsActivity,
    postMomentModalData,
    setPostMomentModalData,
    currentClassName,
    currentRoom,
    fetchTeacherSchedules,
    handleItemClick,
    handleExecuteEvaluate,
    handleExecutePostMoment,
    handleExecuteViewMoments,
  };
}
