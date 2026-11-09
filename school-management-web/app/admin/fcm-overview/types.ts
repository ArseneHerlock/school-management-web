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
    name: "Cụm 1: Phát triển Toàn diện / Vượt trội",
    shortName: "Toàn diện - Vượt trội",
    color: "#10b981", // Emerald
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Phát triển xuất sắc ở cả 5 lĩnh vực, thẩm mỹ sáng tạo và nhận thức nổi trội",
  },
  2: {
    name: "Cụm 2: Phát triển Đạt chuẩn / Vững vàng",
    shortName: "Đạt chuẩn - Vững vàng",
    color: "#3b82f6", // Blue
    bg: "bg-blue-50",
    border: "border-blue-200",
    desc: "Đạt chuẩn vững vàng 4 lĩnh vực cốt lõi theo mốc phát triển Bộ GD&ĐT",
  },
  3: {
    name: "Cụm 3: Phát triển Không đồng đều / Lệch pha",
    shortName: "Không đồng đều",
    color: "#f59e0b", // Amber
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Nhận thức hoặc thể chất khá nhưng có độ vênh ở kỹ năng xã hội hoặc ngôn ngữ",
  },
  4: {
    name: "Cụm 4: Có nguy cơ chậm phát triển / Cần hỗ trợ can thiệp sớm",
    shortName: "Cần hỗ trợ can thiệp",
    color: "#ef4444", // Rose/Red
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Rơi vào vùng cần can thiệp sớm, nhà trường và gia đình cần phối hợp hỗ trợ",
  },
};
