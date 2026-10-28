import { api, normalizeList } from "./client";

export interface FlowerRecord {
  id: string;
  flowerType: number; // 1: Hoa nhỏ, 2: Hoa lớn
  flowerDate: string;
  reason: string;
  isRevoked: boolean;
  revokedReason?: string;
}

export interface GoodChildRecord {
  id: string;
  childId: string;
  month: number;
  year: number;
  dailyFlowerCount: number;
  bonusFlowerCount: number;
  teacherComment?: string;
  parentFeedback?: string;
  flowers: FlowerRecord[];
  createdAt?: string;
}

export interface LearningProduct {
  id: string;
  childId: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  scope?: number;
  createdAt: string;
}

export async function getGoodChildRecords(params?: {
  childId?: string;
  month?: number;
  year?: number;
  pageSize?: number;
}): Promise<GoodChildRecord[]> {
  const q = new URLSearchParams();
  if (params?.childId) q.set("childId", params.childId);
  if (params?.month) q.set("month", String(params.month));
  if (params?.year) q.set("year", String(params.year));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api.get<any>("learning", `/api/learning/good-child-records${qs}`).catch(() => []);
  return normalizeList<GoodChildRecord>(res);
}

export async function createGoodChildRecord(data: {
  childId: string;
  month: number;
  year: number;
  teacherComment?: string;
}): Promise<GoodChildRecord> {
  return await api.post<GoodChildRecord>("learning", "/api/learning/good-child-records", data);
}

export async function awardFlower(
  recordId: string,
  data: { flowerDate: string; reason: string }
): Promise<GoodChildRecord> {
  return await api.post<GoodChildRecord>(
    "learning",
    `/api/learning/good-child-records/${recordId}/flowers`,
    data
  );
}

export async function revokeFlower(
  recordId: string,
  flowerId: string,
  reason: string
): Promise<GoodChildRecord> {
  return await api.post<GoodChildRecord>(
    "learning",
    `/api/learning/good-child-records/${recordId}/flowers/${flowerId}/revoke`,
    { reason }
  );
}

export async function updateParentFeedback(
  recordId: string,
  feedback: string
): Promise<void> {
  await api.put("learning", `/api/learning/good-child-records/${recordId}/parent-feedback`, {
    feedback,
  });
}

export async function updateTeacherComment(
  recordId: string,
  comment: string
): Promise<GoodChildRecord> {
  return await api.put<GoodChildRecord>(
    "learning",
    `/api/learning/good-child-records/${recordId}/comment`,
    { comment }
  );
}

export async function getLearningProducts(childId?: string): Promise<LearningProduct[]> {
  const q = childId ? `?childId=${encodeURIComponent(childId)}` : "";
  const res = await api.get<any>("learning", `/api/learning/products${q}`).catch(() => []);
  return normalizeList<LearningProduct>(res);
}

export async function getAllLearningProducts(pageSize = 100): Promise<LearningProduct[]> {
  const res = await api.get<any>("learning", `/api/learning/products?pageSize=${pageSize}`);
  return normalizeList<LearningProduct>(res);
}

export async function createLearningProduct(data: Partial<LearningProduct> & { [key: string]: any }): Promise<LearningProduct> {
  return await api.post<LearningProduct>("learning", "/api/learning/products", data);
}

export async function deleteLearningProduct(id: string): Promise<void> {
  await api.delete("learning", `/api/learning/products/${id}`);
}

export async function updateGoodChildTeacherComment(
  recordId: string,
  comment: string
): Promise<any> {
  return await api.put(
    "learning",
    `/api/learning/good-child-records/${recordId}/teacher-comment`,
    { comment }
  );
}

