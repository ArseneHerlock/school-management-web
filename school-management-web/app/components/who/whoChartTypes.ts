import { HealthRecord } from "@/services/health";

export interface WhoGrowthChartProps {
  childId?: string;
  records?: HealthRecord[];
  gender?: string;
  dob?: string;
  studentName?: string;
  className?: string;
  height?: number;
}

export const WHO_TABLES = [
  {
    title: "A. HAZ – Chiều cao theo tuổi",
    badge: "Thấp còi",
    border: "border-blue-100 bg-blue-50/40 text-blue-900",
    headerBg: "bg-blue-100/60 text-blue-950",
    rows: [
      { z: "Z-score ≥ -2", label: "Bình thường", color: "text-emerald-700" },
      { z: "-3 ≤ Z-score < -2", label: "Thấp còi", color: "text-amber-700" },
      { z: "Z-score < -3", label: "Thấp còi nặng", color: "text-rose-700" },
    ],
  },
  {
    title: "B. WAZ – Cân nặng theo tuổi",
    badge: "Cân nặng / Tuổi",
    border: "border-emerald-100 bg-emerald-50/40 text-emerald-900",
    headerBg: "bg-emerald-100/60 text-emerald-950",
    rows: [
      { z: "Z-score > +3", label: "Béo phì", color: "text-rose-700" },
      { z: "+2 < Z-score ≤ +3", label: "Thừa cân", color: "text-amber-700" },
      {
        z: "-2 ≤ Z-score ≤ +2",
        label: "Bình thường",
        color: "text-emerald-700",
      },
      { z: "-3 ≤ Z-score < -2", label: "Nhẹ cân", color: "text-amber-700" },
      { z: "Z-score < -3", label: "Nhẹ cân nặng", color: "text-rose-700" },
    ],
  },
  {
    title: "C. WHZ – Cân nặng / Chiều cao",
    badge: "Thể trạng & Thừa cân",
    border: "border-amber-100 bg-amber-50/40 text-amber-900",
    headerBg: "bg-amber-100/60 text-amber-950",
    rows: [
      { z: "Z-score > +3", label: "Béo phì", color: "text-rose-700" },
      { z: "+2 < Z-score ≤ +3", label: "Thừa cân", color: "text-orange-700" },
      {
        z: "-2 ≤ Z-score ≤ +2",
        label: "Bình thường",
        color: "text-emerald-700",
      },
      { z: "-3 ≤ Z-score < -2", label: "Gầy còm", color: "text-amber-700" },
      { z: "Z-score < -3", label: "Gầy còm nặng", color: "text-rose-700" },
    ],
  },
];
