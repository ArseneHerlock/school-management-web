import {
  Student,
  RecordRow,
  ClassRow,
  Grade,
  HealthCategoryFilter,
  getQuarterFromDate,
  WHO_9_CATEGORIES,
} from "./types";
import { evaluateWhoMetrics } from "@/app/teacher/health/components/whoStandards";

export interface HealthStudentRow extends Student {
  health?: RecordRow;
  haz?: number;
  waz?: number;
  whz?: number;
  hazLabel: string;
  wazLabel: string;
  whzLabel: string;
  trangThaiTheTrang: string;
  categoryKey: HealthCategoryFilter;
  canCanThiep: boolean;
  quarterLabel: string;
  className: string;
  gradeName: string;
}

export function buildHealthStudentRows(
  studentsList: Student[],
  healthRecordsMap: Record<string, RecordRow | undefined>,
  classesList: ClassRow[],
  gradesList: Grade[],
): HealthStudentRow[] {
  function getStudentClassName(classId?: string): string {
    const matchedClass = classesList.find((c) => c.id === classId);
    return matchedClass ? matchedClass.tenLop : "Chưa xếp lớp";
  }

  function getStudentGradeName(classId?: string): string {
    const matchedClass = classesList.find((c) => c.id === classId);
    if (!matchedClass) return "Chưa rõ khối";
    const classKhoiId = matchedClass.khoiId || (matchedClass as any).KhoiId;
    const matchedGrade = gradesList.find((g) => g.id === classKhoiId);
    if (matchedGrade?.tenKhoi) return matchedGrade.tenKhoi;
    if (matchedClass.tenKhoi) return matchedClass.tenKhoi;
    if (matchedClass.tenLop) {
      if (matchedClass.tenLop.includes("Lá") || matchedClass.tenLop.includes("La")) return "Khối Lá";
      if (matchedClass.tenLop.includes("Chồi") || matchedClass.tenLop.includes("Choi")) return "Khối Chồi";
      if (matchedClass.tenLop.includes("Mầm") || matchedClass.tenLop.includes("Mam")) return "Khối Mầm";
      if (matchedClass.tenLop.includes("Trẻ") || matchedClass.tenLop.includes("Tre")) return "Khối Nhà Trẻ";
    }
    return "Chưa rõ khối";
  }

  return studentsList.map((studentItem) => {
    const latestRecord = healthRecordsMap[studentItem.id];
    const hasMetrics = Boolean(
      latestRecord?.canNang &&
      latestRecord?.chieuCao &&
      latestRecord.canNang > 0 &&
      latestRecord.chieuCao > 0
    );

    const who = hasMetrics
      ? evaluateWhoMetrics(
          latestRecord!.canNang!,
          latestRecord!.chieuCao!,
          studentItem.ngaySinh,
          studentItem.gioiTinh,
          latestRecord?.ngayDo,
        )
      : null;

    const hazVal = who?.haz.zScore ?? (latestRecord?.haz != null ? Number(latestRecord.haz) : undefined);
    const wazVal = who?.waz.zScore ?? (latestRecord?.waz != null ? Number(latestRecord.waz) : undefined);
    const whzVal = who?.whz.zScore ?? (latestRecord?.whz != null ? Number(latestRecord.whz) : undefined);

    const canCanThiep = who?.canCanThiep ?? latestRecord?.canCanThiep ?? false;

    // Phân loại vào 1 trong 9 nhóm WHO chính
    let categoryKey: HealthCategoryFilter = "CHUA_DO";
    let trangThaiTheTrang = "Chưa có số đo";

    if (hasMetrics) {
      if (!canCanThiep) {
        categoryKey = "DAT_CHUAN";
        trangThaiTheTrang = "Đạt chuẩn WHO";
      } else if (hazVal != null && hazVal < -3) {
        categoryKey = "THAP_COI_NANG";
        trangThaiTheTrang = "Thấp còi nặng";
      } else if (hazVal != null && hazVal < -2) {
        categoryKey = "THAP_COI";
        trangThaiTheTrang = "Thấp còi";
      } else if (wazVal != null && wazVal < -3) {
        categoryKey = "NHE_CAN_NANG";
        trangThaiTheTrang = "Nhẹ cân nặng";
      } else if (wazVal != null && wazVal < -2) {
        categoryKey = "NHE_CAN";
        trangThaiTheTrang = "Nhẹ cân";
      } else if (whzVal != null && whzVal < -3) {
        categoryKey = "GAY_COM_NANG";
        trangThaiTheTrang = "Gầy còm nặng";
      } else if (whzVal != null && whzVal < -2) {
        categoryKey = "GAY_COM";
        trangThaiTheTrang = "Gầy còm";
      } else if ((whzVal != null && whzVal > 3) || (wazVal != null && wazVal > 3)) {
        categoryKey = "BEO_PHI";
        trangThaiTheTrang = "Béo phì";
      } else if ((whzVal != null && whzVal > 2) || (wazVal != null && wazVal > 2)) {
        categoryKey = "THUA_CAN";
        trangThaiTheTrang = "Thừa cân";
      } else {
        categoryKey = "DAT_CHUAN";
        trangThaiTheTrang = "Đạt chuẩn WHO";
      }
    }

    return {
      ...studentItem,
      health: latestRecord,
      haz: hazVal,
      waz: wazVal,
      whz: whzVal,
      hazLabel: who?.haz.label ?? latestRecord?.ketLuanHaz ?? "Chưa đo",
      wazLabel: who?.waz.label ?? latestRecord?.ketLuanWaz ?? "Chưa đo",
      whzLabel: who?.whz.label ?? latestRecord?.ketLuanWhz ?? "Chưa đo",
      trangThaiTheTrang: who?.trangThaiTongThe || trangThaiTheTrang,
      categoryKey,
      canCanThiep,
      quarterLabel: getQuarterFromDate(latestRecord?.ngayDo),
      className: getStudentClassName(studentItem.lopId),
      gradeName: getStudentGradeName(studentItem.lopId),
    };
  });
}

export function filterHealthStudentRows(
  rows: HealthStudentRow[],
  classFilter: string,
  selectedQuarterFilter: string,
  searchKeyword: string,
  selectedCategoryFilter: HealthCategoryFilter,
): HealthStudentRow[] {
  return rows.filter((rowItem) => {
    // 1. Lọc theo lớp
    const isClassMatch = !classFilter || rowItem.lopId === classFilter;

    // 2. Lọc theo quý/đợt khám: nếu không chọn (rỗng) thì khớp tất cả
    const isQuarterMatch =
      !selectedQuarterFilter ||
      rowItem.quarterLabel === selectedQuarterFilter ||
      rowItem.quarterLabel.includes(selectedQuarterFilter);

    // 3. Lọc theo từ khóa tìm kiếm (tên, lớp, khối)
    const keyword = searchKeyword.trim().toLowerCase();
    const isKeywordMatch =
      !keyword ||
      `${rowItem.tenHocSinh} ${rowItem.className} ${rowItem.gradeName}`
        .toLowerCase()
        .includes(keyword);

    // 4. Lọc theo 9 nhóm thể trạng chuẩn WHO
    let isCategoryMatch = true;
    if (selectedCategoryFilter === "ALL") {
      isCategoryMatch = true;
    } else if (selectedCategoryFilter === "DAT_CHUAN") {
      isCategoryMatch = Boolean(!rowItem.canCanThiep && rowItem.health?.canNang);
    } else if (selectedCategoryFilter === "THAP_COI") {
      isCategoryMatch = Boolean(rowItem.haz != null && rowItem.haz >= -3 && rowItem.haz < -2);
    } else if (selectedCategoryFilter === "THAP_COI_NANG") {
      isCategoryMatch = Boolean(rowItem.haz != null && rowItem.haz < -3);
    } else if (selectedCategoryFilter === "NHE_CAN") {
      isCategoryMatch = Boolean(rowItem.waz != null && rowItem.waz >= -3 && rowItem.waz < -2);
    } else if (selectedCategoryFilter === "NHE_CAN_NANG") {
      isCategoryMatch = Boolean(rowItem.waz != null && rowItem.waz < -3);
    } else if (selectedCategoryFilter === "GAY_COM") {
      isCategoryMatch = Boolean(rowItem.whz != null && rowItem.whz >= -3 && rowItem.whz < -2);
    } else if (selectedCategoryFilter === "GAY_COM_NANG") {
      isCategoryMatch = Boolean(rowItem.whz != null && rowItem.whz < -3);
    } else if (selectedCategoryFilter === "THUA_CAN") {
      isCategoryMatch = Boolean(
        (rowItem.whz != null && rowItem.whz > 2 && rowItem.whz <= 3) ||
        (rowItem.waz != null && rowItem.waz > 2 && rowItem.waz <= 3)
      );
    } else if (selectedCategoryFilter === "BEO_PHI") {
      isCategoryMatch = Boolean(
        (rowItem.whz != null && rowItem.whz > 3) ||
        (rowItem.waz != null && rowItem.waz > 3)
      );
    } else if (selectedCategoryFilter === "CHUA_DO") {
      isCategoryMatch = !rowItem.health?.canNang;
    }

    return isClassMatch && isQuarterMatch && isKeywordMatch && isCategoryMatch;
  });
}

export function calculateKpiCounts(rows: HealthStudentRow[]) {
  const totalStudents = rows.length;
  const totalMeasured = rows.filter((i) => i.health?.canNang && i.health.canNang > 0).length;
  const normalCount = rows.filter((i) => !i.canCanThiep && i.health?.canNang && i.health.canNang > 0).length;
  const stuntedCount = rows.filter((i) => i.haz != null && i.haz >= -3 && i.haz < -2).length;
  const severelyStuntedCount = rows.filter((i) => i.haz != null && i.haz < -3).length;
  const underweightCount = rows.filter((i) => i.waz != null && i.waz >= -3 && i.waz < -2).length;
  const severelyUnderweightCount = rows.filter((i) => i.waz != null && i.waz < -3).length;
  const wastedCount = rows.filter((i) => i.whz != null && i.whz >= -3 && i.whz < -2).length;
  const severelyWastedCount = rows.filter((i) => i.whz != null && i.whz < -3).length;
  const overweightCount = rows.filter(
    (i) => (i.whz != null && i.whz > 2 && i.whz <= 3) || (i.waz != null && i.waz > 2 && i.waz <= 3)
  ).length;
  const obeseCount = rows.filter(
    (i) => (i.whz != null && i.whz > 3) || (i.waz != null && i.waz > 3)
  ).length;
  const unmeasuredCount = rows.filter((i) => !i.health?.canNang || i.health.canNang <= 0).length;

  return {
    totalStudents,
    totalMeasured,
    normalCount,
    stuntedCount,
    severelyStuntedCount,
    underweightCount,
    severelyUnderweightCount,
    wastedCount,
    severelyWastedCount,
    overweightCount,
    obeseCount,
    unmeasuredCount,
  };
}

export interface PieCategoryItem {
  key: HealthCategoryFilter;
  name: string;
  shortLabel: string;
  value: number;
  percent: number;
  color: string;
  criteria: string;
  description: string;
}

export function aggregateSchoolPie(rows: HealthStudentRow[]): PieCategoryItem[] {
  const kpis = calculateKpiCounts(rows);
  const total = rows.length;

  const countMap: Record<HealthCategoryFilter, number> = {
    ALL: total,
    DAT_CHUAN: kpis.normalCount,
    THAP_COI: kpis.stuntedCount,
    THAP_COI_NANG: kpis.severelyStuntedCount,
    NHE_CAN: kpis.underweightCount,
    NHE_CAN_NANG: kpis.severelyUnderweightCount,
    GAY_COM: kpis.wastedCount,
    GAY_COM_NANG: kpis.severelyWastedCount,
    THUA_CAN: kpis.overweightCount,
    BEO_PHI: kpis.obeseCount,
    CHUA_DO: kpis.unmeasuredCount,
  };

  const result: PieCategoryItem[] = WHO_9_CATEGORIES.map((cat) => {
    const val = countMap[cat.key] || 0;
    const pct = total > 0 ? Math.round((val / total) * 100) : 0;
    return {
      key: cat.key,
      name: cat.label,
      shortLabel: cat.shortLabel,
      value: val,
      percent: pct,
      color: cat.color,
      criteria: cat.criteria,
      description: cat.description,
    };
  });

  if (kpis.unmeasuredCount > 0) {
    const pct = total > 0 ? Math.round((kpis.unmeasuredCount / total) * 100) : 0;
    result.push({
      key: "CHUA_DO",
      name: "Chưa có số đo",
      shortLabel: "Chưa có số đo",
      value: kpis.unmeasuredCount,
      percent: pct,
      color: "#94a3b8",
      criteria: "Chưa cập nhật",
      description: "Học sinh chưa được ghi nhận cân nặng hoặc chiều cao trong kỳ này.",
    });
  }

  return result;
}

const GRADE_ORDER: Record<string, number> = {
  "Khối Nhà Trẻ": 1,
  "Khối Mầm": 2,
  "Khối Chồi": 3,
  "Khối Lá": 4,
};

export interface StackedNutritionBarData {
  name: string;
  total: number;
  datChuan: number;
  thapCoi: number;
  thapCoiNang: number;
  nheCan: number;
  nheCanNang: number;
  gayCom: number;
  gayComNang: number;
  thuaCan: number;
  beoPhi: number;
  unmeasured: number;
}

export function aggregateHealthByGrade(rows: HealthStudentRow[]): StackedNutritionBarData[] {
  const groupMap: Record<string, StackedNutritionBarData> = {};

  rows.forEach((rowItem) => {
    const gName = rowItem.gradeName || "Chưa rõ khối";
    if (!groupMap[gName]) {
      groupMap[gName] = {
        name: gName,
        total: 0,
        datChuan: 0,
        thapCoi: 0,
        thapCoiNang: 0,
        nheCan: 0,
        nheCanNang: 0,
        gayCom: 0,
        gayComNang: 0,
        thuaCan: 0,
        beoPhi: 0,
        unmeasured: 0,
      };
    }

    const item = groupMap[gName];
    item.total++;

    if (!rowItem.health?.canNang || rowItem.health.canNang <= 0) {
      item.unmeasured++;
    } else if (rowItem.haz != null && rowItem.haz < -3) {
      item.thapCoiNang++;
    } else if (rowItem.haz != null && rowItem.haz < -2) {
      item.thapCoi++;
    } else if (rowItem.waz != null && rowItem.waz < -3) {
      item.nheCanNang++;
    } else if (rowItem.waz != null && rowItem.waz < -2) {
      item.nheCan++;
    } else if (rowItem.whz != null && rowItem.whz < -3) {
      item.gayComNang++;
    } else if (rowItem.whz != null && rowItem.whz < -2) {
      item.gayCom++;
    } else if ((rowItem.whz != null && rowItem.whz > 3) || (rowItem.waz != null && rowItem.waz > 3)) {
      item.beoPhi++;
    } else if ((rowItem.whz != null && rowItem.whz > 2) || (rowItem.waz != null && rowItem.waz > 2)) {
      item.thuaCan++;
    } else {
      item.datChuan++;
    }
  });

  return Object.values(groupMap).sort(
    (a, b) => (GRADE_ORDER[a.name] || 99) - (GRADE_ORDER[b.name] || 99)
  );
}

export function aggregateHealthByClass(rows: HealthStudentRow[]): StackedNutritionBarData[] {
  const groupMap: Record<string, StackedNutritionBarData> = {};

  rows.forEach((rowItem) => {
    const cName = rowItem.className || "Chưa xếp lớp";
    if (!groupMap[cName]) {
      groupMap[cName] = {
        name: cName,
        total: 0,
        datChuan: 0,
        thapCoi: 0,
        thapCoiNang: 0,
        nheCan: 0,
        nheCanNang: 0,
        gayCom: 0,
        gayComNang: 0,
        thuaCan: 0,
        beoPhi: 0,
        unmeasured: 0,
      };
    }

    const item = groupMap[cName];
    item.total++;

    if (!rowItem.health?.canNang || rowItem.health.canNang <= 0) {
      item.unmeasured++;
    } else if (rowItem.haz != null && rowItem.haz < -3) {
      item.thapCoiNang++;
    } else if (rowItem.haz != null && rowItem.haz < -2) {
      item.thapCoi++;
    } else if (rowItem.waz != null && rowItem.waz < -3) {
      item.nheCanNang++;
    } else if (rowItem.waz != null && rowItem.waz < -2) {
      item.nheCan++;
    } else if (rowItem.whz != null && rowItem.whz < -3) {
      item.gayComNang++;
    } else if (rowItem.whz != null && rowItem.whz < -2) {
      item.gayCom++;
    } else if ((rowItem.whz != null && rowItem.whz > 3) || (rowItem.waz != null && rowItem.waz > 3)) {
      item.beoPhi++;
    } else if ((rowItem.whz != null && rowItem.whz > 2) || (rowItem.waz != null && rowItem.waz > 2)) {
      item.thuaCan++;
    } else {
      item.datChuan++;
    }
  });

  return Object.values(groupMap).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}
