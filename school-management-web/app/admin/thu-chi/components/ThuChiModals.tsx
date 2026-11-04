'use client'

import React from 'react'
import Modal from '@/app/components/ui/Modal'
import { FeeItem, InvoiceItem, ChargeType, ChargeTypeLabels } from "@/services/billing"
import { StudentDebtRow } from '../types'

interface ThuChiModalsProps {
  // Fee Modal
  feeModalOpen: boolean
  onCloseFeeModal: () => void
  editingFee: FeeItem | null
  feeForm: { name: string; chargeType: ChargeType; amount: number; description: string; schoolYear: string }
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
  return (
    <>
      {/* 1. Modal Thêm / Sửa Biểu phí */}
      <Modal
        isOpen={feeModalOpen}
        onClose={onCloseFeeModal}
        title={editingFee ? 'Chỉnh sửa khoản thu' : 'Thêm khoản thu mầm non'}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Tên khoản thu</label>
            <input
              type="text"
              value={feeForm.name}
              onChange={(e) => setFeeForm((p: any) => ({ ...p, name: e.target.value }))}
              placeholder="VD: Tiền ăn tháng 10, Học phí bán trú..."
              className="mt-1 w-full rounded-2xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Loại khoản phí</label>
              <select
                value={feeForm.chargeType}
                onChange={(e) => setFeeForm((p: any) => ({ ...p, chargeType: Number(e.target.value) }))}
                className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
              >
                {Object.entries(ChargeTypeLabels).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Số tiền (VNĐ)</label>
              <input
                type="number"
                value={feeForm.amount}
                onChange={(e) => setFeeForm((p: any) => ({ ...p, amount: Number(e.target.value) }))}
                placeholder="VD: 1500000"
                className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Mô tả / Ghi chú</label>
            <textarea
              rows={2}
              value={feeForm.description}
              onChange={(e) => setFeeForm((p: any) => ({ ...p, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
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
              className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu khoản thu'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 2. Modal Chi tiết Hóa đơn */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={onCloseInvoiceDetail}
        title={`Chi tiết Hóa đơn: ${selectedInvoice?.invoiceNumber || ''}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="rounded-2xl bg-rose-50/50 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Học sinh:</span>
              <span className="font-bold text-slate-800">{(selectedInvoice as any)?.studentName || selectedInvoice?.childId || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tổng số tiền:</span>
              <span className="font-bold text-rose-600">{money(selectedInvoice?.totalAmount)} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Đã thanh toán:</span>
              <span className="font-bold text-emerald-600">{money(selectedInvoice?.paidAmount)} đ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Trạng thái:</span>
              <span className="font-bold">{selectedInvoice?.status === 'Paid' ? 'Đã thu đủ' : 'Chưa thu đủ'}</span>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={onCloseInvoiceDetail} className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700">
              Đóng
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. Modal Xác nhận Gạch nợ Thu học phí */}
      <Modal
        isOpen={Boolean(settlingStudent)}
        onClose={onCloseSettleModal}
        title="Xác nhận thu học phí"
        maxWidth="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Xác nhận đã nhận đủ số tiền học phí của học sinh: <b>{settlingStudent?.tenHocSinh}</b> ({settlingStudent?.className}).
          </p>
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 font-bold">
            Số tiền thu: {money(settlingStudent?.debtAmount || settlingStudent?.totalRequired)} đ
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button onClick={onCloseSettleModal} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600">
              Hủy
            </button>
            <button onClick={onConfirmSettle} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
              Xác nhận đã thu
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
