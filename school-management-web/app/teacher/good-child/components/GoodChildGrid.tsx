'use client'

import React from 'react'
import { Edit3, Flower2, Star } from 'lucide-react'
import { Child } from '../../data'
import { FridayAwardChild } from '@/services/awards'

interface GoodChildGridProps {
  childrenList: Child[]
  rowFor: (id: string) => any
  onOpen: (child: Child) => void
  isDelivered?: (id: string) => boolean
  fridayAwardMap?: Map<string, FridayAwardChild>
  month?: number
  year?: number
}

export const GoodChildGrid: React.FC<GoodChildGridProps> = ({
  childrenList,
  rowFor,
  onOpen,
  isDelivered,
  fridayAwardMap,
  month = new Date().getMonth() + 1,
}) => {
  if (!childrenList.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">
        Không có học sinh thuộc lớp phụ trách.
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {childrenList.map((child) => {
        const cId = (child.apiId || String(child.id)).toLowerCase()
        const r = rowFor(child.apiId || String(child.id))
        const hasComment = Boolean(r?.teacherComment?.trim())

        // Lấy dữ liệu hoa thực tế từ CSDL
        const awardInfo = fridayAwardMap?.get(cId)
        const monthFlowers = awardInfo
          ? awardInfo.monthFlowerCount
          : Number(r?.dailyFlowerCount || (Array.isArray(r?.flowers) ? r.flowers.length : 0))
        const hasStar = awardInfo
          ? awardInfo.hasMonthlyStar
          : (monthFlowers >= 4 || Number(r?.bonusFlowerCount || 0) > 0)
        const allTimeFlowers = awardInfo
          ? awardInfo.totalFlowerCount
          : monthFlowers

        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onOpen(child)}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-orange-400 hover:shadow-xs cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 font-bold text-white text-xs shadow-2xs">
                    {child.avatar || child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-orange-600 transition truncate max-w-[150px]">
                      {child.name}
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      {child.nickname ? `Biệt danh: ${child.nickname}` : 'Học sinh'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                      hasComment
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {hasComment ? 'Đã có nhận xét' : 'Chưa nhận xét'}
                  </span>
                  {isDelivered && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                        isDelivered(child.apiId || String(child.id))
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isDelivered(child.apiId || String(child.id)) ? '✓ Đã giao PH' : 'Chưa giao PH'}
                    </span>
                  )}
                </div>
              </div>

              {/* Thông tin số phiếu bé ngoan & hoa tháng */}
              <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/40 p-2">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <Flower2 size={12} className="text-pink-500 shrink-0" />
                    <span className="text-[11px] font-black text-slate-800">
                      {monthFlowers}/4 phiếu
                    </span>
                    {hasStar && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-200 px-1.5 py-0.2 text-[8px] font-black text-amber-900">
                        <Star size={8} className="fill-amber-500 text-amber-500" /> Sao tháng
                      </span>
                    )}
                  </div>

                  {/* 4 nấc tích lũy hoa trong tháng */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4].map((slot) => (
                      <span
                        key={slot}
                        title={`Tuần ${slot}`}
                        className={`text-xs ${
                          slot <= monthFlowers ? 'opacity-100' : 'opacity-20 grayscale'
                        }`}
                      >
                        🌸
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {hasComment && (
                <p className="mt-1.5 text-[11px] text-slate-600 line-clamp-1 italic px-0.5">
                  &ldquo;{r?.teacherComment}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-orange-600 font-bold">
              <span>{hasComment ? 'Chỉnh sửa nhận xét' : 'Thêm nhận xét sổ'}</span>
              <Edit3 size={11} />
            </div>
          </button>
        )
      })}
    </div>
  )
}
