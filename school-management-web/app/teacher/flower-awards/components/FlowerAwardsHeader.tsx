import React from 'react';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw, X, Flower2 } from 'lucide-react';

interface FlowerAwardsHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  feedbackMessage: string;
  setFeedbackMessage: (msg: string) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  selectedMonth: number;
  setSelectedMonth: (m: number) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  lastDayOfMonth: number;
}

export function FlowerAwardsHeader({
  isLoading,
  onRefresh,
  feedbackMessage,
  setFeedbackMessage,
  errorMessage,
  setErrorMessage,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  lastDayOfMonth,
}: FlowerAwardsHeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-4 min-w-0 max-w-full">
      <div className="flex items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
            Khen thưởng thi đua
          </span>
          <h1 className="text-base sm:text-lg font-black text-slate-800 leading-tight">
            Trao hoa bé ngoan
          </h1>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer shrink-0"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin text-orange-500' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs font-bold text-rose-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shrink-0">
            <Calendar size={16} />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Kỳ tặng hoa:</span>
            <select
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-800 outline-none"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Tháng {index + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Thời gian: 01 - {lastDayOfMonth}/{selectedMonth}
        </div>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-3 flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-2xs text-orange-500">
          <Flower2 size={18} />
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Mỗi hoa nhỏ ghi nhận sự tiến bộ trong tuần. Đủ 4 hoa nhỏ tự động được trao tặng 1 Ngôi sao bé ngoan tháng.
        </p>
      </div>
    </div>
  );
}
