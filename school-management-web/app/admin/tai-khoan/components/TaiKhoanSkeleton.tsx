"use client";

import React from "react";

export default function TaiKhoanSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* 4 Stats skeleton cards */}
      <div className="grid gap-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="admin-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-slate-200" />
              <div className="space-y-2 flex-1">
                <div className="h-3 w-20 rounded bg-slate-200" />
                <div className="h-6 w-12 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="admin-card p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-10 rounded-xl bg-slate-200" />
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="admin-card overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div key={row} className="flex items-center justify-between p-4 gap-4">
              <div className="h-4 w-6 rounded bg-slate-200" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-28 rounded bg-slate-100" />
              </div>
              <div className="h-4 w-28 rounded bg-slate-200 hidden md:block" />
              <div className="h-4 w-32 rounded bg-slate-200 hidden lg:block" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
              <div className="h-6 w-16 rounded-full bg-slate-200" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-200" />
                <div className="h-8 w-8 rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
