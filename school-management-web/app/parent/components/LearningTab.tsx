'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Loader2 } from 'lucide-react';
import { getLearningProducts } from '@/services/learning';
import { getActivities, ActivityItem } from '@/services/development';
import {
  parseMomentDescription,
  extractMonthKey,
  formatMonthLabel,
  toIsoDateString,
} from '@/lib/moments';
import { ChildInfo } from '../types';
import { LearningItem, EnrichedLearningItem } from './learning/types';
import { LearningFilterBar } from './learning/LearningFilterBar';
import { LearningProductCard } from './learning/LearningProductCard';
import { LearningPreviewModal } from './learning/LearningPreviewModal';

export default function LearningTab({ child }: { child: ChildInfo }) {
  const [rows, setRows] = useState<LearningItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePreview, setActivePreview] = useState<{
    url: string;
    title: string;
    desc?: string;
  } | null>(null);

  // Bộ lọc: Tìm kiếm + Hoạt động + Tháng + Lĩnh vực
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    if (!child?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    Promise.all([
      getLearningProducts(child.id),
      getActivities({ page: 1, pageSize: 100 }).catch(() => ({ items: [] })),
    ])
      .then(([res, actRes]) => {
        const list = Array.isArray(res) ? (res as unknown as LearningItem[]) : [];
        setRows(list);
        setActivities(actRes?.items || []);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Không tải được sản phẩm học tập');
      })
      .finally(() => setLoading(false));
  }, [child?.id]);

  // Chuẩn hoá danh sách sản phẩm kèm metadata
  const enrichedRows: EnrichedLearningItem[] = useMemo(() => {
    return rows.map((item) => {
      const meta = parseMomentDescription(item.description, item.childId);
      const itemDate = meta.date || toIsoDateString(item.createdAtUtc);
      const monthKey = extractMonthKey(itemDate) || extractMonthKey(item.createdAtUtc);

      const resolvedActId = meta.activityId || item.activityId || '';
      let resolvedActTitle = meta.activityTitle || '';
      if (!resolvedActTitle && resolvedActId) {
        const matched = activities.find(
          (a) => String(a.id).toLowerCase() === String(resolvedActId).toLowerCase()
        );
        if (matched) resolvedActTitle = matched.name;
      }

      const category = meta.category || 'Sản phẩm của bé';
      let displayTitle = String(item.title || '').trim();
      if (!displayTitle || /^\d{6,}$/.test(displayTitle) || /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(displayTitle)) {
        displayTitle = resolvedActTitle || `${category}${itemDate ? ` (${itemDate})` : ''}`;
      }

      return {
        ...item,
        displayTitle,
        cleanDesc: meta.cleanText,
        dateStr: itemDate,
        monthKey,
        category,
        resolvedActId,
        resolvedActTitle,
      };
    });
  }, [rows, activities]);

  // Danh sách Hoạt động để lọc
  const availableActivities = useMemo(() => {
    const actMap = new Map<string, { id: string; title: string; count: number }>();
    enrichedRows.forEach((r) => {
      if (r.resolvedActTitle) {
        const normKey = r.resolvedActTitle.trim().toLowerCase();
        if (!actMap.has(normKey)) {
          actMap.set(normKey, {
            id: r.resolvedActId || r.resolvedActTitle,
            title: r.resolvedActTitle,
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
  }, [enrichedRows, activities]);

  // Danh sách Tháng để lọc
  const availableMonths = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const monthsMap = new Map<string, { key: string; label: string; count: number }>();
    for (let m = 12; m >= 1; m--) {
      const monthStr = m < 10 ? `0${m}` : `${m}`;
      const key = `${currentYear}-${monthStr}`;
      monthsMap.set(key, { key, label: `Tháng ${monthStr}/${currentYear}`, count: 0 });
    }
    enrichedRows.forEach((r) => {
      const key = r.monthKey || extractMonthKey(r.dateStr);
      if (key) {
        if (!monthsMap.has(key)) {
          monthsMap.set(key, { key, label: formatMonthLabel(key), count: 0 });
        }
        monthsMap.get(key)!.count += 1;
      }
    });
    return Array.from(monthsMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [enrichedRows]);

  // Danh sách Lĩnh vực / Chuyên mục
  const availableCategories = useMemo(() => {
    const set = new Set<string>(['Tất cả']);
    enrichedRows.forEach((r) => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set);
  }, [enrichedRows]);

  const filteredRows = useMemo(() => {
    return enrichedRows.filter((r) => {
      if (selectedCategory !== 'Tất cả' && r.category !== selectedCategory) return false;

      if (selectedActivityId !== 'ALL') {
        const selectedActObj = availableActivities.find((a) => a.id === selectedActivityId);
        const targetTitle = (selectedActObj?.title || selectedActivityId).trim().toLowerCase();
        const rActId = String(r.resolvedActId || '').toLowerCase();
        const rActTitle = String(r.resolvedActTitle || '').trim().toLowerCase();
        const rTitle = String(r.displayTitle || '').trim().toLowerCase();

        const matchedById = rActId && rActId === selectedActivityId.toLowerCase();
        const matchedByTitle =
          targetTitle &&
          ((rActTitle && (rActTitle.includes(targetTitle) || targetTitle.includes(rActTitle))) ||
            (rTitle && rTitle.includes(targetTitle)));

        if (!matchedById && !matchedByTitle) return false;
      }

      if (selectedMonth !== 'ALL') {
        const mKey = r.monthKey || extractMonthKey(r.dateStr);
        if (mKey !== selectedMonth && !r.dateStr.startsWith(selectedMonth)) return false;
      }

      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const inTitle = r.displayTitle.toLowerCase().includes(kw);
        const inDesc = (r.cleanDesc || '').toLowerCase().includes(kw);
        const inAct = (r.resolvedActTitle || '').toLowerCase().includes(kw);
        const inCat = (r.category || '').toLowerCase().includes(kw);
        if (!inTitle && !inDesc && !inAct && !inCat) return false;
      }

      return true;
    });
  }, [enrichedRows, selectedCategory, selectedActivityId, selectedMonth, searchKeyword, availableActivities]);

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
  };

  return (
    <section className="space-y-5 max-w-full overflow-x-hidden pb-8">
      {/* Header banner */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 sm:p-7 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            GÓC TRƯNG BÀY SẢN PHẨM
          </span>
          <span className="text-xs text-indigo-200">·</span>
          <span className="text-xs text-indigo-200 font-semibold">{child.lop || 'Trường mầm non'}</span>
        </div>
        <h2 className="mt-2 text-xl sm:text-2xl font-black">Sản phẩm hoạt động & tạo hình của bé {child.hoTen}</h2>
        <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
          Lưu giữ tranh vẽ, bài xé dán, tạo hình đất nặn và các sản phẩm sáng tạo trong giờ học của bé được giáo viên ghi nhận.
        </p>
      </div>

      {/* Thanh Đa Bộ Lọc */}
      <LearningFilterBar
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        selectedActivityId={selectedActivityId}
        onActivityChange={setSelectedActivityId}
        availableActivities={availableActivities}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={availableMonths}
        totalProductsCount={enrichedRows.length}
        availableCategories={availableCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        enrichedRows={enrichedRows}
        hasActiveFilter={hasActiveFilter}
        onResetFilters={resetFilters}
      />

      {/* Nội dung danh sách sản phẩm */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 border border-slate-100 shadow-xs">
          <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
          <p className="text-xs font-bold text-slate-500">Đang tải sản phẩm học tập của bé...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-bold text-rose-700">
          {error}
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <BookOpenCheck size={28} />
          </div>
          <h3 className="text-sm font-black text-slate-700">
            {hasActiveFilter ? 'Không tìm thấy sản phẩm khớp với bộ lọc' : 'Chưa có sản phẩm học tập nào'}
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            {hasActiveFilter
              ? 'Hãy thử đổi tháng, hoạt động hoặc nhấn "Đặt lại bộ lọc" để xem toàn bộ sản phẩm của bé.'
              : `Khi giáo viên chụp ảnh tranh vẽ, bài tạo hình hoặc sản phẩm hoạt động góc của bé ${child.hoTen}, hình ảnh cùng lời nhận xét sẽ được cập nhật tại đây.`}
          </p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
            >
              Xem tất cả ({enrichedRows.length})
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRows.map((item) => (
            <LearningProductCard
              key={item.id}
              item={item}
              onPreview={setActivePreview}
            />
          ))}
        </div>
      )}

      {/* Lightbox xem ảnh to cho phụ huynh */}
      <LearningPreviewModal
        activePreview={activePreview}
        onClose={() => setActivePreview(null)}
      />
    </section>
  );
}
