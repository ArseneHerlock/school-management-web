import React from 'react';
import { Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FcmHeaderProps {
  classNameStr: string;
  month: number;
  setMonth: (m: number) => void;
  year: number;
  setYear: (y: number) => void;
  successToast?: string;
}

export function FcmHeader({
  classNameStr,
  month,
  setMonth,
  year,
  setYear,
  successToast,
}: FcmHeaderProps) {
  return (
    <>
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Phân loại năng lực trẻ {classNameStr ? `— ${classNameStr}` : ''}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <option key={m} value={m}>
                  Tháng {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer bg-slate-50 hover:bg-slate-100 transition"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  Năm {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
