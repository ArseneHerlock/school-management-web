'use client'

import React from 'react'

export default function ThuChiSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 4 Thẻ tài chính skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-2xl bg-slate-100" />
            </div>
            <div className="h-7 w-36 rounded bg-slate-200" />
            <div className="h-3 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      {/* 2 Biểu đồ skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
        <div className="admin-card p-5 space-y-4">
          <div className="h-5 w-48 rounded bg-slate-200" />
          <div className="h-64 rounded-2xl bg-slate-100" />
        </div>
      </div>

      {/* Bảng hóa đơn skeleton */}
      <div className="admin-card p-5 space-y-4">
        <div className="h-5 w-44 rounded bg-slate-200" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-3 border-b border-slate-50 gap-4">
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="h-4 w-20 rounded bg-slate-100 hidden sm:block" />
              <div className="h-6 w-24 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
