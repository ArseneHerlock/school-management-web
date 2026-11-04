'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ChevronRight } from 'lucide-react';
import { Student } from '@/services/students';

interface TeacherClassStudentsListProps {
  studentsList: Student[];
  classNameTitle: string;
}

export function TeacherClassStudentsList({
  studentsList,
  classNameTitle,
}: TeacherClassStudentsListProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Users size={16} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">
              Danh sách học sinh trong lớp ({studentsList.length} trẻ)
            </h4>
            <p className="text-[11px] text-slate-400">
              Theo phân bổ của lớp {classNameTitle}
            </p>
          </div>
        </div>
        <Link
          href="/teacher/attendance"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
        >
          <span>Xem danh sách</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {studentsList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
          Chưa có học sinh nào được xếp vào lớp này.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[260px] overflow-y-auto pr-1">
          {studentsList.map((studentItem) => {
            const studentInitials = studentItem.tenHocSinh
              .split(' ')
              .map((word) => word[0])
              .join('')
              .slice(-2)
              .toUpperCase();

            return (
              <div
                key={studentItem.id}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5 hover:bg-orange-50/40 transition"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500 font-black text-xs text-white">
                  {studentInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-800">
                    {studentItem.tenHocSinh}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {studentItem.gioiTinh} • {studentItem.ngaySinh?.slice(0, 4) || '2022'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
