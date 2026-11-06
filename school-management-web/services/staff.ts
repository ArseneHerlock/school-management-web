import { api, normalizeList } from "./client";

export interface Staff {
  staffId: string;
  userId?: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string | null;
  positionId: string;
  hireDate: string;
  status: string;
  staffCode?: string;
}

export interface CreateStaffInput {
  userId?: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  address?: string;
  positionId: string;
  hireDate: string;
  status?: string;
  [key: string]: any;
}

export interface UpdateStaffInput {
  userId?: string | null;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  positionId?: string;
  hireDate?: string;
  status?: string;
  [key: string]: any;
}

export interface StaffPosition {
  positionId: string;
  positionName: string;
  description?: string;
  [key: string]: any;
}

export interface StaffAssignment {
  assignmentId: string;
  staffId: string;
  classId: string;
  roleInClass?: string;
  schoolYear?: string;
  [key: string]: any;
}

/**
 * Bộ nhớ đệm danh sách nhân viên ngắn hạn (In-Memory Cache) chống Over-fetching
 */
let staffCache: { timestamp: number; data: Staff[] } | null = null;
const STAFF_CACHE_TTL_MS = 30_000;

/**
 * Lấy danh sách nhân sự / cán bộ giáo viên (Có hỗ trợ cache ngắn hạn)
 */
export async function getStaff(filterOptions?: { search?: string; forceRefresh?: boolean }): Promise<Staff[]> {
  const isSearch = Boolean(filterOptions?.search && filterOptions.search.trim().length > 0);
  const now = Date.now();

  if (filterOptions?.forceRefresh) {
    staffCache = null;
  }

  if (!isSearch && !filterOptions?.forceRefresh && staffCache && now - staffCache.timestamp < STAFF_CACHE_TTL_MS) {
    return staffCache.data;
  }

  const queryParameters = new URLSearchParams();
  if (filterOptions?.search) {
    queryParameters.set("search", filterOptions.search.trim());
  }

  let endpointUrl = "/api/Staff";
  const queryString = queryParameters.toString();
  if (queryString.length > 0) {
    endpointUrl = endpointUrl + "?" + queryString;
  }

  const rawResponse = await api.get<any>("staff", endpointUrl);
  const list = normalizeList<Staff>(rawResponse);

  if (!isSearch) {
    staffCache = { timestamp: now, data: list };
  }

  return list;
}

export function invalidateStaffCache(): void {
  staffCache = null;
}

/**
 * Lấy thông tin chi tiết một nhân sự theo ID
 */
export async function getStaffById(staffId: string): Promise<Staff> {
  return await api.get<Staff>("staff", `/api/Staff/${staffId}`);
}

/**
 * Tìm kiếm hồ sơ nhân sự theo ID tài khoản người dùng
 * Sử dụng trực tiếp API /api/Staff/user/{userId} của Backend, không kéo full bảng nhân sự
 */
export async function getStaffByUserId(userId: string): Promise<Staff | null> {
  if (!userId) return null;
  try {
    const directResult = await api.get<Staff>("staff", `/api/Staff/user/${userId}`);
    if (directResult && (directResult.staffId || (directResult as any).id)) {
      return directResult;
    }
  } catch {
    // Fallback nếu tài khoản chưa được liên kết trực tiếp
  }

  // Fallback an toàn qua getStaff (đã có in-memory cache)
  const staffList = await getStaff();
  const matchedStaff = staffList.find(function (staffItem) {
    return staffItem.userId === userId;
  });

  return matchedStaff || null;
}

/**
 * Thêm mới một nhân sự vào hệ thống
 */
export async function createStaff(staffData: CreateStaffInput): Promise<Staff> {
  invalidateStaffCache();
  try {
    const result = await api.post<Staff>("staff", "/api/Staff", staffData);
    return result;
  } finally {
    invalidateStaffCache();
  }
}

/**
 * Cập nhật thông tin nhân sự
 */
export async function updateStaff(
  staffId: string,
  updatedData: UpdateStaffInput
): Promise<Staff> {
  invalidateStaffCache();
  try {
    const result = await api.put<Staff>("staff", `/api/Staff/${staffId}`, updatedData);
    return result;
  } finally {
    invalidateStaffCache();
  }
}

/**
 * Xóa một nhân sự theo ID
 */
export async function deleteStaff(staffId: string): Promise<void> {
  invalidateStaffCache();
  try {
    await api.delete("staff", `/api/Staff/${staffId}`);
  } finally {
    invalidateStaffCache();
  }
}

/**
 * Lấy danh sách chức vụ (Positions)
 */
export async function getPositions(): Promise<StaffPosition[]> {
  const res = await api.get<any>("staff", "/api/Position").catch(() => []);
  return normalizeList<StaffPosition>(res);
}

/**
 * Lấy danh sách phân công lớp học (Assignments)
 */
export async function getAssignments(): Promise<StaffAssignment[]> {
  const res = await api.get<any>("staff", "/api/Assignment").catch(() => []);
  return normalizeList<StaffAssignment>(res);
}

/**
 * Tạo mới phân công lớp học cho nhân sự
 */
export async function createAssignment(data: Partial<StaffAssignment>): Promise<StaffAssignment> {
  invalidateStaffCache();
  try {
    const result = await api.post<StaffAssignment>("staff", "/api/Assignment", data);
    return result;
  } finally {
    invalidateStaffCache();
  }
}

/**
 * Xóa phân công lớp học
 */
export async function deleteAssignment(assignmentId: string): Promise<void> {
  invalidateStaffCache();
  try {
    await api.delete("staff", `/api/Assignment/${encodeURIComponent(assignmentId)}`);
  } finally {
    invalidateStaffCache();
  }
}
