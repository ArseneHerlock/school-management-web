'use client';

import React from 'react';
import { Inbox } from 'lucide-react';

interface MomentsEmptyStateProps {
  hasActiveFilter: boolean;
  activeScope: 'class' | 'child';
  classNameProp?: string;
  childName?: string;
  currentMomentsCount: number;
  onResetFilters: () => void;
}

export function MomentsEmptyState({
  hasActiveFilter,
  activeScope,
  classNameProp,
  childName,
  currentMomentsCount,
  onResetFilters,
}: MomentsEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
      <Inbox size={44} className="mx-auto text-slate-300 mb-3" />
      <p className="text-base font-bold text-slate-700">
        {hasActiveFilter
          ? 'Không tìm thấy khoảnh khắc nào khớp với bộ lọc đang chọn'
          : activeScope === 'class'
          ? `Chưa có khoảnh khắc nào của ${classNameProp || 'lớp'}`
          : `Chưa có khoảnh khắc riêng nào của bé ${childName || ''}`}
      </p>
      <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
        {hasActiveFilter
          ? 'Hãy thử đổi tháng, hoạt động hoặc nhấn "Đặt lại bộ lọc" để xem toàn bộ khoảnh khắc.'
          : activeScope === 'class'
          ? 'Hình ảnh và hoạt động tập thể do giáo viên phụ trách lớp tải lên sẽ tự động hiển thị tại đây.'
          : 'Các sản phẩm và hình ảnh học tập riêng của bé do cô giáo gửi riêng cho bạn sẽ hiển thị tại đây.'}
      </p>
      {hasActiveFilter && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
        >
          Xem tất cả ({currentMomentsCount})
        </button>
      )}
    </div>
  );
}
