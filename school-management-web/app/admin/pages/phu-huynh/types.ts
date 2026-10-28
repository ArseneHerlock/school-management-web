export type Parent = {
  id: string;
  hoTen: string;
  soDienThoai: string;
  email?: string;
  diaChi?: string;
  moiQuanHe?: string;
  ngheNghiep?: string;
  noiLamViec?: string;
  cccd?: string;
  ngaySinh?: string;
  gioiTinh?: string;
  taiKhoanId?: string;
};

export type Child = {
  studentId: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  lopId?: string;
  trangThaiHoc: string;
  quanHe: string;
  laLienHeChinh: boolean;
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

export const initials = (x: string) =>
  x
    .split(/\s+/)
    .map((a) => a[0])
    .join('')
    .slice(-2)
    .toUpperCase();
