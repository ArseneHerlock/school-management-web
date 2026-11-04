import { ScheduleItem } from "./types";

export function getFilteredDaySchedules(
  existingSchedules: ScheduleItem[],
  date: string,
  classId: string,
  isSchoolWide: boolean,
  editingItem: ScheduleItem | null,
): ScheduleItem[] {
  if (!date) return [];
  return existingSchedules
    .filter((s) => {
      if (editingItem && s.id === editingItem.id) return false;
      if (s.date !== date) return false;
      if (isSchoolWide || s.isSchoolWide) return true;
      if (classId && s.classId) {
        return String(s.classId).toLowerCase() === String(classId).toLowerCase();
      }
      return false;
    })
    .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
}

export function findScheduleConflicts(
  daySchedules: ScheduleItem[],
  startTime: string,
  endTime: string,
): ScheduleItem[] {
  if (!startTime || !endTime) return [];
  return daySchedules.filter((s) => {
    const sStart = (s.startTime || "").slice(0, 5);
    const sEnd = (s.endTime || "").slice(0, 5);
    const formStart = startTime.slice(0, 5);
    const formEnd = endTime.slice(0, 5);
    return formStart < sEnd && formEnd > sStart;
  });
}

export function computeAvailableSlots(daySchedules: ScheduleItem[]) {
  if (daySchedules.length === 0) {
    return [{ start: "07:30", end: "09:00", duration: 90 }];
  }
  const freeSlots: Array<{ start: string; end: string; duration: number }> = [];
  const dayStart = "07:00";
  const dayEnd = "17:00";
  let cursor = dayStart;
  for (const item of daySchedules) {
    const iStart = (item.startTime || "").slice(0, 5);
    const iEnd = (item.endTime || "").slice(0, 5);
    if (cursor < iStart) {
      const [cH, cM] = cursor.split(":").map(Number);
      const [sH, sM] = iStart.split(":").map(Number);
      const dur = sH * 60 + sM - (cH * 60 + cM);
      if (dur >= 20) freeSlots.push({ start: cursor, end: iStart, duration: dur });
    }
    if (iEnd > cursor) cursor = iEnd;
  }
  if (cursor < dayEnd) {
    const [cH, cM] = cursor.split(":").map(Number);
    const [eH, eM] = dayEnd.split(":").map(Number);
    const dur = eH * 60 + eM - (cH * 60 + cM);
    if (dur >= 20) freeSlots.push({ start: cursor, end: dayEnd, duration: dur });
  }
  return freeSlots;
}
