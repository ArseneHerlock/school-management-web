export const PRODUCT_CATEGORIES = [
  'Mỹ thuật & Tạo hình',
  'Làm quen chữ viết & Đọc thơ',
  'Khám phá & Toán học',
  'Vận động & Kỹ năng sống',
  'Hoạt động học tập',
  'Vui chơi ngoài trời',
  'Sự kiện & Dã ngoại',
  'Sản phẩm tự chọn khác',
];

export interface LearningProductItem {
  id: string;
  childId: string;
  activityId?: string | null;
  mediaId: string;
  title: string;
  description?: string;
  createdBy?: string;
  createdAtUtc?: string;
}

export interface EnrichedLearningProduct extends LearningProductItem {
  cleanDesc: string;
  dateStr: string;
  monthKey: string;
  category: string;
  resolvedActId: string;
  resolvedActTitle: string;
  displayTitle: string;
}
