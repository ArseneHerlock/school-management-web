import { api, normalizeList } from "./client";

export interface NewsArticle {
  id: string;
  tieuDe: string;
  tomTat?: string | null;
  noiDung?: string | null;
  hinhAnh?: string | null;
  phamVi?: number; // 0: Toàn trường, 1: Giáo viên, 2: Phụ huynh
  ngayTao?: string;
  ngayXuatBan?: string;
  xuatBan?: boolean;
  tacGia?: string;
}

export interface CreateNewsInput {
  tieuDe: string;
  tomTat?: string;
  noiDung?: string;
  hinhAnh?: string;
  phamVi?: number;
  xuatBan?: boolean;
}

export async function getNews(params?: {
  trang?: number;
  soLuongMoiTrang?: number;
  phamVi?: number;
  search?: string;
}): Promise<{ items: NewsArticle[]; total: number }> {
  const q = new URLSearchParams();
  q.set("trang", String(params?.trang || 1));
  q.set("soLuongMoiTrang", String(params?.soLuongMoiTrang || 50));
  if (params?.phamVi !== undefined) q.set("phamVi", String(params.phamVi));
  if (params?.search) q.set("search", params.search);

  const res = await api.get<any>("news", `/api/news?${q.toString()}`).catch(() => []);
  const items = normalizeList<NewsArticle>(res);
  const total = typeof res?.total === "number" ? res.total : items.length;
  return { items, total };
}

export async function getNewsById(id: string): Promise<NewsArticle> {
  return await api.get<NewsArticle>("news", `/api/news/${id}`);
}

export async function createNews(data: CreateNewsInput): Promise<NewsArticle> {
  return await api.post<NewsArticle>("news", "/api/news", data);
}

export async function updateNews(id: string, data: Partial<CreateNewsInput>): Promise<NewsArticle> {
  return await api.put<NewsArticle>("news", `/api/news/${id}`, data);
}

export async function deleteNews(id: string): Promise<void> {
  await api.delete("news", `/api/news/${id}`);
}
