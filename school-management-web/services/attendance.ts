import { api, normalizeList } from "./client";

export interface AttendanceRecord {
  id?: string;
  hocSinhId: string;
  ngay: string;
  trangThai: "Có mặt" | "Vắng có phép" | "Vắng không phép" | "Đi muộn" | string;
  ghiChu?: string;
  gioDen?: string | null;
  gioVe?: string | null;
  nguoiDiemDanhId?: string;
}

export interface AttendanceHistoryItem {
  id: string;
  ngay: string;
  trangThai: string;
  ghiChu?: string;
  gioDen?: string;
  gioVe?: string;
  nguoiDua?: string;
  nguoiDon?: string;
}

/**
 * Lấy toàn bộ danh sách điểm danh
 */
export async function getAllAttendances(): Promise<AttendanceRecord[]> {
  try {
    const rawResponse = await api.get<any>("attendance", "/api/DiemDanh");
    return normalizeList<AttendanceRecord>(rawResponse);
  } catch {
    return [];
  }
}

/**
 * Lấy danh sách điểm danh của toàn trường theo ngày cụ thể
 */
export async function getDailyAttendance(
  targetDate: string
): Promise<AttendanceRecord[]> {
  try {
    const encodedDate = encodeURIComponent(targetDate);
    const rawResponse = await api.get<any>(
      "attendance",
      `/api/DiemDanh/today/all?date=${encodedDate}`
    );
    return normalizeList<AttendanceRecord>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải danh sách điểm danh theo ngày:", error);
    return [];
  }
}

/**
 * Lấy lịch sử điểm danh của một học sinh theo khoảng thời gian
 */
export async function getChildAttendanceHistory(
  childId: string,
  fromDate?: string,
  toDate?: string
): Promise<AttendanceHistoryItem[]> {
  try {
    const queryParameters = new URLSearchParams();
    if (fromDate) {
      queryParameters.set("from", fromDate);
    }
    if (toDate) {
      queryParameters.set("to", toDate);
    }

    let endpointUrl = `/api/DiemDanh/history/${encodeURIComponent(childId)}`;
    const queryString = queryParameters.toString();
    if (queryString.length > 0) {
      endpointUrl = endpointUrl + "?" + queryString;
    }

    const rawResponse = await api.get<any>("attendance", endpointUrl);
    return normalizeList<AttendanceHistoryItem>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải lịch sử điểm danh của học sinh:", error);
    return [];
  }
}

/**
 * Ghi nhận điểm danh đến cho học sinh
 */
export async function checkInStudent(payload: {
  hocSinhId: string;
  trangThai?: string;
  ngay?: string;
}): Promise<any> {
  return await api.post("attendance", "/api/diemdanh/den", payload);
}

/**
 * Ghi nhận điểm danh về cho học sinh
 */
export async function checkOutStudent(payload: {
  hocSinhId: string;
  ngay?: string;
}): Promise<any> {
  return await api.post("attendance", "/api/diemdanh/ve", payload);
}

/**
 * Ghi nhận điểm danh cho một học sinh
 */
export async function recordAttendance(attendanceData: AttendanceRecord): Promise<any> {
  return await api.post("attendance", "/api/DiemDanh", attendanceData);
}

/**
 * Ghi nhận điểm danh hàng loạt cho cả lớp
 */
export async function recordBatchAttendance(
  attendanceRecordsList: AttendanceRecord[]
): Promise<any> {
  return await api.post("attendance", "/api/DiemDanh/batch", attendanceRecordsList);
}

/**
 * Lấy lịch sử điểm danh của một học sinh (dành cho quản trị)
 */
export async function getStudentAttendanceHistory(studentId: string): Promise<AttendanceHistoryItem[]> {
  const rawResponse = await api.get<any>("attendance", `/api/DiemDanh/history/student/${studentId}`);
  return normalizeList<AttendanceHistoryItem>(rawResponse);
}

