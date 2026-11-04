"use client";

import React from "react";
import { Clock, MapPin, User, X } from "lucide-react";
import { TimetableScheduleItem } from "./types";

interface TimetableDetailModalProps {
  item: TimetableScheduleItem | null;
  onClose: () => void;
  getPeriodLabel: (item: TimetableScheduleItem) => string;
}

export default function TimetableDetailModal({
  item,
  onClose,
  getPeriodLabel,
}: TimetableDetailModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              Chi tiết lịch
            </span>
            <h3 className="mt-1 text-base font-bold text-slate-800">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-xs text-slate-600">
          {item.description && (
            <p className="text-slate-700 font-medium">{item.description}</p>
          )}
          <div className="flex items-center gap-2">
            <Clock size={13} className="text-slate-400" />
            <span>
              {item.startTime} - {item.endTime} ({getPeriodLabel(item)})
            </span>
          </div>
          {item.location && (
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-slate-400" />
              <span>{item.location}</span>
            </div>
          )}
          {item.teacherName && (
            <div className="flex items-center gap-2">
              <User size={13} className="text-slate-400" />
              <span>GV: {item.teacherName}</span>
            </div>
          )}
          {item.className && (
            <div className="flex items-center gap-2 font-medium text-sky-700">
              <span>Lớp: {item.className}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
export { TimetableDetailModal };
