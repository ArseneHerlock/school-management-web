"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import { RoomRatioTelemetry } from "@/services/adminDashboardTypes";

interface LiveRoomRatiosWidgetProps {
  ratios: RoomRatioTelemetry[];
  onNavigateClass: (classId?: string) => void;
}

export const LiveRoomRatiosWidget: React.FC<LiveRoomRatiosWidgetProps> = ({
  ratios,
  onNavigateClass,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>("ALL");

  const filteredRatios = useMemo(() => {
    if (selectedGrade === "ALL") return ratios;
    return ratios.filter((r) => {
      const lower = (r.className || "").toLowerCase();
      if (selectedGrade === "Khối Mầm") return lower.includes("mầm");
      if (selectedGrade === "Khối Chồi") return lower.includes("chồi");
      if (selectedGrade === "Khối Lá") return lower.includes("lá");
      return true;
    });
  }, [ratios, selectedGrade]);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck size={16} />
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 truncate">
              Định biên Trẻ / Cô theo phòng
            </h2>
          </div>
        </div>

        <button
          onClick={() => onNavigateClass()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition self-start sm:self-auto cursor-pointer shrink-0"
        >
          <span>Xem tất cả lớp học</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Grade Selector on Mobile */}
      {ratios.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setSelectedGrade("ALL")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
              selectedGrade === "ALL"
                ? "bg-slate-800 text-white shadow-2xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tất cả ({ratios.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedGrade("Khối Mầm")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
              selectedGrade === "Khối Mầm"
                ? "bg-slate-800 text-white shadow-2xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Khối Mầm (4)
          </button>
          <button
            type="button"
            onClick={() => setSelectedGrade("Khối Chồi")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
              selectedGrade === "Khối Chồi"
                ? "bg-slate-800 text-white shadow-2xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Khối Chồi (4)
          </button>
          <button
            type="button"
            onClick={() => setSelectedGrade("Khối Lá")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition shrink-0 cursor-pointer ${
              selectedGrade === "Khối Lá"
                ? "bg-slate-800 text-white shadow-2xs font-black"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Khối Lá (4)
          </button>
        </div>
      )}

      {filteredRatios.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
          Chưa có dữ liệu phân lớp hoặc phòng học trong hệ thống.
        </div>
      ) : (
        <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredRatios.map((room) => {
            const occupancyRate = room.enrolled > 0 ? Math.round((room.present / room.enrolled) * 100) : 0;

            return (
              <div
                key={room.classId}
                onClick={() => onNavigateClass(room.classId)}
                className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide truncate">
                        {room.roomName}
                      </p>
                      <h3 className="text-xs sm:text-sm font-black text-slate-800 truncate group-hover:text-emerald-600 transition">
                        {room.className}
                      </h3>
                      <p className="text-[10px] font-medium text-slate-500 truncate">{room.ageGroup}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold shrink-0 ${
                        room.isSafe
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {room.isSafe ? (
                        <ShieldCheck size={10} className="text-emerald-600" />
                      ) : (
                        <AlertTriangle size={10} className="text-amber-600" />
                      )}
                      <span>{room.statusLabel}</span>
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-lg bg-white p-2 border border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Tỷ lệ thực tế</span>
                      <p className="text-xs sm:text-sm font-black text-emerald-600 truncate">{room.ratioText}</p>
                      <span className="text-[9px] text-slate-400">Max 1:{room.standardRatio}</span>
                    </div>

                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Có mặt</span>
                      <p className="text-xs sm:text-sm font-black text-slate-800 truncate">
                        {room.present} <span className="text-[10px] font-semibold text-slate-400">/ {room.enrolled}</span>
                      </p>
                      <span className="text-[9px] text-emerald-600 font-bold">{occupancyRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 truncate">
                    <UserCheck size={11} className="text-slate-400 shrink-0" />
                    <span>{room.teachersOnDuty} Giáo viên trực</span>
                  </span>
                  <span className="text-slate-400 font-medium shrink-0 ml-1">Chi tiết ➜</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
