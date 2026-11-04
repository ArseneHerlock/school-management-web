export interface EnrollmentApp {
  Id: string;
  TenTre: string;
  GioiTinh: string;
  NgaySinh: string;
  DanToc: string;
  CanNang: string;
  ChieuCao: string;
  TienSuBenh: string;
  ConThuMay: string;
  TongSoCon: string;
  NamHoc: string;
  TenCha: string;
  NamSinhCha: string;
  TrinhDoCha: string;
  NgheNghiepCha: string;
  NoiLamViecCha: string;
  DienThoaiCha: string;
  TenMe: string;
  NamSinhMe: string;
  TrinhDoMe: string;
  NgheNghiepMe: string;
  NoiLamViecMe: string;
  DienThoaiMe: string;
  HoKhauThuongTru: string;
  ChoOHienNay: string;
  TenChuHo: string;
  DienThoaiLienHe: string;
  TrangThai: "ChoDuyet" | "DaNhapHoc" | "TuChoi" | string;
  KhoiMongMuon: string;
  GhiChu: string;
  CreatedAt: string;
}

export interface EnrollmentClassOption {
  id: string;
  tenLop: string;
  namHoc?: string;
  [key: string]: unknown;
}
