'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles, BookOpen, School, Camera } from 'lucide-react';
import { getTeacherSchedules, getSchedules } from '@/services';
import { loadLiveTeacherContext, CLASS_INFO } from '../data';
import WeeklyTimetable, { TimetableScheduleItem, isEvaluableActivity } from '@/app/components/schedule/WeeklyTimetable';
import TeacherActivityActionModal from './components/TeacherActivityActionModal';
import TeacherPostMomentModal from '../components/TeacherPostMomentModal';
import ActivityMomentsModal from '../activities/components/ActivityMomentsModal';
import { ActivityItem } from '@/services/development';

export default function TeacherSchedulePage() {
  const router = useRouter();
  const [teacherContext, setTeacherContext] = useState<any>(null);
  const [allClasses, setAllClasses] = useState<any[]>([]);
  const [noticeMessage, setNoticeMessage] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modal lựa chọn thao tác (Đánh giá trẻ / Đăng khoảnh khắc / Xem khoảnh khắc)
  const [actionModalItem, setActionModalItem] = useState<TimetableScheduleItem | null>(null);
  const [viewMomentsActivity, setViewMomentsActivity] = useState<ActivityItem | null>(null);

  // Modal đăng khoảnh khắc cho hoạt động được chọn
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

  // Fetch teacher schedules from backend API (strictly assigned class + school-wide)
  const fetchTeacherSchedules = useCallback(
    async (params: {
      from: string;
      to: string;
      type?: number;
      classId?: string;
    }): Promise<TimetableScheduleItem[]> => {
      const q = new URLSearchParams();
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      if (params.type !== undefined) q.set('type', String(params.type));

      // Resolve teacher context if not yet state-saved
      let assignedCls = teacherContext?.cls;
      let classesList = allClasses;
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

      // Primary call to teacher schedule API, fallback to standard schedule API
      const scheduleParams = {
        from: params.from,
        to: params.to,
        classId: assignedClassId || undefined,
      };
      const res = await getTeacherSchedules(scheduleParams).catch(() =>
        getSchedules(scheduleParams).catch(() => [])
      );

      const fetchedList = Array.isArray(res) ? res : [];

      // STRICT CLASS FILTERING: Only display schedules for their assigned class or school-wide events
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
        return false; // If teacher has an assigned class, do not flood with other classes!
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
            teacherContext?.me?.fullName ||
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
    [teacherContext, allClasses]
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

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-3 sm:p-5 md:p-6 bg-white min-h-[calc(100vh-4rem)]">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-2xs"
            title="Quay lại bảng điều khiển"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded">
                Phân hệ Giáo viên / Kế hoạch hoạt động
              </span>
              {currentClassName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <School size={12} className="text-emerald-600" />
                  {currentClassName} {currentRoom ? `(${currentRoom})` : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Thời khóa biểu giảng dạy và các hoạt động học tập, sinh hoạt của lớp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/teacher/assessment"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 transition shadow-2xs"
          >
            <Sparkles size={13} />
            <span>Sổ Đánh giá trẻ</span>
          </Link>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Tải lại</span>
          </button>
        </div>
      </div>

      {/* Notice Alert */}
      {noticeMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 flex justify-between items-center shadow-xs">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600" />
            {noticeMessage}
          </span>
          <button
            onClick={() => setNoticeMessage('')}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer font-bold text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* Proposed Weekly Timetable (Strictly scoped to teacher's class) */}
      <WeeklyTimetable
        key={refreshKey}
        userRole="teacher"
        fetchSchedules={fetchTeacherSchedules}
        onItemClick={handleItemClick}
      />

      {/* Modal lựa chọn: Đánh giá trẻ, Đăng khoảnh khắc hoặc Xem khoảnh khắc */}
      <TeacherActivityActionModal
        isOpen={Boolean(actionModalItem)}
        onClose={() => setActionModalItem(null)}
        item={actionModalItem}
        onSelectEvaluate={handleExecuteEvaluate}
        onSelectPostMoment={handleExecutePostMoment}
        onSelectViewMoments={handleExecuteViewMoments}
      />

      {/* Modal xem khoảnh khắc của hoạt động ngay trên Thời khóa biểu */}
      <ActivityMomentsModal
        isOpen={Boolean(viewMomentsActivity)}
        onClose={() => setViewMomentsActivity(null)}
        activity={viewMomentsActivity}
        onOpenPostMoment={(act) => {
          setViewMomentsActivity(null);
          setPostMomentModalData({
            open: true,
            activityId: act.id,
            activityTitle: act.name,
            date: act.code || new Date().toISOString().slice(0, 10),
            classId: teacherContext?.cls?.id || '',
            className: teacherContext?.cls?.tenLop || '',
          });
        }}
      />

      {/* Modal đăng khoảnh khắc nhanh có tự động gán tên hoạt động */}
      <TeacherPostMomentModal
        isOpen={postMomentModalData.open}
        onClose={() =>
          setPostMomentModalData((prev) => ({ ...prev, open: false }))
        }
        defaultActivityId={postMomentModalData.activityId}
        defaultActivityTitle={postMomentModalData.activityTitle}
        defaultDate={postMomentModalData.date}
        defaultClassId={postMomentModalData.classId}
        defaultClassName={postMomentModalData.className}
        onSuccess={() => {
          setNoticeMessage(
            `Đã lưu khoảnh khắc thành công cho hoạt động "${postMomentModalData.activityTitle}"!`
          );
        }}
      />
    </div>
  );
}
