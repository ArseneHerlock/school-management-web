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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 font-black text-xs text-white shadow-xs">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition truncate">
                      {student.tenHocSinh}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {studentRecord ? 'Đã tạo sổ tháng' : 'Chưa mở sổ tháng'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={17} className="text-slate-300 group-hover:text-rose-500" />
              </div>

              {/* Tiến độ hoa */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-2xl bg-rose-50/80 p-2.5 border border-rose-100 flex items-center justify-between">
                  <span className="font-bold text-rose-700 flex items-center gap-1">
                    <span>🌹</span> Hoa nhỏ
                  </span>
                  <strong className="text-rose-800 font-black">{smallFlowers} / 4</strong>
                </div>

                <div className="rounded-2xl bg-amber-50/80 p-2.5 border border-amber-100 flex items-center justify-between">
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <span>🏅</span> Hoa lớn
                  </span>
                  <strong className="text-amber-800 font-black">{bigFlowers}</strong>
                </div>
              </div>
            </div>

            <div className="mt-3 text-[10px] font-bold text-slate-400 text-center border-t border-slate-100 pt-2.5">
              Bấm để xem lịch sử & tặng hoa
            </div>
          </button>
        );
      })}
    </div>
  );
}
