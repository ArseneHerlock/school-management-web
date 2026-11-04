export interface FCMHistoryItem {
  Id: string;
  ChildId: string;
  Month: number;
  Year: number;
  ClusterId: number;
  ClusterName: string;
  PreviousClusterId?: number | null;
  Trend?: string | null;
  Memberships?: Record<string, number> | null;
  RadarScores?: Record<string, number> | null;
}

export const CLUSTER_CONFIG: Record<
  number,
  {
    name: string;
    shortName: string;
    color: string;
    bg: string;
    border: string;
    desc: string;
    encouragement: string;
  }
> = {
  1: {
    name: 'Cụm 1: Phát triển chuẩn và nổi trội',
    shortName: 'Chuẩn - Nổi trội',
    color: '#10b981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Đạt chuẩn và vượt các chỉ tiêu phát triển 5 lĩnh vực',
    encouragement: 'Bé thể hiện năng lực toàn diện rất tốt, hòa đồng và tiếp thu nhanh!',
  },
  2: {
    name: 'Cụm 2: Phát triển mức khá',
    shortName: 'Mức khá',
    color: '#3b82f6',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Đạt chuẩn hầu hết các chỉ tiêu độ tuổi',
    encouragement: 'Bé phát triển đều đặn, tích cực tham gia các bài học và hoạt động vui chơi!',
  },
  3: {
    name: 'Cụm 3: Phát triển mức trung bình',
    shortName: 'Tiệm cận chuẩn',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Đang tiệm cận chuẩn, cần củng cố thêm một số chỉ tiêu',
    encouragement: 'Bé đang trên đà phát triển tốt, cha mẹ hãy dành thêm thời gian trò chuyện cùng con!',
  },
  4: {
    name: 'Cụm 4: Cần theo dõi và đồng hành',
    shortName: 'Cần đồng hành',
    color: '#f43f5e',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    desc: 'Cần sự hỗ trợ tích cực từ cô giáo và cha mẹ',
    encouragement: 'Mỗi bé có nhịp điệu phát triển riêng, cô giáo và gia đình luôn bên cạnh động viên con!',
  },
};
