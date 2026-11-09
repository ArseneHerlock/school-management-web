'use client';

import React from 'react';
import { Eye } from 'lucide-react';

interface StudentProfilesSectionProps {
  classStudents: any[];
  getStudentProgress: (studentId: string) => { completed: number; total: number; pass: number; rate: number };
  onOpenRadar: (student: any) => void;
}

export function StudentProfilesSection({
  classStudents,
  getStudentProgress,
  onOpenRadar,
}: StudentProfilesSectionProps) {
  return (
    <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-800">Hồ sơ năng lực từng bé trong lớp</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Đánh giá đa chiều 5 lĩnh vực phát triển chuẩn Bộ GD&ĐT (Thể chất, Nhận thức, Ngôn ngữ, Xã hội, Thẩm mỹ)
          </p>
        </div>
        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 self-start sm:self-auto">
          {classStudents.length} học sinh
        </span>
      </div>

      {classStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          Chưa có học sinh nào trong lớp học này.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classStudents.map((st) => {
            const sId = st.id || st.Id;
            const prog = getStudentProgress(sId);
            return (
              <div
                key={sId}
                className="rounded-2xl border border-rose-50 bg-rose-50/20 p-3.5 flex items-center justify-between hover:bg-rose-50/40 transition"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-bold text-slate-800 text-xs truncate">{st.tenHocSinh}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                        style={{ width: `${prog.rate}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-rose-600">{prog.rate}%</span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">Đạt: {prog.pass}/{prog.completed} chỉ số</p>
                </div>
                <button
                  onClick={() => onOpenRadar(st)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-500 hover:text-white transition shrink-0 cursor-pointer text-xs font-bold shadow-2xs"
                  title="Xem Hồ sơ năng lực 5 lĩnh vực chuẩn GDMN của bé"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline text-[11px]">Hồ sơ</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
