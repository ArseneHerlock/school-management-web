'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  RotateCw,
} from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title?: string;
}

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export default function PdfViewer({ url, title = 'Tài liệu PDF' }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rendering, setRendering] = useState(false);

  // 1. Load PDF.js library from bundled /pdfjs/pdf.min.js
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError('');

    const loadLib = async () => {
      try {
        if (!window.pdfjsLib) {
          const script = document.createElement('script');
          script.src = '/pdfjs/pdf.min.js';
          script.async = true;
          await new Promise<void>((resolve, reject) => {
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Không thể tải thư viện đọc PDF'));
            document.body.appendChild(script);
          });
        }

        if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
        }

        const loadingTask = window.pdfjsLib.getDocument({
          url,
          withCredentials: false,
        });

        const doc = await loadingTask.promise;
        if (!isMounted) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setPageNum(1);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('PDF loading error:', err);
        setError(err?.message || 'Không thể đọc tệp PDF trực tiếp.');
        setLoading(false);
      }
    };

    void loadLib();

    return () => {
      isMounted = false;
    };
  }, [url]);

  // 2. Render current page to canvas whenever pageNum, scale, or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
    let cancelled = false;

    const renderPage = async () => {
      setRendering(true);
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;

        const containerWidth = containerRef.current?.clientWidth || 360;
        const unscaledViewport = page.getViewport({ scale: 1 });
        // Auto fit width to container with margin
        const targetWidth = Math.min(containerWidth - 24, 1100);
        const fitScale = (targetWidth / unscaledViewport.width) * scale;
        const viewport = page.getViewport({ scale: fitScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Support high DPI screens (retina / modern mobile phones)
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        const renderContext = {
          canvasContext: context,
          transform: transform || undefined,
          viewport,
        };

        await page.render(renderContext).promise;
      } catch (err: any) {
        if (!cancelled) {
          console.error('Page render error:', err);
        }
      } finally {
        if (!cancelled) setRendering(false);
      }
    };

    void renderPage();

    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, scale]);

  const handlePrevPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const handleNextPage = () => {
    if (pageNum < numPages) setPageNum(pageNum + 1);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

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
      {/* PDF Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-2 text-white text-xs border-b border-slate-800 shrink-0">
        {/* Page navigation */}
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

        {/* Zoom and view controls */}
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

      {/* Canvas View Container with horizontal/vertical scrolling if zoomed */}
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

      {/* Footer document details */}
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
