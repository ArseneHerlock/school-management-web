'use client'

import React from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface OtherFeesTableProps {
  otherFeesData: any[]
  otherFeesTotals: { totalMucNop: number; totalSoTienNop: number; totalCongNo: number }
  money: (n: any) => string
}

export default function OtherFeesTable({
  otherFeesData,
  otherFeesTotals,
  money,
}: OtherFeesTableProps) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <th className="p-3 w-10 text-center">STT</th>
              <th className="p-3">Khoản thu</th>
              <th className="p-3">Tính chất</th>
              <th className="p-3 text-right">Mức nộp</th>
              <th className="p-3 text-right font-bold text-emerald-600">Đã nộp</th>
              <th className="p-3 text-right font-bold text-rose-600">Còn nợ</th>
              <th className="p-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {otherFeesData.map((fee, idx) => (
              <tr key={idx} className="hover:bg-rose-50/10 transition">
                <td className="p-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                <td className="p-3 font-semibold text-slate-800">{fee.tenKhoan}</td>
                <td className="p-3 text-slate-500">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    fee.batBuoc ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {fee.batBuoc ? 'Bắt buộc' : 'Tự nguyện'}
                  </span>
                </td>
                <td className="p-3 text-right font-bold text-slate-800">{money(fee.mucNop)} đ</td>
                <td className="p-3 text-right font-bold text-emerald-600">{money(fee.soTienNop)} đ</td>
                <td className="p-3 text-right font-bold text-rose-600">{money(fee.congNo)} đ</td>
                <td className="p-3 text-center">
                  {fee.congNo <= 0 ? (
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

            {otherFeesData.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                  Không có khoản thu khác nào cho kỳ này
                </td>
              </tr>
            )}
          </tbody>
          {otherFeesData.length > 0 && (
            <tfoot>
              <tr className="bg-rose-50/40 font-bold border-t border-rose-100">
                <td colSpan={3} className="p-3 text-right">Tổng cộng:</td>
                <td className="p-3 text-right text-slate-900">{money(otherFeesTotals.totalMucNop)} đ</td>
                <td className="p-3 text-right text-emerald-600">{money(otherFeesTotals.totalSoTienNop)} đ</td>
                <td className="p-3 text-right text-rose-600">{money(otherFeesTotals.totalCongNo)} đ</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
