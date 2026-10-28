export type Student = {
  id: string
  tenHocSinh: string
  lopId?: string
  trangThaiHoc?: string
  ngaySinh?: string
  gioiTinh?: string
}

export type ClassRow = { id: string; tenLop: string; khoiId?: string; siSo?: number }
export type Grade = { id: string; tenKhoi: string }

export type AttendanceRecord = {
  id: string
  coBanGhi: boolean
  trangThai: string
  gioDen?: string | null
  gioVe?: string | null
  ghiChu?: string | null
}

export type HistoryRecord = {
  id: string
  hocSinhId: string
  ngay: string
  trangThai: string
  gioDen?: string | null
  gioVe?: string | null
  ghiChu?: string | null
}

export type AdminAttTab = 'dashboard' | 'monitoring'
