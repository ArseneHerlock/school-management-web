'use client';

import React from 'react';
import { Edit2, Trash2, Filter } from 'lucide-react';
import { Parent, Child, Cls, Staff } from './types';

interface PhuHuynhCardGridProps {
  paginatedParents: Parent[];
  childrenMap: Record<string, Child[]>;
  classes: Cls[];
  staff: Staff[];
  filteredCount: number;
  onSelect: (p: Parent) => void;
  onEdit: (p: Parent) => void;
  onRemove?: (p: Parent) => void;
}

export const PhuHuynhCardGrid: React.FC<PhuHuynhCardGridProps> = ({
  paginatedParents,
  childrenMap,
  classes,
  staff,
  filteredCount,
  onSelect,
  onEdit,
  onRemove,
}) => {
  if (filteredCount === 0) {
    return (
      <div className="admin-card p-12 text-center text-sm text-slate-400">
        <Filter className="mx-auto mb-2 text-slate-300" />
        Không tìm thấy phụ huynh phù hợp.
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto font-sans">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#2d3748] text-white uppercase text-[11px] font-bold">
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 w-16 text-center">Mã</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Họ Tên</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Điện Thoại</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Quan Hệ</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Con / Lớp</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Địa Chỉ</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600">Nghề Nghiệp</th>
              <th className="py-3.5 px-4 font-bold border-r border-slate-600 text-center">Tài Khoản</th>
              <th className="py-3.5 px-4 font-bold text-center w-28">Tùy Chọn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedParents.map((p, idx) => {
              const displayCode = p.id ? p.id.slice(0, 4).toUpperCase() : `${String(idx + 1).padStart(3, '0')}P`;
              const kids = childrenMap[p.id] || [];
              const kidsSummary = kids.length > 0
                ? kids.map((k) => {
                    const cl = classes.find((c) => String(c.id) === String(k.lopId));
                    return `${k.tenHocSinh} (${cl?.tenLop || 'Chưa xếp lớp'})`;
                  }).join(', ')
                : 'Chưa liên kết';

              return (
                <tr
                  key={p.id}
                  className={`hover:bg-sky-50/60 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-800 border-r border-slate-100 text-center">
                    {displayCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 border-r border-slate-100 whitespace-nowrap">
                    {p.hoTen}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 whitespace-nowrap font-sans">
                    {p.soDienThoai}
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 text-center whitespace-nowrap">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      {p.moiQuanHe || 'Phụ huynh'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 border-r border-slate-100 max-w-xs truncate" title={kidsSummary}>
                    {kidsSummary}
                  </td>
                  <td className="py-3 px-4 text-slate-600 border-r border-slate-100 truncate max-w-xs">
                    {p.diaChi || 'Chưa cập nhật'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 border-r border-slate-100 truncate max-w-xs">
                    {p.ngheNghiep || '—'}
                  </td>
                  <td className="py-3 px-4 text-center border-r border-slate-100 whitespace-nowrap">
                    <span className={`status-pill ${p.taiKhoanId ? 'status-ok' : 'status-warn'} text-[10px]`}>
                      {p.taiKhoanId ? 'Có tài khoản' : 'Chưa có'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      {/* Blue square edit button */}
                      <button
                        type="button"
                        onClick={() => onEdit(p)}
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-[#007bff] text-white hover:bg-blue-600 transition shadow-xs cursor-pointer"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 size={13} />
                      </button>

                      {/* Red square delete button */}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(p)}
                          className="flex h-7 w-7 items-center justify-center rounded-md bg-[#dc3545] text-white hover:bg-red-600 transition shadow-xs cursor-pointer"
                          title="Xóa phụ huynh"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
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
