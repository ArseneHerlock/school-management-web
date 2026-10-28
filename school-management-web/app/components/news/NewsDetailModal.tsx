'use client';

import React from 'react';
import { X, Calendar, MapPin, Tag, Share2, Clock } from 'lucide-react';
import Modal from '@/app/components/ui/Modal';
import { extractPdfUrl } from './newsHelper';
import { getFullApiUrl } from '@/services/client';

export interface NewsItemData {
  id: string;
  tieuDe: string;
  tomTat?: string;
  noiDung?: string;
  loaiTin?: 'NEWS' | 'EVENT';
  hinhAnh?: string;
  hinhAnhs?: string[];
  imageUrl?: string;
  ngaySuKien?: string;
  diaDiem?: string;
  phamVi?: number;
  ngayTao?: string;
  ngayXuatBan?: string;
}

interface NewsDetailModalProps {
  item: NewsItemData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsDetailModal({ item, isOpen, onClose }: NewsDetailModalProps) {
  if (!item) return null;

  const isEvent = item.loaiTin === 'EVENT';
  const displayDate = item.ngayTao || item.ngayXuatBan;
  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  const eventDateFormatted = item.ngaySuKien
    ? new Date(item.ngaySuKien).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  const eventTimeFormatted = item.ngaySuKien
    ? new Date(item.ngaySuKien).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const rawImages = item.hinhAnhs && item.hinhAnhs.length > 0
    ? item.hinhAnhs
    : item.hinhAnh
    ? [item.hinhAnh]
    : [];
  const images = rawImages.map((img) => getFullApiUrl(img));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="3xl">
      <div className="space-y-5 -mt-3">
        {/* Breadcrumb / Tag Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isEvent ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isEvent ? 'Sự kiện nhà trường' : 'Tin tức & Thông báo'}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Calendar size={13} />
              {formattedDate}
            </span>
          </div>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: item.tieuDe, text: item.tomTat, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết vào clipboard');
              }
            }}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition"
          >
            <Share2 size={13} /> Chia sẻ
          </button>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          {item.tieuDe}
        </h1>

        {/* Event Detail Badge (if event) */}
        {isEvent && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-900">
              <Calendar size={18} className="text-blue-600" />
              <span>Thời gian: {eventDateFormatted} {eventTimeFormatted ? `(${eventTimeFormatted})` : ''}</span>
            </div>
            {item.diaDiem && (
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                <MapPin size={18} className="text-blue-600" />
                <span>Địa điểm: {item.diaDiem}</span>
              </div>
            )}
          </div>
        )}

        {/* Featured Image */}
        {images.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
              src={images[0]}
              alt={item.tieuDe}
              className="w-full max-h-[380px] object-cover"
            />
          </div>
        )}

        {/* Summary Excerpt */}
        {item.tomTat && (
          <div className="rounded-xl border-l-4 border-blue-600 bg-slate-50 p-4 text-sm font-semibold italic text-slate-700 leading-relaxed">
            {item.tomTat}
          </div>
        )}

        {/* Full Content or PDF Viewer */}
        {(() => {
          const raw = item.noiDung || item.tomTat || '';
          let pdfUrl = extractPdfUrl(item.noiDung) || extractPdfUrl(item.tomTat);
          if (pdfUrl) pdfUrl = getFullApiUrl(pdfUrl);
          const isPdf =
            Boolean(pdfUrl) ||
            raw.includes('.pdf') ||
            raw.startsWith('data:application/pdf') ||
            raw.includes('/api/backend/media') ||
            raw.includes('application/pdf');

          if (isPdf && pdfUrl) {
            return (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs font-bold text-slate-700">Tài liệu đính kèm (PDF)</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={pdfUrl}
                      download="tin_tuc.pdf"
                      className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition"
                    >
                      Tải file PDF
                    </a>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                    >
                      Mở tab mới
                    </a>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 overflow-hidden h-[500px]">
                  <iframe src={`${pdfUrl}#toolbar=1`} className="w-full h-full border-0" title={item.tieuDe} />
                </div>
              </div>
            );
          }

          return (
            <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {item.noiDung || item.tomTat || 'Nội dung chi tiết đang được cập nhật.'}
            </div>
          );
        })()}

        {/* Additional Images (if any) */}
        {images.length > 1 && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Hình ảnh đính kèm</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
          <span>Ban Giám hiệu - Trường Mầm non Bé Ngoan</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-700 hover:bg-slate-200 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
