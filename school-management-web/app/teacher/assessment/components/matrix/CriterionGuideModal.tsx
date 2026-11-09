'use client';

import React from 'react';
import { CriterionItem } from '@/services/development';
import { parseCriterionHeader } from './matrixHelpers';

interface CriterionGuideModalProps {
  criterion: CriterionItem | null;
  onClose: () => void;
}

export function CriterionGuideModal({ criterion, onClose }: CriterionGuideModalProps) {
  if (!criterion) return null;
  const parsed = parseCriterionHeader(criterion.name, criterion.code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
              HƯỚNG DẪN QUAN SÁT & ĐÁNH GIÁ CHỈ SỐ
            </span>
            <h3 className="text-base font-black text-slate-800 mt-1">
              {parsed.targetCode} {parsed.description}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Mã chỉ số: {criterion.code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <h4 className="font-extrabold text-slate-900 mb-1 text-xs">
              Mô tả chỉ số phát triển:
            </h4>
            <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-700 font-medium">
              {criterion.description || parsed.fullName || 'Chưa có mô tả chi tiết cho chỉ số này.'}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-3.5 space-y-1.5">
            <h4 className="font-extrabold text-orange-950 text-xs">
              Tiêu chí đánh giá trong hoạt động:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-orange-900/90 text-[11px]">
              <li>Quan sát mức độ trẻ chủ động tham gia và hoàn thành hoạt động.</li>
              <li>Đánh dấu <strong>Đạt</strong> khi trẻ thể hiện hành vi/kỹ năng thành thạo, độc lập.</li>
              <li>Đánh dấu <strong>Cần rèn luyện</strong> khi trẻ cần sự nhắc nhở hoặc hỗ trợ nhiều từ cô.</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
