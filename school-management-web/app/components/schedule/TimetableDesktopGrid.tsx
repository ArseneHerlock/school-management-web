"use client";

import React from "react";
import {
  DayInfo,
  TimetableScheduleItem,
  WeeklyTimetableProps,
  CardStyleConfig,
  SESSIONS_CONFIG,
} from "./types";
import TimetableCard from "./TimetableCard";

interface TimetableDesktopGridProps {
  currentWeekDays: DayInfo[];
  userRole: WeeklyTimetableProps["userRole"];
  getEventsForCell: (
    isoDate: string,
    session: "morning" | "afternoon" | "evening"
  ) => TimetableScheduleItem[];
  getPeriodLabel: (item: TimetableScheduleItem) => string;
  getCardStyle: (item: TimetableScheduleItem) => CardStyleConfig;
  onEditSchedule?: WeeklyTimetableProps["onEditSchedule"];
  onDeleteSchedule?: WeeklyTimetableProps["onDeleteSchedule"];
  handleCardClick: (item: TimetableScheduleItem) => void;
}

export default function TimetableDesktopGrid({
  currentWeekDays,
  userRole,
  getEventsForCell,
  getPeriodLabel,
  getCardStyle,
  onEditSchedule,
  onDeleteSchedule,
  handleCardClick,
}: TimetableDesktopGridProps) {
  return (
    <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs font-sans">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[1050px] border-collapse text-left"
          style={{ tableLayout: "fixed" }}
        >
          {/* Explicit colgroup to guarantee exact column width distribution */}
          <colgroup>
            <col style={{ width: "110px" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
            <col style={{ width: "calc((100% - 110px) / 7)" }} />
          </colgroup>

          <thead>
            <tr className="bg-[#f0f9ff] border-b border-slate-200">
              <th className="p-3 text-center font-black text-xs text-[#0284c7] uppercase tracking-wider border-r border-slate-200">
                Ca học
              </th>

              {currentWeekDays.map((day) => (
                <th
                  key={day.isoDate}
                  className={`p-2.5 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                    day.isToday
                      ? "bg-sky-100/90 text-sky-900 border-b-2 border-b-sky-600 font-extrabold"
                      : "text-slate-700"
                  }`}
                >
                  <div className="text-sm font-bold">{day.dayName}</div>
                  <div className={`text-xs font-semibold mt-0.5 ${day.isToday ? "text-sky-700" : "text-slate-500"}`}>
                    {day.formattedDate}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {SESSIONS_CONFIG.map((session) => (
              <tr key={session.key}>
                {/* Session Label & Time Range Column (Top aligned, sticky) */}
                <td className="p-3 text-center border-r border-slate-200 align-top bg-amber-50/60">
                  <div className="sticky top-4 flex flex-col items-center justify-center gap-1 select-none">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-amber-200/90 text-amber-950 font-black text-xs uppercase tracking-wider shadow-2xs">
                      {session.label}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800/90 whitespace-nowrap">
                      {session.timeRange}
                    </span>
                  </div>
                </td>

                {/* Day Columns */}
                {currentWeekDays.map((day) => {
                  const events = getEventsForCell(day.isoDate, session.key);
                  return (
                    <td
                      key={day.isoDate}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[140px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    >
                      {events.length === 0 ? (
                        <div className="h-full min-h-[120px] flex items-center justify-center text-[11px] text-slate-300 italic select-none">
                          Trống
                        </div>
                      ) : (
                        <div className="space-y-2 h-full">
                          {events.map((item) => (
                            <TimetableCard
                              key={item.id}
                              item={item}
                              periodLabel={getPeriodLabel(item)}
                              styleConfig={getCardStyle(item)}
                              userRole={userRole}
                              onEdit={onEditSchedule}
                              onDelete={onDeleteSchedule}
                              onClick={() => handleCardClick(item)}
                            />
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export { TimetableDesktopGrid };