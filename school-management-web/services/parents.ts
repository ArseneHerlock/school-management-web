import { api, normalizeList } from "./client";

export interface Parent {
  id: string;
  hoTen: string;
  moiQuanHe?: string | null;
  soDienThoai: string;
  email?: string | null;
  diaChi?: string | null;
  ngheNghiep?: string | null;
  noiLamViec?: string | null;
  cccd?: string | null;
  ngaySinh?: string | null;
  gioiTinh?: string | null;
  taiKhoanId?: string | null;
  avatar?: string | null;
}

export type ParentProfile = Parent;

export interface UpdateParentInput {
  hoTen?: string;
  moiQuanHe?: string | null;
  soDienThoai?: string;
  email?: string | null;
  diaChi?: string | null;
  ngheNghiep?: string | null;
  noiLamViec?: string | null;
  cccd?: string | null;
  ngaySinh?: string | null;
  gioiTinh?: string | null;
  taiKhoanId?: string | null;
  avatar?: string | null;
  [key: string]: any;
}

/**
 * Lấy danh sách phụ huynh, có hỗ trợ tìm kiếm theo từ khóa
 */
export async function getParents(filterOptions?: { search?: string }): Promise<Parent[]> {
  const queryParameters = new URLSearchParams();
  if (filterOptions?.search) {
    queryParameters.set("search", filterOptions.search);
  }

  let endpointUrl = "/api/parents";
  const queryString = queryParameters.toString();
  if (queryString.length > 0) {
    endpointUrl = endpointUrl + "?" + queryString;
  }

  const rawResponse = await api.get<any>("parents", endpointUrl);
  return normalizeList<Parent>(rawResponse);
}

/**
 * Lấy thông tin phụ huynh theo ID
 */
export async function getParentById(parentId: string): Promise<Parent> {
  return await api.get<Parent>("parents", `/api/parents/${parentId}`);
}

/** Hồ sơ của phụ huynh đang đăng nhập; backend xác định tài khoản từ JWT. */
export async function getCurrentParentProfile(): Promise<Parent> {
  return await api.get<Parent>("parents", "/api/parents/me");
}

/**
 * Tìm hồ sơ phụ huynh theo ID tài khoản đăng nhập (UserId)
 */
export async function getParentByUserId(userId: string): Promise<Parent | null> {
  const parentList = await getParents();
  const matchedParent = parentList.find(function (parentItem) {
    return parentItem.taiKhoanId === userId;
  });

  if (matchedParent) {
    return matchedParent;
  }
  return null;
}

/**
 * Tạo mới hồ sơ phụ huynh
 */
export async function createParent(parentData: UpdateParentInput): Promise<Parent> {
  return await api.post<Parent>("parents", "/api/parents", parentData);
}

/**
 * Cập nhật thông tin phụ huynh
 */
export async function updateParent(
  parentId: string,
  updatedData: UpdateParentInput
): Promise<Parent> {
  return await api.put<Parent>("parents", `/api/parents/${parentId}`, updatedData);
}

/**
 * Xóa một hồ sơ phụ huynh khỏi hệ thống
 */
export async function deleteParent(parentId: string): Promise<void> {
  await api.delete("parents", `/api/parents/${parentId}`);
}

/** Persists the signed-in parent's profile through the BFF profile endpoint. */
export async function saveParentProfile(data: UpdateParentInput): Promise<void> {
  await api.put<Parent>("parents", "/api/parents/me", data);
}
