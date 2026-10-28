'use client'

import React from 'react'
import { Plus, Edit3, Trash2, Layers } from 'lucide-react'
import { FeeItem, ChargeTypeLabels } from '@/lib/billing'

interface ThuChiFeesProps {
  fees: FeeItem[]
  schoolYear: string
  money: (n: any) => string
  onOpenCreateFee: () => void
  onOpenEditFee: (fee: FeeItem) => void
  onDeleteFee: (fee: FeeItem) => void
}

export default function ThuChiFees({
  fees,
  schoolYear,
  money,
  onOpenCreateFee,
  onOpenEditFee,
  onDeleteFee,
}: ThuChiFeesProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div>
          <h3 className="text-base font-black text-slate-800">Biểu phí & Danh mục khoản thu mầm non</h3>
          <p className="text-xs text-slate-400">Thiết lập mức thu cho học phí, tiền ăn, chăm sóc bán trú, ngoại khóa...</p>
        </div>
        <button
          onClick={onOpenCreateFee}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-rose-700 transition"
        >
          <Plus size={15} /> Thêm khoản thu mới
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fees.map((fee) => (
          <div key={fee.id} className="rounded-3xl border border-rose-100 bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {ChargeTypeLabels[fee.chargeType] || 'Khoản thu'}
                  </span>
                  <h4 className="mt-1.5 font-extrabold text-slate-800 text-base">{fee.name}</h4>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onOpenEditFee(fee)} className="p-1.5 text-slate-400 hover:text-slate-600" title="Sửa">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => onDeleteFee(fee)} className="p-1.5 text-slate-400 hover:text-rose-600" title="Xóa">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-rose-50/40 p-3">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Định mức thu</span>
                <p className="text-xl font-black text-rose-600">{money(fee.amount)} đ</p>
              </div>

              <p className="mt-3 text-xs text-slate-500 line-clamp-2">
                {fee.description || 'Chưa có ghi chú cho khoản phí này.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Áp dụng niên khóa:</span>
              <span className="font-bold text-slate-700">{fee.schoolYear || schoolYear}</span>
            </div>
          </div>
        ))}

        {fees.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-rose-200 bg-white p-12 text-center text-slate-400">
            <Layers size={36} className="mx-auto mb-2 text-slate-300" />
            <p className="font-bold">Chưa có danh mục khoản thu nào</p>
            <p className="text-xs text-slate-400 mt-1">Bấm "Thêm khoản thu mới" để bắt đầu thiết lập biểu phí.</p>
          </div>
        )}
      </div>
    </div>
  )
}
