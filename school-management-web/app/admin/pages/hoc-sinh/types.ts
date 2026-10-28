export type Student = {
  id: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId?: string | null;
  trangThaiHoc?: string;
};

export type Cls = {
  id: string;
  tenLop: string;
  siSo: number;
  giaoVienChuNhiemId: string;
};

export type StudentFormState = {
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  lopId: string;
  trangThaiHoc: string;
};

export const emptyStudentForm: StudentFormState = {
  tenHocSinh: "",
  ngaySinh: "",
  gioiTinh: "Nam",
  diaChi: "",
  lopId: "",
  trangThaiHoc: "Đang học",
};
