export type ReportScope = "school" | "grade" | "class";
export type PeriodScope = "month" | "cumulative";

export interface ReportItemDef {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  defaultChecked: boolean;
  badge: string;
  iconName:
    | "students"
    | "attendance"
    | "health"
    | "meds"
    | "meals"
    | "pickup"
    | "finance"
    | "staff";
}

export const REPORT_DEFINITIONS: ReportItemDef[] = [
  {
    id: "si_so_hoc_sinh",
    category: "1. Học sinh & Cơ cấu Nhóm lớp",
    title: "Báo cáo sĩ số học sinh và phân bố nhóm lớp",
    subtitle: "Thống kê sĩ số thực tế theo từng lớp, khối và cơ cấu giới tính",
    description: "Tổng hợp học sinh thực tế theo khối, sĩ số từng lớp và tỷ lệ nam/nữ.",
    defaultChecked: true,
    badge: "Học sinh & Lớp học",
    iconName: "students",
  },
  {
    id: "chuyen_can_diem_danh",
    category: "2. Chuyên cần & Điểm danh bán trú",
    title: "Báo cáo tỷ lệ chuyên cần và nghỉ học của học sinh",
    subtitle: "Thống kê lượt có mặt, vắng có phép và không phép",
    description: "Tỷ lệ chuyên cần thực tế từ dữ liệu điểm danh và đơn xin nghỉ phép.",
    defaultChecked: true,
    badge: "Chuyên cần",
    iconName: "attendance",
  },
  {
    id: "theo_doi_suc_khoe",
    category: "3. Y tế học đường & Thể lực trẻ",
    title: "Báo cáo theo dõi thể lực và phát triển chuẩn WHO",
    subtitle: "Tình hình cân nặng, chiều cao, chỉ số HAZ/WAZ/WHZ",
    description: "Chỉ số thể lực thực tế và phân loại chuẩn phát triển thể chất WHO.",
    defaultChecked: true,
    badge: "Thể lực WHO",
    iconName: "health",
  },
  {
    id: "y_te_don_thuoc",
    category: "3. Y tế học đường & Thể lực trẻ",
    title: "Báo cáo y tế đặc biệt & Nhật ký dặn thuốc",
    subtitle: "Danh sách trẻ có bệnh lý nền, dị ứng và nhật ký uống thuốc",
    description: "Theo dõi chăm sóc riêng (dị ứng, bệnh lý) và nhật ký phụ huynh gửi dặn thuốc.",
    defaultChecked: true,
    badge: "Y tế & Đơn thuốc",
    iconName: "meds",
  },
  {
    id: "ban_tru_hoan_tien_an",
    category: "4. Dinh dưỡng & Bán trú nhà trường",
    title: "Báo cáo quyết toán bán trú & Khấu trừ hoàn trả tiền ăn",
    subtitle: "Số ngày nghỉ có phép và tiền ăn hoàn trả cho phụ huynh",
    description: "Khấu trừ hoàn trả tiền ăn bán trú (45.000 đ/ngày) vào hóa đơn kỳ sau.",
    defaultChecked: true,
    badge: "Bán trú & Tiền ăn",
    iconName: "meals",
  },
  {
    id: "an_toan_dua_don",
    category: "5. An toàn & Đưa đón học sinh",
    title: "Báo cáo an toàn đưa đón và tình hình đón muộn",
    subtitle: "Nhật ký giờ đón, người đưa đón ủy quyền và ca đón muộn",
    description: "Giám sát giờ đến, giờ về, người đón và các trường hợp đón trẻ trễ sau 17h00.",
    defaultChecked: true,
    badge: "An toàn đưa đón",
    iconName: "pickup",
  },
  {
    id: "tai_chinh_hoc_phi",
    category: "6. Tài chính & Kế toán học phí",
    title: "Báo cáo tài chính, hóa đơn học phí và công nợ thực tế",
    subtitle: "Doanh thu học phí, số tiền đã thu và danh sách công nợ",
    description: "Thống kê tổng phát hành hóa đơn, thực thu và danh sách học sinh còn công nợ.",
    defaultChecked: true,
    badge: "Tài chính & Công nợ",
    iconName: "finance",
  },
  {
    id: "doi_ngu_nhan_su",
    category: "7. Đội ngũ Cán bộ - Giáo viên - Nhân viên",
    title: "Báo cáo đội ngũ cán bộ, giáo viên và nhân sự",
    subtitle: "Thống kê nhân sự theo chức vụ, phòng ban và phân công",
    description: "Cơ cấu nhân sự nhà trường: giáo viên, bảo mẫu, cấp dưỡng, trạng thái làm việc.",
    defaultChecked: true,
    badge: "Nhân sự",
    iconName: "staff",
  },
];

export interface ReportFilterState {
  scope: ReportScope;
  selectedGradeId: string;
  selectedClassId: string;
  selectedMonth: number;
  selectedYear: number;
  periodScope: PeriodScope;
  searchKeyword: string;
}

export interface ReportRawData {
  students: any[];
  classes: any[];
  grades: any[];
  staff: any[];
  attendance: any[];
  health: any[];
  invoices: any[];
  fees: any[];
  leaves: any[];
  medications: any[];
  specialConditions: any[];
  mealDeductionData: {
    students: any[];
    totalSchoolDeduction: number;
    totalAbsentDays: number;
  };
}

export interface ReportCalculatedMetrics {
  scopeLabel: string;
  totalStudents: number;
  totalClasses: number;
  maleCount: number;
  femaleCount: number;
  totalAttendance: number;
  presentCount: number;
  absentPermitted: number;
  absentUnpermitted: number;
  attendanceRate: string;
  totalHealthRecords: number;
  normalHealth: number;
  specialWatchCount: number;
  specialWatchList: any[];
  relevantSpecialCond: any[];
  relevantMeds: any[];
  relevantMealStudents: any[];
  totalMealDeduction: number;
  totalMealAbsentDays: number;
  pickupRecordsCount: number;
  latePickupsCount: number;
  latePickups: any[];
  totalInvoiced: number;
  totalCollected: number;
  totalOutstanding: number;
  unpaidInvoices: any[];
  totalStaff: number;
  activeStaff: number;
  classesBreakdown: any[];
  gradesBreakdown: any[];
}

export function exportToCsv(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
  suffix = "",
) {
  const csvContent =
    "\uFEFF" +
    [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}${suffix ? `_${suffix}` : ""}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
