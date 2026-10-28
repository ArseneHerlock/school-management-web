export interface ParentProfile {
  id: string;
  hoTen: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  moiQuanHe: string;
  ngheNghiep: string;
  noiLamViec: string;
  cccd: string;
  ngaySinh: string;
  gioiTinh: string;
  avatar?: string;
  taiKhoanId?: string;
}

export interface ChildInfo {
  id: string;
  hoTen: string;
  lop: string;
  classId?: string;
  khoi: string;
  giaoVienChuNhiem: string;
  giaoVienUserId?: string;
  giaoVienStaffId?: string;
  sdtGiaoVien: string;
  avatar: string;
  ngaySinh: string;
  gioiTinh: string;
  maHocSinh: string;
}

export const EMPTY_PARENT: ParentProfile = {
  id: '',
  hoTen: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
  moiQuanHe: '',
  ngheNghiep: '',
  noiLamViec: '',
  cccd: '',
  ngaySinh: '',
  gioiTinh: '',
};

export const ACTIVE_CHILD: ChildInfo = {
  id: '',
  hoTen: '',
  lop: '',
  khoi: '',
  giaoVienChuNhiem: '',
  sdtGiaoVien: '',
  avatar: '',
  ngaySinh: '',
  gioiTinh: '',
  maHocSinh: '',
};

export interface AttendanceDay {
  dayOfWeek: string;
  status: "present" | "leave" | "ongoing" | "absent";
  label: string;
  symbol: string;
}

export interface AbsenceRequest {
  id: string;
  reasonCategory: "sick" | "family" | "travel" | "other";
  reasonTitle: string;
  fromDate: string;
  toDate: string;
  note: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface MomentItem {
  id: string;
  title: string;
  imageUrl: string;
  category: "child" | "class";
  categoryLabel: string;
  date: string;
  likes: number;
  liked?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  icon: string;
  badge?: string;
  isImportant?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "teacher" | "parent";
  senderName: string;
  text: string;
  time: string;
  avatarText: string;
}

export interface TuitionItem {
  name: string;
  amount: number;
}

export interface TuitionPaymentHistory {
  id: string;
  period: string;
  date: string;
  method: string;
  amount: number;
  status: "paid" | "pending";
}
