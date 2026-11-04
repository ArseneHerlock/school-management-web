'use client';

import React from 'react';
import { X, Loader2, Upload, Sparkles } from 'lucide-react';
import { ActivityItem } from '@/services/development';
import { PRODUCT_CATEGORIES } from '../types';

interface AddProductFormProps {
  childName: string;
  onClose: () => void;
  mediaPreviewUrl: string;
  onClearMedia: () => void;
  uploadingFile: boolean;
  onFileUpload: (file: File) => void;
  productTitle: string;
  onProductTitleChange: (val: string) => void;
  productActivityId: string;
  onProductActivityChange: (id: string, name: string) => void;
  activities: ActivityItem[];
  productDate: string;
  onProductDateChange: (val: string) => void;
  productCategory: string;
  onProductCategoryChange: (cat: string) => void;
  productComment: string;
  onProductCommentChange: (val: string) => void;
  submittingProduct: boolean;
  onSubmit: () => void;
  uploadedMediaId: string;
}

export function AddProductForm({
  childName,
  onClose,
  mediaPreviewUrl,
  onClearMedia,
  uploadingFile,
  onFileUpload,
  productTitle,
  onProductTitleChange,
  productActivityId,
  onProductActivityChange,
  activities,
  productDate,
  onProductDateChange,
  productCategory,
  onProductCategoryChange,
  productComment,
  onProductCommentChange,
  submittingProduct,
  onSubmit,
  uploadedMediaId,
}: AddProductFormProps) {
  return (
    <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-md shadow-orange-500/5 space-y-4 animate-in fade-in duration-200">
      <div className="border-b border-orange-100 pb-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
            BÀI TẬP & SẢN PHẨM HỌC TẬP
          </span>
          <h3 className="text-lg font-black text-slate-800 mt-0.5">
            Thêm sản phẩm sáng tạo cho bé {childName}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Cột trái: Tải lên hình ảnh/video */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-2">
            Hình ảnh / Video sản phẩm <span className="text-rose-500">*</span>
          </label>

          {mediaPreviewUrl ? (
            <div className="relative rounded-2xl border border-orange-200 overflow-hidden bg-slate-50 h-56 flex items-center justify-center">
              <img
                src={mediaPreviewUrl}
                alt="Xem trước"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <button
                onClick={onClearMedia}
                className="absolute top-2 right-2 rounded-xl bg-black/60 p-1.5 text-white hover:bg-black/80 transition cursor-pointer"
                title="Chọn ảnh khác"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/30 p-8 text-center hover:bg-orange-50/70 hover:border-orange-400 transition cursor-pointer h-56">
              {uploadingFile ? (
                <>
                  <Loader2 size={32} className="animate-spin text-orange-500 mb-2" />
                  <p className="text-xs font-bold text-slate-600">
                    Đang tải tệp lên MediaService...
                  </p>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-2">
                    <Upload size={22} />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Nhấn để chọn ảnh tranh vẽ, đất nặn, hoặc video của bé
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Hỗ trợ JPG, PNG, WEBP, MP4
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileUpload(file);
                }}
                disabled={uploadingFile}
              />
            </label>
          )}
        </div>

        {/* Cột phải: Thông tin sản phẩm */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Tên sản phẩm / Hoạt động <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={productTitle}
              onChange={(e) => onProductTitleChange(e.target.value)}
              placeholder="vd: Tranh vẽ ngôi nhà của bé, Chú rùa bằng đất nặn..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Hoạt động gắn liền
              </label>
              <select
                value={productActivityId}
                onChange={(e) => {
                  const val = e.target.value;
                  const act = activities.find((a) => a.id === val);
                  onProductActivityChange(val, act ? act.name : '');
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition cursor-pointer"
              >
                <option value="">-- Tự chọn / Theo tiêu đề --</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Ngày thực hiện
              </label>
              <input
                type="date"
                value={productDate}
                onChange={(e) => onProductDateChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Lĩnh vực phát triển
            </label>
            <select
              value={productCategory}
              onChange={(e) => onProductCategoryChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition cursor-pointer"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              Lời nhận xét / Lời khen của cô dành cho bé
            </label>
            <textarea
              rows={3}
              value={productComment}
              onChange={(e) => onProductCommentChange(e.target.value)}
              placeholder="vd: Bé rất khéo tay, phối màu tươi sáng, biết tự dọn dẹp đồ dùng sau giờ học..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={submittingProduct || !productTitle.trim() || !uploadedMediaId}
              onClick={onSubmit}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-sm disabled:opacity-50 transition cursor-pointer"
            >
              {submittingProduct ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Lưu sản phẩm cho bé</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
