'use client';

import React from 'react';
import {
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Trash2,
  Eye,
} from 'lucide-react';
import { getMediaUrl } from '@/services';
import { EnrichedLearningProduct } from '../types';

interface ChildProductGridProps {
  filteredChildProducts: EnrichedLearningProduct[];
  hasChildActiveFilter: boolean;
  childName: string;
  totalProductsCount: number;
  onResetChildFilters: () => void;
  onOpenLightbox: (idx: number) => void;
  onDeleteProduct: (productId: string, createdBy?: string) => void;
  isUserAdmin: boolean;
  activeUserId?: string;
}

export function ChildProductGrid({
  filteredChildProducts,
  hasChildActiveFilter,
  childName,
  totalProductsCount,
  onResetChildFilters,
  onOpenLightbox,
  onDeleteProduct,
  isUserAdmin,
  activeUserId,
}: ChildProductGridProps) {
  if (filteredChildProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 mb-3 border border-orange-100">
          <BookOpen size={30} />
        </div>
        <h3 className="text-base font-black text-slate-800">
          {hasChildActiveFilter
            ? 'Không tìm thấy sản phẩm nào khớp với bộ lọc đang chọn'
            : `Bé ${childName} chưa có sản phẩm nào`}
        </h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
          {hasChildActiveFilter ? (
            'Hãy thử đổi tháng, hoạt động hoặc nhấn "Đặt lại bộ lọc" để xem toàn bộ sản phẩm của bé.'
          ) : (
            <>
              Hãy nhấn nút <strong>&quot;Đăng sản phẩm mới&quot;</strong> ở trên để lưu lại những tác phẩm nghệ thuật, tranh vẽ, hoặc bài tập đáng yêu của bé.
            </>
          )}
        </p>
        {hasChildActiveFilter && (
          <button
            type="button"
            onClick={onResetChildFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
          >
            Xem tất cả ({totalProductsCount})
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filteredChildProducts.map((product, idx) => {
        const mediaUrl = getMediaUrl(product.mediaId);
        const { cleanDesc, category, displayTitle, dateStr, resolvedActTitle } = product;

        const isOwner = Boolean(
          isUserAdmin || (activeUserId && product.createdBy === activeUserId)
        );

        return (
          <div
            key={product.id}
            className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Ảnh sản phẩm */}
              <div
                className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() => onOpenLightbox(idx)}
              >
                {mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt={displayTitle}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent && !parent.querySelector('.fallback-box')) {
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className =
                          'fallback-box h-full w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-indigo-400 p-2 text-center';
                        fallbackDiv.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg><span style="font-size: 10px; font-weight: bold; margin-top: 4px; color: #4f46e5">Tác phẩm của bé</span>`;
                        parent.appendChild(fallbackDiv);
                      }
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-500">
                    <ImageIcon size={32} />
                    <span className="text-[10px] font-bold mt-1">Sản phẩm của bé</span>
                  </div>
                )}

                <span className="absolute top-2.5 left-2.5 rounded-xl bg-orange-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-white">
                  {category}
                </span>

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-bold">
                  <Eye size={14} /> Xem to
                </div>
              </div>

              {/* Chi tiết nội dung */}
              <div className="p-4 space-y-1.5">
                {resolvedActTitle && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-lg max-w-full truncate">
                    <Sparkles size={11} className="shrink-0 text-purple-600" />
                    <span className="truncate">{resolvedActTitle}</span>
                  </div>
                )}
                <h4 className="font-black text-sm text-slate-800 line-clamp-1">
                  {displayTitle}
                </h4>
                {cleanDesc && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    &ldquo;{cleanDesc}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Footer thẻ: Ngày tạo & Nút xóa */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar size={12} />
                {dateStr || 'Hôm nay'}
              </span>

              <button
                onClick={() => onDeleteProduct(product.id, product.createdBy)}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isOwner
                    ? 'text-rose-500 hover:bg-rose-50'
                    : 'text-slate-300 hover:text-rose-400 hover:bg-slate-100'
                }`}
                title={
                  isOwner
                    ? 'Xóa sản phẩm này của bé'
                    : 'Chỉ giáo viên đã đăng hoặc Quản trị viên mới có quyền xóa'
                }
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
