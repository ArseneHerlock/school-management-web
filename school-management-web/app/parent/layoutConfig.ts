export function formatNewsDate(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString('vi-VN');
}

export const PARENT_HEADERS: Record<string, string> = {
  dashboard: 'Tổng quan Phụ Huynh',
  attendance: 'Điểm danh chuyên cần',
  pickup: 'Người đón bé',
  assessment: 'Đánh giá Phát triển Trẻ',
  learning: 'Sản phẩm học tập của bé',
  schedule: 'Lịch học tuần',
  'good-child': 'Theo dõi rèn luyện',
  health: 'Sức khoẻ thể chất',
  progress: 'Tiến độ phát triển',
  messages: 'Liên lạc thông báo',
  absence: 'Quản lý Đơn nghỉ học',
  moments: 'Khoảnh khắc lớp',
  news: 'Tin tức nhà trường',
  tuition: 'Thanh toán Học phí',
};
