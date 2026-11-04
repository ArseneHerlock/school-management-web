'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Maximize2 } from 'lucide-react';
import { getMediaUrl } from "@/services";

interface MediaItem {
  url: string;
  type?: 'image' | 'video';
  title?: string;
}

interface MediaLightboxProps {
  media: MediaItem[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function MediaLightbox({ media, initialIndex = 0, isOpen, onClose }: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || !media || media.length === 0) return null;

  const current = media[currentIndex] || media[0];
  const isVideo = current.type === 'video' || current.url.endsWith('.mp4') || current.url.endsWith('.webm');

  const prev = () => setCurrentIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === media.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
        <span className="text-sm font-semibold bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
          {current.title || `Phương tiện ${currentIndex + 1} / ${media.length}`}
        </span>

        <div className="flex items-center gap-3">
          <a
            href={current.url}
            download
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            title="Tải về"
          >
            <Download size={18} />
          </a>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            title="Đóng"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex max-h-[85vh] max-w-[90vw] items-center justify-center">
        {isVideo ? (
          <video src={getMediaUrl(current.url)} controls autoPlay className="max-h-[80vh] max-w-[85vw] rounded-2xl shadow-2xl outline-none" />
        ) : (
          <img src={getMediaUrl(current.url)} alt={current.title || 'Media'} className="max-h-[80vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl" />
        )}
      </div>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition backdrop-blur-sm"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition backdrop-blur-sm"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Thumbnails preview strip */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 overflow-x-auto max-w-[80vw] p-2 bg-black/40 rounded-2xl backdrop-blur-md">
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-12 w-16 overflow-hidden rounded-xl border-2 transition ${
                idx === currentIndex ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {item.type === 'video' || item.url.endsWith('.mp4') ? (
                <div className="flex h-full w-full items-center justify-center bg-slate-800 text-[10px] text-white">Video</div>
              ) : (
                <img src={getMediaUrl(item.url)} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
