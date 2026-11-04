'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  X,
} from 'lucide-react';
import { currentUser } from '@/services/client';
import { navigationGroups } from './sidebarConfig';
import { TeacherSidebarUserProfile } from './TeacherSidebarUserProfile';

export default function TeacherSidebar({
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const activeUser = currentUser();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    teaching: true,
    care: true,
    interaction: true,
  });

  useEffect(() => {
    navigationGroups.forEach((group) => {
      if (group.items?.some((item) => pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(item.href)))) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (groupId: string) => {
    if (collapsed) {
      setCollapsed(false);
    }
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const isSubActive = (href: string) => {
    if (href === '/teacher') return pathname === '/teacher';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Backdrop overlay on mobile */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileOpen?.(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out shadow-xl lg:shadow-none ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } w-72 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} font-sans`}
      >
        {/* Header Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 font-black">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <span className="block truncate text-sm font-black tracking-tight text-slate-800">
                  School Management
                </span>
                <span className="block text-[11px] font-bold text-orange-600">
                  Cổng Giáo Viên
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen?.(false)}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu 2 Cấp */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navigationGroups.map((group) => {
            const GroupIcon = group.icon;

            if (group.href) {
              const active = isSubActive(group.href);
              return (
                <Link
                  key={group.id}
                  href={group.href}
                  onClick={() => setMobileOpen?.(false)}
                  title={collapsed ? group.groupName : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-orange-700'
                  } ${collapsed ? 'justify-center px-0 h-10' : ''}`}
                >
                  <GroupIcon
                    size={18}
                    className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                  />
                  {(!collapsed || mobileOpen) && (
                    <span className="truncate">{group.groupName}</span>
                  )}
                </Link>
              );
            }

            const isOpen = Boolean(openGroups[group.id]);
            const hasActiveChild = group.items?.some((sub) => isSubActive(sub.href));

            return (
              <div key={group.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  title={collapsed ? group.groupName : undefined}
                  className={`w-full flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-bold transition cursor-pointer select-none ${
                    hasActiveChild
                      ? 'bg-orange-50 text-orange-900 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-50'
                  } ${collapsed ? 'justify-center px-0 h-10' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GroupIcon
                      size={18}
                      className={`shrink-0 ${
                        hasActiveChild ? 'text-orange-600' : 'text-slate-400'
                      }`}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate">{group.groupName}</span>
                    )}
                  </div>

                  {(!collapsed || mobileOpen) && (
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-orange-600' : ''
                      }`}
                    />
                  )}
                </button>

                {isOpen && (!collapsed || mobileOpen) && group.items && (
                  <div className="ml-5 pl-3 border-l-2 border-slate-100 space-y-0.5 pt-0.5">
                    {group.items.map((sub) => {
                      const SubIcon = sub.icon;
                      const active = isSubActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMobileOpen?.(false)}
                          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition ${
                            active
                              ? 'bg-orange-600 text-white font-bold shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <SubIcon
                            size={14}
                            className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                          />
                          <span className="truncate flex-1">{sub.label}</span>
                          {sub.badge && (
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                                active ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'
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

        <TeacherSidebarUserProfile
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          activeUserName={activeUser?.name}
        />
      </aside>
    </>
  );
}
