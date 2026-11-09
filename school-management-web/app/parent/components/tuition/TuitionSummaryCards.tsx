'use client'

import React from 'react'
import { DollarSign, CheckCircle2, AlertTriangle, CreditCard } from 'lucide-react'

interface TuitionSummaryCardsProps {
  totalMucNop: number
  totalDaNop: number
  totalCongNo: number
  money: (n: any) => string
  onOpenPayModal: () => void
}

export default function TuitionSummaryCards({
  totalMucNop,
  totalDaNop,
  totalCongNo,
  money,
  onOpenPayModal,
}: TuitionSummaryCardsProps) {
  return (
    <div className="space-y-2.5 sm:space-y-4">
      <div className="grid gap-1.5 sm:gap-4 grid-cols-3">
        {/* 1. Tổng mức thu */}
        <div className="rounded-xl sm:rounded-3xl border border-rose-100 bg-white p-2.5 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase truncate">Tổng thu</span>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="mt-1 sm:mt-3 text-xs sm:text-2xl font-black text-slate-800 leading-tight">{money(totalMucNop)} đ</p>
          <p className="mt-0.5 text-[9px] sm:text-xs text-slate-400 hidden sm:block">Bao gồm học phí & bán trú</p>
        </div>

        {/* 2. Đã thanh toán */}
        <div className="rounded-xl sm:rounded-3xl border border-emerald-100 bg-white p-2.5 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase truncate">Đã nộp</span>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-1 sm:mt-3 text-xs sm:text-2xl font-black text-emerald-600 leading-tight">{money(totalDaNop)} đ</p>
          <p className="mt-0.5 text-[9px] sm:text-xs text-emerald-600 font-semibold hidden sm:block">Đã ghi sổ thu</p>
        </div>

        {/* 3. Còn công nợ */}
        <div className="rounded-xl sm:rounded-3xl border border-amber-100 bg-white p-2.5 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase truncate">Cần nộp</span>
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="mt-1 sm:mt-3 text-xs sm:text-2xl font-black text-amber-600 leading-tight">{money(totalCongNo)} đ</p>
          <p className="mt-0.5 text-[9px] sm:text-xs text-amber-600 font-semibold hidden sm:block">Chưa thanh toán</p>
        </div>
      </div>

      {totalCongNo > 0 && (
        <button
          onClick={onOpenPayModal}
          className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition active:scale-98 cursor-pointer"
        >
          <CreditCard size={15} />
          <span>Thanh toán ngay ({money(totalCongNo)} đ)</span>
        </button>
      )}
    </div>
  )
}
