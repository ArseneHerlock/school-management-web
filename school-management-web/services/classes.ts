import { api, normalizeList } from "./client";

export interface SchoolClass {
  id: string;
  tenLop: string;
  siSo: number;
  namHoc: string;
  giaoVienChuNhiemId: string;
  giaoVienPhuId?: string;
  khoiId: string;
  siSoThucTe?: number;
  tenKhoi?: string;
  tenGiaoVienChuNhiem?: string;
  tenGiaoVienPhu?: string;
  phongHoc?: string;
  ghiChu?: string;
}

export interface PagedClassResult {
  items: SchoolClass[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetClassesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  khoiId?: string;
}

export interface CreateClassInput {
  tenLop: string;
  siSo: number;
  namHoc: string;
  giaoVienChuNhiemId: string;
  giaoVienPhuId?: string;
  khoiId: string;
  phongHoc?: string;
  ghiChu?: string;
}

export interface UpdateClassInput {
  tenLop?: string;
  siSo?: number;
  namHoc?: string;
  giaoVienChuNhiemId?: string;
  giaoVienPhuId?: string;
  khoiId?: string;
  phongHoc?: string;
  ghiChu?: string;
}

/**
 * Bộ nhớ đệm danh sách lớp học ngắn hạn (In-Memory Cache) chống gọi lặp lại liên tục
 */
let classesCache: { timestamp: number; data: SchoolClass[] } | null = null;
const CLASSES_CACHE_TTL_MS = 30_000;

/**
 * Lấy toàn bộ danh sách lớp học (Có hỗ trợ cache ngắn hạn)
 */
export async function getClasses(forceRefresh = false): Promise<SchoolClass[]> {
  const now = Date.now();
  if (!forceRefresh && classesCache && now - classesCache.timestamp < CLASSES_CACHE_TTL_MS) {
    return classesCache.data;
  }

  const rawResponse = await api.get<any>("classes", "/api/Lop");
  const list = normalizeList<SchoolClass>(rawResponse);
  classesCache = { timestamp: now, data: list };
  return list;
}

export function invalidateClassesCache(): void {
  classesCache = null;
}

/**
 * Lấy danh sách lớp học phân trang kèm tìm kiếm và lọc phía Backend (Chuẩn Enterprise)
 */
export async function getClassesPaged(params: GetClassesParams = {}): Promise<PagedClassResult> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.khoiId && params.khoiId !== "ALL") query.set("khoiId", params.khoiId);

  const qs = query.toString();
  const endpoint = qs ? `/api/Lop?${qs}` : "/api/Lop";
  const res = await api.get<any>("classes", endpoint);

  if (res && Array.isArray(res.items)) {
    return {
      items: res.items,
      totalCount: res.totalCount ?? res.items.length,
      page: res.page ?? 1,
      pageSize: res.pageSize ?? 20,
      totalPages: res.totalPages ?? 1,
    };
  }

  const list = normalizeList<SchoolClass>(res);
  return {
    items: list,
    totalCount: list.length,
    page: 1,
    pageSize: list.length || 20,
    totalPages: 1,
  };
}

/**
 * Lấy thông tin chi tiết một lớp học theo ID
 */
export async function getClassById(classId: string): Promise<SchoolClass> {
  return await api.get<SchoolClass>("classes", `/api/Lop/${classId}`);
}

/**
 * Tạo một lớp học mới
 */
export async function createClass(classData: CreateClassInput): Promise<SchoolClass> {
  return await api.post<SchoolClass>("classes", "/api/Lop", classData);
}

/**
 * Cập nhật thông tin một lớp học
 */
export async function updateClass(
  classId: string,
  updatedData: UpdateClassInput
): Promise<SchoolClass> {
  return await api.put<SchoolClass>("classes", `/api/Lop/${classId}`, updatedData);
}

/**
 * Xóa một lớp học theo ID
 */
export async function deleteClass(classId: string): Promise<void> {
  await api.delete("classes", `/api/Lop/${classId}`);
}
