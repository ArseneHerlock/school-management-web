import { useState } from 'react';
import { PRODUCT_CATEGORIES } from './types';
import { Child } from '../data';
import { uploadProductMediaFile, submitChildProduct } from './productActions';

export function useProductForm(
  selectedChild: Child | null,
  classInfo: any,
  setToast: (toast: { text: string; type: 'success' | 'error' | 'warning' } | null) => void,
  onProductSubmitted: () => Promise<void>
) {
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

      await onProductSubmitted();
    } catch (err: any) {
      setToast({
        text: err instanceof Error ? err.message : 'Không thể lưu sản phẩm của bé.',
        type: 'error',
      });
    } finally {
      setSubmittingProduct(false);
    }
  };

  return {
    showAddForm,
    setShowAddForm,
    productTitle,
    setProductTitle,
    productActivityId,
    setProductActivityId,
    productActivityTitle,
    setProductActivityTitle,
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
    handleFileUpload,
    handleSubmitProduct,
  };
}
