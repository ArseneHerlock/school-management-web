'use client';

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import './parent.css';
import {
  getNews,
  getFees,
  getStudentsByParent,
  getCurrentParentProfile,
  saveParentProfile,
  getStaff,
} from '@/services';
import { getClassById } from '@/services/classes';
import { useApiQuery } from '@/lib/hooks/useApiQuery';
import {
  EMPTY_PARENT,
  ACTIVE_CHILD,
  ParentProfile,
  ChildInfo,
  MomentItem,
} from './types';
import { ParentContext } from './ParentContext';
import ParentSidebar from './components/ParentSidebar';
import ParentHeader from './components/ParentHeader';
import LightboxModal from './components/LightboxModal';
import ParentProfileModal from './components/ParentProfileModal';
import LoadingScreen from '@/app/components/LoadingScreen';
import { PARENT_HEADERS, formatNewsDate } from './layoutConfig';
import { ParentBottomNav } from './components/ParentBottomNav';
import { ParentChildSelector } from './components/ParentChildSelector';

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

  const [childId, setChildId] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const profileQuery = useApiQuery(['parent', 'me'], getCurrentParentProfile);
  const childrenQuery = useApiQuery(
    ['parent', 'children', profileQuery.data?.id],
    () => getStudentsByParent(profileQuery.data!.id),
    { enabled: Boolean(profileQuery.data?.id) }
  );
  const classIds = useMemo(
    () =>
      [
        ...new Set(
          (childrenQuery.data ?? [])
            .map((student: any) => student.lopId || student.LopId)
            .filter(Boolean)
        ),
      ] as string[],
    [childrenQuery.data]
  );
  const childClassesQuery = useApiQuery(
    ['parent', 'child-classes', classIds],
    () => Promise.all(classIds.map(getClassById)),
    { enabled: classIds.length > 0 }
  );
  const staffQuery = useApiQuery(['parent', 'all-staff'], () => getStaff());
  const currentYear = new Date().getFullYear();
  const newsQuery = useApiQuery(['news', 'parent'], () =>
    getNews({ trang: 1, soLuongMoiTrang: 20 })
  );
  const feesQuery = useApiQuery(['fees', `${currentYear}-${currentYear + 1}`], () =>
    getFees(`${currentYear}-${currentYear + 1}`)
  );

  const parent = useMemo<ParentProfile>(() => {
    const p: any = profileQuery.data;
    if (!p) return EMPTY_PARENT;
    return {
      ...EMPTY_PARENT,
      ...p,
      id: p.id || p.Id || '',
      hoTen: p.hoTen || p.HoTen || '',
      soDienThoai: p.soDienThoai || p.SoDienThoai || '',
      email: p.email || p.Email || '',
      diaChi: p.diaChi || p.DiaChi || '',
      moiQuanHe: p.moiQuanHe || p.MoiQuanHe || 'Phụ huynh',
      ngheNghiep: p.ngheNghiep || p.NgheNghiep || '',
      noiLamViec: p.noiLamViec || p.NoiLamViec || '',
      cccd: p.cccd || p.CCCD || '',
      ngaySinh: p.ngaySinh ? String(p.ngaySinh).slice(0, 10) : '',
      gioiTinh: p.gioiTinh || p.GioiTinh || 'Nữ',
      taiKhoanId: p.taiKhoanId || p.TaiKhoanId || '',
    };
  }, [profileQuery.data]);

  const children = useMemo<ChildInfo[]>(() => {
    const classesById = new Map(
      (childClassesQuery.data ?? []).map((item: any) => [
        String(item.id || item.Id),
        item,
      ])
    );
    const staffList: any[] = staffQuery.data ?? [];
    const staffById = new Map<string, any>();
    staffList.forEach((s) => {
      const sId = String(s.staffId || s.StaffId || s.id || s.Id || '').toLowerCase();
      if (sId) staffById.set(sId, s);
    });

    return (childrenQuery.data ?? []).map((student: any) => {
      const id = student.studentId || student.StudentId || student.id || student.Id || '';
      const classId = student.lopId || student.LopId || '';
      const schoolClass: any = classesById.get(String(classId));
      const hoTen = student.tenHocSinh || student.TenHocSinh || '';
      const teacherStaffId = String(
        schoolClass?.giaoVienChuNhiemId || schoolClass?.GiaoVienChuNhiemId || ''
      ).toLowerCase();
      const teacherName =
        schoolClass?.tenGiaoVienChuNhiem || schoolClass?.TenGiaoVienChuNhiem || '';

      const teacherStaff =
        (teacherStaffId ? staffById.get(teacherStaffId) : null) ||
        staffList.find((s) => {
          const sName = String(s.fullName || s.FullName || '').trim().toLowerCase();
          const tName = teacherName.trim().toLowerCase();
          return (
            sName &&
            tName &&
            (sName === tName ||
              sName.replace(/^(cô|thầy)\s+/i, '') === tName.replace(/^(cô|thầy)\s+/i, ''))
          );
        });

      const giaoVienUserId = String(
        teacherStaff?.userId || teacherStaff?.UserId || ''
      ).toLowerCase().trim();
      const sdtGiaoVien = String(
        teacherStaff?.phoneNumber || teacherStaff?.PhoneNumber || ''
      ).trim();

      return {
        id,
        hoTen,
        lop: schoolClass?.tenLop || schoolClass?.TenLop || student.tenLop || student.TenLop || '',
        classId,
        khoi: schoolClass?.tenKhoi || schoolClass?.TenKhoi || '',
        giaoVienChuNhiem: teacherName,
        giaoVienStaffId: teacherStaffId,
        giaoVienUserId,
        sdtGiaoVien,
        avatar: hoTen
          .split(' ')
          .map((word: string) => word[0])
          .join('')
          .slice(-2)
          .toUpperCase(),
        ngaySinh: String(student.ngaySinh || student.NgaySinh || '').slice(0, 10),
        gioiTinh: student.gioiTinh || student.GioiTinh || '',
        maHocSinh: id,
      };
    });
  }, [childrenQuery.data, childClassesQuery.data, staffQuery.data]);

  const parentId = parent.id;
  const news = useMemo(() => {
    const payload: any = newsQuery.data;
    const items = Array.isArray(payload) ? payload : payload?.items || [];
    return items.map((item: any) => ({
      id: item.id || item.Id,
      title: item.tieuDe || item.TieuDe || '',
      category:
        Number(item.phamVi ?? item.PhamVi) === 0
          ? 'Toàn trường'
          : Number(item.phamVi ?? item.PhamVi) === 1
          ? 'Giáo viên'
          : 'Phụ huynh',
      date: formatNewsDate(item.ngayXuatBan || item.NgayXuatBan || item.ngayTao || item.NgayTao),
      summary: item.tomTat || item.TomTat || '',
      content: '',
      icon: '',
      badge: '',
      isImportant: false,
    }));
  }, [newsQuery.data]);
  const fees = feesQuery.data ?? [];
  const loading =
    profileQuery.isLoading || childrenQuery.isLoading || childClassesQuery.isLoading;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        <ParentBottomNav
          pathname={pathname}
          onOpenMenu={() => setOpen(true)}
        />

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
            await profileQuery.refetch();
            setProfileOpen(false);
          }}
        />
      </div>
    </ParentContext.Provider>
  );
}
