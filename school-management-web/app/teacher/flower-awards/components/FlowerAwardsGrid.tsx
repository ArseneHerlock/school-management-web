import React from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Student } from '@/services/students';
import { GoodChildRecord } from '../types';

interface FlowerAwardsGridProps {
  isLoading: boolean;
  studentsList: Student[];
  getRecordForStudent: (studentId: string) => GoodChildRecord | undefined;
  onOpenAwardModal: (student: Student) => void;
}

export function FlowerAwardsGrid({
  isLoading,
  studentsList,
  getRecordForStudent,
  onOpenAwardModal,
}: FlowerAwardsGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-500" size={32} />
      </div>
    );
  }

  if (studentsList.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center text-xs text-slate-400">
        Chưa có học sinh trong danh sách lớp phụ trách.
      </div>
    );
  }

  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 min-w-0 max-w-full">
      {studentsList.map((student) => {
        const studentRecord = getRecordForStudent(student.id);
        const smallFlowers = studentRecord?.dailyFlowerCount || 0;
        const bigFlowers = studentRecord?.bonusFlowerCount || 0;

        const initials = student.tenHocSinh
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(-2)
          .toUpperCase();

        return (
          <button
            key={student.id}
            type="button"
            onClick={() => onOpenAwardModal(student)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 sm:p-3.5 text-left shadow-2xs transition hover:border-orange-400 hover:shadow-xs cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 font-black text-xs text-white shadow-2xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-orange-600 transition truncate max-w-[140px]">
                      {student.tenHocSinh}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {studentRecord ? 'Đã tạo sổ tháng' : 'Chưa mở sổ'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={15} className="text-slate-300 group-hover:text-orange-500 shrink-0" />
              </div>

              {/* Tiến độ hoa */}
              <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-xs">
                <div className="rounded-xl bg-orange-50/70 p-2 border border-orange-100 flex items-center justify-between">
                  <span className="font-bold text-orange-800 text-[11px] flex items-center gap-1">
                    <span>🌸</span> Cờ tuần
                  </span>
                  <strong className="text-orange-900 font-black text-xs">{smallFlowers} / 4</strong>
                </div>

                <div className="rounded-xl bg-amber-50/70 p-2 border border-amber-100 flex items-center justify-between">
                  <span className="font-bold text-amber-800 text-[11px] flex items-center gap-1">
                    <span>⭐</span> Sao tháng
                  </span>
                  <strong className="text-amber-900 font-black text-xs">{bigFlowers}</strong>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[10px] font-bold text-orange-600 text-center border-t border-slate-100 pt-2">
              Bấm để xem lịch sử & tặng hoa
            </div>
          </button>
        );
      })}
    </div>
  );
}
