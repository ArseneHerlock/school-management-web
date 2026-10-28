'use client';

import React from 'react';
import {
  Users,
  Edit3,
  Trash2,
  Loader2,
} from 'lucide-react';
import { ClassItem, Grade, Staff } from './types';

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
      <div className="admin-card col-span-full flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-500" size={32} />
      </div>
    );
  }

  // 4 Standard Grades in Kindergarten according to Vietnamese Preschool standards
  const standardGrades = [
    { key: 'NHA_TRE', name: 'Khối Nhà trẻ', desc: 'Trẻ từ 18 - 36 tháng' },
    { key: 'MAM', name: 'Khối Mầm', desc: 'Trẻ từ 3 - 4 tuổi' },
    { key: 'CHOI', name: 'Khối Chồi', desc: 'Trẻ từ 4 - 5 tuổi' },
    { key: 'LA', name: 'Khối Lá', desc: 'Trẻ từ 5 - 6 tuổi' },
  ];

  // Helper to determine which grade a class belongs to
  const getGradeKeyForClass = (c: ClassItem): string => {
    const nameLower = (c.tenLop || '').toLowerCase();
    if (nameLower.includes('nhà trẻ') || nameLower.includes('nhatre') || nameLower.includes('trẻ')) {
      return 'NHA_TRE';
    }
    if (nameLower.includes('chồi') || nameLower.includes('choi')) {
      return 'CHOI';
    }
    if (nameLower.includes('lá') || nameLower.includes('la')) {
      return 'LA';
    }
    if (nameLower.includes('mầm') || nameLower.includes('mam')) {
      return 'MAM';
    }
    // Fallback to khoiId lookup if available
    const g = findGrade(c.khoiId);
    if (g) {
      const gName = (g.tenKhoi || '').toLowerCase();
      if (gName.includes('nhà trẻ') || g.maKhoi === 'NHA_TRE') return 'NHA_TRE';
      if (gName.includes('chồi') || g.maKhoi === 'CHOI') return 'CHOI';
      if (gName.includes('lá') || g.maKhoi === 'LA') return 'LA';
      if (gName.includes('mầm') || g.maKhoi === 'MAM') return 'MAM';
    }
    return 'MAM';
  };

  const buckets = standardGrades.map((sg) => {
    const classList = filtered.filter((c) => getGradeKeyForClass(c) === sg.key);
    return {
      key: sg.key,
      name: sg.name,
      desc: sg.desc,
      classes: classList,
    };
  });

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center gap-2 text-slate-800 font-extrabold text-lg">
        <span className="text-sky-600 font-black">&gt;</span>
        <h2>Danh sách khối lớp</h2>
      </div>

      {/* 4 Grade Cards Side-by-Side matching Image 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {buckets.map(({ key, name, desc, classes }) => {
          const totalStudents = classes.reduce((sum, cl) => {
            const cnt = cl.siSoThucTe !== undefined && cl.siSoThucTe !== null
              ? Number(cl.siSoThucTe)
              : countStudentsInClass(cl);
            return sum + (Number.isFinite(cnt) ? cnt : 0);
          }, 0);

          return (
            <div
              key={key}
              className="rounded-2xl border-2 border-sky-300 bg-white shadow-xs overflow-hidden flex flex-col transition hover:shadow-md"
            >
              {/* Grade Header */}
              <div className="px-5 py-3.5 border-b border-sky-100 bg-white text-center">
                <h3 className="text-sky-700 font-bold text-lg leading-tight">
                  {name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
              </div>

              {/* Class Rows inside Grade Card */}
              <div className="divide-y divide-slate-100 flex-1 flex flex-col min-h-[220px]">
                {classes.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 my-auto">
                    Chưa có lớp nào trong khối này
                  </div>
                ) : (
                  classes.map((c) => {
                    const teacher1 = findStaff(c.giaoVienChuNhiemId);
                    const teacher2 = c.giaoVienPhuId ? findStaff(c.giaoVienPhuId) : undefined;
                    const currentCount = c.siSoThucTe !== undefined && c.siSoThucTe !== null
                      ? Number(c.siSoThucTe)
                      : countStudentsInClass(c);

                    const teacherName = c.tenGiaoVienChuNhiem || (teacher1?.fullName 
                      ? (teacher2?.fullName ? `${teacher1.fullName}, ${teacher2.fullName}` : teacher1.fullName)
                      : 'Chưa gán GV');

                    return (
                      <div
                        key={c.id}
                        className="group flex flex-col justify-between px-4 py-3 hover:bg-sky-50/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            onClick={() => onViewStudents(c)}
                            className="font-bold text-sky-800 text-sm hover:underline cursor-pointer"
                          >
                            {c.tenLop}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {/* Green status indicator with icon matching Image 2 */}
                            <button
                              type="button"
                              onClick={() => onViewStudents(c)}
                              title={`Xem ${currentCount} học sinh · GV: ${teacherName}`}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs cursor-pointer hover:scale-110 transition"
                            >
                              <span className="font-extrabold text-[10px]">!</span>
                            </button>

                            {/* Quick Edit */}
                            <button
                              type="button"
                              onClick={() => onEdit(c)}
                              title="Chỉnh sửa lớp"
                              className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-sky-100 transition cursor-pointer"
                            >
                              <Edit3 size={13} />
                            </button>

                            {/* Quick Delete */}
                            <button
                              type="button"
                              onClick={() => onRemove(c)}
                              title="Xóa lớp"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Sub-info: Student count & Assigned teachers */}
                        <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-medium text-slate-500">
                            <Users size={11} className="text-slate-400" />
                            {currentCount}/{c.siSo || 25} trẻ
                          </span>
                          <span className="truncate max-w-[150px] text-slate-400 font-normal" title={teacherName}>
                            {teacherName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom summary of grade */}
              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 text-[11px] font-semibold text-slate-500 flex justify-between">
                <span>{classes.length} lớp học</span>
                <span>{totalStudents} học sinh</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
