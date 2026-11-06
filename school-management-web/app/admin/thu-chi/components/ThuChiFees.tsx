'use client'

import React from 'react'
import { Plus, Edit3, Trash2, Layers, Info, ShieldCheck, Utensils, BookOpen, Clock, Bus, CheckCircle2 } from 'lucide-react'
import { FeeItem, ChargeTypeLabels } from "@/services/billing"

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
  // Tính tổng định mức tiêu chuẩn (6 khoản cơ bản không bao gồm dịch vụ tự nguyện đưa đón/trông muộn)
  const coreFeesTotal = fees
    .filter(f => !String(f.name).includes('Tự nguyện') && !String(f.name).includes('xe đưa đón'))
    .reduce((sum, f) => sum + (Number(f.amount) || 0), 0)

  const getFeeNatureBadge = (fee: FeeItem) => {
    const name = fee.name.toLowerCase()
    if (name.includes('tiền ăn') || name.includes('ăn bán trú')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
          <Utensils size={10} /> Bán trú • Hoàn trả khi nghỉ
        </span>
      )
    }
    if (name.includes('tự nguyện') || name.includes('tùy chọn') || name.includes('xe đưa đón') || name.includes('ngoài giờ')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
          <Clock size={10} /> Dịch vụ tự nguyện
        </span>
      )
    }
    if (name.includes('chăm sóc') || name.includes('cơ sở vật chất')) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
          <ShieldCheck size={10} /> Phục vụ bán trú
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
        <BookOpen size={10} /> Bắt buộc
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Khung chính sách & Tiêu chuẩn học phí mầm non */}
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50/70 via-amber-50/40 to-sky-50/50 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-rose-500 text-white p-1.5 shadow-sm">
                <Info size={16} />
              </span>
              <h3 className="text-base font-black text-slate-800">
                Biểu Phí & Quy Chuẩn Khoản Thu Mầm Non (Niên khóa {schoolYear})
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              Danh mục các khoản thu được chuẩn hóa theo <strong>Nghị định số 238/2025/NĐ-CP</strong> (trẻ mầm non được <strong>miễn 100% học phí chính khóa</strong>) và <strong>Nghị quyết HĐND cấp tỉnh</strong> về danh mục dịch vụ phục vụ, hỗ trợ hoạt động giáo dục bán trú.
              Bao gồm: <strong>Tiền ăn bán trú</strong> (hoàn trả khi nghỉ), <strong>Chăm sóc & nuôi dưỡng bán trú</strong>, <strong>Nước uống</strong>, <strong>Học phẩm</strong> và các <strong>Dịch vụ tự nguyện</strong> (Xe ô tô đưa đón, Ngoại khóa năng khiếu).
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 size={13} /> Suất ăn bán trú: <strong>45.000 đ/ngày</strong> (Hoàn trả trực tiếp khi có đơn xin nghỉ phép hợp lệ)
              </span>
              <span>•</span>
              <span className="text-slate-700">
                Định mức dịch vụ bán trú cơ bản: <strong>{money(coreFeesTotal || 1520000)} đ/tháng</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onOpenCreateFee}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:from-rose-600 hover:to-rose-700 transition shrink-0"
          >
            <Plus size={15} /> Thêm khoản thu mới
          </button>
        </div>
      </div>

      {/* Grid danh sách các khoản thu mầm non */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fees.map((fee) => (
          <div key={fee.id} className="rounded-3xl border border-rose-100 bg-white p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition group">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      {ChargeTypeLabels[fee.chargeType] || 'Khoản thu mầm non'}
                    </span>
                    {getFeeNatureBadge(fee)}
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-rose-600 transition">
                    {fee.name}
                  </h4>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => onOpenEditFee(fee)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition" title="Sửa">
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => onDeleteFee(fee)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition" title="Xóa">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-rose-50/40 p-3.5 border border-rose-100/50">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase">Định mức thu</span>
                  <span className="text-[11px] text-slate-500 font-bold">/ {fee.unit || 'tháng'}</span>
                </div>
                <p className="text-xl font-black text-rose-600 mt-0.5">{money(fee.amount)} đ</p>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                {fee.description || 'Chưa có ghi chú chi tiết cho khoản thu này.'}
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
