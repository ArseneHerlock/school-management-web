'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Sparkles,
  ArrowLeft,
  Upload,
  Plus,
  Loader2,
  Trash2,
  Image as ImageIcon,
  Calendar,
  BookOpen,
  Filter,
  Eye,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { api, uploadMedia, getMediaUrl, currentUser } from '@/services';
import { loadLiveTeacherChildren, loadLiveTeacherContext, Child } from '../data';
import Avatar from '../components/Avatar';
import MediaLightbox from '@/app/admin/components/shared/MediaLightbox';

const PRODUCT_CATEGORIES = [
  'Mỹ thuật & Tạo hình',
  'Làm quen chữ viết & Đọc thơ',
  'Khám phá & Toán học',
  'Vận động & Kỹ năng sống',
  'Sản phẩm tự chọn khác',
];

interface LearningProductItem {
  id: string;
  childId: string;
  activityId?: string | null;
  mediaId: string;
  title: string;
  description?: string;
  createdBy?: string;
  createdAtUtc?: string;
}

export default function TeacherLearningPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [allProducts, setAllProducts] = useState<LearningProductItem[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Bộ lọc & Tìm kiếm ở màn hình danh sách bé
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form đăng sản phẩm mới cho bé được chọn
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [productTitle, setProductTitle] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [productComment, setProductComment] = useState<string>('');
  const [uploadedMediaId, setUploadedMediaId] = useState<string>('');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [submittingProduct, setSubmittingProduct] = useState<boolean>(false);

  // Lightbox xem ảnh to
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Thông báo phản hồi
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'warning' } | null>(null);

  const activeUserId = currentUser()?.id;
  const isUserAdmin = currentUser()?.roles.includes('ADMIN');

  const loadData = async () => {
    setLoading(true);
    try {
      const [context, loadedChildren] = await Promise.all([
        loadLiveTeacherContext(),
        loadLiveTeacherChildren(),
      ]);

      setClassInfo(context.cls);
      setChildren(loadedChildren || []);

      const productsRes = await api
        .get<any>('learning', '/api/learning/products?pageSize=100')
        .catch(() => []);
      const itemsList = Array.isArray(productsRes)
        ? productsRes
        : (productsRes as any)?.items || [];

      setAllProducts(itemsList);
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Không thể tải dữ liệu sản phẩm học tập.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Tự động tắt toast sau 5s
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Map số lượng sản phẩm của từng bé
  const childProductCountMap = useMemo(() => {
    const countMap = new Map<string, number>();
    children.forEach((child) => {
      const apiId = String(child.apiId || '').toLowerCase();
      const numId = String(child.id).toLowerCase();
      const count = allProducts.filter((product) => {
        const pChildId = String(product.childId || '').toLowerCase();
        const pDesc = String(product.description || '').toLowerCase();
        return (
          (apiId && pChildId === apiId) ||
          (numId && pChildId === numId) ||
          (apiId && pDesc.includes(`[child:${apiId}]`)) ||
          (numId && pDesc.includes(`[child:${numId}]`))
        );
      }).length;
      if (apiId) countMap.set(apiId, count);
      countMap.set(numId, count);
    });
    return countMap;
  }, [allProducts, children]);

  // Danh sách học sinh lọc theo từ khóa tìm kiếm
  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      return (
        child.name.toLowerCase().includes(term) ||
        child.nickname.toLowerCase().includes(term)
      );
    });
  }, [children, searchQuery]);

  // Danh sách sản phẩm của riêng bé đang được chọn
  const selectedChildProducts = useMemo(() => {
    if (!selectedChild) return [];
    const targetApiId = String(selectedChild.apiId || '').toLowerCase();
    const targetNumId = String(selectedChild.id).toLowerCase();
    return allProducts.filter((product) => {
      const pChildId = String(product.childId || '').toLowerCase();
      const pDesc = String(product.description || '').toLowerCase();
      return (
        (targetApiId && pChildId === targetApiId) ||
        (targetNumId && pChildId === targetNumId) ||
        (targetApiId && pDesc.includes(`[child:${targetApiId}]`)) ||
        (targetNumId && pDesc.includes(`[child:${targetNumId}]`))
      );
    });
  }, [selectedChild, allProducts]);

  // Xử lý upload ảnh/video cho bé
  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    setToast(null);
    try {
      const uploadRes = await uploadMedia(file);
      const mediaId = uploadRes.id || uploadRes.mediaId || '';
      if (!mediaId) {
        throw new Error('Không nhận được mã định danh tệp từ MediaService.');
      }
      setUploadedMediaId(mediaId);
      setMediaPreviewUrl(uploadRes.url || getMediaUrl(mediaId));
      setToast({
        text: `Đã tải lên tệp "${file.name}" thành công!`,
        type: 'success',
      });
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Tải tệp lên thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Lưu sản phẩm của bé lên LearningService
  const handleSubmitProduct = async () => {
    if (!selectedChild) return;
    const targetChildId = selectedChild.apiId || String(selectedChild.id);

    if (!productTitle.trim()) {
      setToast({ text: 'Vui lòng nhập tiêu đề sản phẩm của bé.', type: 'error' });
      return;
    }
    if (!uploadedMediaId) {
      setToast({ text: 'Vui lòng chọn hình ảnh hoặc video sản phẩm của bé.', type: 'error' });
      return;
    }

    setSubmittingProduct(true);
    try {
      const fullDescription = `[CHILD:${targetChildId}] [CAT:${productCategory}] ${productComment.trim()}`.trim();

      await api.post('learning', '/api/learning/products', {
        childId: targetChildId,
        activityId: null,
        mediaId: uploadedMediaId,
        title: productTitle.trim(),
        description: fullDescription,
      });

      // Reset form
      setProductTitle('');
      setProductComment('');
      setUploadedMediaId('');
      setMediaPreviewUrl('');
      setShowAddForm(false);

      setToast({
        text: `Đã lưu sản phẩm "${productTitle.trim()}" cho bé ${selectedChild.name} thành công!`,
        type: 'success',
      });

      // Tải lại danh sách
      const productsRes = await api
        .get<any>('learning', '/api/learning/products?pageSize=100')
        .catch(() => []);
      const itemsList = Array.isArray(productsRes)
        ? productsRes
        : (productsRes as any)?.items || [];
      setAllProducts(itemsList);
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Không thể lưu sản phẩm của bé.',
        type: 'error',
      });
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Xóa sản phẩm của bé (kèm kiểm tra quyền & xử lý lỗi 403)
  const handleDeleteProduct = async (productId: string, createdBy?: string) => {
    if (!isUserAdmin && createdBy && activeUserId && createdBy !== activeUserId) {
      setToast({
        text: 'Bạn không có quyền xóa sản phẩm này. Chỉ giáo viên đã đăng hoặc Quản trị viên mới có quyền xóa.',
        type: 'warning',
      });
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm học tập này của bé không?')) return;

    try {
      await api.delete('learning', `/api/learning/products/${productId}`);
      setAllProducts((prev) => prev.filter((item) => item.id !== productId));
      setToast({
        text: 'Đã xóa sản phẩm của bé thành công khỏi hệ thống.',
        type: 'success',
      });
    } catch (err: any) {
      const is403 = err?.status === 403 || String(err?.message || '').includes('403');
      if (is403) {
        setToast({
          text: 'Bạn không có quyền xóa sản phẩm này (chỉ người đăng hoặc Quản trị viên mới được xóa).',
          type: 'warning',
        });
      } else {
        setToast({
          text: 'Không thể xóa sản phẩm từ hệ thống.',
          type: 'error',
        });
      }
    }
  };

  const className = classInfo?.tenLop || 'Lớp của cô';

  // Chuẩn bị items cho Lightbox
  const lightboxItems = selectedChildProducts.map((p) => {
    const rawDesc = String(p.description || '');
    const cleanDesc = rawDesc
      .replace(/\[CLASS:[^\]]*\]/gi, '')
      .replace(/\[CHILD:[^\]]*\]/gi, '')
      .replace(/\[CAT:[^\]]*\]/gi, '')
      .trim();

    return {
      id: p.id,
      url: getMediaUrl(p.mediaId),
      title: p.title,
      date: String(p.createdAtUtc || '').slice(0, 10),
      type: 'image' as const,
      description: cleanDesc,
    };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Thông báo Toast */}
      {toast && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between shadow-xs transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'warning' ? (
              <ShieldAlert size={16} className="text-amber-600" />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          TRƯỜNG HỢP 1: ĐANG CHỌN 1 BÉ CỤ THỂ -> XEM & ĐĂNG SẢN PHẨM CỦA BÉ ĐÓ
          ========================================================================= */}
      {selectedChild ? (
        <div className="space-y-6">
          {/* Header bé & Nút quay lại */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setSelectedChild(null);
                  setShowAddForm(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition cursor-pointer"
                title="Quay lại danh sách học sinh"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative">
                <Avatar initials={selectedChild.avatar} id={selectedChild.id} size="lg" />
                <span
                  className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white ${
                    selectedChild.gender === 'F' ? 'bg-rose-400' : 'bg-blue-400'
                  }`}
                >
                  {selectedChild.gender === 'F' ? '♀' : '♂'}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                    Góc sản phẩm của bé
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    · Lớp {className}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-slate-800 mt-0.5">
                  {selectedChild.name}
                  {selectedChild.nickname && (
                    <span className="text-orange-600 font-bold ml-2">
                      ({selectedChild.nickname})
                    </span>
                  )}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {selectedChild.dob ? `Sinh ngày: ${selectedChild.dob}` : 'Học sinh mầm non'} ·{' '}
                  <strong className="text-orange-600">
                    {selectedChildProducts.length} sản phẩm sáng tạo
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black transition-all cursor-pointer ${
                  showAddForm
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm shadow-orange-500/30 hover:from-orange-600 hover:to-amber-600'
                }`}
              >
                {showAddForm ? <X size={16} /> : <Plus size={16} />}
                <span>{showAddForm ? 'Đóng biểu mẫu' : 'Đăng sản phẩm mới'}</span>
              </button>
            </div>
          </div>

          {/* Form đăng sản phẩm mới cho bé (Khi mở) */}
          {showAddForm && (
            <div className="rounded-3xl border border-orange-200 bg-white p-6 shadow-md shadow-orange-500/5 space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-orange-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                    BÀI TẬP & SẢN PHẨM HỌC TẬP
                  </span>
                  <h3 className="text-lg font-black text-slate-800 mt-0.5">
                    Thêm sản phẩm sáng tạo cho bé {selectedChild.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600"
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
                        onClick={() => {
                          setUploadedMediaId('');
                          setMediaPreviewUrl('');
                        }}
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
                          <p className="text-xs font-bold text-slate-600">Đang tải tệp lên MediaService...</p>
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
                          if (file) void handleFileUpload(file);
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
                      onChange={(e) => setProductTitle(e.target.value)}
                      placeholder="vd: Tranh vẽ ngôi nhà của bé, Chú rùa bằng đất nặn..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">
                      Lĩnh vực phát triển
                    </label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
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
                      onChange={(e) => setProductComment(e.target.value)}
                      placeholder="vd: Bé rất khéo tay, phối màu tươi sáng, biết tự dọn dẹp đồ dùng sau giờ học..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      disabled={submittingProduct || !productTitle.trim() || !uploadedMediaId}
                      onClick={() => void handleSubmitProduct()}
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
          )}

          {/* Lưới danh sách sản phẩm của bé */}
          {selectedChildProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 mb-3 border border-orange-100">
                <BookOpen size={30} />
              </div>
              <h3 className="text-base font-black text-slate-800">
                Bé {selectedChild.name} chưa có sản phẩm nào
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm leading-relaxed">
                Hãy nhấn nút <strong>&quot;Đăng sản phẩm mới&quot;</strong> ở trên để lưu lại những tác phẩm nghệ thuật, tranh vẽ, hoặc bài tập đáng yêu của bé.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {selectedChildProducts.map((product, idx) => {
                const mediaUrl = getMediaUrl(product.mediaId);
                const rawDesc = String(product.description || '');
                const cleanDesc = rawDesc
                  .replace(/\[CLASS:[^\]]*\]/gi, '')
                  .replace(/\[CHILD:[^\]]*\]/gi, '')
                  .replace(/\[CAT:[^\]]*\]/gi, '')
                  .trim();

                // Lấy chuyên mục từ tag
                const catMatch = rawDesc.match(/\[CAT:([^\]]+)\]/i);
                const category = catMatch ? catMatch[1].trim() : 'Sản phẩm của bé';

                const displayTitle =
                  !product.title ||
                  /^\d{6,}$/.test(product.title.trim()) ||
                  /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(product.title.trim())
                    ? `${category} - ${selectedChild.name}`
                    : product.title;

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
                        onClick={() => {
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        {mediaUrl ? (
                          <img
                            src={mediaUrl}
                            alt={product.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              // Fallback placeholder khi ảnh bị 404
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
                        {String(product.createdAtUtc || '').slice(0, 10) || 'Hôm nay'}
                      </span>

                      <button
                        onClick={() => void handleDeleteProduct(product.id, product.createdBy)}
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
          )}

          {/* Lightbox xem phóng to */}
          <MediaLightbox
            media={lightboxItems}
            initialIndex={lightboxIndex}
            isOpen={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
          />
        </div>
      ) : (
        /* =========================================================================
            TRƯỜNG HỢP 2: DANH SÁCH TOÀN BỘ CÁC BÉ TRONG LỚP (CARD VIEW)
            ========================================================================= */
        <div className="space-y-6">
          {/* Header Trang */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                  GÓC SẢN PHẨM HỌC TẬP CỦA BÉ
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  · Lớp {className}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mt-1">
                Sản Phẩm & Sáng Tạo Của Từng Bé
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Chọn một học sinh trong danh sách lớp bên dưới để xem hoặc đăng hình ảnh, video sản phẩm của riêng bé đó.
              </p>
            </div>

            <button
              onClick={() => void loadData()}
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition shadow-2xs cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : ''} />
              <span>Đồng bộ danh sách</span>
            </button>
          </header>

          {/* Thanh tìm kiếm bé */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-white p-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bé theo họ tên hoặc tên gọi ở nhà..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:bg-white transition"
              />
            </div>

            <div className="text-xs font-black text-slate-600">
              Sĩ số: <span className="text-orange-600">{children.length} bé</span>
            </div>
          </div>

          {/* Lưới các Card học sinh */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-orange-100 shadow-sm">
              <Loader2 size={36} className="animate-spin text-orange-500 mb-3" />
              <p className="text-xs font-bold text-slate-600">Đang tải danh sách học sinh của lớp...</p>
            </div>
          ) : filteredChildren.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
              <p className="text-xs font-bold text-slate-400">
                {searchQuery
                  ? 'Không tìm thấy bé nào khớp với từ khóa tìm kiếm.'
                  : 'Chưa có học sinh nào trong lớp được phân công.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredChildren.map((child) => {
                const targetApiId = String(child.apiId || child.id).toLowerCase();
                const productCount = childProductCountMap.get(targetApiId) || 0;

                return (
                  <button
                    key={child.id}
                    onClick={() => {
                      setSelectedChild(child);
                      setShowAddForm(false);
                    }}
                    className="group text-left rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar initials={child.avatar} id={child.id} size="lg" />
                        <span
                          className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white ${
                            child.gender === 'F' ? 'bg-rose-400' : 'bg-blue-400'
                          }`}
                        >
                          {child.gender === 'F' ? '♀' : '♂'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-black text-base text-slate-800 group-hover:text-orange-600 transition truncate">
                          {child.name}
                        </h3>

                        {child.nickname && (
                          <p className="text-xs font-bold text-orange-600 mt-0.5">
                            Biệt danh: {child.nickname}
                          </p>
                        )}

                        <p className="text-[11px] text-slate-400 font-semibold mt-1">
                          {child.dob ? `Sinh ngày: ${child.dob}` : 'Học sinh mầm non'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                          productCount > 0
                            ? 'bg-orange-50 text-orange-700 border border-orange-200/60'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        <Sparkles size={12} className={productCount > 0 ? 'text-orange-500' : ''} />
                        <span>{productCount} sản phẩm</span>
                      </span>

                      <span className="text-xs font-black text-orange-600 group-hover:underline">
                        Mở góc bé →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
