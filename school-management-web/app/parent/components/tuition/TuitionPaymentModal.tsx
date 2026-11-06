'use client'

import React, { useState } from 'react'
import Modal from '@/app/components/ui/Modal'
import { QrCode, CheckCircle2, Loader2, ShieldCheck, CreditCard, Copy, Check, Download } from 'lucide-react'
import { ChildInfo } from '../../types'

interface TuitionPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  payAmount: number
  money: (n: any) => string
  child: ChildInfo
  paying: boolean
  paySuccess: boolean
  onExecutePayment: () => void
}

export default function TuitionPaymentModal({
  isOpen,
  onClose,
  payAmount,
  money,
  child,
  paying,
  paySuccess,
  onExecutePayment,
}: TuitionPaymentModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const bankName = 'MB Bank (Ngân hàng Quân Đội)'
  const bankAccount = '0987654321'
  const accountHolder = 'TRUONG MAM NON TUOI THO'
  const transferContent = `HOCPHI ${child?.hoTen ? child.hoTen.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase() : 'CON'}`

  // Standard VietQR URL format
  const qrUrl = `https://api.vietqr.io/image/970422-0987654321-compact2.jpg?amount=${payAmount}&addInfo=${encodeURIComponent(
    transferContent
  )}&accountName=${encodeURIComponent(accountHolder)}`

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán học phí trực tuyến"
      subtitle="Chuyển khoản nhanh qua VietQR 24/7"
      maxWidth="md"
    >
      <div className="space-y-4 text-center">
        {paySuccess ? (
          <div className="py-6 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-base font-bold text-slate-800">Thanh toán thành công!</h4>
            <p className="text-xs text-slate-500">
              Hệ thống nhà trường đã ghi nhận số tiền <b>{money(payAmount)} đ</b> cho học sinh {child?.hoTen}.
            </p>
            <button
              onClick={onClose}
              className="mt-3 rounded-2xl bg-slate-900 px-6 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-3.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Học sinh:</span>
                <span className="font-bold text-slate-800">{child?.hoTen || 'Học sinh'} ({child?.lop || 'Lớp mầm'})</span>
              </div>
              <div className="flex justify-between mt-1.5">
                <span>Số tiền thanh toán:</span>
                <span className="font-black text-rose-600 text-base">{money(payAmount)} đ</span>
              </div>
            </div>

            {/* VietQR Code Frame */}
            <div className="mx-auto flex flex-col items-center justify-center p-3 rounded-2xl border border-dashed border-rose-200 bg-white">
              <div className="relative group">
                <img
                  src={qrUrl}
                  alt="VietQR Học phí"
                  className="h-56 w-56 object-contain rounded-xl shadow-xs"
                />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                Mở ứng dụng Ngân hàng hoặc Ví MoMo/ZaloPay để quét mã
              </p>
            </div>

            {/* Bank details with 1-click copy */}
            <div className="rounded-2xl bg-slate-50 p-3 text-left text-xs text-slate-700 space-y-2 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Ngân hàng:</span>
                <span className="font-bold text-slate-800">{bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Số tài khoản:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-slate-900">{bankAccount}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankAccount, 'stk')}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                    title="Sao chép số tài khoản"
                  >
                    {copiedKey === 'stk' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Chủ tài khoản:</span>
                <span className="font-bold text-slate-800">{accountHolder}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Nội dung CK:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-rose-600">{transferContent}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(transferContent, 'nd')}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedKey === 'nd' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={onExecutePayment}
                disabled={paying}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-rose-500/20 hover:from-rose-600 hover:to-rose-700 cursor-pointer"
              >
                {paying ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                <span>{paying ? 'Đang xác thực...' : 'Tôi đã chuyển khoản'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}