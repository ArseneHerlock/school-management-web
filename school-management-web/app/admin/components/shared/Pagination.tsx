'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemsPerPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100]
}: PaginationProps) {
  if (totalItems === 0) return null;

  const effectivePageSize = itemsPerPage ?? pageSize ?? 10;
  const startItem = (currentPage - 1) * effectivePageSize + 1;
  const endItem = Math.min(currentPage * effectivePageSize, totalItems);

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-white px-4 py-3 text-sm">
      {/* Total item count summary */}
      <div className="flex items-center gap-2 text-slate-600">
        <span>
          Hiển thị <b className="font-bold text-slate-900">{startItem}</b> - <b className="font-bold text-slate-900">{endItem}</b> trong tổng số <b className="font-bold text-slate-900">{totalItems.toLocaleString('vi-VN')}</b> bản ghi
        </span>

        {onPageSizeChange && (
          <div className="ml-3 flex items-center gap-1.5 text-xs text-slate-500">
            <span>Hiển thị:</span>
            <select
              value={effectivePageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} dòng/trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page navigation controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
          title="Trang đầu"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
          title="Trang trước"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs font-bold transition ${
                  p === currentPage
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-xs text-slate-400">
                {p}
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
          title="Trang tiếp"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
          title="Trang cuối"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
