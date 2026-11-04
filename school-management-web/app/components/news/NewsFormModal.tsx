"use client";

import React from "react";
import { Loader2, Save, AlertCircle } from "lucide-react";
import Modal from "@/app/components/ui/Modal";
import { NewsItemData } from "./NewsDetailModal";
import { useNewsForm } from "./useNewsForm";
import PdfUploadField from "./PdfUploadField";
import ImageUploadField from "./ImageUploadField";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<NewsItemData>) => Promise<void>;
  initialData?: NewsItemData | null;
}

export default function NewsFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: NewsFormModalProps) {
  const isEditing = Boolean(initialData?.id);
  const {
    tieuDe,
    setTieuDe,
    tomTat,
    setTomTat,
    hinhAnh,
    setHinhAnh,
    pdfUrl,
    setPdfUrl,
    pdfFileName,
    setPdfFileName,
    pdfFileSize,
    setPdfFileSize,
    phamVi,
    setPhamVi,
    loaiTin,
    setLoaiTin,
    uploadingPdf,
    uploadingImage,
    saving,
    error,
    pdfInputRef,
    imageInputRef,
    handlePdfChange,
    handleImageChange,
    handleSubmit,
  } = useNewsForm({
    isOpen,
    initialData,
    onSave,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Chỉnh sửa bản tin nhà trường" : "Đăng tin tức mới"}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. UPLOAD FILE PDF */}
        <PdfUploadField
          pdfUrl={pdfUrl}
          pdfFileName={pdfFileName}
          pdfFileSize={pdfFileSize}
          uploadingPdf={uploadingPdf}
          isEditing={isEditing}
          pdfInputRef={pdfInputRef}
          onPdfChange={handlePdfChange}
          onClearPdf={() => {
            setPdfUrl("");
            setPdfFileName("");
            setPdfFileSize("");
          }}
        />

        {/* 2. UPLOAD ẢNH ĐẠI DIỆN TIN TỨC */}
        <ImageUploadField
          hinhAnh={hinhAnh}
          uploadingImage={uploadingImage}
          imageInputRef={imageInputRef}
          onImageChange={handleImageChange}
          onClearImage={() => setHinhAnh("")}
        />

        {/* 3. TIÊU ĐỀ & MÔ TẢ TÓM TẮT */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              3. Tiêu đề bài viết tin tức <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tieuDe}
              onChange={(e) => setTieuDe(e.target.value)}
              placeholder="Nhập tiêu đề bản tin..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Mô tả ngắn / Tóm tắt hiển thị
            </label>
            <input
              type="text"
              value={tomTat}
              onChange={(e) => setTomTat(e.target.value)}
              placeholder="Mô tả tóm tắt hiển thị dưới tiêu đề bản tin..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 placeholder-slate-400 focus:border-rose-500 outline-none"
            />
          </div>
        </div>

        {/* 4. PHẠM VI HIỂN THỊ & LOẠI TIN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Phạm vi phát hành
            </label>
            <select
              value={phamVi}
              onChange={(e) => setPhamVi(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-rose-500 outline-none"
            >
              <option value={0}>Toàn trường (Công khai cho mọi người)</option>
              <option value={1}>Nội bộ Giáo viên & Nhân sự</option>
              <option value={2}>Dành riêng cho Phụ huynh</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Phân loại bài
            </label>
            <select
              value={loaiTin}
              onChange={(e) => setLoaiTin(e.target.value as "NEWS" | "EVENT")}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-rose-500 outline-none"
            >
              <option value="NEWS">Tin tức / Thông báo</option>
              <option value="EVENT">Sự kiện / Hoạt động</option>
            </select>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={saving || uploadingPdf || uploadingImage}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>
                  {isEditing ? "Đang cập nhật..." : "Đang đăng tin..."}
                </span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>
                  {isEditing ? "Lưu cập nhật bản tin" : "Đăng tin tức ngay"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
