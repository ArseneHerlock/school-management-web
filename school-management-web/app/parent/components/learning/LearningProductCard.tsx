'use client';

import React from 'react';
import { Sparkles, Image as ImageIcon, Eye } from 'lucide-react';
import { getMediaUrl } from '@/services';
import { EnrichedLearningItem } from './types';

interface LearningProductCardProps {
  item: EnrichedLearningItem;
  onPreview: (preview: { url: string; title: string; desc?: string }) => void;
}

export function LearningProductCard({
  item,
  onPreview,
}: LearningProductCardProps) {
  const mediaUrl = item.mediaId ? getMediaUrl(item.mediaId) : '';
  const { displayTitle, cleanDesc, dateStr, category, resolvedActTitle } = item;

  return (
    <article className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between">
      <div>
        {/* Khung ảnh */}
        <div
          onClick={() => {
            if (mediaUrl) {
              onPreview({ url: mediaUrl, title: displayTitle, desc: cleanDesc });
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
              <span className="text-[11px] font-bold mt-1 text-indigo-600">
                Tác phẩm của bé
              </span>
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
          {resolvedActTitle && (
            <div className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-lg max-w-full truncate">
              <Sparkles size={11} className="shrink-0 text-indigo-600" />
              <span className="truncate">{resolvedActTitle}</span>
            </div>
          )}
          <h3 className="font-black text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">
            {displayTitle}
          </h3>
          {cleanDesc ? (
            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-2.5 rounded-2xl border border-slate-100 line-clamp-3">
              &ldquo;{cleanDesc}&rdquo;
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 italic">
              Cô giáo khen ngợi sự cố gắng và sáng tạo của bé.
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>{dateStr || 'Gần đây'}</span>
        <span className="text-indigo-600 font-bold group-hover:underline">Chi tiết →</span>
      </div>
    </article>
  );
}
