"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { ScheduleItem } from "../types";

interface ConflictAndSlotHelperProps {
  conflicts: ScheduleItem[];
  startTime: string;
  endTime: string;
  selectedClassName: string;
  availableSlots: Array<{ start: string; end: string; duration?: number }>;
  onApplySlot: (start: string, end: string) => void;
}

export default function ConflictAndSlotHelper({
  conflicts,
  startTime,
  endTime,
  selectedClassName,
  availableSlots,
  onApplySlot,
}: ConflictAndSlotHelperProps) {
  return (
    <div className="space-y-2">
      {conflicts.length > 0 ? (
        <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-black text-xs">
            <AlertTriangle size={17} className="text-emerald-600 shrink-0" />
            <span>
              CẢNH BÁO: TRÙNG LỊCH ({conflicts.length} hoạt động bị chồng chéo):
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-emerald-950">
            {conflicts.map((c) => (
              <div
                key={c.id}
                className="bg-white p-2.5 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-2xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{c.title}</span>
                  <span className="text-emerald-700 font-black ml-2">
                    ({c.startTime} - {c.endTime})
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {c.className || (c.isSchoolWide ? "Toàn trường" : "Lớp học")}{" "}
                    {c.location ? `• Địa điểm: ${c.location}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                  Bị trùng khung giờ
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium italic">
            Chọn một trong các khung giờ còn trống bên dưới để xếp lịch.
          </p>
        </div>
      ) : startTime && endTime ? (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold shadow-2xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            Khung giờ hợp lệ: Chưa có hoạt động nào bị trùng ({startTime} - {endTime}) cho {selectedClassName}.
          </span>
          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            Sẵn sàng thêm
          </span>
        </div>
      ) : null}

      {availableSlots.length > 0 && (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-sky-900">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-sky-600" />
              Các khung giờ còn trống trong ngày của {selectedClassName}:
            </span>
            <span className="text-[10px] text-sky-600 font-semibold">
              Bấm để tự động điền
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableSlots.map((slot, sIdx) => (
              <button
                key={sIdx}
                type="button"
                onClick={() => onApplySlot(slot.start, slot.end)}
                className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-500 hover:text-white transition shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <span>
                  {slot.start} - {slot.end}
                </span>
                {slot.duration ? (
                  <span className="text-[9px] font-black opacity-75">
                    ({slot.duration} phút)
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
