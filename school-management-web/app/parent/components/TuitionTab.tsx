'use client';

import React, { useState } from 'react';
import { ChildInfo, TuitionItem, TuitionPaymentHistory } from '../types';

interface TuitionTabProps {
  child: ChildInfo;
  items: TuitionItem[];
  history: TuitionPaymentHistory[];
}

export default function TuitionTab({ child, items, history }: TuitionTabProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  const handleConfirm = (method: string) => {
    setSelectedMethod(method);
    setStep(3);
  };

  return (
    <section className="space-y-5">
      <div className="card-frame p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Quản Lý & Thanh Toán Học Phí</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Minh bạch học phí, tiền ăn và các khoản dịch vụ bán trú của bé {child.hoTen}
        </p>
      </div>

      {/* Step 1: Bill Details */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-2xl p-6 text-white shadow-xs border border-sky-400/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">
                Học phí Tháng 10/2026
              </span>
              <span className="text-xs text-amber-200 font-bold bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                Hạn nộp: 05/10/2026
              </span>
            </div>
            <p className="text-xs text-sky-100 font-medium mt-2">Tổng số tiền cần thanh toán:</p>
            <h3 className="text-3xl sm:text-4xl font-black mt-1">
              {totalAmount.toLocaleString('vi-VN')}đ
            </h3>

            {/* Details */}
            <div className="mt-5 space-y-2 border-t border-white/20 pt-4 text-xs">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="text-sky-100">{item.name}</span>
                  <span className="font-bold text-sm">{item.amount.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="mt-5 w-full bg-white hover:bg-sky-50 text-sky-700 font-extrabold py-3.5 rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Tiến hành thanh toán ngay</span>
              <span>→</span>
            </button>
          </div>

          {/* Payment History Table */}
          <div className="card-frame p-5">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3">Lịch sử giao dịch 3 tháng gần nhất</h3>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{h.period}</p>
                      <p className="text-xs text-slate-400">{h.date} · {h.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-800">{h.amount.toLocaleString('vi-VN')}đ</p>
                    <span className="text-[11px] font-bold text-emerald-600">Đã thanh toán</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Method */}
      {step === 2 && (
        <div className="card-frame p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-base">Chọn phương thức thanh toán</h3>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
            >
              ← Quay lại
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 flex justify-between items-center text-sm">
            <span className="text-slate-600 font-semibold">Số tiền thanh toán:</span>
            <span className="text-lg font-black text-sky-700">{totalAmount.toLocaleString('vi-VN')}đ</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => handleConfirm('Ví Điện Tử MoMo')}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-pink-400 hover:bg-pink-50/40 transition-all text-left cursor-pointer"
            >
              <span className="text-2xl">🟣</span>
              <div>
                <p className="text-sm font-bold text-slate-800">Ví Điện Tử MoMo</p>
                <p className="text-xs text-slate-400">Thanh toán an toàn, tức thì qua App MoMo</p>
              </div>
              <span className="ml-auto text-xs font-bold text-sky-600">Chọn →</span>
            </button>

            <button
              onClick={() => handleConfirm('VNPay QR / SmartBanking')}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 transition-all text-left cursor-pointer"
            >
              <span className="text-2xl">🟦</span>
              <div>
                <p className="text-sm font-bold text-slate-800">VNPay QR / SmartBanking</p>
                <p className="text-xs text-slate-400">Quét mã QR từ hơn 40 ứng dụng ngân hàng</p>
              </div>
              <span className="ml-auto text-xs font-bold text-sky-600">Chọn →</span>
            </button>

            <button
              onClick={() => handleConfirm('Chuyển khoản Ngân hàng (Vietcombank)')}
              className="w-full flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-left cursor-pointer"
            >
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-sm font-bold text-slate-800">Chuyển khoản Ngân hàng (Vietcombank)</p>
                <p className="text-xs text-slate-400">Số tài khoản: 1029384756 - Trường Mầm Non OneKids</p>
              </div>
              <span className="ml-auto text-xs font-bold text-sky-600">Chọn →</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <div className="card-frame p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto font-black">
            ✓
          </div>
          <h3 className="text-xl font-extrabold text-slate-800">Thanh Toán Học Phí Thành Công!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Số tiền {totalAmount.toLocaleString('vi-VN')}đ đã được ghi nhận qua phương thức {selectedMethod} vào hệ thống học vụ của bé {child.hoTen} ({child.lop}).
          </p>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 max-w-xs mx-auto border border-slate-200">
            Mã giao dịch: <span className="font-bold text-slate-800">OKD-20260925-9981</span>
          </div>
          <button
            onClick={() => setStep(1)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Hoàn tất & Quay lại
          </button>
        </div>
      )}
    </section>
  );
}
