'use client';

import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import { TimetableScheduleItem } from '@/app/components/schedule/WeeklyTimetable';
import { ActivityChildEvaluation } from '@/services/schedule';
import { MediaItem } from '../moments/types';
import { ActivityMomentsSection } from './ActivityMomentsSection';
import { ChildEvaluationSection } from './ChildEvaluationSection';

interface ActivityDetailModalProps {
  selectedItem: TimetableScheduleItem | null;
  onClose: () => void;
  childName?: string;
  activityMoments: MediaItem[];
  classActivityMoments: MediaItem[];
  childActivityMoments: MediaItem[];
  displayedMoments: MediaItem[];
  loadingMoments: boolean;
  momentScopeFilter: 'ALL' | 'class' | 'child';
  setMomentScopeFilter: (filter: 'ALL' | 'class' | 'child') => void;
  onPreviewMoment: (m: MediaItem) => void;
  childEvaluations: ActivityChildEvaluation[];
  teacherComment?: string;
}

export function ActivityDetailModal({
  selectedItem,
  onClose,
  childName,
  activityMoments,
  classActivityMoments,
  childActivityMoments,
  displayedMoments,
  loadingMoments,
  momentScopeFilter,
  setMomentScopeFilter,
  onPreviewMoment,
  childEvaluations,
  teacherComment,
}: ActivityDetailModalProps) {
  if (!selectedItem) return null;

  return (
    <Modal
      isOpen={Boolean(selectedItem)}
      onClose={onClose}
      title={`Chi tiết hoạt động: ${selectedItem.title}`}
      subtitle={`${
        selectedItem.isSchoolWide ? 'Hoạt động toàn trường' : selectedItem.className
      } • Ngày ${selectedItem.date}`}
      maxWidth="2xl"
    >
      <div className="space-y-5 font-sans">
        {/* Meta badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <Clock size={15} className="text-sky-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Thời gian</p>
              <p className="font-bold text-slate-700">
                {selectedItem.startTime} - {selectedItem.endTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
            <MapPin size={15} className="text-rose-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Địa điểm</p>
              <p className="font-bold text-slate-700">
                {selectedItem.location || 'Phòng học'}
              </p>
            </div>
          </div>
        </div>

        {selectedItem.description && (
          <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <span className="font-bold text-amber-900 block mb-1">Mô tả hoạt động:</span>
            <p className="leading-relaxed">{selectedItem.description}</p>
          </div>
        )}

        {/* 1. Khoảnh khắc của Lớp & của Bé tại chính hoạt động này */}
        <ActivityMomentsSection
          activityMoments={activityMoments}
          classActivityMoments={classActivityMoments}
          childActivityMoments={childActivityMoments}
          displayedMoments={displayedMoments}
          loadingMoments={loadingMoments}
          momentScopeFilter={momentScopeFilter}
          setMomentScopeFilter={setMomentScopeFilter}
          onPreviewMoment={onPreviewMoment}
          childName={childName}
        />

        {/* 2. Child Evaluation & Indicators */}
        <ChildEvaluationSection
          childEvaluations={childEvaluations}
          childName={childName}
          teacherComment={teacherComment}
        />

        {/* Modal action */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
