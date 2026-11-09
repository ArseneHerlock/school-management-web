'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { FeeItem, InvoiceItem, ChargeType, ChargeTypeLabels } from "@/services/billing"
import { StudentDebtRow } from '../types'
import { Utensils, BookOpen, ShieldCheck, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'

interface ThuChiModalsProps {
  // Fee Modal
  feeModalOpen: boolean
  onCloseFeeModal: () => void
  editingFee: FeeItem | null
  feeForm: { name: string; chargeType: ChargeType | number | string; amount: number; description: string; schoolYear: string }
  setFeeForm: React.Dispatch<React.SetStateAction<any>>
  onSaveFee: () => void
  isSubmitting: boolean

  // Invoice Detail Modal
  selectedInvoice: InvoiceItem | null
  onCloseInvoiceDetail: () => void

  // Settle Debt Modal
  settlingStudent: StudentDebtRow | null
  onCloseSettleModal: () => void
  onConfirmSettle: () => void
  money: (n: any) => string
}

// Bảng kê chuẩn các khoản thu dịch vụ hỗ trợ mầm non theo Nghị định 238/2025/NĐ-CP & Nghị quyết HĐND (Tổng 1.520.000 đ)
const STANDARD_INVOICE_ITEMS = [
  { name: 'Học phí mầm non (Miễn 100% theo Nghị định 238/2025/NĐ-CP)', amount: 0, type: 'Miễn 100% theo NĐ 238' },
  { name: 'Tiền ăn bán trú mầm non (Bữa chính trưa + bữa phụ xế - 45.000 đ/ngày)', amount: 900000, type: 'Tiền ăn (Hoàn trả khi nghỉ)' },
  { name: 'Dịch vụ chăm sóc & nuôi dưỡng bán trú (Theo Nghị quyết HĐND)', amount: 350000, type: 'Chăm sóc bán trú' },
  { name: 'Dịch vụ nước uống tinh khiết cho học sinh', amount: 20000, type: 'Nước uống' },
  { name: 'Học phẩm & học liệu phục vụ học tập, vui chơi trải nghiệm', amount: 30000, type: 'Học phẩm mầm non' },
  { name: 'Trang thiết bị, đồ dùng phục vụ bán trú cá nhân (chăn, gối, khay ăn)', amount: 20000, type: 'Đồ dùng bán trú' },
  { name: 'Hoạt động làm quen tiếng Anh & Ngoại khóa năng khiếu (Tự nguyện)', amount: 200000, type: 'Tự nguyện thỏa thuận' },
]

export default function ThuChiModals({
  feeModalOpen,
  onCloseFeeModal,
  editingFee,
  feeForm,
  setFeeForm,
  onSaveFee,
  isSubmitting,
  selectedInvoice,
  onCloseInvoiceDetail,
  settlingStudent,
  onCloseSettleModal,
  onConfirmSettle,
  money,
}: ThuChiModalsProps) {
  const chargeTypeOptions = [
    { value: 1, label: 'Học phí mầm non (Miễn 100% theo NĐ 238/2025/NĐ-CP)' },
    { value: 2, label: 'Tiền ăn bán trú mầm non (45.000 đ/ngày)' },
    { value: 4, label: 'Dịch vụ chăm sóc & nuôi dưỡng bán trú (Theo NQ HĐND)' },
    { value: 6, label: 'Học phẩm, nước uống & Đồ dùng bán trú' },
    { value: 5, label: 'Làm quen tiếng Anh & Năng khiếu (Tự nguyện)' },
    { value: 3, label: 'Dịch vụ xe ô tô đưa đón học sinh (Tự nguyện)' },
  ]

  return (
    <>
      {/* 1. Modal Thêm / Sửa Biểu phí mầm non */}
      <Modal
        isOpen={feeModalOpen}
        onClose={onCloseFeeModal}
        title={editingFee ? 'Chỉnh sửa khoản thu mầm non' : 'Thêm khoản thu mầm non mới'}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên khoản thu mầm non</label>
            <input
              type="text"
              value={feeForm.name}
              onChange={(e) => setFeeForm((p: any) => ({ ...p, name: e.target.value }))}
              placeholder="VD: Tiền ăn bán trú mầm non, Học phí chính khóa..."
              className="mt-1 w-full rounded-2xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Phân loại khoản thu</label>
              <select
                value={feeForm.chargeType}
                onChange={(e) => setFeeForm((p: any) => ({ ...p, chargeType: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
              >
                {chargeTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Định mức thu (VNĐ)</label>
              <input
                type="number"
                value={feeForm.amount}
                onChange={(e) => setFeeForm((p: any) => ({ ...p, amount: Number(e.target.value) }))}
                placeholder="VD: 1500000"
                className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Mô tả chi tiết & Căn cứ áp dụng</label>
            <textarea
              rows={3}
              value={feeForm.description}
              onChange={(e) => setFeeForm((p: any) => ({ ...p, description: e.target.value }))}
              placeholder="Ghi rõ thành phần cấu thành khoản phí, chính sách hoàn trả (nếu có)..."
              className="mt-1 w-full rounded-xl border border-emerald-200 p-2.5 text-xs outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onCloseFeeModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={onSaveFee}
              disabled={isSubmitting || !feeForm.name || !feeForm.amount}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold text-white hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu khoản thu'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 2. Modal Chi tiết Hóa đơn & Bảng kê các khoản thu */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={onCloseInvoiceDetail}
        title={`Phiếu thu & Bảng kê chi tiết: ${selectedInvoice?.invoiceNumber || ''}`}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Header tóm tắt */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-emerald-50/40 p-3.5 border border-emerald-100 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Mã phiếu</span>
              <p className="font-extrabold text-slate-800">{selectedInvoice?.invoiceNumber || '-'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Tổng mức thu</span>
              <p className="font-extrabold text-emerald-600 text-sm">{money(selectedInvoice?.totalAmount)} đ</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Đã thực nộp</span>
              <p className="font-extrabold text-emerald-600 text-sm">{money(selectedInvoice?.paidAmount)} đ</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái</span>
              <p>
                {selectedInvoice?.status === 'Paid' || Number(selectedInvoice?.outstandingAmount || 0) <= 0 ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px]">
                    <CheckCircle2 size={11} /> Đã hoàn thành
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px]">
                    <AlertCircle size={11} /> Còn nợ {money(selectedInvoice?.outstandingAmount || selectedInvoice?.totalAmount)} đ
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Bảng kê chi tiết 6 khoản thu mầm non theo hóa đơn */}
          <div className="space-y-2">
            <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} className="text-emerald-500" />
              Bảng kê chi tiết cơ cấu các khoản thu:
            </h5>
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-2 px-3 w-8 text-center">STT</th>
                    <th className="py-2 px-3">Khoản thu mầm non</th>
                    <th className="py-2 px-3">Phân loại</th>
                    <th className="py-2 px-3 text-right">Định mức</th>
                    <th className="py-2 px-3 text-right">Thực thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {STANDARD_INVOICE_ITEMS.map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/20 transition">
                      <td className="py-2 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{item.name}</td>
                      <td className="py-2 px-3 text-slate-500 text-[11px]">{item.type}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-700">{money(item.amount)} đ</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{money(item.amount)} đ</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50/30 font-black border-t border-emerald-100 text-xs">
                    <td colSpan={3} className="py-2.5 px-3 text-right text-slate-700">Tổng cộng hóa đơn dịch vụ bán trú:</td>
                    <td className="py-2.5 px-3 text-right text-slate-800">{money(selectedInvoice?.totalAmount || 1520000)} đ</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600">{money(selectedInvoice?.totalAmount || 1520000)} đ</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={onCloseInvoiceDetail}
              className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer shadow-sm"
            >
              Đóng bảng kê
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. Modal Xác nhận Gạch nợ Thu học phí */}
      <Modal
        isOpen={Boolean(settlingStudent)}
        onClose={onCloseSettleModal}
        title="Xác nhận thu học phí mầm non"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Xác nhận đã nhận đủ số tiền học phí và tiền ăn bán trú của học sinh: <b>{settlingStudent?.tenHocSinh}</b> ({settlingStudent?.className}).
          </p>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-emerald-900 font-bold space-y-1">
            <span className="text-[10px] text-emerald-600 uppercase font-semibold">Số tiền gạch nợ:</span>
            <p className="text-lg font-black text-emerald-700">
              {money(settlingStudent?.debtAmount || settlingStudent?.totalRequired)} đ
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onCloseSettleModal}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={onConfirmSettle}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:from-emerald-700 hover:to-teal-700 shadow-sm"
            >
              Xác nhận đã thu
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
