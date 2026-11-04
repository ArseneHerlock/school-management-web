'use client';

import React from 'react';
import {
  Users,
  Edit3,
  Trash2,
  Loader2,
} from 'lucide-react';
import { ClassItem, Grade, Staff } from '../types';

interface LopCardGridProps {
  loading: boolean;
  filtered: ClassItem[];
  findStaff: (id: string) => Staff | undefined;
  findGrade: (id: string) => Grade | undefined;
  countStudentsInClass: (classItem: ClassItem) => number;
  onEdit: (c: ClassItem) => void;
  onRemove: (c: ClassItem) => void;
  onViewStudents: (c: ClassItem) => void;
}

export const LopCardGrid: React.FC<LopCardGridProps> = ({
  loading,
  filtered,
  findStaff,
  findGrade,
  countStudentsInClass,
  onEdit,
  onRemove,
  onViewStudents,
}) => {
  if (loading) {
    return (
      <div className="admin-card col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin text-rose-500 mb-2" size={28} />
        <span className="text-xs font-semibold">Đang cập nhật danh sách lớp...</span>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="admin-card col-span-full py-16 text-center text-slate-400 text-xs">
        Không tìm thấy lớp học nào phù hợp.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map(function (classItem) {
        const grade = findGrade(classItem.khoiId);
        const teacher1 = findStaff(classItem.giaoVienChuNhiemId);
        const teacher2 = findStaff(classItem.giaoVienPhuId || '');
        const currentCount = countStudentsInClass(classItem);
        const isFull = currentCount >= classItem.siSo;

        return (
          <div
            key={classItem.id}
            className="admin-card p-5 transition-all hover:-translate-y-1 hover:shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm shadow-2xs">
                    {classItem.tenLop.slice(-2)}
                  </div>
                  <div>
                    <span className="rounded-md bg-rose-100/70 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                      {grade?.tenKhoi || 'Chưa phân khối'}
                    </span>
                    <h2 className="mt-1 text-base font-black text-slate-900 tracking-tight">
                      {classItem.tenLop}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(classItem)}
                    className="icon-btn"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => onRemove(classItem)}
                    className="icon-btn danger"
                    title="Xóa lớp học"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Thống kê sĩ số */}
              <div className="mt-4 rounded-2xl bg-slate-50/80 p-3 border border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600">Sĩ số trẻ:</span>
                  <span className="font-black text-slate-900">
                    <span className={isFull ? 'text-amber-600' : 'text-emerald-600'}>
                      {currentCount}
                    </span>{' '}
                    / {classItem.siSo} trẻ
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFull ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((currentCount / classItem.siSo) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Thông tin giáo viên */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-dashed border-slate-100">
                  <span className="text-slate-400 font-medium">Giáo viên phụ trách 1:</span>
                  <span className="font-bold text-slate-700">
                    {teacher1 ? teacher1.fullName : <i className="text-rose-400 font-normal">Chưa gán</i>}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Giáo viên phụ trách 2:</span>
                  <span className="font-bold text-slate-700">
                    {teacher2 ? teacher2.fullName : <i className="text-rose-400 font-normal">Chưa gán</i>}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400">
                Năm học: {classItem.namHoc}
              </span>
              <button
                onClick={() => onViewStudents(classItem)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <Users size={14} /> Danh sách trẻ
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
