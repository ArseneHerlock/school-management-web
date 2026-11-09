'use client'

import React, { Fragment } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

interface TuitionPeriodGroup {
  id: string
  name: string
  items: any[]
  subtotalMucNop: number
  subtotalDaNop: number
  subtotalCongNo: number
}

interface TuitionPeriodsTableProps {
  periods: TuitionPeriodGroup[]
  expandedPeriods: Record<string, boolean>
  togglePeriod: (id: string) => void
  money: (n: any) => string
}

export default function TuitionPeriodsTable({
  periods,
  expandedPeriods,
  togglePeriod,
  money,
}: TuitionPeriodsTableProps) {
  return (
    <div className="space-y-3">
      {/* 1. Mobile Cards View (sm:hidden) */}
      <div className="block sm:hidden space-y-2.5">
        {periods.map((period) => {
          const isExpanded = expandedPeriods[period.id] !== false
          const isFullyPaid = period.subtotalCongNo <= 0
          return (
            <div
              key={period.id}
              className="rounded-2xl border border-rose-100 bg-white overflow-hidden shadow-xs"
            >
              <div
                onClick={() => togglePeriod(period.id)}
                className="p-3 bg-rose-50/30 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-rose-500 shrink-0" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-400 shrink-0" />
                    )}
                    <span>{period.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px]">
                    <span className="text-slate-600">Phải nộp: <b>{money(period.subtotalMucNop)} đ</b></span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-600 font-bold">Đã nộp: {money(period.subtotalDaNop)} đ</span>
                  </div>
                </div>

                <div>
                  {isFullyPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={11} /> Hoàn tất
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      <AlertCircle size={11} /> Còn nợ {money(period.subtotalCongNo)} đ
                    </span>
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="divide-y divide-rose-50 p-2 space-y-1.5">
                  {period.items.map((item, idx) => (
                    <div key={idx} className="p-2 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-slate-800 truncate">{item.noiDung}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Quy định: {money(item.mucPhiBanDau)} đ
                          {item.soTienGiam > 0 && ` (-${money(item.soTienGiam)} đ)`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-slate-800">{money(item.mucNop)} đ</p>
                        <span
                          className={`text-[9px] font-bold ${
                            item.congNo <= 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {item.congNo <= 0 ? 'Đã thu' : `Nợ: ${money(item.congNo)} đ`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {periods.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
            Không có khoản học phí nào cho học kỳ này.
          </div>
        )}
      </div>

      {/* 2. Desktop Full Table View (hidden sm:block) */}
      <div className="hidden sm:block rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3 w-10 text-center">STT</th>
                <th className="p-3">Khoản thu / Nội dung</th>
                <th className="p-3 text-right">Mức nộp quy định</th>
                <th className="p-3 text-right">Miễn giảm</th>
                <th className="p-3 text-right font-bold text-slate-800">Số tiền phải nộp</th>
                <th className="p-3 text-right font-bold text-emerald-600">Đã nộp</th>
                <th className="p-3 text-right font-bold text-rose-600">Còn nợ</th>
                <th className="p-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {periods.map((period) => {
                const isExpanded = expandedPeriods[period.id] !== false
                return (
                  <Fragment key={period.id}>
                    <tr
                      onClick={() => togglePeriod(period.id)}
                      className="bg-rose-50/30 hover:bg-rose-50/60 cursor-pointer transition select-none font-bold text-slate-800"
                    >
                      <td colSpan={8} className="p-3 border-y border-rose-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                            {isExpanded ? (
                              <ChevronDown size={15} className="text-rose-500" />
                            ) : (
                              <ChevronRight size={15} className="text-slate-400" />
                            )}
                            <span>{period.name}</span>
                            <span className="text-[11px] font-semibold text-slate-400">
                              ({period.items.length} mục)
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span>Phải nộp: <b>{money(period.subtotalMucNop)} đ</b></span>
                            <span className="text-emerald-600">Đã nộp: <b>{money(period.subtotalDaNop)} đ</b></span>
                            <span className="text-rose-600">Nợ: <b>{money(period.subtotalCongNo)} đ</b></span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {isExpanded &&
                      period.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-rose-50/10 transition">
                          <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                          <td className="p-3 font-semibold text-slate-800">{item.noiDung}</td>
                          <td className="p-3 text-right text-slate-600">{money(item.mucPhiBanDau)} đ</td>
                          <td className="p-3 text-right text-emerald-600 font-medium">
                            {item.soTienGiam > 0 ? `-${money(item.soTienGiam)} đ` : '0 đ'}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-800">{money(item.mucNop)} đ</td>
                          <td className="p-3 text-right font-bold text-emerald-600">{money(item.daNop)} đ</td>
                          <td className="p-3 text-right font-bold text-rose-600">{money(item.congNo)} đ</td>
                          <td className="p-3 text-center">
                            {item.congNo <= 0 ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 size={12} /> Đã thu
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                                <AlertCircle size={12} /> Chưa nộp
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </Fragment>
                )
              })}

              {periods.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                    Không có khoản học phí nào cho học kỳ này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
