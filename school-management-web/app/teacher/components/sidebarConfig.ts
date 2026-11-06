import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  Sparkles,
  CalendarPlus,
  FileCheck2,
  HeartPulse,
  Pill,
  Award,
  MessageSquare,
  Images,
  BookOpenCheck,
  Bell,
  UserCircle,
  GraduationCap,
  UserCheck,
  TrendingUp,
  FileText,
  BarChart3,
  Layers,
} from 'lucide-react';

export interface SidebarSubItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

export interface SidebarGroup {
  id: string;
  groupName: string;
  icon: React.ElementType;
  href?: string;
  items?: SidebarSubItem[];
}

export const navigationGroups: SidebarGroup[] = [
  {
    id: 'dashboard',
    groupName: 'Tổng quan lớp học',
    icon: LayoutDashboard,
    href: '/teacher',
  },
  {
    id: 'teaching',
    groupName: 'Nghiệp vụ sư phạm',
    icon: CalendarDays,
    items: [
      {
        label: 'Sổ theo dõi chuyên cần',
        href: '/teacher/attendance',
        icon: ClipboardCheck,
      },
      {
        label: 'Thời khóa biểu & Lịch sinh hoạt',
        href: '/teacher/schedule',
        icon: CalendarDays,
      },
      {
        label: 'Đánh giá sự phát triển của trẻ',
        href: '/teacher/assessment',
        icon: Sparkles,
      },
      {
        label: 'Kế hoạch hoạt động & Sự kiện',
        href: '/teacher/activities',
        icon: CalendarPlus,
      },
    ],
  },
  {
    id: 'care',
    groupName: 'Chăm sóc & Nuôi dưỡng',
    icon: HeartPulse,
    items: [
      {
        label: 'Sổ đón trả trẻ & Người đưa đón',
        href: '/teacher/pickup',
        icon: UserCheck,
      },
      {
        label: 'Sổ theo dõi & Dặn thuốc',
        href: '/teacher/medications',
        icon: Pill,
      },
      {
        label: 'Sổ theo dõi nghỉ phép',
        href: '/teacher/leave',
        icon: FileCheck2,
      },
      {
        label: 'Khám sức khỏe & Biểu đồ tăng trưởng',
        href: '/teacher/health',
        icon: HeartPulse,
      },
    ],
  },
  {
    id: 'evaluation',
    groupName: 'Thi đua & Đánh giá',
    icon: Award,
    items: [
      {
        label: 'Theo dõi bé ngoan hàng tuần',
        href: '/teacher/good-child',
        icon: Award,
      },
      {
        label: 'Hồ sơ năng lực học sinh',
        href: '/teacher/fcm',
        icon: Layers,
      },
      {
        label: 'Tổng kết & Khen thưởng cuối năm',
        href: '/teacher/year-end-awards',
        icon: GraduationCap,
      },
      {
        label: 'Báo cáo chuyên môn lớp',
        href: '/teacher/bao-cao',
        icon: FileText,
      },
    ],
  },
  {
    id: 'interaction',
    groupName: 'Liên lạc Phụ huynh',
    icon: MessageSquare,
    items: [
      {
        label: 'Sổ liên lạc & Tin nhắn',
        href: '/teacher/messages',
        icon: MessageSquare,
      },
      {
        label: 'Nhật ký hoạt động & Album ảnh',
        href: '/teacher/album',
        icon: Images,
      },
      {
        label: 'Góc sản phẩm của bé',
        href: '/teacher/learning',
        icon: BookOpenCheck,
      },
      {
        label: 'Bản tin & Thông báo lớp',
        href: '/teacher/news',
        icon: Bell,
      },
    ],
  },
  {
    id: 'profile',
    groupName: 'Hồ sơ giáo viên',
    icon: UserCircle,
    href: '/teacher/profile',
  },
];
