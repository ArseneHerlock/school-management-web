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
    groupName: 'Bàn làm việc',
    icon: LayoutDashboard,
    href: '/teacher',
  },
  {
    id: 'teaching',
    groupName: 'Giảng dạy',
    icon: CalendarDays,
    items: [
      {
        label: 'Điểm danh lớp',
        href: '/teacher/attendance',
        icon: ClipboardCheck,
      },
      {
        label: 'Thời khóa biểu',
        href: '/teacher/schedule',
        icon: CalendarDays,
      },
      {
        label: 'Đánh giá hoạt động',
        href: '/teacher/assessment',
        icon: Sparkles,
      },
      {
        label: 'Hoạt động sự kiện',
        href: '/teacher/activities',
        icon: CalendarPlus,
      },
    ],
  },
  {
    id: 'care',
    groupName: 'Chăm sóc',
    icon: HeartPulse,
    items: [
      {
        label: 'Đón trả bé',
        href: '/teacher/pickup',
        icon: UserCheck,
      },
      {
        label: 'Sổ dặn thuốc lớp',
        href: '/teacher/medications',
        icon: Pill,
      },
      {
        label: 'Duyệt đơn nghỉ học',
        href: '/teacher/leave',
        icon: FileCheck2,
      },
      {
        label: 'Sức khỏe định kỳ',
        href: '/teacher/health',
        icon: HeartPulse,
      },
    ],
  },
  {
    id: 'evaluation',
    groupName: 'Phát triển học sinh',
    icon: Award,
    items: [
      {
        label: 'Theo dõi rèn luyện',
        href: '/teacher/good-child',
        icon: Award,
      },
      {
        label: 'Hồ sơ phân cụm của lớp',
        href: '/teacher/fcm',
        icon: Layers,
      },
      {
        label: 'Khen thưởng cuối năm',
        href: '/teacher/year-end-awards',
        icon: GraduationCap,
      },
      {
        label: 'Báo cáo của lớp',
        href: '/teacher/bao-cao',
        icon: FileText,
      },
    ],
  },
  {
    id: 'interaction',
    groupName: 'Tương tác gia đình',
    icon: MessageSquare,
    items: [
      {
        label: 'Tin nhắn phụ huynh',
        href: '/teacher/messages',
        icon: MessageSquare,
      },
      {
        label: 'Album ảnh lớp',
        href: '/teacher/album',
        icon: Images,
      },
      {
        label: 'Sản phẩm của bé',
        href: '/teacher/learning',
        icon: BookOpenCheck,
      },
      {
        label: 'Bảng tin thông báo',
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
