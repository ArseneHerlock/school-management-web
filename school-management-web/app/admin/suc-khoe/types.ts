import { classifyWhoBmi } from "@/app/teacher/health/components/whoStandards";

export type HealthCategoryFilter =
  | "ALL"
  | "DAT_CHUAN"
  | "THAP_COI"
  | "THAP_COI_NANG"
  | "NHE_CAN"
  | "NHE_CAN_NANG"
  | "GAY_COM"
  | "GAY_COM_NANG"
  | "THUA_CAN"
  | "BEO_PHI"
  | "CHUA_DO";

export interface CategoryMeta {
  key: HealthCategoryFilter;
  label: string;
  shortLabel: string;
  color: string;
  criteria: string;
  description: string;
}

export const WHO_9_CATEGORIES: CategoryMeta[] = [
  {
    key: "DAT_CHUAN",
    label: "Đạt chuẩn WHO (Bình thường)",
    shortLabel: "Đạt chuẩn WHO",
    color: "#10b981",
    criteria: "-2 SD ≤ HAZ, WAZ, WHZ ≤ +2 SD",
    description: "Chiều cao, cân nặng và thể trạng phát triển cân đối theo chuẩn WHO 2006.",
  },
  {
    key: "THAP_COI",
    label: "Thấp còi (Suy dinh dưỡng chiều cao)",
    shortLabel: "Thấp còi",
    color: "#3b82f6",
    criteria: "HAZ: -3 SD ≤ Z < -2 SD",
    description: "Chiều cao theo tuổi thấp hơn mức chuẩn, cần bổ sung vi chất Canxi, D3, Kẽm.",
  },
  {
    key: "THAP_COI_NANG",
    label: "Thấp còi nặng",
    shortLabel: "Thấp còi nặng",
    color: "#6366f1",
    criteria: "HAZ: Z < -3 SD",
    description: "Chiều cao theo tuổi thiếu hụt nghiêm trọng, cần can thiệp y tế chuyên khoa.",
  },
  {
    key: "NHE_CAN",
    label: "Nhẹ cân (Suy dinh dưỡng cân nặng)",
    shortLabel: "Nhẹ cân",
    color: "#f59e0b",
    criteria: "WAZ: -3 SD ≤ Z < -2 SD",
    description: "Cân nặng theo tuổi thấp hơn chuẩn, cần tăng cường bữa phụ giàu đạm và năng lượng.",
  },
  {
    key: "NHE_CAN_NANG",
    label: "Nhẹ cân nặng",
    shortLabel: "Nhẹ cân nặng",
    color: "#f43f5e",
    criteria: "WAZ: Z < -3 SD",
    description: "Cân nặng thiếu hụt nghiêm trọng theo tuổi, nguy cơ suy kiệt.",
  },
  {
    key: "GAY_COM",
    label: "Gầy còm (Cân nặng / Chiều cao thấp)",
    shortLabel: "Gầy còm",
    color: "#ea580c",
    criteria: "WHZ: -3 SD ≤ Z < -2 SD",
    description: "Thể trạng gầy còm cấp tính, cân nặng không tương xứng với chiều cao hiện tại.",
  },
  {
    key: "GAY_COM_NANG",
    label: "Gầy còm nặng",
    shortLabel: "Gầy còm nặng",
    color: "#dc2626",
    criteria: "WHZ: Z < -3 SD",
    description: "Suy dinh dưỡng cấp tính nặng, cần chế độ phục hồi dinh dưỡng đặc biệt.",
  },
  {
    key: "THUA_CAN",
    label: "Thừa cân",
    shortLabel: "Thừa cân",
    color: "#8b5cf6",
    criteria: "+2 SD < WHZ ≤ +3 SD hoặc WAZ > +2 SD",
    description: "Cân nặng vượt chuẩn so với chiều cao, cần theo dõi khẩu phần ăn và tăng vận động.",
  },
  {
    key: "BEO_PHI",
    label: "Béo phì",
    shortLabel: "Béo phì",
    color: "#be185d",
    criteria: "WHZ > +3 SD hoặc WAZ > +3 SD",
    description: "Cân nặng vượt ngưỡng +3 SD, nguy cơ bệnh lý chuyển hóa, cần điều chỉnh dinh dưỡng.",
  },
];

export const CATEGORY_NAMES: Record<HealthCategoryFilter, string> = {
  ALL: "Tất cả học sinh",
  DAT_CHUAN: "Đạt chuẩn WHO",
  THAP_COI: "Thấp còi",
  THAP_COI_NANG: "Thấp còi nặng",
  NHE_CAN: "Nhẹ cân",
  NHE_CAN_NANG: "Nhẹ cân nặng",
  GAY_COM: "Gầy còm",
  GAY_COM_NANG: "Gầy còm nặng",
  THUA_CAN: "Thừa cân",
  BEO_PHI: "Béo phì",
  CHUA_DO: "Chưa có số đo",
};

export const HEALTH_CATEGORY_COLORS: Record<string, string> = {
  "Đạt chuẩn WHO": "#10b981",
  "Đạt chuẩn (Bình thường)": "#10b981",
  "Thấp còi": "#3b82f6",
  "Thấp còi nặng": "#6366f1",
  "Nhẹ cân": "#f59e0b",
  "Nhẹ cân nặng": "#f43f5e",
  "Gầy còm": "#ea580c",
  "Gầy còm nặng": "#dc2626",
  "Thừa cân": "#8b5cf6",
  "Béo phì": "#be185d",
  "Chưa có số đo": "#94a3b8",
};

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

export const colors = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#f43f5e", "#ea580c", "#dc2626", "#8b5cf6", "#be185d", "#94a3b8"];

export function getQuarterFromDate(dateStr?: string): string {
  if (!dateStr) return "Đợt khám định kỳ";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Đợt khám định kỳ";
  const m = d.getMonth() + 1;
  const q = Math.ceil(m / 3);
  return `Quý ${q}/${d.getFullYear()}`;
}
