import {
  AllergyDietAlert,
  KitchenDispatchStats,
  TuitionLedgerStats,
  AgeDistributionItem,
  WhoNutritionSummary,
  DomainProgressStat,
} from "./types";

export function aggregateKitchenAndTuition({
  studentsList,
  classesList,
  billingList,
  presentCount,
}: {
  studentsList: any[];
  classesList: any[];
  billingList: any[];
  presentCount: number;
}) {
  const allergyWatchlist: AllergyDietAlert[] = [];
  studentsList.forEach((s: any) => {
    if (s.ghiChuDiUng || s.diUng || s.tienSuBenh) {
      allergyWatchlist.push({
        childId: s.id,
        childName: s.tenHocSinh || s.hoTen,
        className:
          classesList.find((c: any) => c.id === s.lopId)?.tenLop ||
          "Chưa xếp lớp",
        allergen: s.ghiChuDiUng || s.diUng || "Lưu ý sức khỏe",
        notes: s.ghiChu || s.tienSuBenh || "Cần giám sát dinh dưỡng",
        severity: "high",
      });
    }
  });

  const kitchenDispatch: KitchenDispatchStats = {
    breakfastCount: presentCount,
    lunchCount: presentCount,
    afternoonSnackCount: presentCount,
    specialDietCount: allergyWatchlist.length,
    statusText:
      presentCount > 0
        ? `Đã chốt ${presentCount} suất ăn hôm nay theo dữ liệu điểm danh thực tế`
        : "Chưa có dữ liệu chốt suất ăn hôm nay",
    allergyWatchlist,
  };

  let totalExpected = 0;
  let totalCollected = 0;
  billingList.forEach((inv: any) => {
    totalExpected += Number(inv.totalAmount || inv.subTotal || 0);
    totalCollected += Number(inv.paidAmount || 0);
  });

  const totalOutstanding = Math.max(0, totalExpected - totalCollected);
  const collectionRate =
    totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const tuitionLedger: TuitionLedgerStats = {
    totalExpected,
    totalCollected,
    totalOutstanding,
    collectionRate,
    periodLabel: `Tháng ${currentMonth}/${currentYear}`,
  };

  return { kitchenDispatch, tuitionLedger, currentYear };
}

export function aggregateDemographicsAndHealth({
  activeStudents,
  healthList,
  domainsList,
  assessmentsList,
  totalEnrolled,
  currentYear,
}: {
  activeStudents: any[];
  healthList: any[];
  domainsList: any[];
  assessmentsList: any[];
  totalEnrolled: number;
  currentYear: number;
}) {
  // Age distribution
  let nhaTreCount = 0;
  let mamCount = 0;
  let choiCount = 0;
  let laCount = 0;

  activeStudents.forEach((student: any) => {
    const birthYear = student.ngaySinh
      ? new Date(student.ngaySinh).getFullYear()
      : null;
    if (birthYear) {
      const age = currentYear - birthYear;
      if (age <= 2) nhaTreCount++;
      else if (age === 3) mamCount++;
      else if (age === 4) choiCount++;
      else laCount++;
    }
  });

  const ageDistribution: AgeDistributionItem[] = [];
  const totalAged = nhaTreCount + mamCount + choiCount + laCount;
  if (totalEnrolled > 0 && totalAged > 0) {
    if (nhaTreCount > 0) {
      ageDistribution.push({
        groupName: "Nhóm Trẻ",
        ageRange: "12 - 36 tháng",
        count: nhaTreCount,
        percentage: Math.round((nhaTreCount / totalAged) * 100),
        color: "#f43f5e",
      });
    }
    if (mamCount > 0) {
      ageDistribution.push({
        groupName: "Khối Mầm",
        ageRange: "3 - 4 tuổi",
        count: mamCount,
        percentage: Math.round((mamCount / totalAged) * 100),
        color: "#f97316",
      });
    }
    if (choiCount > 0) {
      ageDistribution.push({
        groupName: "Khối Chồi",
        ageRange: "4 - 5 tuổi",
        count: choiCount,
        percentage: Math.round((choiCount / totalAged) * 100),
        color: "#0ea5e9",
      });
    }
    if (laCount > 0) {
      ageDistribution.push({
        groupName: "Khối Lá",
        ageRange: "5 - 6 tuổi",
        count: laCount,
        percentage: Math.round((laCount / totalAged) * 100),
        color: "#10b981",
      });
    }
  }

  // WHO nutrition
  const latestHealthMap = new Map<string, any>();
  healthList.forEach((rec: any) => {
    const sid = String(rec.hocSinhId || rec.HocSinhId || "");
    if (sid && !latestHealthMap.has(sid)) {
      latestHealthMap.set(sid, rec);
    }
  });

  let normalCount = 0;
  let underweightOrStuntedCount = 0;
  let overweightOrObeseCount = 0;

  latestHealthMap.forEach((rec) => {
    const tt = String(
      rec.trangThaiTheTrang || rec.tinhTrangDinhDuong || rec.ketLuanWhz || ""
    ).toUpperCase();
    if (
      tt.includes("THAP_COI") ||
      tt.includes("NHE_CAN") ||
      tt.includes("GAY_COM") ||
      tt.includes("SUY_DINH_DUONG")
    ) {
      underweightOrStuntedCount++;
    } else if (
      tt.includes("THUA_CAN") ||
      tt.includes("BEO_PHI") ||
      tt.includes("NGUY_CO_THUA_CAN")
    ) {
      overweightOrObeseCount++;
    } else {
      normalCount++;
    }
  });

  const measuredCount = latestHealthMap.size;
  const unmeasuredCount = Math.max(0, totalEnrolled - measuredCount);
  const normalPercent =
    measuredCount > 0 ? Math.round((normalCount / measuredCount) * 100) : 0;
  const underweightPercent =
    measuredCount > 0
      ? Math.round((underweightOrStuntedCount / measuredCount) * 100)
      : 0;
  const overweightPercent =
    measuredCount > 0
      ? Math.round((overweightOrObeseCount / measuredCount) * 100)
      : 0;

  const whoNutrition: WhoNutritionSummary = {
    totalStudents: totalEnrolled,
    measuredCount,
    normalCount,
    underweightOrStuntedCount,
    overweightOrObeseCount,
    unmeasuredCount,
    normalPercent,
    underweightPercent,
    overweightPercent,
  };

  // Domain progress
  const domainColors: Record<string, string> = {
    TC: "#10b981",
    NT: "#3b82f6",
    NN: "#8b5cf6",
    XH: "#f59e0b",
    TM: "#ec4899",
  };

  const domainListSource =
    domainsList.length > 0
      ? domainsList
      : [
          { id: "tc", code: "TC", name: "Phát triển Thể chất" },
          { id: "nt", code: "NT", name: "Phát triển Nhận thức" },
          { id: "nn", code: "NN", name: "Phát triển Ngôn ngữ" },
          { id: "xh", code: "XH", name: "Tình cảm & Kỹ năng xã hội" },
          { id: "tm", code: "TM", name: "Phát triển Thẩm mỹ" },
        ];

  const domainProgress: DomainProgressStat[] = domainListSource.map((d: any) => {
    const dCode = String(d.code || d.maLinhVuc || "").toUpperCase();
    const dName = d.name || d.tenLinhVuc || "Lĩnh vực phát triển";
    const relatedAssessments = assessmentsList.filter((a: any) => {
      return (
        a.developmentDomainId === d.id ||
        a.domainId === d.id ||
        String(a.domainCode || "").toUpperCase() === dCode ||
        String(a.domainName || "").includes(dName)
      );
    });
    const totalAssessments = relatedAssessments.length;
    const passCount = relatedAssessments.filter((a: any) => {
      const st = String(a.result || a.ketQua || "").toUpperCase();
      return st === "PASS" || st === "ĐẠT" || a.isPassed === true;
    }).length;
    const passRate =
      totalAssessments > 0 ? Math.round((passCount / totalAssessments) * 100) : 0;
    const prefix = dCode.slice(0, 2);
    const color = domainColors[prefix] || "#6366f1";

    return {
      domainId: d.id,
      domainName: dName,
      totalAssessments,
      passCount,
      passRate,
      color,
    };
  });

  return { ageDistribution, whoNutrition, domainProgress };
}
