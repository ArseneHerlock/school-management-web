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
    <div className="grid gap-2.5 sm:gap-4 grid-cols-1 sm:grid-cols-3">
      {/* 1. Tổng mức thu */}
      <div className="rounded-2xl sm:rounded-3xl border border-rose-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Tổng mức thu</span>
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-50 text-rose-600">
            <DollarSign size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>
        <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-slate-800">{money(totalMucNop)} đ</p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-400">Bao gồm học phí & bán trú</p>
      </div>

      {/* 2. Đã thanh toán */}
      <div className="rounded-2xl sm:rounded-3xl border border-emerald-100 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Đã thanh toán</span>
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>
        <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-emerald-600">{money(totalDaNop)} đ</p>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-emerald-600 font-semibold">Đã ghi nhận vào sổ thu</p>
      </div>

      {/* 3. Còn công nợ */}
      <div className="rounded-2xl sm:rounded-3xl border border-amber-100 bg-white p-3.5 sm:p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Cần thanh toán</span>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-black text-amber-600">{money(totalCongNo)} đ</p>
        </div>

        {totalCongNo > 0 && (
          <button
            onClick={onOpenPayModal}
            className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-amber-700 transition active:scale-95 cursor-pointer"
          >
            <CreditCard size={14} />
            <span>Thanh toán ngay</span>
          </button>
        )}
      </div>
    </div>
  )
}