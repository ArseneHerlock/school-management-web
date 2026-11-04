export interface SchoolAward {
  Id: string;
  ChildId: string;
  ClassId: string;
  SchoolYear: string;
  Semester: number;
  AwardTitle: string;
  SuggestedTitle: string;
  AttendanceRate: number;
  HealthStatus: string;
  ActivityPassRate?: number;
  TeacherNote?: string;
  Status: string;
  CertificateCode?: string;
  TenHocSinh: string;
  GioiTinh: string;
  TenLop: string;
}

export interface AwardStats {
  totalAwards?: number;
  approvedCount?: number;
  pendingCount?: number;
  beTaiNang?: number;
  beKhoeBeNgoan?: number;
  beChuyenCan?: number;
  beChamNgoan?: number;
  beTienBo?: number;
  [key: string]: unknown;
}
