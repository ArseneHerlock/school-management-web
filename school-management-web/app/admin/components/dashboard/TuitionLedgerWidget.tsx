"use client";

import React from "react";
import {
  CreditCard,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgePercent,
} from "lucide-react";
import { TuitionLedgerStats } from "@/services/adminDashboardTypes";

interface TuitionLedgerWidgetProps {
  ledger: TuitionLedgerStats;
  onNavigateBilling: () => void;
}

export const TuitionLedgerWidget: React.FC<TuitionLedgerWidgetProps> = ({
  ledger,
  onNavigateBilling,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const hasData = ledger.totalExpected > 0;

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700 shrink-0">
              <Wallet size={16} />
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-800 truncate">
              Sổ quỹ Học phí & Bán trú ({ledger.periodLabel})
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 truncate">
            Giám sát dòng tiền, học phí chính khóa, tiền ăn và dịch vụ
          </p>
        </div>

        <button
          onClick={onNavigateBilling}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition self-start sm:self-auto cursor-pointer"
        >
          <span>Quản lý biểu phí & Hóa đơn</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {!hasData ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          Chưa có hóa đơn học phí hoặc phiếu thu nào được phát hành trong kỳ này.
        </div>
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {/* Tổng dự thu */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Tổng dự thu tháng
              </span>
              <p className="mt-1.5 text-xl sm:text-2xl font-black text-slate-800">
                {formatCurrency(ledger.totalExpected)}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Gồm học phí, bán trú, CSVC</p>
            </div>

            {/* Đã thu */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                  Đã thanh toán
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                  {ledger.collectionRate}%
                </span>
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-black text-emerald-700">
                {formatCurrency(ledger.totalCollected)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-600">Đã đối soát tự động qua QR/Ngân hàng</p>
            </div>

            {/* Còn tồn đọng */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                  Chưa thanh toán / Quá hạn
                </span>
                <AlertCircle size={14} className="text-amber-600" />
              </div>
              <p className="mt-1.5 text-xl sm:text-2xl font-black text-amber-700">
                {formatCurrency(ledger.totalOutstanding)}
              </p>
              <p className="mt-1 text-[11px] text-amber-600">Cần gửi nhắc phí tự động tới phụ huynh</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-600">Tiến độ thu học phí toàn trường</span>
              <span className="font-black text-slate-800">{ledger.collectionRate}% hoàn tất</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                style={{ width: `${ledger.collectionRate}%` }}
              />
            </div>
          </div>
        </>
      )}
    </section>
  );
};