import { api, normalizeList } from "./client";

export interface Student {
  id: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId?: string | null;
  trangThaiHoc?: string;
  createdAt?: string;
}

export interface CreateStudentInput {
  id?: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId?: string | null;
  trangThaiHoc?: string;
}

export interface UpdateStudentInput {
  tenHocSinh?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  diaChi?: string;
  lopId?: string | null;
  trangThaiHoc?: string;
}

export interface StudentParentLink {
  id?: string;
  hocSinhId?: string;
  studentId?: string;
  phuHuynhId?: string;
  parentId?: string;
  moiQuanHe?: string;
  [key: string]: any;
}

/**
 * Lấy danh sách học sinh theo bộ lọc lớp hoặc từ khóa tìm kiếm
 */
export async function getStudents(filterParameters?: {
  lopId?: string;
  search?: string;
}): Promise<Student[]> {
  const queryParameters = new URLSearchParams();

  if (filterParameters?.lopId) {
    queryParameters.set("lopId", filterParameters.lopId);
  }
  if (filterParameters?.search) {
    queryParameters.set("search", filterParameters.search);
  }

  let endpointUrl = "/api/students";
  const queryString = queryParameters.toString();
  if (queryString.length > 0) {
    endpointUrl = endpointUrl + "?" + queryString;
  }

  const rawResponse = await api.get<any>("students", endpointUrl);
  return normalizeList<Student>(rawResponse);
}

/**
 * Lấy toàn bộ liên kết Học sinh - Phụ huynh
 */
export async function getStudentParentLinks(): Promise<StudentParentLink[]> {
  const res = await api.get<any>("students", "/api/students/all-links").catch(() => []);
  return normalizeList<StudentParentLink>(res);
}

/**
 * Lấy thông tin chi tiết một học sinh theo ID
 */
export async function getStudentById(studentId: string): Promise<Student> {
  return await api.get<Student>("students", `/api/students/${studentId}`);
}

/**
 * Lấy danh sách học sinh theo ID phụ huynh
 */
export async function getStudentsByParent(parentId: string): Promise<Student[]> {
  const encodedParentId = encodeURIComponent(parentId);
  const rawResponse = await api.get<any>("students", `/api/students/parent/${encodedParentId}`);
  return normalizeList<Student>(rawResponse);
}

/**
 * Thêm mới một hồ sơ học sinh
 */
export async function createStudent(studentData: CreateStudentInput): Promise<Student> {
  return await api.post<Student>("students", "/api/students", studentData);
}

/**
 * Cập nhật thông tin hồ sơ học sinh
 */
export async function updateStudent(
  studentId: string,
  updatedData: UpdateStudentInput
): Promise<Student> {
  return await api.put<Student>("students", `/api/students/${studentId}`, updatedData);
}

/**
 * Xóa một hồ sơ học sinh khỏi hệ thống
 */
export async function deleteStudent(studentId: string): Promise<void> {
  await api.delete("students", `/api/students/${studentId}`);
}
