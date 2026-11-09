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
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={28} />
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
    <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {filtered.map(function (classItem) {
        const rawCls = classItem as any;
        const grade = findGrade(classItem.khoiId || rawCls.KhoiId || '');
        const gv1Id = classItem.giaoVienChuNhiemId || rawCls.GiaoVienChuNhiemId || '';
        const gv2Id = classItem.giaoVienPhuId || rawCls.GiaoVienPhuId || '';
        const teacher1 = findStaff(gv1Id);
        const teacher2 = findStaff(gv2Id);
        const gv1Name = teacher1?.fullName || (teacher1 as any)?.FullName || classItem.tenGiaoVienChuNhiem || rawCls.TenGiaoVienChuNhiem;
        const gv2Name = teacher2?.fullName || (teacher2 as any)?.FullName || classItem.tenGiaoVienPhu || rawCls.TenGiaoVienPhu;
        const currentCount = countStudentsInClass(classItem);
        const isFull = currentCount >= classItem.siSo;

        return (
          <div
            key={classItem.id}
            className="admin-card p-3.5 sm:p-5 transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden flex flex-col justify-between rounded-2xl sm:rounded-3xl"
          >
            <div>
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 font-black text-xs sm:text-sm shadow-2xs shrink-0">
                    {classItem.tenLop.slice(-2)}
                  </div>
                  <div>
                    <span className="rounded-md bg-emerald-100/70 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-800">
                      {grade?.tenKhoi || 'Chưa phân khối'}
                    </span>
                    <h2 className="mt-0.5 text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {classItem.tenLop}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => onEdit(classItem)}
                    className="icon-btn p-1.5"
                    title="Chỉnh sửa thông tin lớp"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => onRemove(classItem)}
                    className="icon-btn danger p-1.5"
                    title="Xóa lớp học"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Thống kê sĩ số */}
              <div className="mt-2.5 sm:mt-4 rounded-xl sm:rounded-2xl bg-slate-50/80 p-2.5 sm:p-3 border border-slate-100">
                <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1">
                  <span className="font-semibold text-slate-600">Sĩ số trẻ:</span>
                  <span className="font-black text-slate-900">
                    <span className={isFull ? 'text-amber-600' : 'text-emerald-600'}>
                      {currentCount}
                    </span>{' '}
                    / {classItem.siSo} trẻ
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 sm:h-2 rounded-full overflow-hidden">
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
              <div className="mt-2.5 sm:mt-4 space-y-1 sm:space-y-2 text-[11px] sm:text-xs">
                <div className="flex items-center justify-between py-0.5 border-b border-dashed border-slate-100">
                  <span className="text-slate-400 font-medium">GV 1 (Chính):</span>
                  <span className="font-bold text-slate-700 truncate max-w-[170px] text-right">
                    {gv1Name || <i className="text-slate-400 font-normal">Chưa gán</i>}
                  </span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-slate-400 font-medium">GV 2 (Phụ):</span>
                  <span className="font-bold text-slate-700 truncate max-w-[170px] text-right">
                    {gv2Name || <i className="text-slate-400 font-normal">Chưa gán</i>}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                {classItem.namHoc}
              </span>
              <button
                onClick={() => onViewStudents(classItem)}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                <span>Xem danh sách trẻ</span>
                <Users size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
