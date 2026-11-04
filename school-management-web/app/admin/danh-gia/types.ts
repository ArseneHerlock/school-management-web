export type TabType = 'dashboard' | 'criteria' | 'activities';

export interface DanhGiaStatsData {
  totalStudents: number;
  completionRate: number;
  assessedCount: number;
  unassessedCount: number;
  totalAssessments: number;
  passCount: number;
  failCount: number;
  totalCriteria: number;
  totalActivities: number;
  totalDomains: number;
}

export interface ClassChartItem {
  name: string;
  pass: number;
  fail: number;
}

export interface DomainChartItem {
  name: string;
  pass: number;
  fail: number;
}

export interface MatrixCell {
  result: boolean | null;
  existingId?: string;
  comment?: string;
  evidence?: string;
  isDirty?: boolean;
}

export interface AdminMatrixDetail {
  open: boolean;
  studentId: string;
  criterionId: string;
  studentName: string;
  criterionName: string;
  comment: string;
  evidence: string;
}
