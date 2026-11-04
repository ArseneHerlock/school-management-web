import { Child } from '../data';
import {
  parseMomentDescription,
  extractMonthKey,
  formatMonthLabel,
  toIsoDateString,
} from '@/lib/moments';
import { ActivityItem } from '@/services/development';
import { PRODUCT_CATEGORIES, LearningProductItem, EnrichedLearningProduct } from './types';

export function calculateChildProductCounts(children: Child[], allProducts: LearningProductItem[]) {
  const countMap = new Map<string, number>();
  children.forEach((child) => {
    const apiId = String(child.apiId || '').toLowerCase();
    const numId = String(child.id).toLowerCase();
    const count = allProducts.filter((product) => {
      const pChildId = String(product.childId || '').toLowerCase();
      const pDesc = String(product.description || '').toLowerCase();
      return (
        (apiId && pChildId === apiId) ||
        (numId && pChildId === numId) ||
        (apiId && pDesc.includes(`[child:${apiId}]`)) ||
        (numId && pDesc.includes(`[child:${numId}]`))
      );
    }).length;
    if (apiId) countMap.set(apiId, count);
    countMap.set(numId, count);
  });
  return countMap;
}

export function enrichChildProducts(
  selectedChild: Child | null,
  allProducts: LearningProductItem[],
  activities: ActivityItem[]
): EnrichedLearningProduct[] {
  if (!selectedChild) return [];
  const targetApiId = String(selectedChild.apiId || '').toLowerCase();
  const targetNumId = String(selectedChild.id).toLowerCase();

  return allProducts
    .filter((product) => {
      const pChildId = String(product.childId || '').toLowerCase();
      const pDesc = String(product.description || '').toLowerCase();
      return (
        (targetApiId && pChildId === targetApiId) ||
        (targetNumId && pChildId === targetNumId) ||
        (targetApiId && pDesc.includes(`[child:${targetApiId}`)) ||
        (targetNumId && pDesc.includes(`[child:${targetNumId}`))
      );
    })
    .map((product) => {
      const rawDesc = String(product.description || '');
      const meta = parseMomentDescription(rawDesc, product.childId);
      const itemDate = meta.date || toIsoDateString(product.createdAtUtc);
      const monthKey = extractMonthKey(itemDate) || extractMonthKey(product.createdAtUtc);

      const resolvedActId = meta.activityId || product.activityId || '';
      let resolvedActTitle = meta.activityTitle || '';
      if (!resolvedActTitle && resolvedActId) {
        const matchedAct = activities.find(
          (a) => String(a.id).toLowerCase() === String(resolvedActId).toLowerCase()
        );
        if (matchedAct) resolvedActTitle = matchedAct.name;
      }

      const category = meta.category || 'Sản phẩm của bé';
      const displayTitle =
        !product.title ||
        /^\d{6,}$/.test(product.title.trim()) ||
        /^(IMG|VID|image|photo|upload)[_\d-]+$/i.test(product.title.trim())
          ? resolvedActTitle || `${category} - ${selectedChild.name}`
          : product.title;

      return {
        ...product,
        cleanDesc: meta.cleanText,
        dateStr: itemDate,
        monthKey,
        category,
        resolvedActId: String(resolvedActId || ''),
        resolvedActTitle,
        displayTitle,
      };
    });
}

export function calculateChildActivities(
  selectedChildProducts: EnrichedLearningProduct[],
  activities: ActivityItem[]
) {
  const actMap = new Map<string, { id: string; title: string; count: number }>();
  selectedChildProducts.forEach((p) => {
    if (p.resolvedActTitle) {
      const normKey = p.resolvedActTitle.trim().toLowerCase();
      if (!actMap.has(normKey)) {
        actMap.set(normKey, {
          id: p.resolvedActId || p.resolvedActTitle,
          title: p.resolvedActTitle,
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
}

export function calculateChildMonths(selectedChildProducts: EnrichedLearningProduct[]) {
  const currentYear = new Date().getFullYear();
  const monthsMap = new Map<string, { key: string; label: string; count: number }>();
  for (let m = 12; m >= 1; m--) {
    const monthStr = m < 10 ? `0${m}` : `${m}`;
    const key = `${currentYear}-${monthStr}`;
    monthsMap.set(key, { key, label: `Tháng ${monthStr}/${currentYear}`, count: 0 });
  }
  selectedChildProducts.forEach((p) => {
    const key = p.monthKey || extractMonthKey(p.dateStr);
    if (key) {
      if (!monthsMap.has(key)) {
        monthsMap.set(key, { key, label: formatMonthLabel(key), count: 0 });
      }
      monthsMap.get(key)!.count += 1;
    }
  });
  return Array.from(monthsMap.values()).sort((a, b) => b.key.localeCompare(a.key));
}

export function filterChildProducts(
  selectedChildProducts: EnrichedLearningProduct[],
  selectedCategoryFilter: string,
  selectedActivityFilter: string,
  selectedMonthFilter: string,
  productSearch: string,
  availableChildActivities: { id: string; title: string }[]
) {
  return selectedChildProducts.filter((p) => {
    if (selectedCategoryFilter !== 'Tất cả' && p.category !== selectedCategoryFilter) return false;

    if (selectedActivityFilter !== 'ALL') {
      const selectedActObj = availableChildActivities.find((a) => a.id === selectedActivityFilter);
      const targetTitle = (selectedActObj?.title || selectedActivityFilter).trim().toLowerCase();
      const pActId = String(p.resolvedActId || '').toLowerCase();
      const pActTitle = String(p.resolvedActTitle || '').trim().toLowerCase();
      const pTitle = String(p.displayTitle || '').trim().toLowerCase();

      const matchedById = pActId && pActId === selectedActivityFilter.toLowerCase();
      const matchedByTitle =
        targetTitle &&
        ((pActTitle && (pActTitle.includes(targetTitle) || targetTitle.includes(pActTitle))) ||
          (pTitle && pTitle.includes(targetTitle)));

      if (!matchedById && !matchedByTitle) return false;
    }

    if (selectedMonthFilter !== 'ALL') {
      const mKey = p.monthKey || extractMonthKey(p.dateStr);
      if (mKey !== selectedMonthFilter && !p.dateStr.startsWith(selectedMonthFilter)) return false;
    }

    if (productSearch.trim()) {
      const kw = productSearch.trim().toLowerCase();
      const inTitle = p.displayTitle.toLowerCase().includes(kw);
      const inDesc = (p.cleanDesc || '').toLowerCase().includes(kw);
      const inAct = (p.resolvedActTitle || '').toLowerCase().includes(kw);
      const inCat = (p.category || '').toLowerCase().includes(kw);
      if (!inTitle && !inDesc && !inAct && !inCat) return false;
    }

    return true;
  });
}
