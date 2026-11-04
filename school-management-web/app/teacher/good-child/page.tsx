'use client';

import React, { Suspense } from 'react';
import {
  CalendarDays,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Flower2,
  X,
} from 'lucide-react';
import { useGoodChildList } from './useGoodChildList';
import { FridayAwardsSection } from './components/FridayAwardsSection';
import { MonthlyBookSection } from './components/MonthlyBookSection';

function GoodChildListContent() {
  const {
    activeTab,
    setActiveTab,
    className,
    children,
    month,
    setMonth,
    year,
    setYear,
    busy,
    successToast,
    msg,
    setMsg,
    fridayData,
    selectedChildIds,
    awarding,
    classDelivery,
    deliveringClass,
    fridayAwardMap,
    loadData,
    toggleSelectChild,
    handleSelectAll,
    handleAwardFriday,
    handleToggleDeliverAllClass,
    rowFor,
    handleOpenChildPage,
  } = useGoodChildList();

  return (
    <section className="mx-auto max-w-6xl space-y-6 font-sans">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-amber-100 text-amber-700">
              <Flower2 size={16} />
            </span>
            <span className="text-[11px] font-black tracking-widest text-amber-700 uppercase">
              THEO DÕI RÈN LUYỆN NỀ NẾP
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            Theo dõi rèn luyện - {className}
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Theo dõi nề nếp chuyên cần của tất cả học sinh, phát phiếu khen thứ Sáu, tổng hợp sao rèn luyện tháng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title="Tải lại danh sách"
          >
            <RefreshCw size={14} className={busy ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
        </div>
      </header>

      {msg && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800 flex items-center justify-between">
          <span>{msg}</span>
          <button
            onClick={() => setMsg('')}
            className="text-amber-600 hover:text-amber-900 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('FRIDAY_AWARDS')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'FRIDAY_AWARDS'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flower2 size={15} />
            <span>Phát Phiếu Bé Ngoan Thứ 6</span>
            {fridayData && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  activeTab === 'FRIDAY_AWARDS'
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {fridayData.qualifiedCount}/{fridayData.totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('MONTHLY_BOOK')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'MONTHLY_BOOK'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarDays size={15} />
            <span>Sổ Rèn Luyện Của Bé</span>
          </button>
        </div>

        {activeTab === 'MONTHLY_BOOK' && (
          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'FRIDAY_AWARDS' && (
        <FridayAwardsSection
          fridayData={fridayData}
          selectedChildIds={selectedChildIds}
          awarding={awarding}
          month={month}
          onAwardFriday={() => void handleAwardFriday()}
          onToggleSelectChild={toggleSelectChild}
          onSelectAll={handleSelectAll}
        />
      )}

      {activeTab === 'MONTHLY_BOOK' && (
        <MonthlyBookSection
          month={month}
          year={year}
          childrenList={children}
          rowFor={rowFor}
          onOpenChildPage={handleOpenChildPage}
          fridayAwardMap={fridayAwardMap}
          classDelivery={classDelivery}
          deliveringClass={deliveringClass}
          onToggleDeliverAllClass={() => void handleToggleDeliverAllClass()}
        />
      )}
    </section>
  );
}

export default function TeacherGoodChildPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-amber-500" />
        </div>
      }
    >
      <GoodChildListContent />
    </Suspense>
  );
}
