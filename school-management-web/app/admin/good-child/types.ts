export interface GoodChildEnrichedRow {
  id?: string | number;
  childId?: string | number;
  ChildId?: string | number;
  studentName: string;
  className: string;
  dailyCount: number;
  bonusCount: number;
  hasComment: boolean;
  hasFeedback: boolean;
  teacherComment?: string;
  parentFeedback?: string;
  [key: string]: any;
}

export interface ClassChartItem {
  name: string;
  daily: number;
  bonus: number;
  count: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  color: string;
}
