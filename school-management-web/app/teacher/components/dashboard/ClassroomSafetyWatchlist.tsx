'use client'

import React from 'react'
import {
  ShieldAlert,
  Pill,
  AlertTriangle,
  UserCheck,
  FileText,
  Clock,
} from 'lucide-react'

export interface SafetyItem {
  id: string
  childName: string
  type: 'medication' | 'allergy' | 'pickup' | 'leave'
  title: string
  detail: string
  timeBadge?: string
  status: 'pending' | 'completed' | 'info'
}

interface ClassroomSafetyWatchlistProps {
  items: SafetyItem[]
  onNavigateLeave: () => void
  onNavigateAttendance: () => void
}

export const ClassroomSafetyWatchlist: React.FC<ClassroomSafetyWatchlistProps> = ({
  items,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const displayItems = showAll ? items : items.slice(0, 4);

  return (
    <div className="rounded-3xl border border-rose-200/80 bg-white p-4 sm:p-6 shadow-xs max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <ShieldAlert size={17} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-800">
              Sổ theo dõi an toàn & y tế của trẻ hôm nay
            </h3>
            <p className="text-[11px] text-slate-400">
              Theo dõi lịch uống thuốc, dị ứng dinh dưỡng và dặn dò đặc biệt từ phụ huynh
            </p>
          </div>
        </div>
        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-black text-rose-700 self-start sm:self-auto">
          {items.length} Lưu ý cần chăm sóc
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
          Hôm nay lớp không có lưu ý sức khỏe hoặc dặn thuốc đặc biệt nào từ phụ huynh.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {displayItems.map((item) => {
              const isMed = item.type === 'medication'
              const isAllergy = item.type === 'allergy'
              const isPickup = item.type === 'pickup'

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3.5 transition ${
                    isMed
                      ? 'border-rose-200 bg-rose-50/50 hover:bg-rose-50'
                      : isAllergy
                      ? 'border-amber-200 bg-amber-50/50 hover:bg-amber-50'
                      : isPickup
                      ? 'border-blue-200 bg-blue-50/50 hover:bg-blue-50'
                      : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          isMed
                            ? 'bg-rose-500 text-white'
                            : isAllergy
                            ? 'bg-amber-500 text-white'
                            : isPickup
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-500 text-white'
                        }`}
                      >
                        {isMed && <Pill size={14} />}
                        {isAllergy && <AlertTriangle size={14} />}
                        {isPickup && <UserCheck size={14} />}
                        {!isMed && !isAllergy && !isPickup && <FileText size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{item.childName}</p>
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase truncate">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    {item.timeBadge && (
                      <span className="shrink-0 flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-black text-slate-700 shadow-2xs">
                        <Clock size={10} className="text-slate-400" />
                        <span>{item.timeBadge}</span>
                      </span>
                    )}
                  </div>

                  <p className="mt-2.5 text-[11px] text-slate-600 leading-relaxed bg-white/70 p-2 rounded-xl border border-black/5">
                    {item.detail}
                  </p>
                </div>
              )
            })}
          </div>

          {items.length > 4 && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-black transition cursor-pointer"
              >
                {showAll ? 'Thu gọn danh sách lưu ý' : `Xem thêm ${items.length - 4} lưu ý khác...`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}