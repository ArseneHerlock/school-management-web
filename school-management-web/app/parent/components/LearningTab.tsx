'use client';

import { useEffect, useState } from 'react';
import { BookOpenCheck, Loader2, Sparkles, Image as ImageIcon, Eye } from 'lucide-react';
import { getMediaUrl } from '@/lib/api';
import { getLearningProducts } from '@/services/learning';
import { ChildInfo } from '../types';

interface LearningItem {
  id: string;
  childId: string;
  mediaId: string;
  title: string;
  description?: string;
  createdAtUtc?: string;
}

export default function LearningTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePreview, setActivePreview] = useState<{ url: string; title: string; desc?: string } | null>(null);

  useEffect(() => {
    if (!child?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    // Gọi API lấy sản phẩm của bé (server proxy clamp pageSize <= 100)
    getLearningProducts(child.id)
      .then((res) => {
        const list = Array.isArray(res) ? (res as unknown as LearningItem[]) : [];
        setRows(list);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Không tải được sản phẩm học tập');
      })
      .finally(() => setLoading(false));
  }, [child?.id]);

  const cleanDescription = (raw?: string) => {
    if (!raw) return '';
    return raw
      .replace(/\[CLASS:[^\]]*\]/gi, '')
      .replace(/\[CHILD:[^\]]*\]/gi, '')
      .replace(/\[CAT:[^\]]*\]/gi, '')
      .trim();
  };

  const sanitizeTitle = (title?: string, desc?: string, date?: string) => {
    let t = String(title || '').trim();
    if (!t || /^\d{6,}$/.test(t) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(t)) {
      const catMatch = String(desc || '').match(/\[CAT:([^\]]+)\]/i);
      const cat = catMatch ? catMatch[1].trim() : 'Sản phẩm sáng tạo';
      const dateStr = String(date || '').slice(0, 10);
      return `${cat}${dateStr ? ` (${dateStr})` : ''}`;
    }
    return t;
  };

  return (
    <section className="space-y-5 max-w-full overflow-x-hidden pb-8">
      {/* Header banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 sm:p-7 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            GÓC HỌC TẬP
          </span>
          <span className="text-xs text-indigo-200">·</span>
          <span className="text-xs text-indigo-200 font-semibold">{child.lop || 'Trường mầm non'}</span>
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-black">Sản phẩm học tập của {child.hoTen}</h2>
        <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
          Nơi lưu giữ các bài tập, nét vẽ đầu đời và minh chứng quá trình học tập sáng tạo của bé được giáo viên ghi nhận.
        </p>
      </div>

      {/* Nội dung danh sách sản phẩm */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 border border-slate-100 shadow-xs">
          <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
          <p className="text-xs font-bold text-slate-500">Đang tải sản phẩm học tập của bé...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <BookOpenCheck size={28} />
          </div>
          <h3 className="text-sm font-black text-slate-700">Chưa có sản phẩm học tập nào</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            Khi cô giáo chia sẻ tranh vẽ hoặc bài học của bé {child.hoTen}, hình ảnh và lời nhận xét sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((item) => {
            const mediaUrl = item.mediaId ? getMediaUrl(item.mediaId) : '';
            const displayTitle = sanitizeTitle(item.title, item.description, item.createdAtUtc);
            const cleanDesc = cleanDescription(item.description);
            const dateStr = String(item.createdAtUtc || '').slice(0, 10);

            // Trích xuất chuyên mục
            const catMatch = String(item.description || '').match(/\[CAT:([^\]]+)\]/i);
            const category = catMatch ? catMatch[1].trim() : 'Sản phẩm của bé';

            return (
              <article
                key={item.id}
                className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Khung ảnh */}
                  <div
                    onClick={() => {
                      if (mediaUrl) {
                        setActivePreview({ url: mediaUrl, title: displayTitle, desc: cleanDesc });
                      }
                    }}
                    className="relative h-48 w-full bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    {mediaUrl ? (
                      <img
                        src={mediaUrl}
                        alt={displayTitle}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.fallback-badge')) {
                            const fb = document.createElement('div');
                            fb.className =
                              'fallback-badge h-full w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-indigo-400 p-2 text-center';
                            fb.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><span style="font-size: 11px; font-weight: bold; margin-top: 4px; color: #4338ca">Tác phẩm của bé</span>`;
                            parent.appendChild(fb);
                          }
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-indigo-400">
                        <ImageIcon size={32} />
                        <span className="text-[11px] font-bold mt-1 text-indigo-600">Tác phẩm của bé</span>
                      </div>
                    )}

                    <span className="absolute top-2.5 left-2.5 rounded-xl bg-indigo-900/85 backdrop-blur-md px-2.5 py-1 text-[10px] font-black text-white">
                      {category}
                    </span>

                    {mediaUrl && (
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1 text-white text-xs font-bold">
                        <Eye size={14} /> Xem to
                      </div>
                    )}
                  </div>

                  {/* Nội dung chi tiết */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-black text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">
                      {displayTitle}
                    </h3>
                    {cleanDesc ? (
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-2xl border border-slate-100 line-clamp-3">
                        &ldquo;{cleanDesc}&rdquo;
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">Cô giáo khen ngợi sự cố gắng và sáng tạo của bé.</p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>{dateStr || 'Gần đây'}</span>
                  <span className="text-indigo-600 font-bold group-hover:underline">Chi tiết →</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Lightbox xem ảnh to cho phụ huynh trên mobile */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActivePreview(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] bg-slate-900 flex items-center justify-center overflow-hidden">
              <img
                src={activePreview.url}
                alt={activePreview.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
              <button
                onClick={() => setActivePreview(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-base font-black text-slate-800">{activePreview.title}</h3>
              {activePreview.desc && (
                <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {activePreview.desc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
