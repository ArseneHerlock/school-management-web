import { ActivityItem, DomainItem, CriterionItem, AssessmentItem } from "@/services/development";
import { DanhGiaStatsData, ClassChartItem, DomainChartItem } from "./types";

export function calculateDanhGiaStats(
  students: any[],
  assessments: AssessmentItem[],
  criteria: CriterionItem[],
  activities: ActivityItem[],
  domains: DomainItem[],
): DanhGiaStatsData {
  const assessedStudentIds = new Set(assessments.map((a) => a.childId));
  const assessedCount = students.filter((s) => assessedStudentIds.has(s.id)).length;
  const passCount = assessments.filter((a) => a.result === true).length;
  const failCount = assessments.filter((a) => a.result === false).length;
  const totalStudents = students.length;

  return {
    totalStudents,
    completionRate:
      totalStudents > 0 ? Math.round((assessedCount / totalStudents) * 100) : 0,
    assessedCount,
    unassessedCount: Math.max(0, totalStudents - assessedCount),
    totalAssessments: assessments.length,
    passCount,
    failCount,
    totalCriteria: criteria.length,
    totalActivities: activities.length,
    totalDomains: domains.length,
  };
}

export function buildClassChartData(
  classes: any[],
  students: any[],
  assessments: AssessmentItem[],
): ClassChartItem[] {
  return classes.map((c) => {
    const clsStu = students.filter((s) => s.lopId === c.id).map((s) => s.id);
    const clsAss = assessments.filter((a) => clsStu.includes(a.childId));
    return {
      name: c.tenLop,
      pass: clsAss.filter((a) => a.result).length,
      fail: clsAss.filter((a) => !a.result).length,
    };
  });
}

export function buildDomainChartData(
  domains: DomainItem[],
  criteria: CriterionItem[],
  assessments: AssessmentItem[],
): DomainChartItem[] {
  return domains.map((d) => {
    const dCritIds = criteria
      .filter((c) => c.developmentDomainId === d.id)
      .map((c) => c.id);
    const dAss = assessments.filter((a) =>
      dCritIds.includes(a.developmentCriterionId),
    );
    return {
      name: d.name,
      pass: dAss.filter((a) => a.result).length,
      fail: dAss.filter((a) => !a.result).length,
    };
  });
}

export function filterAssessmentsList(
  assessments: AssessmentItem[],
  students: any[],
  filterClass: string,
  filterActivity: string,
  filterCriterion: string,
  filterResult: "all" | "pass" | "fail",
  searchKeyword: string,
): AssessmentItem[] {
  return assessments.filter((a) => {
    if (filterClass) {
      const st = students.find((s) => s.id === a.childId);
      if (st?.lopId !== filterClass) return false;
    }
    if (filterActivity && a.activityId !== filterActivity) return false;
    if (filterCriterion && a.developmentCriterionId !== filterCriterion)
      return false;
    if (filterResult === "pass" && !a.result) return false;
    if (filterResult === "fail" && a.result) return false;
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      const stName = students.find((s) => s.id === a.childId)?.tenHocSinh || "";
      if (
        !stName.toLowerCase().includes(q) &&
        !(a.comment || "").toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}
