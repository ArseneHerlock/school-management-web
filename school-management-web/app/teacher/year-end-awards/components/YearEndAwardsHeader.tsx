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

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-100 text-orange-700">
              <GraduationCap size={18} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
              TỔNG KẾT BẾ GIẢNG NĂM HỌC
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800">
            Khen Thưởng Cuối Năm - {classNameStr}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xét duyệt danh hiệu thi đua tổng kết dựa trên số liệu chuyên cần, thể trạng và năng lực thực tế của học sinh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={schoolYear}
            onChange={(e) => setSchoolYear(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="2025-2026">Năm học 2025-2026</option>
            <option value="2026-2027">Năm học 2026-2027</option>
          </select>

          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value={0}>Tổng kết Cả Năm</option>
            <option value={1}>Học kỳ 1</option>
            <option value={2}>Học kỳ 2</option>
          </select>
        </div>
      </div>
    </>
  );
}
