'use client'

import React from 'react'

export default function TuitionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 3 Thẻ thống kê skeleton */}
      <div className="grid gap-2.5 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-3.5 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-xl bg-slate-100" />
            </div>
            <div className="h-7 w-32 rounded bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <div className="h-8 w-48 rounded-2xl bg-slate-200" />
        <div className="h-8 w-40 rounded-2xl bg-slate-100" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-3xl border border-slate-100 bg-white p-4 sm:p-6 shadow-xs space-y-4">
        <div className="h-5 w-56 rounded bg-slate-200" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div key={row} className="flex items-center justify-between py-2 border-b border-slate-50 gap-4">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
