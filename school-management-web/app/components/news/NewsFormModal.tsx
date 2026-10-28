'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  X,
  Loader2,
  Save,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import { uploadMedia, getMediaUrl } from '@/services/media';
import { getFullApiUrl } from '@/services/client';
import { NewsItemData } from './NewsDetailModal';
import { extractPdfUrl } from './newsHelper';

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
  const [tieuDe, setTieuDe] = useState('');
  const [tomTat, setTomTat] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [phamVi, setPhamVi] = useState<number>(0);
  const [loaiTin, setLoaiTin] = useState<'NEWS' | 'EVENT'>('NEWS');

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTieuDe(initialData.tieuDe || '');
      setTomTat(initialData.tomTat || '');
      setHinhAnh(initialData.imageUrl || initialData.hinhAnh || '');
      setPhamVi(initialData.phamVi ?? 0);
      setLoaiTin(initialData.loaiTin || 'NEWS');

      const content = initialData.noiDung || '';
      const cleanPdf = extractPdfUrl(content) || extractPdfUrl(initialData.tomTat);
      if (cleanPdf) {
        setPdfUrl(cleanPdf);
        setPdfFileName(
          initialData.tomTat?.replace(/^Tài liệu:\s*/i, '') || 'Tài liệu tin tức PDF'
        );
      } else {
        setPdfUrl('');
        setPdfFileName('');
      }
      setPdfFileSize('');
    } else {
      setTieuDe('');
      setTomTat('');
      setHinhAnh('');
      setPdfUrl('');
      setPdfFileName('');
      setPdfFileSize('');
      setPhamVi(0);
      setLoaiTin('NEWS');
    }
    setError('');
  }, [initialData, isOpen]);

  // Handle PDF Upload
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Vui lòng chọn đúng tệp định dạng PDF (.pdf)');
      return;
    }

    setUploadingPdf(true);
    setError('');

    try {
      const cleanName = file.name
        .replace(/\.pdf$/i, '')
        .replace(/[_-]+/g, ' ')
        .trim();
      if (!tieuDe || tieuDe === 'Bản tin mới') {
        setTieuDe(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      setPdfFileName(file.name);
      setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setTomTat(`Tài liệu: ${file.name}`);

      let finalUrl = '';
      try {
        const res = await uploadMedia(file);
        finalUrl = getMediaUrl(res.url || res.id || res.fileUrl);
      } catch (uploadErr) {
        console.warn('Backend Media upload failed, reading file as data URL:', uploadErr);
        finalUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setPdfUrl(finalUrl);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải file PDF lên.');
    } finally {
      setUploadingPdf(false);
    }
  };

  // Handle Image Upload (Thumbnail/Avatar)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)');
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      let finalImgUrl = '';
      try {
        const res = await uploadMedia(file);
        finalImgUrl = getMediaUrl(res.url || res.id || res.fileUrl);
      } catch (uploadErr) {
        console.warn('Backend Image upload failed, reading as data URL:', uploadErr);
        finalImgUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
      setHinhAnh(finalImgUrl);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải ảnh đại diện lên.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = Boolean(initialData?.id);

    if (!isEditing && !pdfUrl && !tomTat.trim()) {
      setError('Vui lòng tải lên file tài liệu PDF hoặc nhập nội dung tóm tắt cho tin tức.');
      return;
    }
    if (!tieuDe.trim()) {
      setError('Vui lòng nhập tiêu đề cho tin tức.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const resolvedTomTat =
        tomTat.trim() ||
        (pdfFileName ? `Tài liệu: ${pdfFileName}` : initialData?.tomTat || 'Thông báo chính thức từ nhà trường');

      const resolvedNoiDung =
        pdfUrl || initialData?.noiDung || resolvedTomTat;

      await onSave({
        id: initialData?.id,
        tieuDe: tieuDe.trim(),
        noiDung: resolvedNoiDung,
        tomTat: resolvedTomTat,
        hinhAnh: hinhAnh || undefined,
        imageUrl: hinhAnh || undefined,
        phamVi,
        loaiTin,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu tin tức vào hệ thống.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Chỉnh sửa bản tin nhà trường' : 'Đăng tin tức mới'}
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
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            1. Tệp tài liệu PDF bài viết / thông báo {initialData?.id ? '(Tùy chọn cập nhật)' : '*'}
          </label>
          <input
            type="file"
            ref={pdfInputRef}
            accept=".pdf,application/pdf"
            onChange={handlePdfChange}
            className="hidden"
          />

          {!pdfUrl ? (
            <div
              onClick={() => pdfInputRef.current?.click()}
              className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50/70 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
            >
              <div className="h-11 w-11 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
                {uploadingPdf ? (
                  <Loader2 size={22} className="animate-spin text-rose-600" />
                ) : (
                  <FileUp size={22} />
                )}
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">
                  {uploadingPdf
                    ? 'Đang tải file PDF lên...'
                    : initialData?.id
                    ? 'Nhấn vào đây nếu muốn thay đổi / đính kèm file PDF mới'
                    : 'Nhấn vào đây để tải file PDF lên'}
                </p>
                <p className="text-slate-400 mt-0.5">Định dạng file .PDF (Hỗ trợ dung lượng đến 50MB)</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  PDF
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate max-w-md">
                    {pdfFileName || 'Tài liệu PDF đã tải lên'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {pdfFileSize ? `${pdfFileSize} · ` : ''}Đã sẵn sàng hiển thị trong bài viết
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Đổi file
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPdfUrl('');
                    setPdfFileName('');
                    setPdfFileSize('');
                  }}
                  className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer"
                  title="Xóa file"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. UPLOAD ẢNH ĐẠI DIỆN TIN TỨC (THUMBNAIL) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            2. Ảnh đại diện cho tin tức (Thumbnail)
          </label>
          <input
            type="file"
            ref={imageInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {!hinhAnh ? (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-sky-200 hover:border-sky-400 bg-sky-50/40 hover:bg-sky-50/70 rounded-2xl p-4 text-center cursor-pointer transition flex items-center justify-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition">
                {uploadingImage ? (
                  <Loader2 size={20} className="animate-spin text-sky-600" />
                ) : (
                  <ImageIcon size={20} />
                )}
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-800">
                  {uploadingImage ? 'Đang tải ảnh...' : 'Chọn ảnh đại diện bài viết'}
                </p>
                <p className="text-slate-400 text-[11px]">Định dạng JPG, PNG, WEBP</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative inline-block rounded-xl overflow-hidden border border-slate-200 shadow-2xs group">
                <img
                  src={getFullApiUrl(hinhAnh)}
                  alt="Ảnh đại diện tin tức"
                  className="h-24 w-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setHinhAnh('')}
                  className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 hover:bg-black transition cursor-pointer"
                  title="Xóa ảnh đại diện"
                >
                  <X size={13} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Đổi ảnh khác
              </button>
            </div>
          )}
        </div>

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
              onChange={(e) => setLoaiTin(e.target.value as 'NEWS' | 'EVENT')}
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
                <span>{initialData?.id ? 'Đang cập nhật...' : 'Đang đăng tin...'}</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{initialData?.id ? 'Lưu cập nhật bản tin' : 'Đăng tin tức ngay'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
