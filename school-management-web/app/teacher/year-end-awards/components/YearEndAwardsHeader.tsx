import React from 'react';
import { GraduationCap, CheckCircle2 } from 'lucide-react';

interface YearEndAwardsHeaderProps {
  classNameStr: string;
  schoolYear: string;
  setSchoolYear: (sy: string) => void;
  semester: number;
  setSemester: (sem: number) => void;
  successToast: string;
}

export function YearEndAwardsHeader({
  classNameStr,
  schoolYear,
  setSchoolYear,
  semester,
  setSemester,
  successToast,
}: YearEndAwardsHeaderProps) {
  return (
    <>
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-full overflow-hidden">
        <div>
          <h1 className="text-base sm:text-xl font-black text-slate-800 leading-tight">
            Khen thưởng cuối năm {classNameStr ? `— ${classNameStr}` : ''}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full md:w-auto">
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer bg-slate-50"
          >
            <option value="2025-2026">2025–2026</option>
            <option value="2026-2027">2026–2027</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer bg-slate-50"
          >
            <option value={0}>Cả Năm</option>
            <option value={1}>Học kỳ 1</option>
            <option value={2}>Học kỳ 2</option>
          </select>
        </div>
      </div>
    </>
  );
}
