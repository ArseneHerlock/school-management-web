'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  ExternalLink,
  Loader2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { usePdfDocument } from './usePdfDocument';

interface PdfViewerProps {
  url: string;
  title?: string;
}

export default function PdfViewer({ url, title = 'Tài liệu PDF' }: PdfViewerProps) {
  const {
    containerRef,
    canvasRef,
    loading,
    error,
    pdfDoc,
    pageNum,
    numPages,
    scale,
    rendering,
    handlePrevPage,
    handleNextPage,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  } = usePdfDocument(url);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
        <Loader2 className="animate-spin text-rose-600" size={32} />
        <p className="text-xs sm:text-sm font-bold text-slate-700">Đang nạp dữ liệu văn bản tài liệu PDF...</p>
        <p className="text-[11px] text-slate-400">Đang hiển thị trực tiếp trên thiết bị</p>
      </div>
    );
  }

  if (error || !pdfDoc) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
        <AlertCircle size={28} className="text-rose-600 mx-auto" />
        <p className="text-xs sm:text-sm font-bold text-rose-800">{error || 'Không thể hiển thị tài liệu'}</p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-rose-300 text-xs font-bold text-rose-700 hover:bg-rose-50 transition shadow-xs"
          >
            <ExternalLink size={14} /> Mở bằng trình duyệt
          </a>
          <a
            href={url}
            download={title.endsWith('.pdf') ? title : `${title}.pdf`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs"
          >
            <Download size={14} /> Tải tệp về máy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden flex flex-col"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 text-white text-xs border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevPage}
            disabled={pageNum <= 1 || rendering}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Trang trước"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="font-bold px-1.5 text-[11px] sm:text-xs">
            Trang <span className="text-rose-400">{pageNum}</span> / {numPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={pageNum >= numPages || rendering}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            title="Trang sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.75}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            title="Thu nhỏ"
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={handleResetZoom}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition"
            title="Đặt lại kích thước chuẩn"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            disabled={scale >= 2.5}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
            title="Phóng to"
          >
            <ZoomIn size={14} />
          </button>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition ml-1"
            title="Mở toàn màn hình"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="relative min-h-[420px] max-h-[85vh] overflow-auto bg-slate-100 flex items-center justify-center p-2 sm:p-4">
        {rendering && (
          <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 z-10 backdrop-blur-xs">
            <Loader2 size={12} className="animate-spin" />
            <span>Đang vẽ trang {pageNum}...</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-md bg-white max-w-full transition-transform"
        />
      </div>

      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-1.5 truncate">
          <FileText size={14} className="text-rose-600 shrink-0" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={url}
            download={title.endsWith('.pdf') ? title : `${title}.pdf`}
            className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Tải về</span>
          </a>
        </div>
      </div>
    </div>
  );
}
