'use client';

import React from 'react';
import { ChildInfo } from '../types';
import WeeklyTimetable from '@/app/components/schedule/WeeklyTimetable';
import { MomentLightbox } from './moments/MomentLightbox';
import { ActivityDetailModal } from './schedule/ActivityDetailModal';
import { useParentScheduleTab } from './useParentScheduleTab';

export default function ScheduleTab({ child }: { child: ChildInfo }) {
  const {
    refreshKey,
    selectedItem,
    setSelectedItem,
    childEvaluations,
    activityMoments,
    classActivityMoments,
    childActivityMoments,
    displayedMoments,
    loadingMoments,
    momentScopeFilter,
    setMomentScopeFilter,
    previewMoment,
    setPreviewMoment,
    fetchParentSchedules,
    teacherComment,
  } = useParentScheduleTab(child);

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

      <MomentLightbox
        item={previewMoment}
        isOpen={Boolean(previewMoment)}
        onClose={() => setPreviewMoment(null)}
      />
    </section>
  );
}
