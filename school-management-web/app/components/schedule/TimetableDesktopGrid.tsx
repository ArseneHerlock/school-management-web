"use client";

import React from "react";
import {
  DayInfo,
  TimetableScheduleItem,
  WeeklyTimetableProps,
  CardStyleConfig,
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

const SESSIONS: Array<{ key: "morning" | "afternoon" | "evening"; label: string }> = [
  { key: "morning", label: "Sáng" },
  { key: "afternoon", label: "Chiều" },
  { key: "evening", label: "Tối" },
];

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
    <div className="hidden md:block border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[1050px] border-collapse text-left"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr className="bg-[#f0f9ff] border-b border-slate-200">
              <th className="w-24 p-3 text-center font-bold text-sm text-[#0284c7] border-r border-slate-200">
                Ca học
              </th>

              {currentWeekDays.map((day) => (
                <th
                  key={day.isoDate}
                  className={`p-2.5 text-center border-r border-slate-200 last:border-r-0 transition-colors ${
                    day.isToday ? "bg-sky-100/90 text-[#0369a1]" : "text-[#0284c7]"
                  }`}
                >
                  <div className="text-sm font-bold">{day.dayName}</div>
                  <div className="text-xs font-semibold mt-0.5 opacity-90">
                    {day.formattedDate}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {SESSIONS.map((session) => (
              <tr key={session.key}>
                <td className="w-24 p-3 text-center font-bold text-sm bg-[#fef9c3] text-[#785412] border-r border-slate-200 align-middle">
                  {session.label}
                </td>
                {currentWeekDays.map((day) => {
                  const events = getEventsForCell(day.isoDate, session.key);
                  return (
                    <td
                      key={day.isoDate}
                      className="p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[160px] h-[160px]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #f8fafc 1px, transparent 1px), linear-gradient(to bottom, #f8fafc 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    >
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
