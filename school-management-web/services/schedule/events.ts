import { api, normalizeList } from "../client";
import { ScheduleEvent, ActivityScheduleEvent } from "./types";

export async function getSchedules(params?: {
  classId?: string;
  from?: string;
  to?: string;
  type?: number;
  thang?: number | string;
  nam?: number | string;
}): Promise<ScheduleEvent[]> {
  const q = new URLSearchParams();
  if (params?.classId) q.set("classId", params.classId);
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);
  if (params?.type !== undefined) q.set("type", String(params.type));
  if (params?.thang !== undefined) q.set("thang", String(params.thang));
  if (params?.nam !== undefined) q.set("nam", String(params.nam));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api
    .get<any>("schedule", `/api/schedules${qs}`)
    .catch(() => []);
  return normalizeList<ScheduleEvent>(res);
}

export async function getParentSchedules(params?: {
  classId?: string;
  from?: string;
  to?: string;
  thang?: number | string;
  nam?: number | string;
}): Promise<ScheduleEvent[]> {
  const q = new URLSearchParams();
  if (params?.classId) q.set("classId", params.classId);
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);
  if (params?.thang !== undefined) q.set("thang", String(params.thang));
  if (params?.nam !== undefined) q.set("nam", String(params.nam));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api
    .get<any>("schedule", `/api/schedules/parent${qs}`)
    .catch(() => []);
  return normalizeList<ScheduleEvent>(res);
}

export async function getTeacherSchedules(params?: {
  classId?: string;
  from?: string;
  to?: string;
}): Promise<ScheduleEvent[]> {
  const q = new URLSearchParams();
  if (params?.classId) q.set("classId", params.classId);
  if (params?.from) q.set("from", params.from);
  if (params?.to) q.set("to", params.to);
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api
    .get<any>("schedule", `/api/schedules/teacher${qs}`)
    .catch(() => []);
  return normalizeList<ScheduleEvent>(res);
}

export async function createSchedule(
  data: Partial<ScheduleEvent>
): Promise<ScheduleEvent> {
  return await api.post<ScheduleEvent>("schedule", "/api/schedules", data);
}

export async function updateSchedule(
  id: string,
  data: Partial<ScheduleEvent>
): Promise<ScheduleEvent> {
  return await api.put<ScheduleEvent>("schedule", `/api/schedules/${id}`, data);
}

export async function deleteSchedule(id: string): Promise<void> {
  await api.delete("schedule", `/api/schedules/${id}`);
}

export async function loadScheduledActivities(filters?: {
  classId?: string;
  from?: string;
  to?: string;
}): Promise<ActivityScheduleEvent[]> {
  let apiItems: ActivityScheduleEvent[] = [];
  try {
    const res = await api.get<any[]>("schedule", "/api/schedules?type=2");
    if (Array.isArray(res) && res.length > 0) {
      apiItems = res.map((x: any) => {
        const rawSubj = String(x.teachers?.[0]?.subject || "");
        const extractedActId = rawSubj.startsWith("ACT:")
          ? rawSubj.slice(4).trim()
          : x.activityId || x.id;
        return {
          id: String(x.id),
          activityId: extractedActId,
          activityCode: x.code || "HD",
          title: x.title || x.tieuDe || "Hoạt động",
          description: x.description || x.moTa || "",
          type: Number(x.type ?? 2),
          date: String(x.date || x.ngay || "").slice(0, 10),
          startTime: String(x.startTime || x.gioBatDau || "08:30").slice(0, 5),
          endTime: String(x.endTime || x.gioKetThuc || "10:00").slice(0, 5),
          location: x.location || x.diaDiem || "Sân trường",
          classId: x.classId || x.lopId || null,
          className: x.isSchoolWide ? "Toàn trường" : x.className || "Lớp học",
          isSchoolWide: Boolean(x.isSchoolWide),
          status: x.status || "Approved",
          criteria: x.criteria || [],
          createdAt: x.createdAt,
        };
      });
    }
  } catch {}

  let combined = apiItems;
  if (filters?.classId && filters.classId !== "ALL") {
    combined = combined.filter(
      (s) => s.isSchoolWide || s.classId === filters.classId
    );
  }
  if (filters?.from) {
    combined = combined.filter((s) => s.date >= filters.from!);
  }
  if (filters?.to) {
    combined = combined.filter((s) => s.date <= filters.to!);
  }

  return combined.sort((a, b) =>
    `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`)
  );
}

export async function saveScheduledActivity(
  act: ActivityScheduleEvent
): Promise<ActivityScheduleEvent> {
  if (act.id) {
    return await updateSchedule(act.id, act);
  } else {
    return await createSchedule(act);
  }
}

export async function deleteScheduledActivity(id: string): Promise<void> {
  await deleteSchedule(id);
}

export async function scheduleActivityByAdmin(data: {
  activityId: string;
  activityCode: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  classId: string | null;
  className: string;
  isSchoolWide: boolean;
  criteria?: { id: string; name: string }[];
}): Promise<ActivityScheduleEvent> {
  const payload = {
    title: data.title,
    description: data.description,
    type: 2,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
    location: data.location,
    classId: data.classId,
    className: data.className,
    isSchoolWide: data.isSchoolWide,
    activityId: data.activityId,
    teachers: data.activityId
      ? [{ teacherId: "Giáo viên", subject: `ACT:${data.activityId}` }]
      : [],
    criteria: data.criteria || [],
    status: "Approved",
  };

  const res = await api.post<any>("schedule", "/api/schedules", payload);
  return {
    id: String(res?.id || ""),
    ...payload,
    ...res,
  };
}
