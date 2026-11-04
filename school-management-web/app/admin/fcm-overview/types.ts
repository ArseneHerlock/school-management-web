export interface ChildFCM {
  ChildId: string;
  TenHocSinh: string;
  GioiTinh: string;
  TenLop: string;
  ClusterId: number;
  ClusterName: string;
  PreviousClusterId?: number | null;
  Trend?: string | null;
  Memberships?: Record<string, number> | null;
  RadarScores?: Record<string, number> | null;
}

export interface ClassBreakdown {
  ClassId: string;
  TenLop: string;
  TotalStudents: number;
  Cluster1: number;
  Cluster2: number;
  Cluster3: number;
  Cluster4: number;
  Evaluated: number;
}

export const CLUSTER_CONFIG: Record<
  number,
  {
    name: string;
    shortName: string;
    color: string;
    bg: string;
    border: string;
    desc: string;
  }
> = {
  1: {
    name: "Nhóm 1: Phát triển xuất sắc & Nổi trội",
    shortName: "Xuất sắc - Nổi trội",
    color: "#10b981", // Emerald
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Đạt vượt mức các chỉ tiêu phát triển 5 lĩnh vực",
  },
  2: {
    name: "Nhóm 2: Phát triển tốt (Đạt chuẩn)",
    shortName: "Đạt chuẩn tốt",
    color: "#3b82f6", // Blue
    bg: "bg-blue-50",
    border: "border-blue-200",
    desc: "Đạt chuẩn hầu hết các chỉ tiêu theo lứa tuổi",
  },
  3: {
    name: "Nhóm 3: Phát triển mức khá (Đang phát triển)",
    shortName: "Mức khá",
    color: "#f59e0b", // Amber
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Đang tiệm cận chuẩn, cần củng cố một số chỉ tiêu",
  },
  4: {
    name: "Nhóm 4: Cần đồng hành & Rèn luyện thêm",
    shortName: "Cần rèn luyện",
    color: "#ef4444", // Rose/Red
    bg: "bg-rose-50",
    border: "border-rose-200",
    desc: "Chưa đạt nhiều chỉ tiêu, cần giáo viên hỗ trợ tăng cường",
  },
};
