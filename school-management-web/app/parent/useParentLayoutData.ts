import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getNews,
  getFees,
  getStudentsByParent,
  getCurrentParentProfile,
  getStaff,
} from '@/services';
import { currentUser } from '@/services/client';
import { getClassById } from '@/services/classes';
import { useApiQuery } from '@/lib/hooks/useApiQuery';
import {
  EMPTY_PARENT,
  ParentProfile,
  ChildInfo,
} from './types';
import { formatNewsDate } from './layoutConfig';

export function useParentLayoutData() {
  const router = useRouter();
  const [forceTimeout, setForceTimeout] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initialCache = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const user = currentUser();
      if (!user?.id) return null;
      const storedProfile = sessionStorage.getItem(`parent_profile_${user.id}`);
      const storedChildren = sessionStorage.getItem(`parent_children_${user.id}`);
      return {
        profile: storedProfile ? JSON.parse(storedProfile) : null,
        children: storedChildren ? JSON.parse(storedChildren) : null,
      };
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const activeUser = currentUser();
    if (!activeUser) {
      window.location.href = '/login';
      return;
    }
    const timer = setTimeout(() => {
      setForceTimeout(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  const profileQuery = useApiQuery(['parent', 'me'], getCurrentParentProfile, {
    initialData: initialCache?.profile || undefined,
    staleTime: 60_000,
  });

  const resolvedParentId = profileQuery.data?.id || initialCache?.profile?.id;

  const childrenQuery = useApiQuery(
    ['parent', 'children', resolvedParentId],
    () => getStudentsByParent(resolvedParentId!),
    {
      enabled: Boolean(resolvedParentId),
      initialData: initialCache?.children || undefined,
      staleTime: 60_000,
    }
  );

  useEffect(() => {
    const user = currentUser();
    if (!user?.id) return;
    if (profileQuery.data) {
      try {
        sessionStorage.setItem(`parent_profile_${user.id}`, JSON.stringify(profileQuery.data));
      } catch {}
    }
    if (childrenQuery.data) {
      try {
        sessionStorage.setItem(`parent_children_${user.id}`, JSON.stringify(childrenQuery.data));
      } catch {}
    }
  }, [profileQuery.data, childrenQuery.data]);

  const classIds = useMemo(
    () => [
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
    { enabled: classIds.length > 0, staleTime: 120_000 }
  );

  const staffQuery = useApiQuery(['parent', 'all-staff'], () => getStaff(), {
    staleTime: 120_000,
  });

  const currentYear = new Date().getFullYear();
  const newsQuery = useApiQuery(['news', 'parent'], () =>
    getNews({ trang: 1, soLuongMoiTrang: 20 })
  );
  const feesQuery = useApiQuery(['fees', `${currentYear}-${currentYear + 1}`], () =>
    getFees(`${currentYear}-${currentYear + 1}`)
  );

  const parent = useMemo<ParentProfile>(() => {
    const p: any = profileQuery.data || initialCache?.profile;
    const activeUser = typeof window !== 'undefined' ? currentUser() : null;
    if (!p && !activeUser) return EMPTY_PARENT;
    return {
      ...EMPTY_PARENT,
      ...(p || {}),
      id: p?.id || p?.Id || activeUser?.id || '',
      hoTen: p?.hoTen || p?.HoTen || activeUser?.name || 'Phụ huynh',
      soDienThoai: p?.soDienThoai || p?.SoDienThoai || '',
      email: p?.email || p?.Email || (activeUser as any)?.email || '',
      diaChi: p?.diaChi || p?.DiaChi || '',
      moiQuanHe: p?.moiQuanHe || p?.MoiQuanHe || 'Phụ huynh',
      ngheNghiep: p?.ngheNghiep || p?.NgheNghiep || '',
      noiLamViec: p?.noiLamViec || p?.NoiLamViec || '',
      cccd: p?.cccd || p?.CCCD || '',
      ngaySinh: p?.ngaySinh ? String(p.ngaySinh).slice(0, 10) : '',
      gioiTinh: p?.gioiTinh || p?.GioiTinh || 'Nữ',
      taiKhoanId: p?.taiKhoanId || p?.TaiKhoanId || activeUser?.id || '',
    };
  }, [profileQuery.data, initialCache?.profile]);

  const children = useMemo<ChildInfo[]>(() => {
    const classesById = new Map(
      (childClassesQuery.data ?? []).map((item: any) => [String(item.id || item.Id), item])
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
      const teacherName = schoolClass?.tenGiaoVienChuNhiem || schoolClass?.TenGiaoVienChuNhiem || '';

      const teacherStaff =
        (teacherStaffId ? staffById.get(teacherStaffId) : null) ||
        staffList.find((s) => {
          const sName = String(s.fullName || s.FullName || '').trim().toLowerCase();
          const tName = teacherName.trim().toLowerCase();
          return (
            sName &&
            tName &&
            (sName === tName || sName.replace(/^(cô|thầy)\s+/i, '') === tName.replace(/^(cô|thầy)\s+/i, ''))
          );
        });

      return {
        id,
        hoTen,
        lop: schoolClass?.tenLop || schoolClass?.TenLop || student.tenLop || student.TenLop || '',
        classId,
        khoi: schoolClass?.tenKhoi || schoolClass?.TenKhoi || '',
        giaoVienChuNhiem: teacherName,
        giaoVienStaffId: teacherStaffId,
        giaoVienUserId: String(teacherStaff?.userId || teacherStaff?.UserId || '').toLowerCase().trim(),
        sdtGiaoVien: String(teacherStaff?.phoneNumber || teacherStaff?.PhoneNumber || '').trim(),
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
  const hasCachedData = Boolean(initialCache?.profile || initialCache?.children);
  const loading =
    !mounted ||
    (!forceTimeout &&
      !hasCachedData &&
      (profileQuery.isLoading || (Boolean(profileQuery.data?.id) && childrenQuery.isLoading)));

  return {
    parent,
    children,
    news,
    fees,
    loading,
    refetchProfile: profileQuery.refetch,
  };
}
