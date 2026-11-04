'use client';

import React from 'react';
import { X, Camera, Plus } from 'lucide-react';
import { ActivityItem } from '@/services/development';
import MediaLightbox from '@/app/admin/components/shared/MediaLightbox';
import { useActivityMoments } from './useActivityMoments';
import { ActivityMomentsFilterBar } from './ActivityMomentsFilterBar';
import { ActivityMomentsGrid } from './ActivityMomentsGrid';

interface ActivityMomentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityItem | null;
  onOpenPostMoment: (activity: ActivityItem) => void;
}

export default function ActivityMomentsModal({
  isOpen,
  onClose,
  activity,
  onOpenPostMoment,
}: ActivityMomentsModalProps) {
  const {
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
  } = useActivityMoments(isOpen, activity);

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 font-sans">
        {/* Header */}
        <div className="border-b border-orange-100 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
                <Camera size={22} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-block text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    KHOẢNH KHẮC HOẠT ĐỘNG
                  </span>
                  <span className="font-mono text-xs text-orange-100 font-bold">
                    #{activity.code}
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white mt-0.5 line-clamp-1">
                  {activity.name}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-orange-100 line-clamp-1">
              {activity.description || 'Bộ sưu tập hình ảnh & video ghi nhận từ các lớp trong trường.'}
            </p>

            <button
              type="button"
              onClick={() => onOpenPostMoment(activity)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white text-orange-600 px-3.5 py-1.5 text-xs font-black shadow-sm hover:bg-orange-50 transition shrink-0 cursor-pointer"
            >
              <Plus size={14} />
              <span>Đăng thêm ảnh</span>
            </button>
          </div>
        </div>

        <ActivityMomentsFilterBar
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          availableMonths={availableMonths}
          totalCount={moments.length}
        />

        <div className="flex-1 overflow-y-auto p-6">
          <ActivityMomentsGrid
            loading={loading}
            filteredMoments={filteredMoments}
            activity={activity}
            onOpenPostMoment={onOpenPostMoment}
            onOpenLightbox={openLightbox}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>
            Tổng cộng: <b>{filteredMoments.length}</b> khoảnh khắc hiển thị
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      <MediaLightbox
        media={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </div>
  );
}
