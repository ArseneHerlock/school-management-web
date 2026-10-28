import { api, normalizeList } from "./client";

export interface HealthRecord {
  id?: string;
  hocSinhId: string;
  ngayDo?: string;
  ngayKham?: string;
  thang?: number;
  nam?: number;
  chieuCao?: number;
  canNang?: number;
  vongDau?: number;
  vongNguc?: number;
  bmi?: number;
  tinhTrangDinhDuong?: string;
  tinhTrangSucKhoe?: string;
  ghiChu?: string | null;

  // Chuẩn WHO (0 - 5 tuổi) do Backend tính toán
  thangTuoi?: number;
  haz?: number; // Height-for-Age Z-score
  waz?: number; // Weight-for-Age Z-score
  whz?: number; // Weight-for-Height Z-score
  ketLuanHaz?: string; // e.g. "Chiều cao phát triển bình thường" | "Suy dinh dưỡng thể thấp còi"
  ketLuanWaz?: string; // e.g. "Cân nặng bình thường theo tuổi" | "Suy dinh dưỡng thể nhẹ cân"
  ketLuanWhz?: string; // e.g. "Thể trạng cân đối" | "Gầy còm" | "Nguy cơ thừa cân" | "Thừa cân" | "Béo phì"
  ketLuanTongThe?: string;
  trangThaiTheTrang?: string; // "BINH_THUONG" | "THAP_COI" | "NHE_CAN" | "GAY_COM" | "NGUY_CO_THUA_CAN" | "THUA_CAN" | "BEO_PHI"
  canCanThiep?: boolean;
  loiKhuyen?: string;

  [key: string]: any;
}

export interface WhoCurvePoint {
  x: number; // Tháng tuổi hoặc Chiều cao (cm)
  sdNeg3: number;
  sdNeg2: number;
  sdNeg1: number;
  median: number;
  sdPos1: number;
  sdPos2: number;
  sdPos3: number;
}

export interface WhoGrowthChartData {
  hocSinhId: string;
  tenHocSinh: string;
  ngaySinh?: string;
  gioiTinh: string;
  thangTuoiHienTai: number;
  hazCurve: WhoCurvePoint[];
  wazCurve: WhoCurvePoint[];
  whzCurve: WhoCurvePoint[];
  lichSuDo: HealthRecord[];
  lanDoMoiNhat?: HealthRecord;
}

export interface WhoClassSummary {
  tongSoHocSinh: number;
  soDaDo: number;
  soChuaDo: number;
  soBinhThuong: number;
  soThapCoi: number;
  soNheCan: number;
  soGayCom: number;
  soNguyCoThuaCan: number;
  soThuaCan: number;
  soBeoPhi: number;
  danhSachCanCanThiep: HealthRecord[];
}

export async function getAllHealthRecords(): Promise<HealthRecord[]> {
  const res = await api.get<any>("health", "/api/SucKhoe").catch(() => []);
  return normalizeList<HealthRecord>(res);
}

export async function getHealthRecords(
  childId: string,
  params?: { ngaySinh?: string; gioiTinh?: string }
): Promise<HealthRecord[]> {
  const query = new URLSearchParams();
  if (params?.ngaySinh) query.set("ngaySinh", params.ngaySinh);
  if (params?.gioiTinh) query.set("gioiTinh", params.gioiTinh);
  const qs = query.toString() ? `?${query.toString()}` : "";
  const res = await api
    .get<any>("health", `/api/SucKhoe/lich-su/${encodeURIComponent(childId)}${qs}`)
    .catch(() => []);
  return normalizeList<HealthRecord>(res);
}

export async function getWhoGrowthChart(
  childId: string,
  params?: { tenHocSinh?: string; ngaySinh?: string; gioiTinh?: string }
): Promise<WhoGrowthChartData> {
  const query = new URLSearchParams();
  if (params?.tenHocSinh) query.set("tenHocSinh", params.tenHocSinh);
  if (params?.ngaySinh) query.set("ngaySinh", params.ngaySinh);
  if (params?.gioiTinh) query.set("gioiTinh", params.gioiTinh);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return await api.get<WhoGrowthChartData>(
    "health",
    `/api/SucKhoe/who/bieu-do/${encodeURIComponent(childId)}${qs}`
  );
}

export async function getWhoClassSummary(
  hocSinhIds: string[],
  ngayDo?: string
): Promise<WhoClassSummary> {
  return await api.post<WhoClassSummary>("health", "/api/SucKhoe/who/thong-ke-lop", {
    hocSinhIds,
    ngayDo: ngayDo || undefined,
  });
}

export async function getWhoStandardCurves(
  gioiTinh: string = "Nam"
): Promise<{ haz: WhoCurvePoint[]; waz: WhoCurvePoint[]; whz: WhoCurvePoint[] }> {
  return await api.get<any>("health", `/api/SucKhoe/who/chuan-curves?gioiTinh=${encodeURIComponent(gioiTinh)}`);
}

export async function createHealthRecord(data: HealthRecord): Promise<HealthRecord> {
  return await api.post<HealthRecord>("health", "/api/SucKhoe", data);
}

export async function createBatchHealthRecords(data: {
  thang: number;
  nam: number;
  danhSach: Array<{
    hocSinhId: string;
    chieuCao: number;
    canNang: number;
    ngaySinh?: string;
    gioiTinh?: string;
    tinhTrangSucKhoe?: string;
    ghiChu?: string | null;
  }>;
}): Promise<any> {
  return await api.post("health", "/api/SucKhoe/hang-loat", data);
}

export async function updateHealthRecord(
  id: string,
  data: Partial<HealthRecord>
): Promise<HealthRecord> {
  return await api.put<HealthRecord>("health", `/api/SucKhoe/${id}`, data);
}

export async function deleteHealthRecord(id: string): Promise<void> {
  await api.delete("health", `/api/SucKhoe/${encodeURIComponent(id)}`);
}
