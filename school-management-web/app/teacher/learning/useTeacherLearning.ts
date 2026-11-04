import { useEffect, useState, useMemo } from 'react';
import { api, getMediaUrl, currentUser } from '@/services';
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
import {
  uploadProductMediaFile,
  submitChildProduct,
  deleteChildProduct,
} from './productActions';

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

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [productTitle, setProductTitle] = useState<string>('');
  const [productActivityId, setProductActivityId] = useState<string>('');
  const [productActivityTitle, setProductActivityTitle] = useState<string>('');
  const [productDate, setProductDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [productCategory, setProductCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [productComment, setProductComment] = useState<string>('');
  const [uploadedMediaId, setUploadedMediaId] = useState<string>('');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [submittingProduct, setSubmittingProduct] = useState<boolean>(false);

  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const [toast, setToast] = useState<{
    text: string;
    type: 'success' | 'error' | 'warning';
  } | null>(null);

  const activeUserId = currentUser()?.id;
  const isUserAdmin = currentUser()?.roles.includes('ADMIN');

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

      const productsRes = await api
        .get<any>('learning', '/api/learning/products?pageSize=100')
        .catch(() => []);
      const itemsList = Array.isArray(productsRes)
        ? productsRes
        : (productsRes as any)?.items || [];

      setAllProducts(itemsList);
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

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    setToast(null);
    try {
      const res = await uploadProductMediaFile(file);
      setUploadedMediaId(res.mediaId);
      setMediaPreviewUrl(res.previewUrl);
      setToast({ text: `Đã tải lên tệp "${file.name}" thành công!`, type: 'success' });
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Tải tệp lên thất bại. Vui lòng thử lại.',
        type: 'error',
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitProduct = async () => {
    if (!selectedChild) return;
    const targetChildId = selectedChild.apiId || String(selectedChild.id);

    if (!productTitle.trim()) {
      setToast({ text: 'Vui lòng nhập tiêu đề sản phẩm của bé.', type: 'error' });
      return;
    }
    if (!uploadedMediaId) {
      setToast({ text: 'Vui lòng chọn hình ảnh hoặc video sản phẩm của bé.', type: 'error' });
      return;
    }

    setSubmittingProduct(true);
    try {
      await submitChildProduct({
        targetChildId,
        childName: selectedChild.name,
        classInfo,
        productTitle,
        productActivityId,
        productActivityTitle,
        productCategory,
        productDate,
        productComment,
        uploadedMediaId,
      });

      setProductTitle('');
      setProductActivityId('');
      setProductActivityTitle('');
      setProductComment('');
      setUploadedMediaId('');
      setMediaPreviewUrl('');
      setShowAddForm(false);
      setToast({
        text: `Đã lưu sản phẩm "${productTitle.trim()}" cho bé ${selectedChild.name} thành công!`,
        type: 'success',
      });

      const productsRes = await api.get<any>('learning', '/api/learning/products?pageSize=100').catch(() => []);
      setAllProducts(Array.isArray(productsRes) ? productsRes : (productsRes as any)?.items || []);
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Không thể lưu sản phẩm của bé.',
        type: 'error',
      });
    } finally {
      setSubmittingProduct(false);
    }
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
    showAddForm,
    setShowAddForm,
    productTitle,
    setProductTitle,
    productActivityId,
    setProductActivityId,
    productDate,
    setProductDate,
    productCategory,
    setProductCategory,
    productComment,
    setProductComment,
    uploadedMediaId,
    setUploadedMediaId,
    mediaPreviewUrl,
    setMediaPreviewUrl,
    uploadingFile,
    submittingProduct,
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
    handleFileUpload,
    handleSubmitProduct,
    handleDeleteProduct,
    setProductActivityTitle,
    className: classInfo?.tenLop || 'Lớp của cô',
  };
}
