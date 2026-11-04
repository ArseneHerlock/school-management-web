'use client';

import React from 'react';
import {
  Inbox,
  Video,
  ImageIcon,
  User,
  School,
  Eye,
  Sparkles,
  Tag,
  Calendar,
  Trash2,
} from 'lucide-react';
import { AlbumItem } from '../types';
import { formatMonthLabel } from '@/lib/moments';

interface AlbumPhotoGridProps {
  photos: AlbumItem[];
  classNameTitle: string;
  selectedMonth: string;
  hasActiveFilter: boolean;
  onResetFilters: () => void;
  onOpenLightbox: (index: number) => void;
  onDelete: (id: string, createdBy?: string) => void;
  isUserAdmin: boolean;
  activeUserId?: string;
  totalPhotosCount: number;
}

export function AlbumPhotoGrid({
  photos,
  classNameTitle,
  selectedMonth,
  hasActiveFilter,
  onResetFilters,
  onOpenLightbox,
  onDelete,
  isUserAdmin,
  activeUserId,
  totalPhotosCount,
}: AlbumPhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 mb-3 border border-orange-100">
          <Inbox size={32} />
        </div>
        <h3 className="text-base font-black text-slate-800">Không tìm thấy khoảnh khắc nào</h3>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          {totalPhotosCount === 0
            ? `Chưa có khoảnh khắc nào được ghi nhận cho lớp ${classNameTitle}. Thầy/Cô hãy bấm nút "Đăng khoảnh khắc mới" ở trên để bắt đầu tải lên nhé!`
            : `Hiện có ${totalPhotosCount} ảnh trong album nhưng không thỏa mãn các điều kiện lọc đang chọn (Tháng: ${
                selectedMonth !== 'ALL' ? formatMonthLabel(selectedMonth) : 'Tất cả'
              }). Thầy/Cô hãy bấm "Đặt lại bộ lọc" để xem toàn bộ ảnh.`}
        </p>
        {hasActiveFilter && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition cursor-pointer"
          >
            Xem tất cả ảnh ({totalPhotosCount})
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((item, index) => {
        const isOwner = Boolean(
          isUserAdmin || (activeUserId && item.createdBy === activeUserId)
        );

        return (
          <div
            key={item.id}
            className="group relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            {/* Khung xem ảnh / video */}
            <div
              className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer"
              onClick={() => onOpenLightbox(index)}
            >
              {item.type === 'video' ? (
                <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center text-white p-3">
                  <div className="h-12 w-12 rounded-full bg-orange-500/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Video size={24} className="text-white ml-0.5" />
                  </div>
                  <span className="text-[10px] font-bold mt-2 text-slate-300">Video khoảnh khắc</span>
                </div>
              ) : item.url ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-box')) {
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className =
                        'fallback-box h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-400 p-2 text-center';
                      fallbackDiv.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size: 10px; font-weight: bold; margin-top: 4px; color: #ea580c">Hình ảnh</span>`;
                      parent.appendChild(fallbackDiv);
                    }
                  }}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-500">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-bold mt-1">Ảnh hoạt động</span>
                </div>
              )}

              {/* Badges Strip góc trên */}
              <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
                {item.scope === 'child' ? (
                  <span className="rounded-xl bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white shadow-xs flex items-center gap-1">
                    <User size={11} /> {item.childName || 'Bé'}
                  </span>
                ) : (
                  <span className="rounded-xl bg-sky-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-white shadow-xs flex items-center gap-1">
                    <School size={11} /> Cả lớp
                  </span>
                )}

                <span className="rounded-xl bg-black/55 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                  {item.category}
                </span>
              </div>

              {/* Nút xem to khi hover */}
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1.5 bg-white/95 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-black shadow-md transform -translate-y-1 group-hover:translate-y-0 transition">
                  <Eye size={14} className="text-orange-500" /> Xem phóng to
                </span>
              </div>
            </div>

            {/* Phần dưới: Tên hoạt động, ghi chú, ngày & nút xóa */}
            <div className="p-3.5 space-y-2 border-t border-slate-100 flex-1 flex flex-col justify-between">
              <div>
                {item.activityTitle ? (
                  <div className="inline-flex items-center gap-1 text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-lg mb-1 truncate max-w-full">
                    <Sparkles size={11} className="shrink-0 text-purple-600" />
                    <span className="truncate">{item.activityTitle}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg mb-1">
                    <Tag size={11} /> Hoạt động chung
                  </div>
                )}

                <p className="font-bold text-xs text-slate-900 line-clamp-1" title={item.title}>
                  {item.title}
                </p>

                {item.cleanNote && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.cleanNote}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" />
                  {item.date}
                </span>

                <button
                  onClick={() => onDelete(item.id, item.createdBy)}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    isOwner
                      ? 'text-rose-500 hover:bg-rose-50'
                      : 'text-slate-300 hover:text-rose-400 hover:bg-slate-100'
                  }`}
                  title={
                    isOwner
                      ? 'Xóa khoảnh khắc này'
                      : 'Chỉ người đăng hoặc Quản trị viên mới có quyền xóa'
                  }
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
