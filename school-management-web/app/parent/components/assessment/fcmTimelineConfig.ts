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
    name: 'Cụm 1: Phát triển Toàn diện / Vượt trội',
    shortName: 'Toàn diện - Vượt trội',
    color: '#8b5cf6',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    desc: 'Bé thể hiện năng lực toàn diện nổi bật ở cả 5 lĩnh vực phát triển',
    encouragement: 'Bé thể hiện năng lực toàn diện rất tốt, hòa đồng và tiếp thu nhanh!',
  },
  2: {
    name: 'Cụm 2: Phát triển Đạt chuẩn / Vững vàng',
    shortName: 'Đạt chuẩn vững vàng',
    color: '#10b981',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Đạt chuẩn vững vàng các lĩnh vực cốt lõi độ tuổi',
    encouragement: 'Bé phát triển đều đặn, tích cực tham gia các bài học và hoạt động vui chơi!',
  },
  3: {
    name: 'Cụm 3: Phát triển Không đồng đều / Lệch pha',
    shortName: 'Không đồng đều',
    color: '#f59e0b',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    desc: 'Phát triển khá nhưng có độ vênh giữa các lĩnh vực',
    encouragement: 'Bé đang trên đà phát triển tốt, tiếp tục đồng hành cùng con!',
  },
  4: {
    name: 'Cụm 4: Có nguy cơ chậm phát triển / Cần hỗ trợ can thiệp sớm',
    shortName: 'Cần hỗ trợ',
    color: '#ef4444',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    desc: 'Cần cô giáo và gia đình phối hợp hỗ trợ can thiệp sớm',
    encouragement: 'Nhà trường và gia đình sẽ cùng phối hợp để hỗ trợ bé tiến bộ mỗi ngày.',
  },
};
