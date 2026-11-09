import { useState, useEffect } from 'react';
import { api } from "@/services";
import { getFullApiUrl } from '@/services/client';
import { parseNewsImageAndText } from './newsHelper';

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

export function useNewsDetail(newsId: string) {
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

  return { article, loading, error };
}
