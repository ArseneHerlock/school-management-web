'use client';

import { useState, useEffect } from 'react';
import {
  Camera,
  Upload,
  Plus,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Inbox,
  Video,
  Filter,
  Eye,
  Sparkles,
  Users,
  AlertCircle,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { uploadMedia, getMediaUrl, api, currentUser } from '@/services';
import { loadLiveTeacherContext } from '../data';
import MediaLightbox from '@/app/admin/components/shared/MediaLightbox';
import Pagination from '@/app/admin/components/shared/Pagination';

interface AlbumItem {
  id: string;
  url: string;
  title: string;
  date: string;
  type: 'image' | 'video';
  category: string;
  createdBy?: string;
}

const CATEGORIES = [
  'Tất cả',
  'Hoạt động học tập',
  'Vui chơi ngoài trời',
  'Bữa ăn - Giấc ngủ',
  'Sự kiện & Dã ngoại',
];

export default function TeacherAlbumPage() {
  const [photos, setPhotos] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [currentCategoryForUpload, setCurrentCategoryForUpload] = useState<string>('Hoạt động học tập');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [classInfo, setClassInfo] = useState<any>(null);
  const itemsPerPage = 12;

  const activeUserId = currentUser()?.id;
  const isUserAdmin = currentUser()?.roles.includes('ADMIN');

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const context = await loadLiveTeacherContext();
      setClassInfo(context.cls);
      const currentClassId = String(context.cls?.id || '');
      const currentClassName = context.cls?.tenLop || '';

      const res = await api.get<any>('learning', '/api/learning/products?pageSize=100').catch(() => []);
      const list = Array.isArray(res) ? res : (res as any)?.items || [];

      // Lọc các khoảnh khắc thuộc lớp:
      // - childId trùng với classId
      // - hoặc description có tag [CLASS:
      const classItems: AlbumItem[] = list
        .filter((item: any) => {
          const desc = String(item.description || '');
          const isClassTagged = desc.includes('[CLASS:');
          const isClassIdMatched = currentClassId && String(item.childId) === currentClassId;
          const isNameMatched = currentClassName && desc.toLowerCase().includes(currentClassName.toLowerCase());
          return isClassTagged || isClassIdMatched || isNameMatched;
        })
        .map((item: any) => {
          const mediaIdentifier = item.mediaId || item.mediaUrl || item.url || '';
          const url = getMediaUrl(mediaIdentifier);
          const rawDesc = String(item.description || '');

          // Trích xuất chuyên mục từ tag [CAT:...]
          let itemCategory = 'Hoạt động học tập';
          const catMatch = rawDesc.match(/\[CAT:([^\]]+)\]/i);
          if (catMatch && CATEGORIES.includes(catMatch[1].trim())) {
            itemCategory = catMatch[1].trim();
          }

          const isVideo = String(url).match(/\.(mp4|webm|ogg|mov)$/i);
          let rawTitle = String(item.title || item.tieuDe || '').trim();
          if (!rawTitle || /^\d{6,}$/.test(rawTitle) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(rawTitle)) {
            const dateStr = String(item.createdAtUtc || item.createdAt || '').slice(0, 10);
            rawTitle = `${itemCategory}${dateStr ? ` (${dateStr})` : ''}`;
          }

          return {
            id: String(item.id),
            url,
            title: rawTitle,
            date: String(item.createdAtUtc || item.createdAt || '').slice(0, 10),
            type: isVideo ? 'video' : 'image',
            category: itemCategory,
            createdBy: item.createdBy ? String(item.createdBy) : undefined,
          };
        });

      setPhotos(classItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPhotos();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentClassId = classInfo?.id || classInfo?.Id;
    if (!currentClassId) {
      setMessage({
        text: 'Chưa xác định được lớp học của giáo viên. Vui lòng thử lại sau.',
        type: 'error',
      });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      let successCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadRes = await uploadMedia(file);
        const uploadedMediaId = uploadRes.id || uploadRes.mediaId || '';

        if (uploadedMediaId) {
          const classNameStr = classInfo?.tenLop || 'Lớp của cô';
          const tag = `[CLASS:${currentClassId}:${classNameStr}] [CAT:${currentCategoryForUpload}]`;
          let cleanTitle = file.name.replace(/\.[^/.]+$/, '').trim();
          if (!cleanTitle || /^\d{6,}$/.test(cleanTitle) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(cleanTitle)) {
            cleanTitle = `${currentCategoryForUpload} - ${classNameStr}`;
          }

          await api.post('learning', '/api/learning/products', {
            childId: currentClassId,
            activityId: null,
            mediaId: uploadedMediaId,
            title: cleanTitle,
            description: `${tag} Khoảnh khắc sinh hoạt lớp ${classNameStr}`,
          });
          successCount++;
        }
      }

      await loadPhotos();
      setMessage({
        text: `Đã đăng thành công ${successCount} hình ảnh/video khoảnh khắc vào Album lớp!`,
        type: 'success',
      });
    } catch (err: any) {
      setMessage({
        text: err instanceof Error ? err.message : 'Tải phương tiện lên thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string, createdBy?: string) => {
    // Kiểm tra quyền trước khi gửi yêu cầu
    if (!isUserAdmin && createdBy && activeUserId && createdBy !== activeUserId) {
      setMessage({
        text: 'Bạn không có quyền xóa khoảnh khắc này. Chỉ người đã đăng hoặc Quản trị viên mới có quyền xóa.',
        type: 'warning',
      });
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa khoảnh khắc lớp học này không?')) return;

    try {
      await api.delete('learning', `/api/learning/products/${id}`);
      setPhotos((prev) => prev.filter((x) => x.id !== id));
      setMessage({
        text: 'Đã xóa khoảnh khắc thành công khỏi album lớp.',
        type: 'success',
      });
    } catch (err: any) {
      const is403 = err?.status === 403 || String(err?.message || '').includes('403');
      if (is403) {
        setMessage({
          text: 'Bạn không có quyền xóa khoảnh khắc này (chỉ người đăng hoặc Quản trị viên mới được xóa).',
          type: 'warning',
        });
      } else {
        setMessage({
          text: 'Không thể xóa khoảnh khắc từ hệ thống.',
          type: 'error',
        });
      }
    }
  };

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === 'Tất cả') return true;
    return p.category === selectedCategory;
  });

  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage) || 1;
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lightboxItems = filteredPhotos.map((p) => ({
    id: p.id,
    url: p.url,
    title: p.title,
    date: p.date,
    type: p.type,
  }));

  const openLightbox = (index: number) => {
    const globalIdx = (currentPage - 1) * itemsPerPage + index;
    setLightboxIndex(globalIdx);
    setLightboxOpen(true);
  };

  const className = classInfo?.tenLop || 'Lớp của cô';

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
              KHOẢNH KHẮC & ALBUM LỚP
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              · Lớp {className}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mt-1">
            Album Khoảnh Khắc Lớp Học
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Tổng hợp toàn bộ hình ảnh và video hoạt động chung của lớp học. Phụ huynh trong lớp đều có thể xem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={currentCategoryForUpload}
            onChange={(e) => setCurrentCategoryForUpload(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-orange-400 cursor-pointer"
          >
            {CATEGORIES.filter((c) => c !== 'Tất cả').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-sm shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600 cursor-pointer transition">
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            <span>{uploading ? 'Đang tải lên...' : 'Đăng ảnh / Video lớp'}</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </header>

      {/* Thông báo thông điệp */}
      {message && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between shadow-xs ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : message.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === 'warning' ? (
              <ShieldAlert size={16} className="text-amber-600" />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs phân loại chuyên mục */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter size={15} className="text-slate-400 mr-1" />
        {CATEGORIES.map((categoryName) => (
          <button
            key={categoryName}
            onClick={() => {
              setSelectedCategory(categoryName);
              setCurrentPage(1);
            }}
            className={`whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition cursor-pointer ${
              selectedCategory === categoryName
                ? 'bg-orange-500 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-orange-50 hover:border-orange-200'
            }`}
          >
            {categoryName}
          </button>
        ))}
      </div>

      {/* Lưới hình ảnh và video */}
      {loading ? (
        <div className="flex h-72 items-center justify-center rounded-3xl border border-orange-100 bg-white">
          <Loader2 className="animate-spin text-orange-500 mb-2" size={36} />
        </div>
      ) : paginatedPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 mb-3 border border-orange-100">
            <Inbox size={32} />
          </div>
          <h3 className="text-base font-black text-slate-800">Chưa có khoảnh khắc lớp nào</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Hãy tải lên các hình ảnh hoặc video hoạt động sinh hoạt, học tập, dã ngoại của lớp {className}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {paginatedPhotos.map((item, index) => {
            const isOwner = Boolean(
              isUserAdmin || (activeUserId && item.createdBy === activeUserId)
            );

            return (
              <div
                key={item.id}
                className="group relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Khung xem ảnh / video */}
                <div
                  className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {item.type === 'video' ? (
                    <div className="h-full w-full bg-slate-900 flex items-center justify-center text-white">
                      <Video size={36} className="text-orange-400 group-hover:scale-110 transition" />
                    </div>
                  ) : item.url ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        // Fallback placeholder khi ảnh bị 404
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.fallback-box')) {
                          const fallbackDiv = document.createElement('div');
                          fallbackDiv.className =
                            'fallback-box h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-400 p-2 text-center';
                          fallbackDiv.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size: 10px; font-weight: bold; margin-top: 4px; color: #ea580c">Hình ảnh lớp</span>`;
                          parent.appendChild(fallbackDiv);
                        }
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-500">
                      <ImageIcon size={30} />
                      <span className="text-[10px] font-bold mt-1">Ảnh hoạt động</span>
                    </div>
                  )}

                  {/* Chuyên mục badge */}
                  <span className="absolute top-2 left-2 rounded-xl bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                    {item.category}
                  </span>

                  {/* Nút xem to */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <span className="flex items-center gap-1 bg-white/90 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm">
                      <Eye size={13} /> Xem phóng to
                    </span>
                  </div>
                </div>

                {/* Phần dưới: Tiêu đề, ngày & nút xóa */}
                <div className="p-3.5 flex items-center justify-between border-t border-slate-100">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-bold text-xs text-slate-800 truncate" title={item.title}>
                      {item.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                      <Calendar size={11} />
                      {item.date || 'Hôm nay'}
                    </p>
                  </div>

                  <button
                    onClick={() => void handleDelete(item.id, item.createdBy)}
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
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPhotos.length}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Lightbox phóng to ảnh / video */}
      <MediaLightbox
        media={lightboxItems}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
