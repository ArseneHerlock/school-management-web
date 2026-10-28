import { NewsItem } from '../../types'

export interface ExtendedNewsItem extends NewsItem {
  hinhAnhs?: string[]
}

export function formatDate(value: unknown) {
  if (!value) return ''
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  return date.toLocaleDateString('vi-VN')
}

export function mapNews(news: any): ExtendedNewsItem {
  const rawHinhAnhs = news.hinhAnhs ?? news.HinhAnhs ?? news.hinhAnh ?? news.HinhAnh ?? ''
  const hinhAnhs = typeof rawHinhAnhs === 'string' ? rawHinhAnhs.split(',').filter(Boolean) : Array.isArray(rawHinhAnhs) ? rawHinhAnhs : []

  return {
    id: String(news.id ?? news.Id ?? ''),
    title: news.tieuDe ?? news.TieuDe ?? news.tieu_de ?? 'Thông báo mới',
    category: news.category ?? news.loai ?? 'Thông báo',
    date: formatDate(
      news.ngayXuatBan ??
        news.NgayXuatBan ??
        news.ngayTao ??
        news.NgayTao ??
        news.ngay_xuat_ban ??
        news.ngay_tao
    ),
    summary: news.tomTat ?? news.TomTat ?? news.tom_tat ?? '',
    content:
      news.noiDung ??
      news.NoiDung ??
      news.noi_dung ??
      news.tomTat ??
      news.tom_tat ??
      '',
    hinhAnhs,
    icon: '',
    badge: 'Mới',
    isImportant: true,
  }
}
