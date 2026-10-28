export interface EnrollmentApplication {
  id: string;
  tenTre: string;
  gioiTinh: string;
  ngaySinh: string;
  danToc: string;
  canNang?: number | string;
  chieuCao?: number | string;
  tienSuBenh?: string;
  conThuMay?: number | string;
  tongSoCon?: number | string;
  namHoc?: string;
  tenCha?: string;
  namSinhCha?: number | string;
  trinhDoCha?: string;
  ngheNghiepCha?: string;
  noiLamViecCha?: string;
  dienThoaiCha?: string;
  tenMe?: string;
  namSinhMe?: number | string;
  trinhDoMe?: string;
  ngheNghiepMe?: string;
  noiLamViecMe?: string;
  dienThoaiMe?: string;
  diaChiThuongTru?: string;
  hoKhauThuongTru?: string;
  noiOHienNay?: string;
  choOHienNay?: string;
  tenChuHo?: string;
  dienThoaiLienHe?: string;
  emailPhuHuynh?: string;
  doiTuongUuTien?: string;
  khoiMongMuon?: string;
  lopPhanCongId?: string;
  ghiChu?: string;
  trangThai: "CHO_DUYET" | "DA_DUYET" | "TU_CHOI" | "ChoDuyet" | "DaNhapHoc" | "TuChoi" | string;
  ngayDangKy?: string;
  createdAt?: string;
}

export async function getEnrollments(params?: {
  status?: string;
  q?: string;
}): Promise<EnrollmentApplication[]> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.q) q.set("q", params.q);
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await fetch(`/api/enrollment${qs}`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function submitEnrollment(data: Partial<EnrollmentApplication>): Promise<{
  success: boolean;
  id: string;
  message: string;
}> {
  const res = await fetch("/api/enrollment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Gửi hồ sơ tuyển sinh thất bại");
  }
  return await res.json();
}

export async function updateEnrollmentStatus(params: {
  ids: string[];
  action: "APPROVE" | "REJECT" | "DELETE";
  targetStatus?: string;
  classId?: string;
}): Promise<any> {
  const res = await fetch("/api/enrollment", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Cập nhật hồ sơ thất bại");
  }
  return await res.json();
}

export async function deleteEnrollment(id: string): Promise<void> {
  const res = await fetch(`/api/enrollment?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Xóa hồ sơ thất bại");
  }
}
