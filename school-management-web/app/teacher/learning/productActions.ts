import { api, uploadMedia, getMediaUrl } from '@/services';
import { buildMomentDescription } from '@/lib/moments';

export interface SubmitProductArgs {
  targetChildId: string;
  childName: string;
  classInfo: any;
  productTitle: string;
  productActivityId: string;
  productActivityTitle: string;
  productCategory: string;
  productDate: string;
  productComment: string;
  uploadedMediaId: string;
}

export async function uploadProductMediaFile(file: File) {
  const uploadRes = await uploadMedia(file);
  const mediaId = uploadRes.id || uploadRes.mediaId || '';
  if (!mediaId) {
    throw new Error('Không nhận được mã định danh tệp từ MediaService.');
  }
  const previewUrl = uploadRes.url || getMediaUrl(mediaId);
  return { mediaId, previewUrl };
}

export async function submitChildProduct(args: SubmitProductArgs) {
  const currentClassId = args.classInfo?.id || args.classInfo?.Id || '';
  const currentClassName = args.classInfo?.tenLop || args.classInfo?.TenLop || '';
  const fullDescription = buildMomentDescription({
    classId: currentClassId ? String(currentClassId) : undefined,
    className: currentClassName || undefined,
    childId: args.targetChildId,
    childName: args.childName,
    activityId: args.productActivityId || undefined,
    activityTitle: args.productActivityTitle.trim() || args.productTitle.trim(),
    category: args.productCategory,
    date: args.productDate || new Date().toISOString().slice(0, 10),
    note: args.productComment.trim(),
  });

  await api.post('learning', '/api/learning/products', {
    childId: args.targetChildId,
    activityId: args.productActivityId || null,
    mediaId: args.uploadedMediaId,
    title: args.productTitle.trim(),
    description: fullDescription,
  });
}

export async function deleteChildProduct(productId: string) {
  await api.delete('learning', `/api/learning/products/${productId}`);
}
