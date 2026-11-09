'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChildInfo, ParentProfile } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Award,
  HeartPulse,
  MessageSquareText,
  CalendarOff,
  WalletCards,
  Image as ImageIcon,
  Newspaper,
  ClipboardCheck,
  Sparkles,
  Pill,
  ChevronDown,
  X,
  User,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { logout } from '@/services';

interface ParentSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  child: ChildInfo;
  parent: ParentProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  unreadMessagesCount?: number;
}

interface SubNavItem {
  id: string;
  label: string;
  href: string;
  badge?: string | number;
  badgeColor?: string;
}

interface NavGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SubNavItem[];
}

export default function ParentSidebar({
  child,
  parent,
  isOpen,
  onClose,
  onOpenProfile,
  unreadMessagesCount = 0,
}: ParentSidebarProps) {
  const pathname = usePathname();

  // Menu chuẩn hóa nghiệp vụ Sư phạm Mầm non dành cho Phụ huynh
  const navGroups: NavGroup[] = [
    {
      id: 'dashboard',
      label: 'Sổ liên lạc điện tử',
      href: '/parent',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'learning-group',
      label: 'Học tập & Hoạt động',
      icon: <GraduationCap size={18} />,
      subItems: [
        { id: 'schedule', label: 'Thời khóa biểu & Lịch sinh hoạt', href: '/parent/schedule' },
        { id: 'moments', label: 'Nhật ký hoạt động của bé', href: '/parent/moments' },
        { id: 'learning', label: 'Góc sản phẩm của bé', href: '/parent/learning' },
        { id: 'assessment', label: 'Đánh giá sự phát triển của trẻ', href: '/parent/assessment' },
        { id: 'good-child', label: 'Theo dõi bé ngoan hàng tuần', href: '/parent/good-child' },
      ],
    },
    {
      id: 'health-group',
      label: 'Chăm sóc & Nuôi dưỡng',
      icon: <HeartPulse size={18} />,
      subItems: [
        { id: 'attendance', label: 'Sổ theo dõi chuyên cần', href: '/parent/attendance' },
        { id: 'pickup', label: 'Đón trả trẻ & Người đưa đón', href: '/parent/pickup' },
        { id: 'medications', label: 'Đơn dặn thuốc cho bé', href: '/parent/medications' },
        { id: 'absence', label: 'Đơn xin phép nghỉ học', href: '/parent/absence' },
        { id: 'health', label: 'Khám sức khỏe & Tăng trưởng', href: '/parent/health' },
      ],
    },
    {
      id: 'communication-group',
      label: 'Thông tin & Học phí',
      icon: <MessageSquareText size={18} />,
      subItems: [
        {
          id: 'messages',
          label: 'Trao đổi với giáo viên',
          href: '/parent/messages',
          badge: unreadMessagesCount > 0 ? String(unreadMessagesCount) : undefined,
          badgeColor: 'bg-rose-500',
        },
        { id: 'news', label: 'Bản tin & Thông báo nhà trường', href: '/parent/news' },
        { id: 'tuition', label: 'Học phí & Các khoản thu', href: '/parent/tuition' },
      ],
    },
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'learning-group': true,
    'health-group': true,
    'communication-group': true,
  });

  useEffect(() => {
    navGroups.forEach((group) => {
      if (group.subItems?.some((sub) => pathname === sub.href || pathname.startsWith(`${sub.href}/`))) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isSubActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[60] lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-[70] flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 shadow-xl lg:shadow-none font-sans`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
          <Link href="/parent" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-600/20">
              MN
            </div>
            <div>
              <p className="text-xs font-black tracking-tight text-slate-800">Cổng Phụ Huynh</p>
              <p className="text-[10px] text-slate-400 font-medium">Trường Mầm Non</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {navGroups.map((group) => {
            if (group.href) {
              const isGroupActive = pathname === group.href;
              return (
                <Link
                  key={group.id}
                  href={group.href}
                  onClick={onClose}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                    isGroupActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-700'
                  }`}
                >
                  <span className={isGroupActive ? 'text-white' : 'text-slate-400'}>
                    {group.icon}
                  </span>
                  <span>{group.label}</span>
                </Link>
              );
            }

            const isExpanded = Boolean(openGroups[group.id]);
            const hasActiveChild = group.subItems?.some((sub) => isSubActive(sub.href));

            return (
              <div key={group.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                    hasActiveChild
                      ? 'bg-indigo-50/70 text-indigo-900 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={hasActiveChild ? 'text-indigo-600' : 'text-slate-400'}>
                      {group.icon}
                    </span>
                    <span className="truncate">{group.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      isExpanded ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>

                {isExpanded && group.subItems && (
                  <div className="ml-4 pl-3 border-l-2 border-slate-100 space-y-0.5 pt-0.5">
                    {group.subItems.map((sub) => {
                      const active = isSubActive(sub.href);
                      return (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                            active
                              ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {Boolean(sub.badge) && (
                            <span
                              className={`ml-2 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                active ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
                              }`}
                            >
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
              <User size={15} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 truncate">{parent.hoTen || 'Phụ huynh'}</p>
              <p className="text-[10px] text-slate-400 truncate">{parent.soDienThoai || ''}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenProfile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              title="Thông tin tài khoản phụ huynh"
            >
              <User size={15} />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
