'use client'

import React from 'react'
import { Clock, MapPin, User, Sparkles } from 'lucide-react'
import { ScheduleItem, TYPE_COLORS } from './types'

export const ChildEventCard: React.FC<{ item: ScheduleItem }> = ({ item }) => {
  const isAct = item.isActivity
  const color = isAct ? TYPE_COLORS[2] : (TYPE_COLORS[item.type] || TYPE_COLORS[0])

  return (
    <div className={`rounded-xl border ${color.border} ${color.bg} p-2 transition shadow-2xs space-y-1`}>
      <div className="flex items-start justify-between gap-1">
        <h4 className={`text-xs font-black ${color.text} leading-tight line-clamp-2`}>{item.title}</h4>
      </div>

      {isAct && (
        <span className="inline-flex items-center gap-1 font-mono text-[9px] font-black uppercase text-purple-700 bg-purple-100/90 px-1.5 py-0.5 rounded">
          <Sparkles size={9} /> HOẠT ĐỘNG
        </span>
      )}

      <div className="space-y-0.5 text-[10px] text-slate-600 font-medium">
        <div className="flex items-center gap-1 font-bold text-slate-800">
          <Clock size={11} className="text-slate-400 shrink-0" />
          <span>
            {item.startTime} - {item.endTime}
          </span>
        </div>

        {item.location && (
          <div className="flex items-center gap-1 truncate text-slate-500">
            <MapPin size={10} className="text-emerald-600 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}

        {item.teacherName && (
          <div className="flex items-center gap-1 truncate text-slate-500">
            <User size={10} className="text-sky-600 shrink-0" />
            <span className="truncate">{item.teacherName}</span>
          </div>
        )}
      </div>

      {item.childEvaluation && (
        <div className="mt-1.5 rounded-lg bg-white/90 p-1.5 border border-purple-200 text-[10px] space-y-0.5">
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span>✔ Đã được cô đánh giá</span>
            <span className="bg-emerald-50 px-1 rounded text-[9px]">
              {item.childEvaluation.rating === 'excellent' ? '🏆 Xuất sắc' : '⭐ Tốt'}
            </span>
          </div>
          {item.childEvaluation.comment && (
            <p className="text-slate-600 italic line-clamp-2">&ldquo;{item.childEvaluation.comment}&rdquo;</p>
          )}
        </div>
      )}
    </div>
  )
}
