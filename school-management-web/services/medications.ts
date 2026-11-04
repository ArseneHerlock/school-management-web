export interface MedicationItem {
  Id: string;
  HocSinhId: string;
  PhuHuynhId?: string;
  TenNguoiGui?: string;
  TenThuoc: string;
  LieuLuong: string;
  GioUongDuKien: string;
  NgayUong: string;
  LoiNhan?: string;
  HinhAnhThuoc?: string;
  BaoQuan?: string;
  TrangThai: 'CHO_TIEP_NHAN' | 'DA_TIEP_NHAN' | 'DA_CHO_UONG' | 'SU_CO';
  GiaoVienXacNhan?: string;
  GioUongThucTe?: string;
  GhiChuGiaoVien?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  TenHocSinh?: string;
  NgaySinh?: string;
  GioiTinh?: string;
  LopId?: string;
  TenLop?: string;
}

export interface SpecialConditionItem {
  Id: string;
  HocSinhId: string;
  LoaiBenh: 'TIM_MACH' | 'THAN_KINH_CO_GIAT' | 'HEN_SUYEN' | 'DI_UNG' | 'KHAC';
  TenBenh: string;
  MucDoNguyHiem: number; // 1: Nhẹ, 2: Cần lưu ý, 3: Nguy hiểm
  LuuYVanDong?: string;
  LuuYAnUong?: string;
  PhacDoSoCuu?: string;
  SoDienThoaiKhanCap?: string;
  BacSiDieuTri?: string;
  GhiChu?: string;
  CreatedAt: string;
  UpdatedAt?: string;
  TenHocSinh?: string;
  NgaySinh?: string;
  GioiTinh?: string;
  LopId?: string;
  TenLop?: string;
}

export async function fetchMedications(params?: {
  childId?: string;
  classId?: string;
  date?: string;
  allDates?: boolean;
}): Promise<MedicationItem[]> {
  const query = new URLSearchParams();
  if (params?.childId) query.set('childId', params.childId);
  if (params?.classId) query.set('classId', params.classId);
  if (params?.date) query.set('date', params.date);
  if (params?.allDates) query.set('allDates', 'true');

  const res = await fetch(`/api/medications?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Không thể tải danh sách đơn dặn thuốc');
  }
  return res.json();
}

export async function createMedicationRequest(data: {
  hocSinhId: string;
  phuHuynhId?: string;
  tenNguoiGui?: string;
  tenThuoc: string;
  lieuLuong: string;
  gioUongDuKien: string;
  ngayUong?: string;
  loiNhan?: string;
  hinhAnhThuoc?: string;
  baoQuan?: string;
}): Promise<MedicationItem> {
  const res = await fetch('/api/medications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể tạo đơn dặn thuốc');
  }
  return res.json();
}

export async function updateMedicationStatus(data: {
  id: string;
  trangThai: 'CHO_TIEP_NHAN' | 'DA_TIEP_NHAN' | 'DA_CHO_UONG' | 'SU_CO';
  gioUongThucTe?: string;
  giaoVienXacNhan?: string;
  ghiChuGiaoVien?: string;
}): Promise<MedicationItem> {
  const res = await fetch('/api/medications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể cập nhật trạng thái đơn thuốc');
  }
  return res.json();
}

export async function fetchSpecialConditions(params?: {
  childId?: string;
  classId?: string;
}): Promise<SpecialConditionItem[]> {
  const query = new URLSearchParams();
  if (params?.childId) query.set('childId', params.childId);
  if (params?.classId) query.set('classId', params.classId);

  const res = await fetch(`/api/special-conditions?${query.toString()}`);
  if (!res.ok) {
    throw new Error('Không thể tải danh sách bệnh lý đặc biệt');
  }
  return res.json();
}

export async function saveSpecialCondition(data: {
  id?: string;
  hocSinhId: string;
  loaiBenh: string;
  tenBenh: string;
  mucDoNguyHiem?: number;
  luuYVanDong?: string;
  luuYAnUong?: string;
  phacDoSoCuu?: string;
  soDienThoaiKhanCap?: string;
  bacSiDieuTri?: string;
  ghiChu?: string;
  [key: string]: any;
}): Promise<SpecialConditionItem> {
  const res = await fetch('/api/special-conditions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể lưu hồ sơ bệnh lý đặc biệt');
  }
  return res.json();
}

export async function deleteSpecialCondition(id: string): Promise<void> {
  const res = await fetch(`/api/special-conditions?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Không thể xóa hồ sơ bệnh lý');
  }
}
