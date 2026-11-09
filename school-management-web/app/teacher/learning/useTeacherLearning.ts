import { useEffect, useState, useMemo } from 'react';
import { api, currentUser } from '@/services';
import { getActivities, ActivityItem } from '@/services/development';
import { loadLiveTeacherChildren, loadLiveTeacherContext, Child } from '../data';
import { PRODUCT_CATEGORIES, LearningProductItem } from './types';
import {
  calculateChildProductCounts,
  enrichChildProducts,
  calculateChildActivities,
  calculateChildMonths,
  filterChildProducts,
} from './learningFilters';
import { deleteChildProduct } from './productActions';
import { useProductForm } from './useProductForm';

export function useTeacherLearning() {
  const [children, setChildren] = useState<Child[]>([]);
  const [allProducts, setAllProducts] = useState<LearningProductItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('ALL');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Tất cả');

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const activeUserId = currentUser()?.id;
  const isUserAdmin = currentUser()?.roles.includes('ADMIN');

  const refreshProducts = async () => {
    const productsRes = await api.get<any>('learning', '/api/learning/products?pageSize=100').catch(() => []);
    setAllProducts(Array.isArray(productsRes) ? productsRes : (productsRes as any)?.items || []);
  };

  const form = useProductForm(selectedChild, classInfo, setToast, refreshProducts);

  const loadData = async () => {
    setLoading(true);
    try {
      const [context, loadedChildren, actRes] = await Promise.all([
        loadLiveTeacherContext(),
        loadLiveTeacherChildren(),
        getActivities({ page: 1, pageSize: 100 }).catch(() => ({ items: [] })),
      ]);

      setClassInfo(context.cls);
      setChildren(loadedChildren || []);
      setActivities(actRes?.items || []);
      await refreshProducts();
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Không thể tải dữ liệu sản phẩm học tập.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const childProductCountMap = useMemo(
    () => calculateChildProductCounts(children, allProducts),
    [allProducts, children]
  );

  const filteredChildren = useMemo(() => {
    return children.filter((child) => {
      if (!searchQuery.trim()) return true;
      const term = searchQuery.toLowerCase();
      return child.name.toLowerCase().includes(term) || child.nickname.toLowerCase().includes(term);
    });
  }, [children, searchQuery]);

  const selectedChildProducts = useMemo(
    () => enrichChildProducts(selectedChild, allProducts, activities),
    [selectedChild, allProducts, activities]
  );

  const availableChildActivities = useMemo(
    () => calculateChildActivities(selectedChildProducts, activities),
    [selectedChildProducts, activities]
  );

  const availableChildMonths = useMemo(
    () => calculateChildMonths(selectedChildProducts),
    [selectedChildProducts]
  );

  const availableChildCategories = useMemo(() => {
    const set = new Set<string>(['Tất cả', ...PRODUCT_CATEGORIES]);
    selectedChildProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [selectedChildProducts]);

  const filteredChildProducts = useMemo(
    () =>
      filterChildProducts(
        selectedChildProducts,
        selectedCategoryFilter,
        selectedActivityFilter,
        selectedMonthFilter,
        productSearch,
        availableChildActivities
      ),
    [
      selectedChildProducts,
      selectedCategoryFilter,
      selectedActivityFilter,
      selectedMonthFilter,
      productSearch,
      availableChildActivities,
    ]
  );

  const hasChildActiveFilter =
    selectedCategoryFilter !== 'Tất cả' ||
    selectedActivityFilter !== 'ALL' ||
    selectedMonthFilter !== 'ALL' ||
    Boolean(productSearch.trim());

  const resetChildFilters = () => {
    setSelectedCategoryFilter('Tất cả');
    setSelectedActivityFilter('ALL');
    setSelectedMonthFilter('ALL');
    setProductSearch('');
  };

  const handleDeleteProduct = async (productId: string, createdBy?: string) => {
    if (!isUserAdmin && createdBy && activeUserId && createdBy !== activeUserId) {
      setToast({
        text: 'Bạn không có quyền xóa sản phẩm này. Chỉ giáo viên đã đăng hoặc Quản trị viên mới có quyền xóa.',
        type: 'warning',
      });
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm học tập này của bé không?')) return;

    try {
      await deleteChildProduct(productId);
      setAllProducts((prev) => prev.filter((item) => item.id !== productId));
      setToast({ text: 'Đã xóa sản phẩm của bé thành công khỏi hệ thống.', type: 'success' });
    } catch (err: any) {
      const is403 = err?.status === 403 || String(err?.message || '').includes('403');
      setToast({
        text: is403
          ? 'Bạn không có quyền xóa sản phẩm này (chỉ người đăng hoặc Quản trị viên mới được xóa).'
          : 'Không thể xóa sản phẩm từ hệ thống.',
        type: is403 ? 'warning' : 'error',
      });
    }
  };

  return {
    children,
    activities,
    loading,
    selectedChild,
    setSelectedChild,
    searchQuery,
    setSearchQuery,
    productSearch,
    setProductSearch,
    selectedActivityFilter,
    setSelectedActivityFilter,
    selectedMonthFilter,
    setSelectedMonthFilter,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    ...form,
    lightboxOpen,
    setLightboxOpen,
    lightboxIndex,
    setLightboxIndex,
    toast,
    setToast,
    activeUserId,
    isUserAdmin,
    loadData,
    childProductCountMap,
    filteredChildren,
    selectedChildProducts,
    availableChildActivities,
    availableChildMonths,
    availableChildCategories,
    filteredChildProducts,
    hasChildActiveFilter,
    resetChildFilters,
    handleDeleteProduct,
    className: classInfo?.tenLop || 'Lớp của cô',
  };
}
