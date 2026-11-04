import {
  Student,
  RecordRow,
  ClassRow,
  Grade,
  HealthCategoryFilter,
  getQuarterFromDate,
} from "./types";
import { evaluateWhoMetrics } from "@/app/teacher/health/components/whoStandards";

export function buildHealthStudentRows(
  studentsList: Student[],
  latestHealthRecordsMap: Record<string, RecordRow | undefined>,
  classesList: ClassRow[],
  gradesList: Grade[],
) {
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
    const latestRecord = latestHealthRecordsMap[studentItem.id];
    const hasMetrics =
      latestRecord?.canNang &&
      latestRecord?.chieuCao &&
      latestRecord.canNang > 0 &&
      latestRecord.chieuCao > 0;

    const who = hasMetrics
      ? evaluateWhoMetrics(
          latestRecord.canNang,
          latestRecord.chieuCao,
          studentItem.ngaySinh,
          studentItem.gioiTinh,
          latestRecord.ngayDo,
        )
      : null;

    return {
      ...studentItem,
      health: latestRecord,
      haz: who?.haz.zScore ?? latestRecord?.haz,
      waz: who?.waz.zScore ?? latestRecord?.waz,
      whz: who?.whz.zScore ?? latestRecord?.whz,
      hazLabel: who?.haz.label ?? latestRecord?.ketLuanHaz ?? "Chưa đo",
      wazLabel: who?.waz.label ?? latestRecord?.ketLuanWaz ?? "Chưa đo",
      whzLabel: who?.whz.label ?? latestRecord?.ketLuanWhz ?? "Chưa đo",
      trangThaiTheTrang:
        who?.trangThaiTongThe ??
        latestRecord?.trangThaiTheTrang ??
        (hasMetrics ? "Bình thường" : "Chưa có số đo"),
      canCanThiep: who?.canCanThiep ?? latestRecord?.canCanThiep ?? false,
      quarterLabel: getQuarterFromDate(latestRecord?.ngayDo),
      className: getStudentClassName(studentItem.lopId),
      gradeName: getStudentGradeName(studentItem.lopId),
    };
  });
}

export function filterHealthStudentRows(
  rows: any[],
  classFilter: string,
  selectedQuarterFilter: string,
  searchKeyword: string,
  selectedCategoryFilter: HealthCategoryFilter,
) {
  return rows.filter((rowItem) => {
    const isClassMatch = !classFilter || rowItem.lopId === classFilter;
    const isQuarterMatch =
      !selectedQuarterFilter || rowItem.quarterLabel.includes(selectedQuarterFilter);

    const keyword = searchKeyword.toLowerCase();
    const isKeywordMatch = `${rowItem.tenHocSinh} ${rowItem.className} ${rowItem.gradeName}`
      .toLowerCase()
      .includes(keyword);

    let isCategoryMatch = true;
    if (selectedCategoryFilter === "DAT_CHUAN") {
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
      isCategoryMatch = Boolean(rowItem.whz != null && rowItem.whz > 2 && rowItem.whz <= 3);
    } else if (selectedCategoryFilter === "BEO_PHI") {
      isCategoryMatch = Boolean(rowItem.whz != null && rowItem.whz > 3);
    } else if (selectedCategoryFilter === "CHUA_DO") {
      isCategoryMatch = !rowItem.health?.canNang;
    }

    return isClassMatch && isQuarterMatch && isKeywordMatch && isCategoryMatch;
  });
}

export function aggregateSchoolPie(rows: any[]) {
  const map: Record<string, number> = {
    "Đạt chuẩn (Bình thường)": 0,
    "Thấp còi / Nhẹ cân": 0,
    "Thừa cân / Béo phì": 0,
    "Chưa có số đo": 0,
  };

  rows.forEach((rowItem) => {
    const tt = String(rowItem.trangThaiTheTrang || "").toUpperCase();
    if (!rowItem.health || !rowItem.health?.canNang || tt.includes("CHƯA") || tt.includes("CHUA")) {
      map["Chưa có số đo"]++;
    } else if (
      tt.includes("THẤP CÒI") || tt.includes("THAP_COI") ||
      tt.includes("NHẸ CÂN") || tt.includes("NHE_CAN") ||
      tt.includes("GẦY CÒM") || tt.includes("GAY_COM") ||
      tt.includes("SUY DINH DƯỠNG") || tt.includes("SUY_DINH_DUONG")
    ) {
      map["Thấp còi / Nhẹ cân"]++;
    } else if (
      tt.includes("THỪA CÂN") || tt.includes("THUA_CAN") ||
      tt.includes("BÉO PHÌ") || tt.includes("BEO_PHI")
    ) {
      map["Thừa cân / Béo phì"]++;
    } else {
      map["Đạt chuẩn (Bình thường)"]++;
    }
  });

  return Object.entries(map)
    .filter(([_, count]) => count > 0)
    .map(([name, value]) => ({ name, value }));
}

const GRADE_ORDER: Record<string, number> = {
  "Khối Nhà Trẻ": 1,
  "Khối Mầm": 2,
  "Khối Chồi": 3,
  "Khối Lá": 4,
};

export function aggregateHealthByGrade(rows: any[]) {
  return (
    Object.values(
      rows.reduce((accumulator: any, rowItem) => {
        const gName = rowItem.gradeName || "Chưa rõ khối";
        if (!accumulator[gName]) {
          accumulator[gName] = {
            name: gName,
            total: 0,
            normal: 0,
            undernourished: 0,
            overweight: 0,
            unmeasured: 0,
          };
        }
        accumulator[gName].total++;
        const tt = String(rowItem.trangThaiTheTrang || "").toUpperCase();
        if (!rowItem.health || !rowItem.health?.canNang || tt.includes("CHƯA") || tt.includes("CHUA")) {
          accumulator[gName].unmeasured++;
        } else if (
          tt.includes("THẤP CÒI") || tt.includes("THAP_COI") ||
          tt.includes("NHẸ CÂN") || tt.includes("NHE_CAN") ||
          tt.includes("GẦY CÒM") || tt.includes("GAY_COM") ||
          tt.includes("SUY DINH DƯỠNG") || tt.includes("SUY_DINH_DUONG")
        ) {
          accumulator[gName].undernourished++;
        } else if (
          tt.includes("THỪA CÂN") || tt.includes("THUA_CAN") ||
          tt.includes("BÉO PHÌ") || tt.includes("BEO_PHI")
        ) {
          accumulator[gName].overweight++;
        } else {
          accumulator[gName].normal++;
        }
        return accumulator;
      }, {})
    ) as any[]
  ).sort((a, b) => (GRADE_ORDER[a.name] || 99) - (GRADE_ORDER[b.name] || 99));
}

export function aggregateHealthByClass(rows: any[]) {
  return (
    Object.values(
      rows.reduce((accumulator: any, rowItem) => {
        const cName = rowItem.className || "Chưa xếp lớp";
        if (!accumulator[cName]) {
          accumulator[cName] = {
            name: cName,
            total: 0,
            normal: 0,
            undernourished: 0,
            overweight: 0,
            unmeasured: 0,
          };
        }
        accumulator[cName].total++;
        const tt = String(rowItem.trangThaiTheTrang || "").toUpperCase();
        if (!rowItem.health || !rowItem.health?.canNang || tt.includes("CHƯA") || tt.includes("CHUA")) {
          accumulator[cName].unmeasured++;
        } else if (
          tt.includes("THẤP CÒI") || tt.includes("THAP_COI") ||
          tt.includes("NHẸ CÂN") || tt.includes("NHE_CAN") ||
          tt.includes("GẦY CÒM") || tt.includes("GAY_COM") ||
          tt.includes("SUY DINH DƯỠNG") || tt.includes("SUY_DINH_DUONG")
        ) {
          accumulator[cName].undernourished++;
        } else if (
          tt.includes("THỪA CÂN") || tt.includes("THUA_CAN") ||
          tt.includes("BÉO PHÌ") || tt.includes("BEO_PHI")
        ) {
          accumulator[cName].overweight++;
        } else {
          accumulator[cName].normal++;
        }
        return accumulator;
      }, {})
    ) as any[]
  ).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

export function calculateKpiCounts(rows: any[]) {
  return {
    totalMeasured: rows.filter((i) => i.health?.canNang).length,
    normalCount: rows.filter((i) => !i.canCanThiep && i.health?.canNang).length,
    stuntedCount: rows.filter((i) => i.haz != null && i.haz >= -3 && i.haz < -2).length,
    severelyStuntedCount: rows.filter((i) => i.haz != null && i.haz < -3).length,
    underweightCount: rows.filter((i) => i.waz != null && i.waz >= -3 && i.waz < -2).length,
    severelyUnderweightCount: rows.filter((i) => i.waz != null && i.waz < -3).length,
    wastedCount: rows.filter((i) => i.whz != null && i.whz >= -3 && i.whz < -2).length,
    severelyWastedCount: rows.filter((i) => i.whz != null && i.whz < -3).length,
    overweightCount: rows.filter((i) => i.whz != null && i.whz > 2 && i.whz <= 3).length,
    obeseCount: rows.filter((i) => i.whz != null && i.whz > 3).length,
  };
}
