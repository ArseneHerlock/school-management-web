import { HealthCategoryFilter, WHO_9_CATEGORIES } from "./types";
import { HealthStudentRow, calculateKpiCounts } from "./healthAggregations";

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

function classifyStudentIntoBar(rowItem: HealthStudentRow, item: StackedNutritionBarData) {
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
    classifyStudentIntoBar(rowItem, groupMap[gName]);
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
    classifyStudentIntoBar(rowItem, groupMap[cName]);
  });

  return Object.values(groupMap).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}
