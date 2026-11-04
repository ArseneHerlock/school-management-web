'use client';

import React from 'react';
import {
  X,
  Sparkles,
  Camera,
  Calendar,
  Clock,
  MapPin,
  School,
  User,
  ArrowRight,
  CheckCircle2,
  Tag,
  Images,
} from 'lucide-react';
import { TimetableScheduleItem, isEvaluableActivity } from '@/app/components/schedule/WeeklyTimetable';

interface TeacherActivityActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: TimetableScheduleItem | null;
  onSelectEvaluate: (item: TimetableScheduleItem) => void;
  onSelectPostMoment: (item: TimetableScheduleItem) => void;
  onSelectViewMoments?: (item: TimetableScheduleItem) => void;
}

export default function TeacherActivityActionModal({
  isOpen,
  onClose,
  item,
  onSelectEvaluate,
  onSelectPostMoment,
  onSelectViewMoments,
}: TeacherActivityActionModalProps) {
  if (!isOpen || !item) return null;

  const evaluable = isEvaluableActivity(item);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 font-sans">
        {/* Header */}
        <div className="border-b border-slate-100 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full">
              LỰA CHỌN THAO TÁC HOẠT ĐỘNG
            </span>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <h3 className="mt-2 text-lg font-black tracking-tight text-white line-clamp-2">
            {item.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-sky-100">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
              <Calendar size={12} />
              {item.date}
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
              <Clock size={12} />
              {item.startTime} - {item.endTime}
            </span>
            {item.className && (
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                <School size={12} />
                {item.className}
              </span>
            )}
          </div>
        </div>

        {/* Content body with the 2 main choices */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-semibold">
            Thầy/Cô muốn thực hiện thao tác nào cho hoạt động này?
          </p>

          <div className="grid gap-3.5">
            {/* Lựa chọn 1: Đánh giá trẻ */}
            <button
              type="button"
              onClick={() => onSelectEvaluate(item)}
              className="group relative flex items-start gap-4 p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-500 bg-purple-50/40 hover:bg-purple-50 text-left transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/20 group-hover:scale-105 transition">
                <Sparkles size={24} />
              </div>

              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-purple-950">
                    Đánh giá phát triển trẻ
                  </span>
                  {evaluable ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.2 rounded-full">
                      <CheckCircle2 size={10} /> Có tiêu chí
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                      Tự do
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mở sổ đánh giá để chấm chỉ số đạt / cần rèn luyện và ghi nhận xét của cô cho từng bé.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 group-hover:text-purple-700 group-hover:translate-x-1 transition"
              />
            </button>

            {/* Lựa chọn 2: Đăng khoảnh khắc */}
            <button
              type="button"
              onClick={() => onSelectPostMoment(item)}
              className="group relative flex items-start gap-4 p-4 rounded-2xl border-2 border-orange-200 hover:border-orange-500 bg-orange-50/40 hover:bg-orange-50 text-left transition shadow-xs hover:shadow-md cursor-pointer"
            >
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 group-hover:scale-105 transition">
                <Camera size={24} />
              </div>

              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-orange-950">
                    Đăng khoảnh khắc hoạt động
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-200/80 px-2 py-0.2 rounded-full">
                    Tự động gán tên
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Tải ảnh / video hoạt động lên hệ thống. Tự động lấy tên <b>"{item.title}"</b>, cho phép đăng cho cả lớp hoặc riêng từng bé.
                </p>
              </div>

              <ArrowRight
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 group-hover:text-orange-700 group-hover:translate-x-1 transition"
              />
            </button>

            {/* Lựa chọn 3: Xem khoảnh khắc đã đăng của hoạt động */}
            {onSelectViewMoments && (
              <button
                type="button"
                onClick={() => onSelectViewMoments(item)}
                className="group relative flex items-start gap-4 p-4 rounded-2xl border-2 border-sky-200 hover:border-sky-500 bg-sky-50/40 hover:bg-sky-50 text-left transition shadow-xs hover:shadow-md cursor-pointer"
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20 group-hover:scale-105 transition">
                  <Images size={24} />
                </div>

                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-sky-950">
                      Xem khoảnh khắc tại hoạt động này
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-sky-700 bg-sky-100 px-2 py-0.2 rounded-full">
                      Cả lớp &amp; Từng bé
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Xem ngay các hình ảnh / video của lớp hoặc của từng bé đã ghi nhận trong hoạt động <b>&quot;{item.title}&quot;</b>.
                  </p>
                </div>

                <ArrowRight
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-400 group-hover:text-sky-700 group-hover:translate-x-1 transition"
                />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
