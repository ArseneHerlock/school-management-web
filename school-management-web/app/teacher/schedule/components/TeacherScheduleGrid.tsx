'use client';

import React from 'react';
import { Clock, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { ScheduleItem, TeacherDayColumn, TYPE_NAMES, TYPE_COLORS } from './types';

interface TeacherScheduleGridProps {
  currentWeekDays: TeacherDayColumn[];
  filteredEvents: ScheduleItem[];
  onOpenEvaluation: (evt: ScheduleItem) => void;
}

export default function TeacherScheduleGrid({
  currentWeekDays,
  filteredEvents,
  onOpenEvaluation,
}: TeacherScheduleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
      {currentWeekDays.map((day) => {
        const dayEvents = filteredEvents
          .filter((item) => item.date === day.isoDate)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        return (
          <div
            key={day.isoDate}
            className={`flex flex-col rounded-3xl border bg-white p-3.5 shadow-xs transition-all ${
              day.isToday
                ? 'border-orange-400 ring-2 ring-orange-300/60 bg-gradient-to-b from-orange-50/30 to-white'
                : 'border-slate-200/80'
            }`}
          >
            {/* Header ngày */}
            <div className="pb-2.5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs font-black ${
                    day.isToday ? 'text-orange-600' : 'text-slate-800'
                  }`}
                >
                  {day.dayName}
                </p>
                {day.isToday && (
                  <span className="text-[9px] font-black uppercase text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md">
                    Hôm nay
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">{day.formattedDate}</p>
            </div>

            {/* Danh sách sự kiện trong ngày */}
            <div className="mt-3 flex-1 space-y-2.5">
              {dayEvents.map((eventItem) => {
                const colorConfig = TYPE_COLORS[eventItem.type] || TYPE_COLORS[0];
                const hasCriteria =
                  eventItem.isActivity &&
                  eventItem.criteria &&
                  eventItem.criteria.length > 0;

                return (
                  <div
                    key={eventItem.id}
                    className={`rounded-2xl border p-3 transition shadow-xs ${colorConfig.bg} ${colorConfig.border}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${colorConfig.badge}`}
                      >
                        {TYPE_NAMES[eventItem.type]}
                      </span>
                      {hasCriteria && (
                        <span className="flex items-center gap-0.5 text-[9px] font-black text-orange-700 bg-orange-100/90 px-1.5 py-0.5 rounded">
                          <Award size={10} /> Tiêu chí
                        </span>
                      )}
                    </div>

                    <h4 className="mt-1.5 text-xs font-black text-slate-800 line-clamp-2 leading-snug">
                      {eventItem.title}
                    </h4>

                    <div className="mt-2 space-y-1 text-[10px] text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-slate-400" />
                        <span className="font-bold text-slate-700">
                          {eventItem.startTime} - {eventItem.endTime}
                        </span>
                      </div>
                      {eventItem.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="text-slate-400" />
                          <span className="truncate">{eventItem.location}</span>
                        </div>
                      )}
                    </div>

                    {hasCriteria && (
                      <button
                        onClick={() => onOpenEvaluation(eventItem)}
                        className="mt-2.5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-1.5 text-[10px] font-black text-white shadow-xs hover:from-orange-600 hover:to-amber-600 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Award size={12} />
                        <span>Đánh giá bé ({eventItem.evaluationCount || 0})</span>
                      </button>
                    )}
                  </div>
                );
              })}

              {dayEvents.length === 0 && (
                <div className="py-10 text-center text-xs text-slate-300 italic">
                  Không có lịch dạy
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
