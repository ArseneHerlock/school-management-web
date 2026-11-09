'use client';

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './parent.css';
import { saveParentProfile } from '@/services';
import { ACTIVE_CHILD, MomentItem } from './types';
import { ParentContext } from './ParentContext';
import ParentSidebar from './components/ParentSidebar';
import ParentHeader from './components/ParentHeader';
import LightboxModal from './components/LightboxModal';
import ParentProfileModal from './components/ParentProfileModal';
import LoadingScreen from '@/app/components/LoadingScreen';
import { PARENT_HEADERS } from './layoutConfig';
import { ParentBottomNav } from './components/ParentBottomNav';
import { ParentChildSelector } from './components/ParentChildSelector';
import { useParentLayoutData } from './useParentLayoutData';

export default function ParentLayout({
  children: pageChildren,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected, setSelected] = useState<MomentItem | null>(null);
  const [childId, setChildIdState] = useState(() => {
    if (typeof window === 'undefined') return '';
    try {
      return sessionStorage.getItem('parent_active_child_id') || '';
    } catch {
      return '';
    }
  });

  const setChildId = (id: string) => {
    setChildIdState(id);
    try {
      if (typeof window !== 'undefined' && id) {
        sessionStorage.setItem('parent_active_child_id', id);
      }
    } catch {}
  };
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const { parent, children, news, fees, loading, refetchProfile } = useParentLayoutData();
  const parentId = parent.id;

  const tab = useMemo(() => {
    const seg = pathname?.split('/')[2];
    return seg && seg in PARENT_HEADERS ? seg : 'dashboard';
  }, [pathname]);

  const navigateTab = (targetTab: string) => {
    setOpen(false);
    router.push(targetTab === 'dashboard' ? '/parent' : `/parent/${targetTab}`);
  };

  const child = useMemo(
    () => children.find((x) => x.id === childId) || children[0] || ACTIVE_CHILD,
    [children, childId]
  );

  const contextValue = useMemo(
    () => ({
      parent,
      parentId,
      childrenData: children,
      child,
      childId,
      setChildId,
      news,
      fees,
      navigateTab,
      openCallModal: () => {},
      selectMoment: setSelected,
    }),
    [parent, parentId, children, child, childId, news, fees]
  );

  if (loading) {
    return (
      <LoadingScreen
        message="Đang tải dữ liệu Phụ Huynh..."
        subMessage="Đang đồng bộ hồ sơ bé, lớp học và thông báo nhà trường"
        theme="sky"
      />
    );
  }

  return (
    <ParentContext.Provider value={contextValue}>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-700 font-sans antialiased">
        <ParentSidebar
          activeTab={tab}
          setActiveTab={navigateTab}
          child={child}
          parent={parent}
          isOpen={open}
          onClose={() => setOpen(false)}
          onOpenProfile={() => setProfileOpen(true)}
          unreadMessagesCount={unreadMessagesCount}
        />

        <div className="lg:pl-64 flex flex-col min-h-screen min-w-0 transition-all duration-300">
          <ParentHeader
            title={PARENT_HEADERS[tab] || 'Cổng phụ huynh'}
            subtitle={
              tab === 'dashboard'
                ? 'Thông tin chung'
                : `Đang xem: ${child.hoTen || 'Chưa chọn trẻ'}`
            }
            onToggleSidebar={() => setOpen(true)}
            onNavigateNotificationTab={(targetTab, targetChildId) => {
              if (targetChildId) setChildId(targetChildId);
              navigateTab(targetTab);
            }}
            onOpenProfile={() => setProfileOpen(true)}
            parent={parent}
            childrenData={children}
            onNotificationCountsChange={(counts) =>
              setUnreadMessagesCount(counts.unreadMessages)
            }
          />

          <main className="flex-1 p-3 sm:p-5 lg:p-8 max-w-7xl mx-auto w-full min-w-0 pb-24 lg:pb-8">
            {tab !== 'dashboard' && (
              <ParentChildSelector
                childrenData={children}
                selectedChildId={child.id}
                onSelectChild={setChildId}
              />
            )}

            {pageChildren}
          </main>
        </div>

        <ParentBottomNav pathname={pathname} onOpenMenu={() => setOpen(true)} />

        <LightboxModal
          moment={selected}
          onClose={() => setSelected(null)}
          onToggleLike={() => setSelected(null)}
        />
        <ParentProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          parent={parent}
          onSave={async (p) => {
            await saveParentProfile(p);
            await refetchProfile();
            setProfileOpen(false);
          }}
        />
      </div>
    </ParentContext.Provider>
  );
}
