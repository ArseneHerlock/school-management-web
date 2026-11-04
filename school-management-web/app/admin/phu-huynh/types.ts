export type Parent = {
  id: string;
  hoTen: string;
  soDienThoai: string;
  email?: string | null;
  diaChi?: string | null;
  moiQuanHe?: string | null;
  ngheNghiep?: string | null;
  noiLamViec?: string | null;
  cccd?: string | null;
  soCccd?: string | null;
  ngaySinh?: string | null;
  gioiTinh?: string | null;
  taiKhoanId?: string | null;
  userId?: string | null;
};

export type Child = {
  id?: string;
  studentId: string;
  tenHocSinh: string;
  hoTen?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  lopId?: string;
  tenLop?: string;
  trangThaiHoc?: string;
  quanHe?: string;
  relationship?: string;
  laLienHeChinh?: boolean;
};

export type Cls = {
  id: string;
  tenLop: string;
  giaoVienChuNhiemId: string;
  khoiId?: string;
};

export type Staff = {
  staffId: string;
  fullName: string;
};

export type Grade = {
  id: string;
  tenKhoi: string;
};

export const emptyParentForm = {
  hoTen: '',
  soDienThoai: '',
  email: '',
  diaChi: '',
  moiQuanHe: 'Bố',
  ngheNghiep: '',
  noiLamViec: '',
  cccd: '',
  ngaySinh: '',
  gioiTinh: 'Nam',
};
