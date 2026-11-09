'use client';

import React from 'react';
import { Edit2, Trash2, Filter, Phone, Mail, GraduationCap } from 'lucide-react';
import { Staff, Position, Cls, Assignment, getRoleLabel } from '../types';

interface NhanSuGridProps {
  paginatedStaff: Staff[];
  positions: Position[];
  classes: Cls[];
  assign: Record<string, Assignment[]>;
  filteredCount: number;
  onSelect: (s: Staff) => void;
  onRemove: (s: Staff) => void;
}

export const NhanSuGrid: React.FC<NhanSuGridProps> = ({
  paginatedStaff,
  positions,
  classes,
  assign,
  filteredCount,
  onSelect,
  onRemove,
}) => {
  if (filteredCount === 0) {
    return (
      <div className="admin-card p-8 sm:p-12 text-center text-xs sm:text-sm text-slate-400 font-sans">
        <Filter className="mx-auto mb-2 text-slate-300" size={24} />
        Không tìm thấy nhân sự phù hợp.
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs font-sans">
      {/* 1. Mobile Cards View (sm:hidden) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {paginatedStaff.map((x, idx) => {
          const displayCode = x.staffCode || (x.staffId ? x.staffId.slice(0, 4).toUpperCase() : `${String(idx + 1).padStart(3, '0')}GV`);
          const pos = positions.find((p) => String(p.positionId) === String(x.positionId))?.positionName || x.positionId || 'Giáo viên mầm non';
          const assignedClasses = (assign[x.staffId] || []).map((a) => {
            const className = classes.find((c) => String(c.id) === String(a.classId))?.tenLop || a.classId;
            return `${className} (${getRoleLabel(Number(a.role))})`;
          }).join(', ') || 'Chưa phân công';

          return (
            <div key={x.staffId} className="p-3 hover:bg-slate-50/60 transition flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0 font-mono">
                  {displayCode}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-black text-slate-900 truncate">
                      {x.fullName}
                    </h3>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-700">
                      {pos}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded truncate max-w-[200px]">
                      {assignedClasses}
                    </span>
                  </div>
                  {x.phoneNumber && (
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Phone size={10} className="shrink-0" />
                      <span>{x.phoneNumber}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelect(x)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition shadow-2xs cursor-pointer"
                  title="Chỉnh sửa nhân sự"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(x)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition shadow-2xs cursor-pointer"
                  title="Xóa nhân sự"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Table View (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#2d3748] text-white uppercase text-[11px] font-bold">
              <th className="py-3.5 px-4 border-r border-slate-600 w-16 text-center">Mã</th>
              <th className="py-3.5 px-4 border-r border-slate-600">Họ Tên</th>
              <th className="py-3.5 px-4 border-r border-slate-600">Vị Trí / Chức Vụ</th>
              <th className="py-3.5 px-4 border-r border-slate-600">Điện Thoại</th>
              <th className="py-3.5 px-4 border-r border-slate-600">Email</th>
              <th className="py-3.5 px-4 border-r border-slate-600">Lớp Phụ Trách</th>
              <th className="py-3.5 px-4 text-center w-28">Tùy Chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedStaff.map((x, idx) => {
              const displayCode = x.staffCode || (x.staffId ? x.staffId.slice(0, 4).toUpperCase() : `${String(idx + 1).padStart(3, '0')}GV`);
              const pos = positions.find((p) => String(p.positionId) === String(x.positionId))?.positionName || x.positionId || 'Giáo viên mầm non';
              const assignedClasses = (assign[x.staffId] || []).map((a) => {
                const className = classes.find((c) => String(c.id) === String(a.classId))?.tenLop || a.classId;
                return `${className} (${getRoleLabel(Number(a.role))})`;
              }).join(', ') || 'Chưa phân công';

              return (
                <tr
                  key={x.staffId}
                  className={`hover:bg-sky-50/60 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100 text-center font-mono">
                    {displayCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                    {x.fullName}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {pos}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap">
                    {x.phoneNumber || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 border-r border-slate-100 whitespace-nowrap">
                    {x.email || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 max-w-xs truncate" title={assignedClasses}>
                    {assignedClasses}
                  </td>
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelect(x)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#007bff] text-white hover:bg-blue-600 transition shadow-2xs cursor-pointer"
                        title="Chỉnh sửa nhân sự"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(x)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e53e3e] text-white hover:bg-red-600 transition shadow-2xs cursor-pointer"
                        title="Xóa nhân sự"
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
