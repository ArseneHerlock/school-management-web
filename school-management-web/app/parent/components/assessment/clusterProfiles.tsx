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
  homeCompanionTips: string[];
}

export const CLUSTER_PROFILES: Record<number, ClusterProfile> = {
  1: {
    clusterId: 1,
    title: 'Nhóm 1: Phát triển Nổi trội & Toàn diện',
    subTitle: 'Năng lực toàn diện vượt chuẩn độ tuổi',
    levelBadge: 'Nổi trội toàn diện',
    themeColor: '#059669', // emerald-600
    themeLightBg: 'from-emerald-50 via-teal-50/50 to-white',
    themeBorder: 'border-emerald-200',
    themeText: 'text-emerald-900',
    themePillBg: 'bg-emerald-100 text-emerald-800',
    icon: <Award className="text-emerald-600" size={24} />,
    pedagogicalSummary:
      'Bé thể hiện năng lực nổi trội và đồng đều ở cả 5 lĩnh vực phát triển. Khả năng tư duy logic nhanh nhạy, kỹ năng ngôn ngữ phong phú và tương tác xã hội rất tự tin, luôn chủ động tham gia hoạt động lớp.',
    strengthsText: 'Nhận thức nhạy bén, diễn đạt tự tin, tự lập cao và biết quan tâm bạn bè.',
    supportAreasText: 'Tiếp tục bồi dưỡng phát huy năng khiếu sở trường và khả năng sáng tạo mở rộng.',
    homeCompanionTips: [
      'Khuyến khích bé đọc sách tranh phong phú và khuyến khích con kể lại câu chuyện theo ngôn từ sáng tạo riêng của mình.',
      'Tạo điều kiện cho bé tham gia các hoạt động ngoại khóa năng khiếu (vẽ, đàn, thể thao, khám phá khoa học).',
      'Khen ngợi sự kiên trì, nỗ lực và tinh thần giúp đỡ bạn bè của con thay vì chỉ khen ngợi sự thông minh.',
    ],
  },
  2: {
    clusterId: 2,
    title: 'Nhóm 2: Phát triển Tốt & Đạt chuẩn',
    subTitle: 'Đạt chuẩn tốt tất cả mục tiêu lứa tuổi',
    levelBadge: 'Đạt chuẩn phát triển',
    themeColor: '#2563eb', // blue-600
    themeLightBg: 'from-blue-50 via-sky-50/50 to-white',
    themeBorder: 'border-blue-200',
    themeText: 'text-blue-900',
    themePillBg: 'bg-blue-100 text-blue-800',
    icon: <Award className="text-blue-600" size={24} />,
    pedagogicalSummary:
      'Bé đạt chuẩn hầu hết các chỉ tiêu theo độ tuổi mầm non, bắt nhịp rất tốt với chương trình học tập và nề nếp sinh hoạt. Bé thể hiện sự hứng thú, vui vẻ và phát triển lành mạnh cả về thể chất lẫn nhận thức.',
    strengthsText: 'Nề nếp tốt, tiếp thu bài học đều đặn, vui vẻ hòa đồng với cô giáo và bạn bè.',
    supportAreasText: 'Khuyến khích bé tự tin phát biểu ý kiến cá nhân và rèn luyện thêm tính kiên nhẫn.',
    homeCompanionTips: [
      'Trò chuyện hàng ngày cùng con về một ngày ở trường, đặt câu hỏi gợi mở "vì sao", "con cảm thấy thế nào".',
      'Tập cho con thói quen tự lập như tự dọn dẹp đồ chơi sau khi chơi, tự cất giày dép, tự rửa tay trước khi ăn.',
      'Cùng bé tham gia vận động ngoài trời 30 phút mỗi ngày để tăng cường thể lực và sự dẻo dai.',
    ],
  },
  3: {
    clusterId: 3,
    title: 'Nhóm 3: Đang phát triển tích cực (Tiệm cận chuẩn)',
    subTitle: 'Đang tiệm cận chuẩn, cần củng cố kỹ năng',
    levelBadge: 'Tiệm cận chuẩn',
    themeColor: '#d97706', // amber-600
    themeLightBg: 'from-amber-50 via-orange-50/40 to-white',
    themeBorder: 'border-amber-200',
    themeText: 'text-amber-950',
    themePillBg: 'bg-amber-100 text-amber-800',
    icon: <Compass className="text-amber-600" size={24} />,
    pedagogicalSummary:
      'Bé đang trên đà tiệm cận chuẩn độ tuổi, đã đạt được một số tiêu chí cơ bản nhưng cần thêm thời gian để củng cố về vận động tinh, khả năng diễn đạt ngôn ngữ hoặc sự tự tin khi sinh hoạt tập thể.',
    strengthsText: 'Có tinh thần cố gắng, làm quen tốt với nề nếp lớp học, có tiến bộ khi được hướng dẫn.',
    supportAreasText: 'Cần bồi dưỡng thêm khả năng tập trung chú ý và mở rộng vốn từ vựng giao tiếp.',
    homeCompanionTips: [
      'Dành thời gian đọc sách cùng con mỗi tối, chỉ tay vào từng từ và hình vẽ để kích thích ngôn ngữ của bé.',
      'Chơi các trò chơi rèn luyện vận động tinh như nặn đất sét, xếp hình lego, xâu hạt cùng con.',
      'Thường xuyên khích lệ, khen ngợi từng tiến bộ nhỏ nhất của con để xây dựng lòng tự tin.',
    ],
  },
  4: {
    clusterId: 4,
    title: 'Nhóm 4: Cần cô giáo & gia đình đồng hành rèn luyện',
    subTitle: 'Cần cô giáo và gia đình sát cánh đồng hành',
    levelBadge: 'Cần hỗ trợ sát sao',
    themeColor: '#e11d48', // rose-600
    themeLightBg: 'from-rose-50 via-pink-50/40 to-white',
    themeBorder: 'border-rose-200',
    themeText: 'text-rose-950',
    themePillBg: 'bg-rose-100 text-rose-800',
    icon: <Heart className="text-rose-600" size={24} />,
    pedagogicalSummary:
      'Chỉ số quan sát cho thấy bé đang gặp một số khó khăn nhất định ở giai đoạn này (về ngôn ngữ, thể chất hoặc khả năng hòa nhập). Đây là thời điểm vàng để nhà trường và gia đình phối hợp hỗ trợ can thiệp sớm.',
    strengthsText: 'Bé có thế mạnh cảm xúc riêng và đáp ứng rất tốt khi nhận được sự quan tâm ấm áp.',
    supportAreasText: 'Cần lộ trình hỗ trợ cá nhân hóa từ giáo viên kết hợp rèn luyện kiên nhẫn tại nhà.',
    homeCompanionTips: [
      'Chủ động liên hệ với cô giáo chủ nhiệm để thống nhất kế hoạch rèn luyện cá nhân hóa dành riêng cho con.',
      'Tạo môi trường gia đình ấm áp, kiên nhẫn lắng nghe, hạn chế tối đa việc cho bé xem thiết bị điện tử.',
      'Khuyến khích bé giao tiếp bằng mắt và lặp lại các câu ngắn đơn giản trong các hoạt động sinh hoạt gia đình.',
    ],
  },
};
