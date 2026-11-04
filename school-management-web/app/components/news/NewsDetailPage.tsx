'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Share2,
  Edit2,
  Trash2,
  Loader2,
  Download,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { api } from "@/services";
import { getFullApiUrl } from '@/services/client';
import { parseNewsImageAndText, extractPdfUrl } from './newsHelper';
import PdfViewer from './PdfViewer';

export interface NewsDetail {
  id: string;
  tieuDe: string;
  tomTat?: string;
  noiDung?: string;
  hinhAnh?: string;
  hinhAnhs?: string[];
  phamVi?: number;
  trangThai?: number;
  ngayTao?: string;
  ngayXuatBan?: string;
  nhanSuId?: string;
}

interface NewsDetailPageProps {
  newsId: string;
  role: 'admin' | 'teacher' | 'parent';
  onBack: () => void;
  onEdit?: (item: NewsDetail) => void;
  onDelete?: (item: NewsDetail) => void;
}

export default function NewsDetailPage({
  newsId,
  role,
  onBack,
  onEdit,
  onDelete,
}: NewsDetailPageProps) {
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    api
      .get<any>('news', `/api/news/${newsId}`)
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || res;
        const rawTomTat = data.tomTat || data.summary || '';
        const rawNoiDung = data.noiDung || data.content || rawTomTat;
        const fromTomTat = parseNewsImageAndText(rawTomTat);
        const fromNoiDung = parseNewsImageAndText(rawNoiDung);
        let img = data.hinhAnh || data.imageUrl || fromNoiDung.imageUrl || fromTomTat.imageUrl || null;
        if (img && !img.includes('unsplash.com')) {
          img = getFullApiUrl(img.replace(/-+$/, ''));
        } else {
          img = undefined;
        }

        setArticle({
          id: data.id || newsId,
          tieuDe: data.tieuDe || data.title || 'Tin tức nhà trường',
          tomTat: fromTomTat.cleanText,
          noiDung: fromNoiDung.cleanText || fromTomTat.cleanText || data.noiDung,
          hinhAnh: img,
          hinhAnhs: img ? [img] : [],
          phamVi: data.phamVi,
          trangThai: data.trangThai,
          ngayTao: data.ngayTao || data.createdAt,
          ngayXuatBan: data.ngayXuatBan || data.publishedAt,
          nhanSuId: data.nhanSuId,
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Không tải được nội dung bài viết');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [newsId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs font-sans my-4">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-3" size={32} />
        <p className="text-sm font-semibold text-slate-600">Đang tải nội dung văn bản...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center shadow-xs font-sans space-y-4 my-4">
        <p className="text-sm font-bold text-rose-700">{error || 'Không tìm thấy bài viết này.'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition"
        >
          <ArrowLeft size={14} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const dateStr = article.ngayTao || article.ngayXuatBan;
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  // Detect whether content is a PDF document
  const rawContent = article.noiDung || article.tomTat || '';
  const detectedPdfUrl = extractPdfUrl(article.noiDung) || extractPdfUrl(article.tomTat);
  const isPdfContent =
    Boolean(detectedPdfUrl) ||
    rawContent.includes('.pdf') ||
    rawContent.startsWith('data:application/pdf') ||
    rawContent.includes('/api/backend/media') ||
    rawContent.includes('application/pdf');

  let pdfUrl = detectedPdfUrl || (isPdfContent ? extractPdfUrl(rawContent) || '' : '');
  if (pdfUrl) {
    pdfUrl = getFullApiUrl(pdfUrl);
  }

  return (
    <article className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 space-y-4 font-sans overflow-x-hidden">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 transition cursor-pointer shrink-0"
          >
            <ArrowLeft size={15} />
            <span>Quay lại</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 truncate">
              {article.tieuDe}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-blue-600" />
                {formattedDate || 'Mới phát hành'}
              </span>
              <span>·</span>
              <span className="text-slate-400">Ban Giám Hiệu</span>
              {article.phamVi !== undefined && (
                <>
                  <span>·</span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                    {article.phamVi === 1
                      ? 'Nội bộ Giáo viên'
                      : article.phamVi === 2
                      ? 'Dành cho Phụ huynh'
                      : 'Toàn trường'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={article.tieuDe ? `${article.tieuDe}.pdf` : 'tin_tuc.pdf'}
              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white transition shadow-2xs cursor-pointer"
              title="Tải tệp PDF về máy"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Tải về PDF</span>
            </a>
          )}

          {role === 'admin' && (
            <>
              {onEdit && (
                <button
                  onClick={() => onEdit(article)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span className="hidden sm:inline">Sửa</span>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(article)}
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-700 transition cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span className="hidden sm:inline">Xóa</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết bài viết');
              }
            }}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition cursor-pointer"
            title="Sao chép liên kết"
          >
            <Share2 size={13} />
          </button>
        </div>
      </div>

      {/* Featured Banner Image */}
      {article.hinhAnh && (
        <div className="w-full max-h-72 sm:max-h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
          <img
            src={article.hinhAnh}
            alt={article.tieuDe}
            className="w-full h-full max-h-72 sm:max-h-96 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Summary Excerpt Callout */}
      {article.tomTat && !article.tomTat.startsWith('/api') && (
        <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50/70 p-3.5 sm:p-4 text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed shadow-2xs">
          {article.tomTat}
        </div>
      )}

      {/* Main Content Area: High-Fidelity Canvas PDF VIEWER or REGULAR TEXT */}
      {isPdfContent && pdfUrl ? (
        <div className="space-y-4">
          {/* PDF Action Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 p-3.5 sm:p-4 rounded-2xl border border-rose-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileText size={22} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  {article.tomTat && article.tomTat.includes('.pdf')
                    ? article.tomTat
                    : `${article.tieuDe}.pdf`}
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  Tài liệu văn bản PDF chính thức từ Ban Giám Hiệu
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-rose-300 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 transition shadow-2xs cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>Mở xem tài liệu</span>
              </a>
              <a
                href={pdfUrl}
                download={article.tieuDe ? `${article.tieuDe}.pdf` : 'tai_lieu.pdf'}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs cursor-pointer"
              >
                <Download size={14} />
                <span>Tải về</span>
              </a>
            </div>
          </div>

          {/* High-Fidelity Native Canvas PDF Viewer: Renders real PDF pages on all devices */}
          <PdfViewer url={pdfUrl} title={article.tieuDe} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-4">
          <div className="text-xs sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            {article.noiDung || article.tomTat || 'Nội dung chi tiết đang được cập nhật.'}
          </div>
        </div>
      )}
    </article>
  );
}
