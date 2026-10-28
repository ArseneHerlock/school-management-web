'use client'

import React from 'react'
import { ActivityItem, CriterionItem } from '@/lib/development'

interface DanhGiaFilterProps {
  classes: any[]
  activities: ActivityItem[]
  criteria: CriterionItem[]
  filterClass: string
  setFilterClass: (val: string) => void
  filterActivity: string
  setFilterActivity: (val: string) => void
  filterCriterion: string
  setFilterCriterion: (val: string) => void
  filterResult: 'all' | 'pass' | 'fail'
  setFilterResult: (val: 'all' | 'pass' | 'fail') => void
  filterFromDate: string
  setFilterFromDate: (val: string) => void
  filterToDate: string
  setFilterToDate: (val: string) => void
  searchKeyword: string
  setSearchKeyword: (val: string) => void
  filteredCount: number
}

export default function DanhGiaFilter({
  classes,
  activities,
  criteria,
  filterClass,
  setFilterClass,
  filterActivity,
  setFilterActivity,
  filterCriterion,
  setFilterCriterion,
  filterResult,
  setFilterResult,
  filterFromDate,
  setFilterFromDate,
  filterToDate,
  setFilterToDate,
  searchKeyword,
  setSearchKeyword,
  filteredCount,
}: DanhGiaFilterProps) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Bộ lọc theo dõi kết quả thực tế</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Lọc theo lớp học, hoạt động, tiêu chí phát triển và khoảng thời gian.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-500">
          Tìm thấy: <span className="text-rose-600 font-extrabold">{filteredCount}</span> kết quả
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Lớp học</label>
          <select
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">Tất cả lớp</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Hoạt động</label>
          <select
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterActivity}
            onChange={(e) => setFilterActivity(e.target.value)}
          >
            <option value="">Tất cả hoạt động</option>
            {activities.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Tiêu chí</label>
          <select
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterCriterion}
            onChange={(e) => setFilterCriterion(e.target.value)}
          >
            <option value="">Tất cả tiêu chí</option>
            {criteria.map((cr) => (
              <option key={cr.id} value={cr.id}>
                {cr.code} - {cr.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Kết quả</label>
          <select
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value as any)}
          >
            <option value="all">Tất cả (Đạt & Chưa đạt)</option>
            <option value="pass">Chỉ xem ĐẠT</option>
            <option value="fail">Chỉ xem CHƯA ĐẠT</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Từ ngày</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterFromDate}
            onChange={(e) => setFilterFromDate(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase">Đến ngày</label>
          <input
            type="date"
            className="mt-1 w-full rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-rose-400"
            value={filterToDate}
            onChange={(e) => setFilterToDate(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <input
          type="text"
          placeholder="Tìm theo tên bé, nhận xét hoặc bằng chứng..."
          className="w-full rounded-xl border border-rose-200/80 bg-rose-50/30 px-3 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-rose-400 focus:bg-white"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
    </div>
  )
}
