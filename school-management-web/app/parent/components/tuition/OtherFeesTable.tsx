'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Utensils, BookOpen, Clock, ShieldCheck, Bus } from 'lucide-react'
import { ChargeTypeLabels } from '@/services/billing'

interface OtherFeesTableProps {
  otherFeesData: any[]
  otherFeesTotals: { totalMucNop: number; totalSoTienNop: number; totalCongNo: number }
  money: (n: any) => string
}

export default function OtherFeesTable({
  otherFeesData,
  money,
}: OtherFeesTableProps) {
  const getNatureBadge = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('tiền ăn') || n.includes('ăn bán trú')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
          <Utensils size={10} /> Bán trú • Hoàn trả khi nghỉ
        </span>
      )
    }
    if (n.includes('tự nguyện') || n.includes('xe đưa đón') || n.includes('ngoài giờ')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold">
          <Clock size={10} /> Tự nguyện đăng ký
        </span>
      )
    }
    if (n.includes('chăm sóc') || n.includes('cơ sở vật chất')) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold">
          <ShieldCheck size={10} /> Phục vụ bán trú
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold">
        <BookOpen size={10} /> Bắt buộc
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 text-xs text-slate-700 leading-relaxed">
        <h4 className="font-extrabold text-slate-800 text-sm mb-1">
          Bảng Niêm Yết Biểu Phí & Dịch Vụ Mầm Non (Nghị định 238/2025/NĐ-CP & Nghị quyết HĐND)
        </h4>
        <p className="text-slate-600">
          Nhà trường công khai minh bạch tất cả các khoản thu trong năm học theo đúng quy định pháp luật. Trẻ mầm non được <strong>miễn 100% học phí</strong>. Các khoản dịch vụ bán trú (tiền ăn, chăm sóc trưa) và dịch vụ tự nguyện thỏa thuận (xe đưa đón, ngoại khóa năng khiếu) được thực hiện theo đúng danh mục HĐND phê duyệt.
        </p>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="p-3 w-10 text-center">STT</th>
                <th className="p-3">Danh mục khoản thu</th>
                <th className="p-3">Phân loại</th>
                <th className="p-3">Tính chất thu</th>
                <th className="p-3 text-right">Định mức thu</th>
                <th className="p-3">Ghi chú & Chính sách hoàn trả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {otherFeesData.map((fee, idx) => (
                <tr key={idx} className="hover:bg-rose-50/10 transition">
                  <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-800">{fee.tenKhoan}</td>
                  <td className="p-3 text-slate-600 font-semibold text-[11px]">
                    {ChargeTypeLabels[fee.chargeType] || 'Khoản thu mầm non'}
                  </td>
                  <td className="p-3">
                    {getNatureBadge(fee.tenKhoan)}
                  </td>
                  <td className="p-3 text-right font-black text-rose-600 text-sm whitespace-nowrap">
                    {money(fee.mucNop)} đ <span className="text-[10px] font-normal text-slate-400">/ {fee.unit || 'tháng'}</span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px] max-w-xs leading-relaxed">
                    {fee.moTa || 'Theo quyết định ban hành biểu phí năm học.'}
                  </td>
                </tr>
              ))}

              {otherFeesData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                    Chưa có biểu phí niêm yết nào
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
