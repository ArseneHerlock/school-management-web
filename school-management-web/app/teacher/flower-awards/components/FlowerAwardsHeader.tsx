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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-black tracking-wider text-rose-600 uppercase">
            Thi đua & Khen thưởng mầm non
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Tặng hoa bé ngoan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mỗi tháng bé có thể nhận tối đa 4 hoa nhỏ. Khi tích lũy đủ 4/4 hoa nhỏ, hệ thống sẽ tự động tặng 1 Hoa lớn danh dự.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-rose-300 transition cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-rose-500' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Calendar size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Kỳ tặng hoa:</span>
            <select
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400 focus:bg-white"
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
              className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400 focus:bg-white"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Thời gian hợp lệ: Từ ngày 01 đến ngày {lastDayOfMonth} / {selectedMonth}
        </div>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-orange-50/40 p-4.5 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs text-rose-500">
          <Flower2 size={24} />
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-800">
            Quy tắc khen thưởng Tháng {selectedMonth}/{selectedYear}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Mỗi hoa nhỏ biểu thị cho một việc tốt trong tuần/ngày. Đủ 4 hoa nhỏ sẽ tự động được trao tặng 1 Hoa lớn cuối tháng.
          </p>
        </div>
      </div>
    </div>
  );
}
