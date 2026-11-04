'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MomentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MomentsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MomentsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-xs font-bold text-slate-500 px-3">
        Trang {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
