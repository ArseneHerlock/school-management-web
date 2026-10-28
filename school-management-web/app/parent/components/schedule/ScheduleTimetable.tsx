'use client'

import React from 'react'
import { ScheduleItem } from './types'
import { ChildEventCard } from './ChildEventCard'

interface DayCol {
  dayName: string
  isoDate: string
  formattedDate: string
  isToday: boolean
}

interface ScheduleTimetableProps {
  currentWeekDays: DayCol[]
  getEventsForCell: (isoDate: string, session: 'morning' | 'afternoon' | 'evening') => ScheduleItem[]
}

export const ScheduleTimetable: React.FC<ScheduleTimetableProps> = ({
  currentWeekDays,
  getEventsForCell,
}) => {
  return (
    <div className="card-frame overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-100/90 border-b border-slate-200">
              <th className="w-24 p-3 text-center font-black bg-sky-100/70 text-sky-900 border-r border-slate-200">
                Buổi học
              </th>
              {currentWeekDays.map((d) => (
                <th
                  key={d.isoDate}
                  className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                    d.isToday ? 'bg-sky-600 text-white font-black shadow-inner' : 'bg-slate-50 text-slate-800 font-bold'
                  }`}
                >
                  <div className="text-xs uppercase">{d.dayName}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      d.isToday ? 'text-sky-100 font-bold' : 'text-slate-400 font-semibold'
                    }`}
                  >
                    {d.formattedDate}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {/* SÁNG */}
            <tr>
              <td className="p-3 text-center font-black bg-amber-50 text-amber-900 border-r border-slate-200 align-top">
                <span className="text-xs font-black block">Sáng</span>
                <span className="text-[9px] font-semibold text-amber-700 block mt-0.5">07:00-11:30</span>
              </td>
              {currentWeekDays.map((d) => {
                const evs = getEventsForCell(d.isoDate, 'morning')
                return (
                  <td
                    key={d.isoDate}
                    className={`p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[140px] ${
                      d.isToday ? 'bg-sky-50/20' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      {evs.map((s) => (
                        <ChildEventCard key={s.id} item={s} />
                      ))}
                      {evs.length === 0 && (
                        <div className="h-20 flex items-center justify-center text-[10px] text-slate-300 font-medium">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* CHIỀU */}
            <tr>
              <td className="p-3 text-center font-black bg-indigo-50 text-indigo-900 border-r border-slate-200 align-top">
                <span className="text-xs font-black block">Chiều</span>
                <span className="text-[9px] font-semibold text-indigo-700 block mt-0.5">13:30-16:30</span>
              </td>
              {currentWeekDays.map((d) => {
                const evs = getEventsForCell(d.isoDate, 'afternoon')
                return (
                  <td
                    key={d.isoDate}
                    className={`p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[140px] ${
                      d.isToday ? 'bg-sky-50/20' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      {evs.map((s) => (
                        <ChildEventCard key={s.id} item={s} />
                      ))}
                      {evs.length === 0 && (
                        <div className="h-20 flex items-center justify-center text-[10px] text-slate-300 font-medium">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>

            {/* TỐI */}
            <tr>
              <td className="p-3 text-center font-black bg-emerald-50 text-emerald-900 border-r border-slate-200 align-top">
                <span className="text-xs font-black block">Tối</span>
                <span className="text-[9px] font-semibold text-emerald-700 block mt-0.5">16:30-18:00</span>
              </td>
              {currentWeekDays.map((d) => {
                const evs = getEventsForCell(d.isoDate, 'evening')
                return (
                  <td
                    key={d.isoDate}
                    className={`p-2 border-r border-slate-200 last:border-r-0 align-top min-h-[100px] ${
                      d.isToday ? 'bg-sky-50/20' : ''
                    }`}
                  >
                    <div className="space-y-1.5">
                      {evs.map((s) => (
                        <ChildEventCard key={s.id} item={s} />
                      ))}
                      {evs.length === 0 && (
                        <div className="h-16 flex items-center justify-center text-[10px] text-slate-300 font-medium">
                          —
                        </div>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
