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
}

export interface ChildInfo {
  id: string;
  hoTen: string;
  lop: string;
  khoi: string;
  giaoVienChuNhiem: string;
  sdtGiaoVien: string;
  avatar: string;
  ngaySinh: string;
  gioiTinh: string;
  maHocSinh: string;
}

export interface AttendanceDay {
  dayOfWeek: string;
  status: 'present' | 'leave' | 'ongoing' | 'absent';
  label: string;
  symbol: string;
}

export interface AbsenceRequest {
  id: string;
  reasonCategory: 'sick' | 'family' | 'travel' | 'other';
  reasonTitle: string;
  fromDate: string;
  toDate: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface MomentItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'child' | 'class';
  categoryLabel: string;
  date: string;
  likes: number;
  liked?: boolean;
}

export interface NewsItem {
  id: number;
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
  sender: 'teacher' | 'parent';
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
  status: 'paid' | 'pending';
}
