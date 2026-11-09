/**
 * Tiện ích xử lý Metadata và Tag của Khoảnh khắc hoạt động học sinh & lớp học
 * Hỗ trợ đồng bộ đa phân hệ: Giáo viên (Lịch, Album, Hoạt động) và Phụ huynh.
 */

export interface ParsedMomentMeta {
  classId?: string;
  className?: string;
  childId?: string;
  childName?: string;
  activityId?: string;
  activityTitle?: string;
  category?: string;
  date?: string; // YYYY-MM-DD
  cleanText: string;
  scope: 'class' | 'child';
}

export const MOMENT_CATEGORIES = [
  'Tất cả',
  'Hoạt động học tập',
  'Vui chơi ngoài trời',
  'Nề nếp - Giấc ngủ',
  'Sự kiện & Dã ngoại',
  'Sáng tạo nghệ thuật',
] as const;

/**
 * Phân tích chuỗi description để trích xuất toàn bộ metadata được mã hoá dạng tag
 */
export function parseMomentDescription(rawDesc?: string, fallbackChildId?: string): ParsedMomentMeta {
  const desc = String(rawDesc || '').trim();

  // [CLASS:id:name]
  let classId: string | undefined;
  let className: string | undefined;
  const classMatch = desc.match(/\[CLASS:([^\]]+)\]/i);
  if (classMatch) {
    const parts = classMatch[1].split(':');
    classId = parts[0]?.trim();
    className = parts[1]?.trim();
  }

  // [CHILD:id:name]
  let childId: string | undefined;
  let childName: string | undefined;
  const childMatch = desc.match(/\[CHILD:([^\]]+)\]/i);
  if (childMatch) {
    const parts = childMatch[1].split(':');
    childId = parts[0]?.trim();
    childName = parts[1]?.trim();
  } else if (fallbackChildId && fallbackChildId !== classId) {
    childId = fallbackChildId;
  }

  // [ACT:id:title]
  let activityId: string | undefined;
  let activityTitle: string | undefined;
  const actMatch = desc.match(/\[ACT:([^\]]+)\]/i);
  if (actMatch) {
    const parts = actMatch[1].split(':');
    activityId = parts[0]?.trim();
    // Tên hoạt động có thể chứa dấu hai chấm nên join lại các phần còn lại
    activityTitle = parts.slice(1).join(':').trim();
  }

  // [CAT:category]
  let category: string | undefined;
  const catMatch = desc.match(/\[CAT:([^\]]+)\]/i);
  if (catMatch) {
    category = catMatch[1]?.trim();
  }

  // [DATE:YYYY-MM-DD]
  let date: string | undefined;
  const dateMatch = desc.match(/\[DATE:([^\]]+)\]/i);
  if (dateMatch) {
    date = dateMatch[1]?.trim();
  }

  // Xác định scope
  const isClassTagged = Boolean(classMatch);
  const isChildTagged = Boolean(childMatch);
  let scope: 'class' | 'child' = 'class';
  if (isChildTagged) {
    scope = 'child';
  } else if (isClassTagged) {
    scope = 'class';
  } else if (fallbackChildId && (!classId || fallbackChildId !== classId)) {
    scope = 'child';
  }

  // Lọc bỏ toàn bộ tag để lấy văn bản thuần
  const cleanText = desc
    .replace(/\[CLASS:[^\]]*\]/gi, '')
    .replace(/\[CHILD:[^\]]*\]/gi, '')
    .replace(/\[ACT:[^\]]*\]/gi, '')
    .replace(/\[CAT:[^\]]*\]/gi, '')
    .replace(/\[DATE:[^\]]*\]/gi, '')
    .trim();

  return {
    classId,
    className,
    childId,
    childName,
    activityId,
    activityTitle,
    category: category || 'Hoạt động học tập',
    date,
    cleanText,
    scope,
  };
}

/**
 * Xây dựng chuỗi description có gắn tag metadata chuẩn hoá
 */
export function buildMomentDescription(options: {
  classId?: string;
  className?: string;
  childId?: string;
  childName?: string;
  activityId?: string;
  activityTitle?: string;
  category?: string;
  date?: string;
  note?: string;
}): string {
  const tags: string[] = [];

  if (options.classId) {
    tags.push(`[CLASS:${options.classId}:${options.className || ''}]`);
  }

  if (options.childId) {
    tags.push(`[CHILD:${options.childId}:${options.childName || ''}]`);
  }

  if (options.activityId || options.activityTitle) {
    tags.push(`[ACT:${options.activityId || ''}:${options.activityTitle || ''}]`);
  }

  if (options.category) {
    tags.push(`[CAT:${options.category}]`);
  }

  if (options.date) {
    tags.push(`[DATE:${options.date}]`);
  }

  const tagPrefix = tags.join(' ');
  const userNote = (options.note || '').trim();

  return tagPrefix ? `${tagPrefix} ${userNote}`.trim() : userNote;
}

/**
 * Chuyển đổi an toàn giá trị ngày bất kỳ (Date object, ISO string, định dạng khác) sang chuỗi YYYY-MM-DD
 */
export function toIsoDateString(val?: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return '';
    return val.toISOString().slice(0, 10);
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.slice(0, 10);
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return s.slice(0, 10);
}

/**
 * Trích xuất tháng/năm từ chuỗi ngày (YYYY-MM-DD hoặc ISO string)
 * Trả về định dạng: "YYYY-MM" (ví dụ: "2026-10")
 */
export function extractMonthKey(dateStr?: any): string {
  if (!dateStr) return '';
  const iso = toIsoDateString(dateStr);
  const m = iso.match(/^(\d{4})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}`;
  return '';
}

/**
 * Định dạng tháng hiển thị người dùng: "Tháng 10/2026"
 */
export function formatMonthLabel(monthKey: string): string {
  if (!monthKey || !monthKey.includes('-')) return monthKey;
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
}
