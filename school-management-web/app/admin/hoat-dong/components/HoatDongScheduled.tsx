"use client";

import React from "react";
import { Calendar, Clock, MapPin, Building2, Trash2 } from "lucide-react";
import { ActivityScheduleEvent } from "@/services/schedule";

interface HoatDongScheduledProps {
  scheduledList: ActivityScheduleEvent[];
  onDeleteSchedule: (id: string, title: string) => void;
}

export default function HoatDongScheduled({
  scheduledList,
  onDeleteSchedule,
}: HoatDongScheduledProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-3xl border border-rose-100 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-800">
            Lịch trình hoạt động đã xếp cho học sinh
          </h3>
          <p className="text-xs text-slate-400">
            Các hoạt động này được đồng bộ trực tiếp lên Lịch học và Đánh giá của
            Giáo viên & Phụ huynh
          </p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Tổng số: <b className="text-rose-600">{scheduledList.length}</b> buổi
          hoạt động
        </span>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase">
                <th className="p-3.5">Ngày & Thời gian</th>
                <th className="p-3.5">Tên hoạt động</th>
                <th className="p-3.5">Phạm vi áp dụng</th>
                <th className="p-3.5">Địa điểm</th>
                <th className="p-3.5">Tiêu chí rèn luyện</th>
                <th className="p-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {scheduledList.map((item) => (
                <tr key={item.id} className="hover:bg-rose-50/20 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Calendar size={13} className="text-rose-500" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <Clock size={11} />
                      <span>
                        {item.startTime} - {item.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400 truncate max-w-xs">
                      {item.description || "Hoạt động trải nghiệm mầm non"}
                    </p>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                      <Building2 size={12} />{" "}
                      {item.isSchoolWide
                        ? "Toàn trường"
                        : item.className || "Lớp chỉ định"}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{item.location || "Khuôn viên trường"}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(item.criteria || []).map((c) => (
                        <span
                          key={c.id}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600"
                        >
                          {c.name}
                        </span>
                      ))}
                      {(!item.criteria || item.criteria.length === 0) && (
                        <span className="text-[10px] text-slate-400 italic">
                          Không có tiêu chí
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onDeleteSchedule(item.id, item.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Hủy buổi hoạt động này"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {scheduledList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Chưa có hoạt động nào được xếp lịch
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
