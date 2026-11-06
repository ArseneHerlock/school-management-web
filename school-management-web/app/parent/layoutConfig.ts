export function formatNewsDate(value: unknown): string {
  if (!value) return '';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString('vi-VN');
}

export const PARENT_HEADERS: Record<string, string> = {
  dashboard: 'Sổ liên lạc điện tử',
  attendance: 'Sổ theo dõi chuyên cần',
  pickup: 'Đón trả trẻ & Người đưa đón',
  assessment: 'Đánh giá sự phát triển của trẻ',
  learning: 'Góc trưng bày sản phẩm của bé',
  schedule: 'Thời khóa biểu & Lịch sinh hoạt',
  'good-child': 'Theo dõi bé ngoan hàng tuần',
  health: 'Khám sức khỏe & Biểu đồ tăng trưởng',
  progress: 'Sổ theo dõi sự phát triển',
  messages: 'Trao đổi với giáo viên',
  absence: 'Đơn xin phép nghỉ học',
  moments: 'Nhật ký hoạt động của bé',
  news: 'Bản tin & Thông báo nhà trường',
  tuition: 'Học phí & Tiền ăn bán trú',
  medications: 'Sổ theo dõi & Dặn thuốc',
};
