import React from "react";

export interface TimetableScheduleItem {
  id: string;
  title: string;
  description?: string;
  type?: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  classId?: string | null;
  className?: string;
  isSchoolWide?: boolean;
  status?: number | string;
  teacherName?: string;
  teachers?: Array<{ teacherId: string; subject?: string }>;
  criteria?: any[];
  isActivity?: boolean;
  childEvaluation?: any;
  [key: string]: any;
}

export interface WeeklyTimetableProps {
  userRole: "admin" | "teacher" | "parent";
  fetchSchedules: (params: {
    from: string;
    to: string;
    type?: number;
    classId?: string;
  }) => Promise<TimetableScheduleItem[]>;
  classes?: Array<{ id: string; name?: string; tenLop?: string }>;
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  onAddSchedule?: (date?: string) => void;
  onEditSchedule?: (item: TimetableScheduleItem) => void;
  onDeleteSchedule?: (id: string) => void;
  onItemClick?: (item: TimetableScheduleItem) => void;
  extraHeaderInfo?: React.ReactNode;
}

export interface CardStyleConfig {
  variant: string;
  containerClass: string;
  titleClass: string;
  textClass: string;
  badge: string | null;
  badgeClass: string;
}

export interface DayInfo {
  dayIndex: number;
  dayName: string;
  isoDate: string;
  formattedDate: string;
  isToday: boolean;
}

export interface SessionConfig {
  key: "morning" | "afternoon" | "evening";
  label: string;
  timeRange: string;
}

export const SESSIONS_CONFIG: SessionConfig[] = [
  { key: "morning", label: "Sáng", timeRange: "07:00 - 11:30" },
  { key: "afternoon", label: "Chiều", timeRange: "11:30 - 17:00" },
  { key: "evening", label: "Tối / Trả muộn", timeRange: "17:00 - 19:00" },
];

export function isEvaluableActivity(item: {
  title?: string;
  type?: number;
  isActivity?: boolean;
  isSchoolWide?: boolean;
  activityId?: string;
  teachers?: Array<{ teacherId?: string; subject?: string }>;
}): boolean {
  const title = (item.title || "").toLowerCase();
  // Routine daily care tasks - NEVER evaluable
  if (
    title.includes("đón trẻ") ||
    title.includes("thể dục sáng") ||
    title.includes("điểm danh") ||
    title.includes("bữa trưa") ||
    title.includes("ăn trưa") ||
    title.includes("ngủ trưa") ||
    title.includes("giấc ngủ") ||
    title.includes("ăn xế") ||
    title.includes("vệ sinh") ||
    title.includes("trả trẻ") ||
    title.includes("nêu gương") ||
    title.includes("uống sữa")
  ) {
    return false;
  }

  // Linked directly to a School Activity or explicit type 2 / isActivity flag
  const hasActivityLink =
    Boolean(item.activityId) ||
    Boolean(item.teachers?.[0]?.subject?.startsWith("ACT:"));
  if (hasActivityLink || item.type === 2 || item.isActivity) return true;

  // Educational / developmental keywords
  if (
    title.includes("hoạt động") ||
    title.includes("học") ||
    title.includes("tạo hình") ||
    title.includes("ngoài trời") ||
    title.includes("vận động") ||
    title.includes("khám phá") ||
    title.includes("kỹ năng") ||
    title.includes("góc chơi") ||
    title.includes("âm nhạc") ||
    title.includes("kể chuyện") ||
    title.includes("sự kiện") ||
    title.includes("trải nghiệm") ||
    title.includes("toán") ||
    title.includes("văn học") ||
    title.includes("chữ cái")
  ) {
    return true;
  }

  return false;
}
