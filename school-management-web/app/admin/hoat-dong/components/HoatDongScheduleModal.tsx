"use client";

import React, { useMemo } from "react";
import Modal from "@/app/components/ui/Modal";
import { CalendarDays, Clock, MapPin, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { ActivityItem } from "@/services/development";
import { ActivityScheduleEvent } from "@/services/schedule";

interface HoatDongScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedulingActivity: ActivityItem | null;
  scheduleForm: {
    date: string;
    startTime: string;
    endTime: string;
    classId: string;
    location: string;
  };
  setScheduleForm: React.Dispatch<React.SetStateAction<any>>;
  classesList: any[];
  scheduledList?: ActivityScheduleEvent[];
  onConfirmSchedule: (e: React.FormEvent) => Promise<void>;
  isScheduling: boolean;
}

const quickSlots = [
  { label: "Sáng 1", start: "08:00", end: "09:30" },
  { label: "Sáng 2", start: "09:30", end: "11:00" },
  { label: "Chiều 1", start: "14:00", end: "15:30" },
  { label: "Chiều 2", start: "15:30", end: "17:00" },
];

export default function HoatDongScheduleModal({
  isOpen,
  onClose,
  schedulingActivity,
  scheduleForm,
  setScheduleForm,
  classesList,
  scheduledList = [],
  onConfirmSchedule,
  isScheduling,
}: HoatDongScheduleModalProps) {
  const eventsOnDate = useMemo(() => {
    if (!scheduleForm.date) return [];
    return scheduledList.filter((ev) => ev.date === scheduleForm.date);
  }, [scheduledList, scheduleForm.date]);

  const conflictEvent = useMemo(() => {
    if (!eventsOnDate.length || !scheduleForm.startTime || !scheduleForm.endTime)
      return null;
    return eventsOnDate.find((ev) => {
      return (
        scheduleForm.startTime < ev.endTime && scheduleForm.endTime > ev.startTime
      );
    });
  }, [eventsOnDate, scheduleForm.startTime, scheduleForm.endTime]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lên lịch hoạt động: ${schedulingActivity?.name || ""}`}
      subtitle="Hệ thống hỗ trợ kiểm tra khung giờ trống và cảnh báo trùng lịch tự động"
      maxWidth="lg"
    >
      <form onSubmit={onConfirmSchedule} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <CalendarDays size={14} className="text-emerald-500" />
                Ngày diễn ra *
              </label>
              <input
                type="date"
                required
                value={scheduleForm.date}
                onChange={(e) =>
                  setScheduleForm((p: any) => ({ ...p, date: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 outline-none focus:border-emerald-400 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-600 block mb-1">
                Chọn nhanh khung giờ đề xuất:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {quickSlots.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() =>
                      setScheduleForm((p: any) => ({
                        ...p,
                        startTime: s.start,
                        endTime: s.end,
                      }))
                    }
                    className={`p-1.5 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                      scheduleForm.startTime === s.start &&
                      scheduleForm.endTime === s.end
                        ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {s.label}: {s.start} - {s.end}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={13} className="text-slate-400" />
                  Bắt đầu *
                </label>
                <input
                  type="time"
                  required
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm((p: any) => ({
                      ...p,
                      startTime: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-emerald-200 p-2 outline-none focus:border-emerald-400 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Clock size={13} className="text-slate-400" />
                  Kết thúc *
                </label>
                <input
                  type="time"
                  required
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm((p: any) => ({
                      ...p,
                      endTime: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-xl border border-emerald-200 p-2 outline-none focus:border-emerald-400 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700">Phạm vi tham gia *</label>
              <select
                value={scheduleForm.classId}
                onChange={(e) =>
                  setScheduleForm((p: any) => ({ ...p, classId: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 outline-none focus:border-emerald-400 font-semibold"
              >
                <option value="SCHOOL_WIDE">Toàn trường (Tất cả các lớp)</option>
                {classesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.tenLop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                Địa điểm tổ chức
              </label>
              <input
                type="text"
                value={scheduleForm.location}
                onChange={(e) =>
                  setScheduleForm((p: any) => ({
                    ...p,
                    location: e.target.value,
                  }))
                }
                placeholder="VD: Sân cỏ trường, Hội trường lớn, Phòng thể chất..."
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-extrabold text-slate-700 text-xs">
                  Lịch hoạt động ngày {scheduleForm.date || "đã chọn"}:
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  {eventsOnDate.length} sự kiện
                </span>
              </div>

              <div className="my-2.5">
                {conflictEvent ? (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-bold flex items-start gap-2">
                    <AlertTriangle
                      size={16}
                      className="text-amber-600 shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-black text-emerald-700">CẢNH BÁO TRÙNG GIỜ!</p>
                      <p className="font-medium text-slate-700 mt-0.5">
                        Trùng khung giờ với <b>{conflictEvent.title}</b> (
                        {conflictEvent.startTime} - {conflictEvent.endTime})
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>
                      Khung giờ {scheduleForm.startTime} - {scheduleForm.endTime} ĐANG
                      TRỐNG!
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {eventsOnDate.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    Ngày này chưa có hoạt động nào được xếp lịch. Khung giờ hoàn toàn
                    tự do!
                  </div>
                ) : (
                  eventsOnDate.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 truncate">
                          {ev.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {ev.location} ·{" "}
                          {ev.isSchoolWide
                            ? "Toàn trường"
                            : ev.className || "Lớp"}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        {ev.startTime} - {ev.endTime}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center gap-1">
              <Info size={13} className="text-slate-400" />
              Giúp ban giám hiệu lên lịch trực quan mà không cần rời trang
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isScheduling}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 px-5 py-2 font-bold text-white hover:from-emerald-600 hover:to-amber-600 shadow-md cursor-pointer"
          >
            {isScheduling ? "Đang xếp lịch..." : "Xác nhận xếp lịch"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
