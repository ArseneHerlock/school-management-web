export interface RoomRatioTelemetry {
  classId: string;
  className: string;
  roomName: string;
  ageGroup: string;
  enrolled: number;
  present: number;
  teachersOnDuty: number;
  ratioText: string;
  standardRatio: number;
  isSafe: boolean;
  statusLabel: string;
}

export interface AllergyDietAlert {
  childId: string;
  childName: string;
  className: string;
  allergen: string;
  notes: string;
  severity: "high" | "medium" | "low";
}

export interface KitchenDispatchStats {
  breakfastCount: number;
  lunchCount: number;
  afternoonSnackCount: number;
  specialDietCount: number;
  statusText: string;
  allergyWatchlist: AllergyDietAlert[];
}

export interface TuitionLedgerStats {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  collectionRate: number;
  periodLabel: string;
}

export interface WeeklyAttendancePoint {
  day: string;
  rate: number;
  presentCount: number;
  totalCount: number;
}

export interface AgeDistributionItem {
  groupName: string;
  ageRange: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ClassAttendanceStat {
  classId: string;
  className: string;
  gradeName?: string;
  enrolled: number;
  present: number;
  absent: number;
  rate: number;
}

export interface WhoNutritionSummary {
  totalStudents: number;
  measuredCount: number;
  normalCount: number;
  underweightOrStuntedCount: number;
  overweightOrObeseCount: number;
  unmeasuredCount: number;
  normalPercent: number;
  underweightPercent: number;
  overweightPercent: number;
}

export interface DomainProgressStat {
  domainId: string;
  domainName: string;
  totalAssessments: number;
  passCount: number;
  passRate: number;
  color: string;
}

export interface DashboardStatsData {
  studentsCount: number;
  activeStudentsCount: number;
  unassignedStudentsCount: number;
  parentsCount: number;
  staffCount: number;
  classesCount: number;
  activitiesCount: number;
  criteriaCount: number;
  assessmentsCount: number;
  assessedStudentsCount: number;

  attendanceToday: {
    present: number;
    absentWithNotice: number;
    absentWithoutNotice: number;
    attendanceRate: number;
  };
  roomRatios: RoomRatioTelemetry[];
  kitchenDispatch: KitchenDispatchStats;
  tuitionLedger: TuitionLedgerStats;
  weeklyAttendance: WeeklyAttendancePoint[];
  ageDistribution: AgeDistributionItem[];
  classAttendance: ClassAttendanceStat[];
  whoNutrition: WhoNutritionSummary;
  domainProgress: DomainProgressStat[];

  latestNews: Array<{
    id?: string;
    tieuDe?: string;
    title?: string;
    ngayTao?: string;
    ngayXuatBan?: string;
  }>;
  cachedAt: string;
}
