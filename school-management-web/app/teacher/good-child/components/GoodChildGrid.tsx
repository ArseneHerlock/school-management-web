'use client'

import React from 'react'
import { Edit3 } from 'lucide-react'
import { Child } from '../../data'

interface GoodChildGridProps {
  childrenList: Child[]
  rowFor: (id: string) => any
  onOpen: (child: Child) => void
  isDelivered?: (id: string) => boolean
}

export const GoodChildGrid: React.FC<GoodChildGridProps> = ({
  childrenList,
  rowFor,
  onOpen,
  isDelivered,
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
        const cId = child.apiId || String(child.id)
        const r = rowFor(cId)
        const hasComment = Boolean(r?.teacherComment?.trim())

        return (
          <button
            key={child.id}
            type="button"
            onClick={() => onOpen(child)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 text-left transition hover:border-amber-400 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 font-bold text-white shadow-xs">
                    {child.avatar || child.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition">
                      {child.name}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {child.nickname ? `Biệt danh: ${child.nickname}` : 'Học sinh'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                      hasComment
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {hasComment ? 'Đã có nhận xét' : 'Chưa ghi nhận'}
                  </span>
                  {isDelivered && (
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                        isDelivered(cId)
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isDelivered(cId) ? '✓ Đã giao PH' : 'Chưa giao PH'}
                    </span>
                  )}
                </div>
              </div>

              {hasComment && (
                <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 italic px-1">
                  &ldquo;{r?.teacherComment}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-600 font-bold">
              <span>{hasComment ? 'Sửa nhận xét' : 'Viết nhận xét'}</span>
              <Edit3 size={13} />
            </div>
          </button>
        )
      })}
    </div>
  )
}
