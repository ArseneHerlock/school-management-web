import { classifyWhoBmi } from "@/app/teacher/health/components/whoStandards";

export type HealthCategoryFilter =
  | "ALL"
  | "DAT_CHUAN"
  | "NHE_CAN"
  | "NHE_CAN_NANG"
  | "THAP_COI"
  | "THAP_COI_NANG"
  | "GAY_COM"
  | "GAY_COM_NANG"
  | "THUA_CAN"
  | "BEO_PHI"
  | "CHUA_DO";

export type Student = {
  id: string;
  tenHocSinh: string;
  ngaySinh: string;
  gioiTinh: string;
  lopId?: string;
  trangThaiHoc: string;
};

export type ClassRow = {
  id: string;
  tenLop: string;
  khoiId?: string;
  tenKhoi?: string;
};

export type Grade = {
  id: string;
  tenKhoi: string;
};

export type RecordRow = {
  id: string;
  hocSinhId: string;
  ngayDo: string;
  chieuCao?: number;
  canNang?: number;
  vongDau?: number;
  vongNguc?: number;
  ghiChu?: string;
  haz?: number;
  waz?: number;
  whz?: number;
  ketLuanHaz?: string;
  ketLuanWaz?: string;
  ketLuanWhz?: string;
  ketLuanTongThe?: string;
  trangThaiTheTrang?: string;
  canCanThiep?: boolean;
  loiKhuyen?: string;
};

export const bmi = (h?: number, w?: number) =>
  h && w && h > 0 ? w / (h / 100) ** 2 : 0;

export const classify = (v: number, gender?: string, dob?: string) =>
  !v || v <= 0 ? "Chưa có chỉ số" : classifyWhoBmi(v, gender, dob).shortLabel;

export const colors = ["#43a968", "#f59e0b", "#ef4444", "#14b8a6", "#64748b"];

export function getQuarterFromDate(dateStr?: string): string {
  if (!dateStr) return "Đợt khám định kỳ";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Đợt khám định kỳ";
  const m = d.getMonth() + 1;
  const q = Math.ceil(m / 3);
  return `Quý ${q}/${d.getFullYear()}`;
}
