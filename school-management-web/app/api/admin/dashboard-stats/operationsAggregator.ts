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
        className: classesList.find((c: any) => c.id === s.lopId)?.tenLop || "Chưa xếp lớp",
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
        ? `Đã chốt ${presentCount} học sinh có mặt hôm nay theo dữ liệu điểm danh thực tế`
        : "Chưa có dữ liệu điểm danh hôm nay",
    allergyWatchlist,
  };

  let totalExpected = 0;
  let totalCollected = 0;
  billingList.forEach((inv: any) => {
    totalExpected += Number(inv.totalAmount || inv.subTotal || 0);
    totalCollected += Number(inv.paidAmount || 0);
  });

  const totalOutstanding = Math.max(0, totalExpected - totalCollected);
  const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
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

function computeAgeDistribution(activeStudents: any[], currentYear: number, totalEnrolled: number): AgeDistributionItem[] {
  let nhaTre = 0, mam = 0, choi = 0, la = 0;
  activeStudents.forEach((student: any) => {
    const birthYear = student.ngaySinh ? new Date(student.ngaySinh).getFullYear() : null;
    if (birthYear) {
      const age = currentYear - birthYear;
      if (age <= 2) nhaTre++;
      else if (age === 3) mam++;
      else if (age === 4) choi++;
      else la++;
    }
  });

  const items: AgeDistributionItem[] = [];
  const total = nhaTre + mam + choi + la;
  if (totalEnrolled > 0 && total > 0) {
    if (nhaTre > 0) items.push({ groupName: "Nhóm Trẻ", ageRange: "12 - 36 tháng", count: nhaTre, percentage: Math.round((nhaTre / total) * 100), color: "#f43f5e" });
    if (mam > 0) items.push({ groupName: "Khối Mầm", ageRange: "3 - 4 tuổi", count: mam, percentage: Math.round((mam / total) * 100), color: "#f97316" });
    if (choi > 0) items.push({ groupName: "Khối Chồi", ageRange: "4 - 5 tuổi", count: choi, percentage: Math.round((choi / total) * 100), color: "#0ea5e9" });
    if (la > 0) items.push({ groupName: "Khối Lá", ageRange: "5 - 6 tuổi", count: la, percentage: Math.round((la / total) * 100), color: "#10b981" });
  }
  return items;
}

function computeWhoNutrition(healthList: any[], totalEnrolled: number): WhoNutritionSummary {
  const sorted = [...healthList].sort((a: any, b: any) => {
    const da = String(a.ngayDo || a.NgayDo || a.createdAt || "");
    const db = String(b.ngayDo || b.NgayDo || b.createdAt || "");
    return db.localeCompare(da);
  });

  const map = new Map<string, any>();
  sorted.forEach((rec: any) => {
    const sid = String(rec.hocSinhId || rec.HocSinhId || "");
    if (sid && !map.has(sid)) map.set(sid, rec);
  });

  const cleanText = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
  let normalCount = 0, stuntedCount = 0, severelyStuntedCount = 0;
  let underweightCount = 0, severelyUnderweightCount = 0, wastedCount = 0, severelyWastedCount = 0;
  let overweightCount = 0, obeseCount = 0;

  map.forEach((rec) => {
    const raw = `${rec.trangThaiTheTrang || ""} ${rec.ketLuanHaz || ""} ${rec.ketLuanWaz || ""} ${rec.ketLuanWhz || ""} ${rec.ghiChu || ""}`;
    const clean = cleanText(raw);
    const haz = rec.haz != null ? Number(rec.haz) : null;
    const waz = rec.waz != null ? Number(rec.waz) : null;
    const whz = rec.whz != null ? Number(rec.whz) : null;

    if ((haz !== null && haz < -3) || clean.includes("thap coi nang")) severelyStuntedCount++;
    else if ((haz !== null && haz < -2) || clean.includes("thap coi")) stuntedCount++;
    else if ((waz !== null && waz < -3) || clean.includes("nhe can nang")) severelyUnderweightCount++;
    else if ((waz !== null && waz < -2) || clean.includes("nhe can")) underweightCount++;
    else if ((whz !== null && whz < -3) || clean.includes("gay com nang")) severelyWastedCount++;
    else if ((whz !== null && whz < -2) || clean.includes("gay com")) wastedCount++;
    else if ((whz !== null && whz > 3) || (waz !== null && waz > 3) || clean.includes("beo phi")) obeseCount++;
    else if ((whz !== null && whz > 2) || (waz !== null && waz > 2) || clean.includes("thua can")) overweightCount++;
    else normalCount++;
  });

  const underweightOrStuntedCount = stuntedCount + severelyStuntedCount + underweightCount + severelyUnderweightCount + wastedCount + severelyWastedCount;
  const overweightOrObeseCount = overweightCount + obeseCount;
  const measuredCount = map.size;
  const unmeasuredCount = Math.max(0, totalEnrolled - measuredCount);
  let normalPercent = 0, underweightPercent = 0, overweightPercent = 0;

  if (measuredCount > 0) {
    underweightPercent = Math.round((underweightOrStuntedCount / measuredCount) * 100);
    overweightPercent = Math.round((overweightOrObeseCount / measuredCount) * 100);
    normalPercent = Math.max(0, 100 - underweightPercent - overweightPercent);
  }

  return {
    totalStudents: totalEnrolled,
    measuredCount,
    normalCount,
    stuntedCount,
    severelyStuntedCount,
    underweightCount,
    severelyUnderweightCount,
    wastedCount,
    severelyWastedCount,
    overweightCount,
    obeseCount,
    underweightOrStuntedCount,
    overweightOrObeseCount,
    unmeasuredCount,
    normalPercent,
    underweightPercent,
    overweightPercent,
  };
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
  const ageDistribution = computeAgeDistribution(activeStudents, currentYear, totalEnrolled);
  const whoNutrition = computeWhoNutrition(healthList, totalEnrolled);

  const domainColors: Record<string, string> = { TC: "#10b981", NT: "#3b82f6", NN: "#8b5cf6", XH: "#f59e0b", TM: "#ec4899" };
  const domainSource = domainsList.length > 0 ? domainsList : [
    { id: "tc", code: "TC", name: "Phát triển Thể chất" },
    { id: "nt", code: "NT", name: "Phát triển Nhận thức" },
    { id: "nn", code: "NN", name: "Phát triển Ngôn ngữ" },
    { id: "xh", code: "XH", name: "Tình cảm & Kỹ năng xã hội" },
    { id: "tm", code: "TM", name: "Phát triển Thẩm mỹ" },
  ];

  const domainProgress: DomainProgressStat[] = domainSource.map((d: any) => {
    const dCode = String(d.code || d.maLinhVuc || "").toUpperCase();
    const dName = d.name || d.tenLinhVuc || "Lĩnh vực phát triển";
    const related = assessmentsList.filter((a: any) => (
      a.developmentDomainId === d.id || a.domainId === d.id ||
      String(a.domainCode || "").toUpperCase() === dCode ||
      String(a.domainName || "").includes(dName)
    ));
    const totalAssessments = related.length;
    const passCount = related.filter((a: any) => {
      const st = String(a.result || a.ketQua || "").toUpperCase();
      return st === "PASS" || st === "ĐẠT" || a.isPassed === true;
    }).length;
    const passRate = totalAssessments > 0 ? Math.round((passCount / totalAssessments) * 100) : 0;
    const color = domainColors[dCode.slice(0, 2)] || "#6366f1";

    return { domainId: d.id, domainName: dName, totalAssessments, passCount, passRate, color };
  });

  return { ageDistribution, whoNutrition, domainProgress };
}
