import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export function usePdfDocument(url: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rendering, setRendering] = useState(false);

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
        const targetWidth = Math.min(containerWidth - 24, 1100);
        const fitScale = (targetWidth / unscaledViewport.width) * scale;
        const viewport = page.getViewport({ scale: fitScale });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

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
    if (pageNum > 1) setPageNum((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (pageNum < numPages) setPageNum((prev) => prev + 1);
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

  return {
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
  };
}
