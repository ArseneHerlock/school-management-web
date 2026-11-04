export type ClassItem = {
  id: string;
  tenLop: string;
  siSo: number;
  namHoc: string;
  giaoVienChuNhiemId: string;
  giaoVienPhuId?: string;
  khoiId: string;
  tenKhoi?: string;
  tenGiaoVienChuNhiem?: string;
  tenGiaoVienPhu?: string;
  siSoThucTe?: number;
};

export type Grade = {
  id: string;
  maKhoi: string;
  tenKhoi: string;
};

export type Staff = {
  staffId: string;
  id?: string;
  fullName: string;
  staffCode?: string;
  phoneNumber?: string;
  email?: string;
};

export type Student = {
  id: string;
  tenHocSinh: string;
  lopId?: string;
  trangThaiHoc: string;
};
