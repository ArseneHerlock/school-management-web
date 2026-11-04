'use client';

import React, { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { extractMonthKey, formatMonthLabel } from '@/lib/moments';
import { MomentItem, ChildInfo } from '../types';
import { MediaItem } from './moments/types';
import { MomentsScopeSelector } from './moments/MomentsScopeSelector';
import { MomentCard } from './moments/MomentCard';
import { MomentLightbox } from './moments/MomentLightbox';
import { MomentsHeaderBanner } from './moments/MomentsHeaderBanner';
import { MomentsFilterBar } from './moments/MomentsFilterBar';
import { MomentsEmptyState } from './moments/MomentsEmptyState';
import { MomentsPagination } from './moments/MomentsPagination';
import { useMomentsData } from './moments/useMomentsData';

interface MomentsTabProps {
  child?: ChildInfo | any;
  moments?: any[];
  onSelectMoment?: (m: MomentItem | any) => void;
  onToggleLike?: (id: string) => void;
}

export default function MomentsTab({ child }: MomentsTabProps = {}) {
  const [activeScope, setActiveScope] = useState<'class' | 'child'>('class');
  const {
    classMoments,
    setClassMoments,
    childMoments,
    setChildMoments,
    activities,
    loading,
  } = useMomentsData(child);

  // Bộ lọc: Tìm kiếm + Hoạt động + Tháng + Chuyên mục
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const currentMoments = activeScope === 'class' ? classMoments : childMoments;

  const availableActivities = useMemo(() => {
    const actMap = new Map<string, { id: string; title: string; count: number }>();
    currentMoments.forEach((m) => {
      if (m.activityTitle) {
        const normKey = m.activityTitle.trim().toLowerCase();
        if (!actMap.has(normKey)) {
          actMap.set(normKey, {
            id: m.activityId || m.activityTitle,
            title: m.activityTitle,
            count: 0,
          });
        }
        actMap.get(normKey)!.count += 1;
      }
    });

    activities.forEach((a) => {
      const normKey = (a.name || '').trim().toLowerCase();
      if (normKey && !actMap.has(normKey)) {
        actMap.set(normKey, { id: a.id, title: a.name, count: 0 });
      }
    });

    return Array.from(actMap.values()).sort((a, b) => b.count - a.count);
  }, [currentMoments, activities]);

  const availableMonths = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const monthsMap = new Map<string, { key: string; label: string; count: number }>();

    for (let m = 12; m >= 1; m--) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      const key = `${currentYear}-${monthStr}`;
      monthsMap.set(key, {
        key,
        label: `Tháng ${monthStr}/${currentYear}`,
        count: 0,
      });
    }

    currentMoments.forEach((item) => {
      const key = item.monthKey || extractMonthKey(item.date);
      if (key) {
        if (!monthsMap.has(key)) {
          monthsMap.set(key, {
            key,
            label: formatMonthLabel(key),
            count: 0,
          });
        }
        monthsMap.get(key)!.count += 1;
      }
    });

    return Array.from(monthsMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [currentMoments]);

  const filtered = useMemo(() => {
    return currentMoments.filter((m) => {
      if (selectedCategory !== 'Tất cả' && m.category !== selectedCategory) {
        return false;
      }
      if (selectedActivityId !== 'ALL') {
        const selectedActObj = availableActivities.find((a) => a.id === selectedActivityId);
        const targetTitle = (selectedActObj?.title || selectedActivityId).trim().toLowerCase();
        const mActId = String(m.activityId || '').toLowerCase();
        const mActTitle = String(m.activityTitle || '').trim().toLowerCase();
        const mTitle = String(m.title || '').trim().toLowerCase();

        const matchedById = mActId && mActId === selectedActivityId.toLowerCase();
        const matchedByTitle =
          targetTitle &&
          ((mActTitle && (mActTitle.includes(targetTitle) || targetTitle.includes(mActTitle))) ||
            (mTitle && mTitle.includes(targetTitle)));

        if (!matchedById && !matchedByTitle) return false;
      }
      if (selectedMonth !== 'ALL') {
        const mMonth = m.monthKey || extractMonthKey(m.date);
        if (mMonth !== selectedMonth && !m.date.startsWith(selectedMonth)) {
          return false;
        }
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const inTitle = m.title.toLowerCase().includes(kw);
        const inDesc = (m.description || '').toLowerCase().includes(kw);
        const inAct = (m.activityTitle || '').toLowerCase().includes(kw);
        const inCat = (m.category || '').toLowerCase().includes(kw);
        if (!inTitle && !inDesc && !inAct && !inCat) return false;
      }
      return true;
    });
  }, [currentMoments, selectedCategory, selectedActivityId, selectedMonth, searchKeyword, availableActivities]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const toggleLike = (id: string) => {
    const updater = (prev: MediaItem[]) =>
      prev.map((m) => {
        if (m.id === id) {
          const isLiked = !m.isLiked;
          const likes = m.likes + (isLiked ? 1 : -1);
          return { ...m, isLiked, likes };
        }
        return m;
      });

    if (activeScope === 'class') {
      setClassMoments(updater);
    } else {
      setChildMoments(updater);
    }
  };

  const hasActiveFilter =
    selectedCategory !== 'Tất cả' ||
    selectedActivityId !== 'ALL' ||
    selectedMonth !== 'ALL' ||
    Boolean(searchKeyword.trim());

  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setSelectedActivityId('ALL');
    setSelectedMonth('ALL');
    setSearchKeyword('');
    setCurrentPage(1);
  };

  const currentItem = paginated[lightboxIndex] || null;

  return (
    <section className="space-y-4 sm:space-y-6">
      <MomentsHeaderBanner
        childName={child?.hoTen}
        classNameProp={child?.lop}
      />

      <MomentsScopeSelector
        activeScope={activeScope}
        onSelectScope={(scope) => {
          setActiveScope(scope);
          setCurrentPage(1);
          setSelectedCategory('Tất cả');
          setSelectedActivityId('ALL');
        }}
        classMomentsCount={classMoments.length}
        childMomentsCount={childMoments.length}
        className={child?.lop}
        childName={child?.hoTen}
      />

      <MomentsFilterBar
        searchKeyword={searchKeyword}
        onSearchChange={(val) => {
          setSearchKeyword(val);
          setCurrentPage(1);
        }}
        selectedActivityId={selectedActivityId}
        onActivityChange={(val) => {
          setSelectedActivityId(val);
          setCurrentPage(1);
        }}
        availableActivities={availableActivities}
        selectedMonth={selectedMonth}
        onMonthChange={(val) => {
          setSelectedMonth(val);
          setCurrentPage(1);
        }}
        availableMonths={availableMonths}
        totalMomentsCount={currentMoments.length}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        currentMoments={currentMoments}
        activeScope={activeScope}
        hasActiveFilter={hasActiveFilter}
        onResetFilters={resetFilters}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-16 border border-slate-100">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
          <p className="mt-3 text-xs font-bold text-slate-400">Đang đồng bộ album hoạt động...</p>
        </div>
      ) : filtered.length === 0 ? (
        <MomentsEmptyState
          hasActiveFilter={hasActiveFilter}
          activeScope={activeScope}
          classNameProp={child?.lop}
          childName={child?.hoTen}
          currentMomentsCount={currentMoments.length}
          onResetFilters={resetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map((item, idx) => (
              <MomentCard
                key={item.id}
                item={item}
                onOpenLightbox={() => {
                  setLightboxIndex(idx);
                  setLightboxOpen(true);
                }}
                onToggleLike={toggleLike}
              />
            ))}
          </div>

          <MomentsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      <MomentLightbox
        item={currentItem}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
}
