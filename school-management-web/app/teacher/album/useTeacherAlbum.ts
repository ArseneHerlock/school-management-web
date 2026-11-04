import { useState, useEffect, useMemo } from 'react';
import { api, currentUser, normalizeList } from '@/services';
import { getActivities, ActivityItem } from '@/services/development';
import { loadLiveTeacherContext, loadLiveTeacherChildren, Child } from '../data';
import { extractMonthKey } from '@/lib/moments';
import { AlbumItem } from './types';
import { mapAlbumItems, getAvailableActivities, getAvailableMonths } from './albumHelpers';

export function useTeacherAlbum() {
  const [photos, setPhotos] = useState<AlbumItem[]>([]);
  const [, setChildren] = useState<Child[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedScope, setSelectedScope] = useState<'ALL' | 'class' | 'child'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);

  const activeUserId = currentUser()?.id;
  const isUserAdmin = currentUser()?.roles.includes('ADMIN');

  const loadPhotos = async () => {
    setLoading(true);
    try {
      const [context, res] = await Promise.all([
        loadLiveTeacherContext().catch(() => null),
        api.get<any>('learning', '/api/learning/products?pageSize=100').catch(() => []),
      ]);

      if (context?.cls) setClassInfo(context.cls);
      const currentClassId = String((context?.cls as any)?.id || (context?.cls as any)?.Id || '');
      const currentClassName = String(
        (context?.cls as any)?.tenLop || (context?.cls as any)?.TenLop || ''
      )
        .trim()
        .toLowerCase();
      const rawList = normalizeList<any>(res);

      const initialItems = mapAlbumItems(rawList, [], [], currentClassId, currentClassName);
      setPhotos(initialItems);
      setLoading(false);

      Promise.all([
        loadLiveTeacherChildren().catch(() => []),
        getActivities({ page: 1, pageSize: 100 }).catch(() => ({ items: [] })),
      ]).then(([loadedKids, actRes]) => {
        if (loadedKids?.length || actRes?.items?.length) {
          setChildren(loadedKids || []);
          setActivities(actRes?.items || []);
          setPhotos(mapAlbumItems(rawList, loadedKids || [], actRes?.items || [], currentClassId, currentClassName));
        }
      });
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadPhotos();
  }, []);

  const availableActivities = useMemo(() => {
    return getAvailableActivities(photos, activities);
  }, [photos, activities]);

  const availableMonths = useMemo(() => {
    return getAvailableMonths(photos);
  }, [photos]);

  const handleDelete = async (id: string, createdBy?: string) => {
    if (!isUserAdmin && createdBy && activeUserId && createdBy !== activeUserId) {
      setMessage({
        text: 'Bạn không có quyền xóa khoảnh khắc này. Chỉ người đã đăng hoặc Quản trị viên mới có quyền xóa.',
        type: 'warning',
      });
      return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa khoảnh khắc này khỏi hệ thống không?')) return;

    try {
      await api.delete('learning', `/api/learning/products/${id}`);
      setPhotos((prev) => prev.filter((x) => x.id !== id));
      setMessage({
        text: 'Đã xóa khoảnh khắc thành công khỏi album.',
        type: 'success',
      });
    } catch (err: any) {
      const is403 = err?.status === 403 || String(err?.message || '').includes('403');
      setMessage({
        text: is403
          ? 'Bạn không có quyền xóa khoảnh khắc này (chỉ người đăng hoặc Quản trị viên mới được xóa).'
          : 'Không thể xóa khoảnh khắc từ hệ thống.',
        type: is403 ? 'warning' : 'error',
      });
    }
  };

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (selectedCategory !== 'Tất cả' && p.category !== selectedCategory) return false;
      if (selectedActivityId !== 'ALL') {
        const matchesActId = p.activityId === selectedActivityId;
        const matchesActTitle =
          p.activityTitle &&
          availableActivities.find((a) => a.id === selectedActivityId)?.title === p.activityTitle;
        if (!matchesActId && !matchesActTitle) return false;
      }
      if (selectedMonth !== 'ALL') {
        const pMonth = p.monthKey || extractMonthKey(p.date);
        if (pMonth !== selectedMonth && !p.date.startsWith(selectedMonth)) return false;
      }
      if (selectedScope !== 'ALL' && p.scope !== selectedScope) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(kw);
        const inNote = (p.cleanNote || '').toLowerCase().includes(kw);
        const inChild = p.childName ? p.childName.toLowerCase().includes(kw) : false;
        const inAct = p.activityTitle ? p.activityTitle.toLowerCase().includes(kw) : false;
        if (!inTitle && !inNote && !inChild && !inAct) return false;
      }
      return true;
    });
  }, [
    photos,
    selectedCategory,
    selectedActivityId,
    selectedMonth,
    selectedScope,
    searchKeyword,
    availableActivities,
  ]);

  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedActivityId('ALL');
    setSelectedMonth('ALL');
    setSelectedScope('ALL');
    setSearchKeyword('');
    setCurrentPage(1);
  };

  const hasFilterActive =
    selectedCategory !== 'Tất cả' ||
    selectedActivityId !== 'ALL' ||
    selectedMonth !== 'ALL' ||
    selectedScope !== 'ALL' ||
    Boolean(searchKeyword.trim());

  return {
    photos,
    classInfo,
    loading,
    message,
    setMessage,
    selectedCategory,
    setSelectedCategory,
    selectedActivityId,
    setSelectedActivityId,
    selectedMonth,
    setSelectedMonth,
    selectedScope,
    setSelectedScope,
    searchKeyword,
    setSearchKeyword,
    currentPage,
    setCurrentPage,
    lightboxOpen,
    setLightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    postModalOpen,
    setPostModalOpen,
    activeUserId,
    isUserAdmin,
    loadPhotos,
    availableActivities,
    availableMonths,
    handleDelete,
    filteredPhotos,
    resetFilters,
    hasFilterActive,
  };
}
