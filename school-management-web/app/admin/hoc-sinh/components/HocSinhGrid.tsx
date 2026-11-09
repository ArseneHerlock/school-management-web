'use client';

import React from 'react';
import { Edit2, Trash2, Filter, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { Student } from '../types';

interface HocSinhGridProps {
  paginated: Student[];
  filteredCount: number;
  getClassName: (id?: string | null) => string;
  getGradeName?: (id?: string | null) => string;
  getSchoolYear?: (id?: string | null) => string;
  onOpenDetail: (student: Student) => void;
  onRemove: (student: Student) => void;
}

export const HocSinhGrid: React.FC<HocSinhGridProps> = ({
  paginated,
  filteredCount,
  getClassName,
  getGradeName,
  getSchoolYear,
  onOpenDetail,
  onRemove,
}) => {
  if (filteredCount === 0) {
    return (
      <div className="admin-card p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-400">
        <Filter className="mx-auto mb-2 text-slate-300" size={24} />
        Không tìm thấy học sinh phù hợp.
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* 1. Mobile Cards View (sm:hidden) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {paginated.map((s, idx) => {
          const displayCode = s.id
            ? s.id.slice(0, 4).toUpperCase()
            : `${String(idx + 1).padStart(3, '0')}A`;
          const className = getClassName(s.lopId);
          const isBoy = s.gioiTinh === 'Nam' || s.gioiTinh === 'Trai';

          return (
            <div key={s.id} className="p-3 hover:bg-slate-50/60 transition flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isBoy ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {displayCode}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-slate-900 truncate">
                      {s.tenHocSinh}
                    </h3>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isBoy ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {s.gioiTinh || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {className}
                    </span>
                    {s.ngaySinh && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(s.ngaySinh).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                  {s.diaChi && (
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[220px]">
                      {s.diaChi}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenDetail(s)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition shadow-2xs cursor-pointer"
                  title="Xem hồ sơ / Chỉnh sửa"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(s)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition shadow-2xs cursor-pointer"
                  title="Xóa học sinh"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Table View (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto font-sans">
        <table className="w-full min-w-[760px] text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#2d3748] text-white uppercase text-[11px] font-bold">
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 w-16 text-center">Mã</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Họ Tên</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Lớp</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Khối</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Ngày Sinh</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Giới Tính</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Địa Chỉ</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Niên Khóa</th>
              <th className="py-3.5 px-4 font-bold text-center w-28">Tùy Chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginated.map((s, idx) => {
              const displayCode = s.id
                ? s.id.slice(0, 4).toUpperCase()
                : `${String(idx + 1).padStart(3, '0')}A`;

              const className = getClassName(s.lopId);
              const gradeName = getGradeName
                ? getGradeName(s.lopId)
                : className.replace(/^(Lớp\s+)/i, '').split(' ')[0] || '—';
              const schoolYear = getSchoolYear ? getSchoolYear(s.lopId) : '2026 - 2027';

              return (
                <tr
                  key={s.id}
                  className={`hover:bg-sky-50/60 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100 text-center">
                    {displayCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                    {s.tenHocSinh}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                    {className}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap">
                    {gradeName}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap">
                    {s.ngaySinh
                      ? new Date(s.ngaySinh).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap">
                    {s.gioiTinh || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 border-r border-slate-100 truncate max-w-xs">
                    {s.diaChi || 'Chưa cập nhật'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap font-sans">
                    {schoolYear}
                  </td>
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDetail(s)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#007bff] text-white hover:bg-blue-600 transition shadow-xs cursor-pointer"
                        title="Xem hồ sơ / Chỉnh sửa"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(s)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dc3545] text-white hover:bg-red-600 transition shadow-xs cursor-pointer"
                        title="Xóa học sinh"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
