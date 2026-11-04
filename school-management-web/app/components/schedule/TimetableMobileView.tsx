"use client";

import React from "react";
import {
  DayInfo,
  TimetableScheduleItem,
  WeeklyTimetableProps,
  CardStyleConfig,
} from "./types";
import TimetableCard from "./TimetableCard";

interface TimetableMobileViewProps {
  currentWeekDays: DayInfo[];
  selectedMobileDay: string;
  setSelectedMobileDay: (day: string) => void;
  filteredSchedules: TimetableScheduleItem[];
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

export default function TimetableMobileView({
  currentWeekDays,
  selectedMobileDay,
  setSelectedMobileDay,
  filteredSchedules,
  userRole,
  getEventsForCell,
  getPeriodLabel,
  getCardStyle,
  onEditSchedule,
  onDeleteSchedule,
  handleCardClick,
}: TimetableMobileViewProps) {
  const morningEvents = getEventsForCell(selectedMobileDay, "morning");
  const afternoonEvents = getEventsForCell(selectedMobileDay, "afternoon");

  return (
    <div className="block md:hidden space-y-3.5">
      {/* Horizontal Day Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        {currentWeekDays.map((day) => {
          const isSelected = day.isoDate === selectedMobileDay;
          const dayEvents = filteredSchedules.filter(
            (item) => item.date === day.isoDate
          );
          return (
            <button
              key={day.isoDate}
              type="button"
              onClick={() => setSelectedMobileDay(day.isoDate)}
              className={`shrink-0 flex flex-col items-center justify-center min-w-[58px] py-2 px-1 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#0284c7] text-white border-[#0284c7] shadow-sm font-bold"
                  : day.isToday
                  ? "bg-sky-50 text-sky-800 border-sky-300 font-semibold"
                  : "bg-white text-slate-700 border-slate-200"
              }`}
            >
              <span className="text-[10px] uppercase font-bold">{day.dayName}</span>
              <span
                className={`text-xs font-black mt-0.5 ${
                  isSelected ? "text-white" : "text-slate-800"
                }`}
              >
                {day.formattedDate.slice(0, 5)}
              </span>
              {dayEvents.length > 0 && (
                <span
                  className={`mt-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {dayEvents.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Event List */}
      <div className="space-y-3">
        {/* Morning Session */}
        <div className="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="flex items-center gap-1.5 text-xs font-black text-[#785412] bg-[#fef9c3] px-2.5 py-1 rounded-xl">
              🌅 Ca sáng
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {morningEvents.length} hoạt động
            </span>
          </div>
          {morningEvents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              Không có lịch học/hoạt động buổi sáng
            </p>
          ) : (
            <div className="space-y-2">
              {morningEvents.map((item) => (
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
        </div>

        {/* Afternoon Session */}
        <div className="rounded-3xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="flex items-center gap-1.5 text-xs font-black text-[#785412] bg-[#fef9c3] px-2.5 py-1 rounded-xl">
              🌇 Ca chiều
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {afternoonEvents.length} hoạt động
            </span>
          </div>
          {afternoonEvents.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2 text-center">
              Không có lịch học/hoạt động buổi chiều
            </p>
          ) : (
            <div className="space-y-2">
              {afternoonEvents.map((item) => (
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
        </div>
      </div>
    </div>
  );
}
export { TimetableMobileView };
