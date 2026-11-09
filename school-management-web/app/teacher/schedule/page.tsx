'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle2, Sparkles, School } from 'lucide-react';
import WeeklyTimetable from '@/app/components/schedule/WeeklyTimetable';
import TeacherActivityActionModal from './components/TeacherActivityActionModal';
import TeacherPostMomentModal from '../components/TeacherPostMomentModal';
import ActivityMomentsModal from '../activities/components/ActivityMomentsModal';
import { useTeacherSchedulePage } from './useTeacherSchedulePage';

export default function TeacherSchedulePage() {
  const {
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
  } = useTeacherSchedulePage();

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-3 sm:p-5 md:p-6 bg-white min-h-[calc(100vh-4rem)]">
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Thời khóa biểu & Lịch sinh hoạt {currentClassName ? `— ${currentClassName}` : ''}
            </h1>
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

      <WeeklyTimetable
        key={refreshKey}
        userRole="teacher"
        fetchSchedules={fetchTeacherSchedules}
        onItemClick={handleItemClick}
      />

      <TeacherActivityActionModal
        isOpen={Boolean(actionModalItem)}
        onClose={() => setActionModalItem(null)}
        item={actionModalItem}
        onSelectEvaluate={handleExecuteEvaluate}
        onSelectPostMoment={handleExecutePostMoment}
        onSelectViewMoments={handleExecuteViewMoments}
      />

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
