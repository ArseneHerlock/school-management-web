import React from 'react';
import { Award, Compass, Heart } from 'lucide-react';

export interface FCMHistoryItem {
  Id?: string;
  id?: string;
  ChildId?: string;
  childId?: string;
  ClassId?: string;
  Month?: number;
  month?: number;
  Year?: number;
  year?: number;
  ClusterId?: number;
  clusterId?: number;
  ClusterName?: string;
  clusterName?: string;
  PreviousClusterId?: number | null;
  previousClusterId?: number | null;
  Trend?: string | null;
  trend?: string | null;
  Memberships?: any;
  RadarScores?: any;
  CreatedAt?: string;
}

export interface ClusterProfile {
  clusterId: number;
  title: string;
  subTitle: string;
  levelBadge: string;
  themeColor: string;
  themeLightBg: string;
  themeBorder: string;
  themeText: string;
  themePillBg: string;
  icon: React.ReactNode;
  pedagogicalSummary: string;
  strengthsText: string;
  supportAreasText: string;
}

export const CLUSTER_PROFILES: Record<number, ClusterProfile> = {
  1: {
    clusterId: 1,
    title: 'Cụm 1: Phát triển Toàn diện / Vượt trội',
    subTitle: 'Năng lực toàn diện vượt chuẩn độ tuổi',
    levelBadge: 'Toàn diện vượt trội',
    themeColor: '#059669', // emerald-600
    themeLightBg: 'from-emerald-50 via-teal-50/50 to-white',
    themeBorder: 'border-emerald-200',
    themeText: 'text-emerald-900',
    themePillBg: 'bg-emerald-100 text-emerald-800',
    icon: <Award className="text-emerald-600" size={24} />,
    pedagogicalSummary:
      'Bé thể hiện năng lực nổi trội và đồng đều ở cả 5 lĩnh vực phát triển. Khả năng tư duy nhanh nhạy, kỹ năng ngôn ngữ phong phú và thẩm mỹ sáng tạo xuất sắc.',
    strengthsText: 'Nhận thức nhạy bén, diễn đạt tự tin, tự lập cao và thẩm mỹ nổi trội.',
    supportAreasText: 'Duy trì mở rộng tiềm năng và tham gia các hoạt động năng khiếu.',
  },
  2: {
    clusterId: 2,
    title: 'Cụm 2: Phát triển Đạt chuẩn / Vững vàng',
    subTitle: 'Đạt chuẩn vững vàng các mục tiêu lứa tuổi',
    levelBadge: 'Đạt chuẩn vững vàng',
    themeColor: '#2563eb', // blue-600
    themeLightBg: 'from-blue-50 via-sky-50/50 to-white',
    themeBorder: 'border-blue-200',
    themeText: 'text-blue-900',
    themePillBg: 'bg-blue-100 text-blue-800',
    icon: <Award className="text-blue-600" size={24} />,
    pedagogicalSummary:
      'Bé đạt chuẩn vững vàng 4 lĩnh vực cốt lõi (Thể chất, Nhận thức, Ngôn ngữ, Xã hội), bắt nhịp rất tốt với chương trình học tập và nề nếp sinh hoạt lớp.',
    strengthsText: 'Nề nếp tốt, tiếp thu bài học đều đặn, vui vẻ hòa đồng với cô giáo và bạn bè.',
    supportAreasText: 'Tiếp tục rèn luyện thêm thẩm mỹ sáng tạo và sự kiên nhẫn.',
  },
  3: {
    clusterId: 3,
    title: 'Cụm 3: Phát triển Không đồng đều / Lệch pha',
    subTitle: 'Phát triển khá nhưng có độ vênh giữa các lĩnh vực',
    levelBadge: 'Không đồng đều',
    themeColor: '#d97706', // amber-600
    themeLightBg: 'from-amber-50 via-orange-50/40 to-white',
    themeBorder: 'border-amber-200',
    themeText: 'text-amber-950',
    themePillBg: 'bg-amber-100 text-amber-800',
    icon: <Compass className="text-amber-600" size={24} />,
    pedagogicalSummary:
      'Bé có nhận thức và vận động thể chất khá tốt nhưng kỹ năng cảm xúc, tương tác xã hội hoặc ngôn ngữ diễn đạt còn chậm hơn, cần được rèn luyện có mục tiêu.',
    strengthsText: 'Tư duy nhận thức tốt, vận động nhanh nhẹn.',
    supportAreasText: 'Tập trung rèn luyện giao tiếp xã hội, kiên nhẫn chờ đến lượt và điều hòa cảm xúc.',
  },
  4: {
    clusterId: 4,
    title: 'Cụm 4: Có nguy cơ chậm phát triển / Cần hỗ trợ can thiệp sớm',
    subTitle: 'Cần cô giáo và gia đình phối hợp hỗ trợ',
    levelBadge: 'Cần hỗ trợ',
    themeColor: '#dc2626', // rose-600
    themeLightBg: 'from-rose-50 via-red-50/40 to-white',
    themeBorder: 'border-rose-200',
    themeText: 'text-rose-950',
    themePillBg: 'bg-rose-100 text-rose-800',
    icon: <Heart className="text-rose-600" size={24} />,
    pedagogicalSummary:
      'Bé chưa đạt một số mốc phát triển quan trọng theo độ tuổi, cần cô giáo và gia đình phối hợp sát sao để hỗ trợ bé từng bước bắt kịp các bạn.',
    strengthsText: 'Có tình cảm, tiếp nhận được hướng dẫn khi được đồng hành 1-1.',
    supportAreasText: 'Cần hỗ trợ tăng cường về ngôn ngữ, nhận thức và tự phục vụ hàng ngày.',
  },
};
