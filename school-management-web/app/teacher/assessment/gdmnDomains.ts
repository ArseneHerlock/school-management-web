/**
 * 5 Lĩnh vực phát triển chuẩn Giáo dục Mầm non (Ban hành theo Thông tư số 17/2009/TT-BGDĐT & TT 51/2020/TT-BGDĐT)
 */
export interface StandardDomain {
  id: string;
  code: string;
  name: string;
  shortName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: 'Activity' | 'Brain' | 'MessageSquare' | 'Heart' | 'Palette';
  description: string;
  keywords: string[];
}

export const GDMN_5_DOMAINS: StandardDomain[] = [
  {
    id: 'd62c00ba-1aa1-3e6b-4795-b37a42099c76',
    code: 'GDMN-PHYSICAL',
    name: 'Phát triển Thể chất',
    shortName: 'Thể chất',
    color: '#10b981',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'Activity',
    description: 'Vận động thô, vận động tinh, dinh dưỡng và nền nếp sức khỏe',
    keywords: ['thể chất', 'vận động', 'chuyền bóng', 'chạy', 'nhảy', 'thăng bằng', 'sức khỏe', 'đi theo đường', 'bóng'],
  },
  {
    id: 'f12a3fb0-6832-38cf-470d-3b97b70b238f',
    code: 'GDMN-COGNITION',
    name: 'Phát triển Nhận thức',
    shortName: 'Nhận thức',
    color: '#0284c7',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconName: 'Brain',
    description: 'Khám phá khoa học, đồ vật, hiện tượng và làm quen toán học sơ đẳng',
    keywords: ['nhận thức', 'khám phá', 'so sánh', 'phân loại', 'đồ vật', 'toán', 'thử nghiệm', 'hình học', 'đếm'],
  },
  {
    id: 'c7e896f7-1630-6b39-a0bb-21554638bc85',
    code: 'GDMN-LANGUAGE',
    name: 'Phát triển Ngôn ngữ',
    shortName: 'Ngôn ngữ',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    iconName: 'MessageSquare',
    description: 'Nghe hiểu lời nói, diễn đạt giao tiếp và làm quen chữ cái, đọc viết',
    keywords: ['ngôn ngữ', 'kể chuyện', 'trình tự', 'tranh', 'thơ', 'diễn đạt', 'lắng nghe', 'chữ cái', 'lời nói'],
  },
  {
    id: '8b2f117b-2183-d6f3-0937-e7cd680bfa2b',
    code: 'GDMN-SOCIAL-EMOTIONAL',
    name: 'Tình cảm & Kỹ năng xã hội',
    shortName: 'Tình cảm - Xã hội',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    iconName: 'Heart',
    description: 'Ý thức bản thân, hòa đồng chia sẻ, chờ đến lượt và tuân thủ nền nếp',
    keywords: ['tình cảm', 'kỹ năng xã hội', 'chơi cùng bạn', 'chờ đến lượt', 'nhóm', 'tình huống', 'hợp tác', 'chia sẻ'],
  },
  {
    id: '65056cb0-8c7a-3fb6-e64b-d62a855ad2dc',
    code: 'GDMN-AESTHETIC',
    name: 'Phát triển Thẩm mỹ',
    shortName: 'Thẩm mỹ',
    color: '#f43f5e',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconName: 'Palette',
    description: 'Cảm thụ âm nhạc, múa hát, hội họa tạo hình và sáng tạo nghệ thuật',
    keywords: ['thẩm mỹ', 'thẩm mĩ', 'hát', 'âm nhạc', 'tạo hình', 'sáng tạo', 'sản phẩm', 'vẽ', 'nặn', 'xé dán'],
  },
];

export function resolveStandardDomain(item: any): StandardDomain {
  if (!item) return GDMN_5_DOMAINS[0];
  const code = (item.code || item.domainCode || '').toUpperCase();
  const name = (item.name || item.domainName || '').toLowerCase();

  if (code.includes('PTTCXH') || code.includes('GDMN-SOCIAL-EMOTIONAL') || code.includes('SOCIAL')) {
    return GDMN_5_DOMAINS[3];
  }
  if ((code.includes('PTTC') && !code.includes('PTTCXH')) || code.includes('GDMN-PHYSICAL') || code.includes('PHYSICAL')) {
    return GDMN_5_DOMAINS[0];
  }
  if (code.includes('PTNT') || code.includes('GDMN-COGNITION') || code.includes('COGNITION')) {
    return GDMN_5_DOMAINS[1];
  }
  if (code.includes('PTNN') || code.includes('GDMN-LANGUAGE') || code.includes('LANGUAGE')) {
    return GDMN_5_DOMAINS[2];
  }
  if (code.includes('PTTM') || code.includes('GDMN-AESTHETIC') || code.includes('AESTHETIC')) {
    return GDMN_5_DOMAINS[4];
  }

  for (const d of GDMN_5_DOMAINS) {
    if (d.keywords.some((kw) => name.includes(kw))) {
      return d;
    }
  }

  return GDMN_5_DOMAINS[0];
}
