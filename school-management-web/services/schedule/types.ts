export interface ScheduleEvent {
  id: string;
  title: string;
  description?: string;
  type?: number;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  classId?: string | null;
  className?: string;
  isSchoolWide?: boolean;
  status?: string;
  evaluationCount?: number;
  criteria?: any[];
  createdAt?: string;
  [key: string]: any;
}

export interface ActivityScheduleEvent extends ScheduleEvent {
  activityId?: string;
  activityCode?: string;
  criteria?: any[];
}

export interface ActivityChildEvaluation {
  id?: string;
  scheduleId?: string;
  childId: string;
  childName?: string;
  activityTitle?: string;
  date?: string;
  completed?: boolean;
  result?: boolean | string;
  rating?: number | string;
  score?: number;
  note?: string;
  comment?: string;
  criterionId?: string;
  criterionName?: string;
  evaluatedAt?: string;
  [key: string]: any;
}
