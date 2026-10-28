'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Home,
  Calendar,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  Newspaper,
  CalendarCheck,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getFullApiUrl } from '@/services/client';
import ConfirmModal from '@/app/components/ui/ConfirmModal';
import NewsDetailPage from './NewsDetailPage';
import NewsFormModal from './NewsFormModal';
import { NewsItemData } from './NewsDetailModal';
import { parseNewsImageAndText, formatWithImageTag } from './newsHelper';

interface NewsListViewProps {
  role: 'admin' | 'teacher' | 'parent';
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function NewsListView({
  role,
  pageTitle = 'Tin tức & Hoạt động Nhà trường',
  pageSubtitle = 'Cập nhật tin tức, sự kiện và thông báo chính thức từ Trường Mầm non Bé Ngoan.',
}: NewsListViewProps) {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  // Active view: List view or Single Article Detail page
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Editor Modal (ONLY opened on create/edit button click)
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItemData | null>(null);

  // Delete Confirm Modal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Live timestamp matching Image 5 top-right
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const y = now.getFullYear();
      const time = now.toTimeString().split(' ')[0];
      setCurrentTimeStr(`${dayName}, ngày ${d}/${m}/${y} ${time} GMT+7`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch from backend microservices (NewsService 8080 & ActivityService 5293)
  const loadData = async () => {
    setLoading(true);
    try {
      const [newsRes, actRes] = await Promise.all([
        api.get<any>('news', '/api/news?trang=1&soLuongMoiTrang=100').catch(() => null),
        api.get<any>('activity', '/api/activities').catch(() => null),
      ]);

      const nItems = Array.isArray(newsRes)
        ? newsRes
        : Array.isArray(newsRes?.items)
        ? newsRes.items
        : [];

      const parsedItems = nItems.map((item: any) => {
        const fromTomTat = parseNewsImageAndText(item.tomTat);
        const fromNoiDung = parseNewsImageAndText(item.noiDung);
        let detectedImg = item.hinhAnh || fromTomTat.imageUrl || fromNoiDung.imageUrl || null;
        if (detectedImg && !detectedImg.includes('unsplash.com')) {
          detectedImg = getFullApiUrl(detectedImg);
        } else {
          detectedImg = null;
        }
        return {
          ...item,
          rawTomTat: item.tomTat,
          tomTat: fromTomTat.cleanText,
          noiDung: fromNoiDung.cleanText || fromTomTat.cleanText,
          hinhAnh: detectedImg,
        };
      });

      // Loại bỏ bản ghi cũ bị trùng tiêu đề do lỗi sửa tạo mới trước đó (giữ lại bản mới nhất)
      const sortedByNewest = [...parsedItems].sort(
        (a, b) =>
          new Date(b.ngayTao || b.ngayXuatBan || 0).getTime() -
          new Date(a.ngayTao || a.ngayXuatBan || 0).getTime()
      );
      const seenTitles = new Set<string>();
      const uniqueItems: any[] = [];
      for (const item of sortedByNewest) {
        const normTitle = String(item.tieuDe || '').trim().toLowerCase();
        if (normTitle && seenTitles.has(normTitle)) {
          if (role === 'admin' && item.id) {
            api.delete('news', `/api/news/${item.id}`).catch(() => {});
          }
          continue;
        }
        if (normTitle) seenTitles.add(normTitle);
        uniqueItems.push(item);
      }

      setNewsList(uniqueItems);

      const aItems = Array.isArray(actRes)
        ? actRes
        : Array.isArray(actRes?.items)
        ? actRes.items
        : [];
      setActivities(aItems);
    } catch (err) {
      console.error('Error loading data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Filtered news
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return newsList;
    const q = searchQuery.toLowerCase().trim();
    return newsList.filter(
      (item) =>
        (item.tieuDe && item.tieuDe.toLowerCase().includes(q)) ||
        (item.tomTat && item.tomTat.toLowerCase().includes(q)) ||
        (item.noiDung && item.noiDung.toLowerCase().includes(q))
    );
  }, [newsList, searchQuery]);

  // Open article detail page
  const handleViewArticle = (id: string) => {
    setSelectedArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open create form
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  // Open edit form (fetch full article detail so noiDung / PDF is preserved)
  const handleOpenEdit = async (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    let fullItem = item;
    try {
      const detail = await api.get<any>('news', `/api/news/${item.id}`);
      if (detail && detail.id) {
        fullItem = detail;
      }
    } catch {}

    const fromTomTat = parseNewsImageAndText(fullItem.rawTomTat || fullItem.tomTat);
    const fromNoiDung = parseNewsImageAndText(fullItem.noiDung);
    let img = fullItem.hinhAnh || item.hinhAnh || fromTomTat.imageUrl || fromNoiDung.imageUrl || '';
    if (img && !img.includes('unsplash.com')) {
      img = getFullApiUrl(img);
    } else {
      img = '';
    }
    setEditingItem({
      id: fullItem.id || item.id,
      tieuDe: fullItem.tieuDe || item.tieuDe || '',
      tomTat: fromTomTat.cleanText,
      noiDung: fromNoiDung.cleanText || fromTomTat.cleanText,
      hinhAnh: img,
      phamVi: fullItem.phamVi ?? item.phamVi ?? 0,
      loaiTin: 'NEWS',
    });
    setFormOpen(true);
  };

  // Open delete confirm
  const handleOpenDelete = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete via backend NewsService
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.delete('news', `/api/news/${itemToDelete.id}`);
      if (selectedArticleId === itemToDelete.id) {
        setSelectedArticleId(null);
      }
      await loadData();
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  // Save (Create or Update) via backend NewsService
  const handleSave = async (data: Partial<NewsItemData>) => {
    const targetId = data.id || editingItem?.id;
    const isEditing = Boolean(targetId);
    const img = data.hinhAnh && !data.hinhAnh.includes('unsplash.com') ? data.hinhAnh.trim() : null;

    const tomTatWithImg = formatWithImageTag(data.tomTat || '', img);
    const noiDungWithImg = formatWithImageTag(data.noiDung || data.tomTat || '', img);

    const payload = {
      tieuDe: data.tieuDe,
      tomTat: tomTatWithImg,
      noiDung: noiDungWithImg,
      phamVi: data.phamVi ?? 0,
      xuatBanNgay: true,
      xuatBan: true,
    };

    if (isEditing && targetId) {
      await api.put('news', `/api/news/${targetId}`, payload);
    } else {
      await api.post('news', '/api/news', payload);
    }

    setEditingItem(null);
    await loadData();
  };

  const formatNewsDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // IF AN ARTICLE IS SELECTED -> RENDER DEDICATED ARTICLE DETAIL PAGE!
  if (selectedArticleId) {
    return (
      <>
        <NewsDetailPage
          key={`${selectedArticleId}-${newsList.length}`}
          newsId={selectedArticleId}
          role={role}
          onBack={() => setSelectedArticleId(null)}
          onEdit={(art) => {
            setEditingItem({
              id: art.id,
              tieuDe: art.tieuDe,
              tomTat: art.tomTat,
              noiDung: art.noiDung,
              hinhAnh: art.hinhAnh,
              phamVi: art.phamVi,
              loaiTin: 'NEWS',
            });
            setFormOpen(true);
          }}
          onDelete={(art) => {
            setItemToDelete(art);
            setDeleteConfirmOpen(true);
          }}
        />
        {(role === 'admin' || role === 'teacher') && (
          <NewsFormModal
            isOpen={formOpen}
            onClose={() => setFormOpen(false)}
            onSave={handleSave}
            initialData={editingItem}
          />
        )}
        <ConfirmModal
          isOpen={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Xác nhận xóa bài viết"
          message={`Bạn có chắc chắn muốn xóa "${itemToDelete?.tieuDe || 'bài viết này'}" không? Hành động này sẽ xóa dữ liệu khỏi hệ thống.`}
          confirmText="Xóa vĩnh viễn"
          cancelText="Giữ lại"
          variant="danger"
          loading={deleting}
        />
      </>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-7xl mx-auto font-sans px-2 sm:px-4 overflow-x-hidden">
      {/* Top Breadcrumb Bar matching Image 5 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Home size={14} className="text-slate-600" />
          <span className="hover:text-blue-700 cursor-pointer">Trang chủ</span>
          <span>»</span>
          <span className="hover:text-blue-700 cursor-pointer">Tin tức</span>
          <span>»</span>
          <span className="font-bold text-slate-700">Bản tin</span>
        </div>
        <div className="italic text-slate-400">
          {currentTimeStr}
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none"
            placeholder="Tìm kiếm tin tức, hoạt động, thông báo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={() => void loadData()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            title="Làm mới"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          {(role === 'admin' || role === 'teacher') && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
            >
              <Plus size={15} />
              <span>Đăng tin mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Section matching Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left Column: News Feed (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Title NEWS */}
          <div className="text-center pt-1 pb-4">
            <h2 className="text-lg font-black tracking-widest text-[#0066b2] uppercase">
              NEWS
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-[1px] w-24 bg-slate-200"></span>
              <span className="w-1.5 h-1.5 rotate-45 bg-[#0066b2]"></span>
              <span className="h-[1px] w-24 bg-slate-200"></span>
            </div>
          </div>

          {/* News List */}
          {filteredNews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Chưa có bản tin nào từ hệ thống.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 space-y-6">
              {filteredNews.map((item, idx) => {
                const dateStr = formatNewsDate(item.ngayTao || item.ngayXuatBan);
                const hasRealImage = Boolean(item.hinhAnh && !item.hinhAnh.includes('unsplash.com'));

                return (
                  <article
                    key={item.id}
                    onClick={() => handleViewArticle(item.id)}
                    className={`group flex flex-col sm:flex-row items-start gap-4 cursor-pointer transition ${
                      idx > 0 ? 'pt-6' : ''
                    }`}
                  >
                    {/* Left Thumbnail or Badge (NO FAKE IMAGES) */}
                    {hasRealImage ? (
                      <div className="w-full sm:w-56 h-40 sm:h-36 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <img
                          src={item.hinhAnh}
                          alt={item.tieuDe}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full sm:w-44 h-28 sm:h-32 shrink-0 rounded-xl border border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 flex flex-col items-center justify-center text-sky-600 gap-2 p-3 text-center transition group-hover:bg-blue-100/50">
                        <Newspaper size={28} />
                        <span className="text-[11px] font-bold text-sky-800 line-clamp-1">Bản tin trường</span>
                      </div>
                    )}

                    {/* Right Content */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h3 className="text-base sm:text-[17px] font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                        {item.tieuDe}
                        {idx < 2 && (
                          <span className="inline-block ml-2 px-2 py-0.5 rounded-full bg-[#f59e0b] text-[10px] font-black text-white uppercase tracking-wider align-middle">
                            new
                          </span>
                        )}
                      </h3>

                      {/* Date with Calendar icon */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{dateStr || 'Hôm nay'}</span>
                      </div>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed pt-0.5">
                        {item.tomTat || item.noiDung || 'Nhấn để xem chi tiết bài viết...'}
                      </p>

                      {/* Role Actions (Admin/Teacher) */}
                      {(role === 'admin' || role === 'teacher') && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={(e) => handleOpenEdit(item, e)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition cursor-pointer"
                          >
                            <Edit2 size={12} />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={(e) => handleOpenDelete(item, e)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                          >
                            <Trash2 size={12} />
                            <span>Xóa</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: UPCOMING EVENTS (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Header Bar */}
          <div className="rounded-t-lg bg-slate-100 py-2.5 px-4 text-center font-bold text-slate-800 text-sm uppercase tracking-wider border border-slate-200 shadow-2xs">
            UPCOMING EVENTS
          </div>

          {/* Activities / Events from backend */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-b-lg overflow-hidden bg-white shadow-2xs">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Chưa có hoạt động nào sắp diễn ra.
              </div>
            ) : (
              activities.slice(0, 5).map((act, idx) => {
                const rawDate = act.createdAt ? new Date(act.createdAt) : new Date();
                const day = String(rawDate.getDate()).padStart(2, '0');
                const month = `Tháng ${rawDate.getMonth() + 1}`;

                return (
                  <div
                    key={act.id || idx}
                    className="group flex items-start gap-3 p-3.5 hover:bg-slate-50/80 transition"
                  >
                    {/* Deep Blue Date Block matching Image 5 */}
                    <div className="w-16 h-16 shrink-0 rounded bg-[#0070ba] text-white flex flex-col items-center justify-center text-center shadow-xs">
                      <span className="text-lg font-black leading-none">{day}</span>
                      <span className="w-7 h-[1px] bg-white/40 my-1"></span>
                      <span className="text-[10px] font-bold uppercase leading-none tracking-tight">
                        {month}
                      </span>
                    </div>

                    {/* Right Info from ActivityService */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition line-clamp-2 leading-snug">
                        {act.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                        {act.description}
                      </p>
                      {act.code && (
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          Mã HĐ: {act.code}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Editor Modal for Admin & Teacher (Only opens on explicit create/edit button click) */}
      {(role === 'admin' || role === 'teacher') && (
        <NewsFormModal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}

      {/* Confirm Modal for Delete */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa bài viết"
        message={`Bạn có chắc chắn muốn xóa "${itemToDelete?.tieuDe || 'bài viết này'}" không? Hành động này sẽ xóa dữ liệu khỏi hệ thống.`}
        confirmText="Xóa vĩnh viễn"
        cancelText="Giữ lại"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
