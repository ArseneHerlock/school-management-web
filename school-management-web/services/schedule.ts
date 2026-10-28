import { api, normalizeList } from "./client";

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
  const res = await api.get<any>("schedule", `/api/schedules${qs}`).catch(() => []);
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
  const res = await api.get<any>("schedule", `/api/schedules/parent${qs}`).catch(() => []);
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
  const res = await api.get<any>("schedule", `/api/schedules/teacher${qs}`).catch(() => []);
  return normalizeList<ScheduleEvent>(res);
}

export async function createSchedule(data: Partial<ScheduleEvent>): Promise<ScheduleEvent> {
  return await api.post<ScheduleEvent>("schedule", "/api/schedules", data);
}

export async function updateSchedule(id: string, data: Partial<ScheduleEvent>): Promise<ScheduleEvent> {
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
    combined = combined.filter((s) => s.isSchoolWide || s.classId === filters.classId);
  }
  if (filters?.from) {
    combined = combined.filter((s) => s.date >= filters.from!);
  }
  if (filters?.to) {
    combined = combined.filter((s) => s.date <= filters.to!);
  }

  return combined.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`));
}

export async function saveScheduledActivity(act: ActivityScheduleEvent): Promise<ActivityScheduleEvent> {
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

export async function getEvaluationsForSchedule(scheduleId: string): Promise<ActivityChildEvaluation[]> {
  try {
    const res = await api.get<any>("development", `/api/development/assessments?page=1&pageSize=100`);
    const items = normalizeList<any>(res).filter((x) => !scheduleId || x.activityId === scheduleId);
    return items.map((x) => ({
      id: x.id,
      scheduleId: x.activityId,
      childId: x.childId,
      result: x.result,
      note: x.notes || x.comment,
      comment: x.comment || x.notes,
      criterionId: x.developmentCriterionId,
      evaluatedAt: x.assessedAt,
    }));
  } catch {
    return [];
  }
}

export async function getEvaluationsForChild(
  childId: string,
  month?: number,
  year?: number
): Promise<ActivityChildEvaluation[]> {
  try {
    const [assessRes, actRes, critRes] = await Promise.all([
      api
        .get<any>(
          "development",
          `/api/development/assessments?childId=${encodeURIComponent(childId)}&page=1&pageSize=300`
        )
        .catch(() => ({ items: [] })),
      api
        .get<any>("activity", "/api/activities?page=1&pageSize=200")
        .catch(() => ({ items: [] })),
      api
        .get<any>("development", "/api/development/criteria?page=1&pageSize=300")
        .catch(() => ({ items: [] })),
    ]);

    const rawAssessments = normalizeList<any>(assessRes);
    const activities = normalizeList<any>(actRes);
    const criteria = normalizeList<any>(critRes);

    const activityTitleMap = new Map<string, string>();
    const criterionToActivityMap = new Map<string, string>();

    activities.forEach((act: any) => {
      const actId = String(act.id || "").trim();
      const actName = String(act.name || act.title || "").trim();
      if (actId && actName) {
        activityTitleMap.set(actId, actName);
      }
      if (Array.isArray(act.developmentCriteria)) {
        act.developmentCriteria.forEach((dc: any) => {
          const cid = String(dc.developmentCriterionId || "").trim();
          if (cid && actName && !criterionToActivityMap.has(cid)) {
            criterionToActivityMap.set(cid, actName);
          }
        });
      }
    });

    const criterionNameMap = new Map<string, string>();
    criteria.forEach((cr: any) => {
      const cid = String(cr.id || "").trim();
      const cName = String(cr.name || "").trim();
      if (cid && cName) {
        criterionNameMap.set(cid, cName);
      }
    });

    const mapped: ActivityChildEvaluation[] = rawAssessments.map((x: any) => {
      const actId = String(x.activityId || "").trim();
      const critId = String(x.developmentCriterionId || "").trim();
      const criterionName = criterionNameMap.get(critId) || "";
      const activityTitle =
        activityTitleMap.get(actId) ||
        criterionToActivityMap.get(critId) ||
        criterionName ||
        "Hoạt động trên lớp";
      const isoDate = x.assessedAt ? String(x.assessedAt).slice(0, 10) : "";

      return {
        id: x.id,
        scheduleId: actId || undefined,
        childId: x.childId,
        activityTitle,
        criterionId: critId,
        criterionName,
        date: isoDate,
        completed: Boolean(x.result),
        result: Boolean(x.result),
        note: String(x.notes || x.comment || "").trim(),
        comment: String(x.comment || x.notes || "").trim(),
        evaluatedAt: x.assessedAt,
      };
    });

    // Sắp xếp mới nhất lên đầu
    mapped.sort((a, b) =>
      String(b.evaluatedAt || b.date || "").localeCompare(
        String(a.evaluatedAt || a.date || "")
      )
    );

    if (month && year) {
      const filteredByMonth = mapped.filter((item) => {
        if (!item.date) return true;
        const d = new Date(item.date);
        if (Number.isNaN(d.getTime())) return true;
        return d.getMonth() + 1 === month && d.getFullYear() === year;
      });
      if (filteredByMonth.length > 0) {
        return filteredByMonth;
      }
    }

    return mapped;
  } catch {
    return [];
  }
}

const DELIVERY_STORAGE_KEY = "kindergarten_good_child_deliveries";

export function isGoodChildDelivered(childId: string, month: number, year: number, classId?: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    if (!raw) return false;
    const map = JSON.parse(raw);
    const childKey = `${childId}_${month}_${year}`;
    if (map[childKey] !== undefined) return Boolean(map[childKey]);
    if (classId) {
      const classKey = `class_${classId}_${month}_${year}`;
      if (map[classKey] !== undefined) return Boolean(map[classKey]);
    }
    return false;
  } catch {
    return false;
  }
}

export function setGoodChildDelivered(keyId: string, month: number, year: number, delivered = true, isClass = false): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const key = isClass ? `class_${keyId}_${month}_${year}` : `${keyId}_${month}_${year}`;
    map[key] = delivered;
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export async function saveActivityEvaluations(
  scheduleIdOrPayload: string | { scheduleId: string; activityId?: string; activityTitle?: string; date?: string; evaluations: ActivityChildEvaluation[] },
  evalsArg?: ActivityChildEvaluation[]
): Promise<void> {
  let activityId = "";
  let scheduleId = "";
  let evals: ActivityChildEvaluation[] = [];

  if (typeof scheduleIdOrPayload === "object") {
    scheduleId = scheduleIdOrPayload.scheduleId;
    activityId = scheduleIdOrPayload.activityId || scheduleIdOrPayload.scheduleId;
    evals = scheduleIdOrPayload.evaluations || [];
  } else {
    scheduleId = scheduleIdOrPayload;
    activityId = scheduleIdOrPayload;
    evals = evalsArg || [];
  }

  // Lưu đánh giá trực tiếp tới microservice Development API backend (PostgreSQL)
  const guidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  for (const item of evals) {
    if (item.criterionId && item.childId && guidRe.test(item.criterionId) && guidRe.test(item.childId)) {
      try {
        const rawAct = activityId || scheduleId;
        await api.post("development", "/api/development/assessments", {
          childId: item.childId,
          developmentCriterionId: item.criterionId,
          activityId: guidRe.test(rawAct) ? rawAct : null,
          result: Boolean(item.completed || item.result === true || item.result === "Đạt"),
          assessmentMethod: "QuanSat",
          comment: item.comment || item.note || null,
          evidence: null,
          assessedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Lỗi khi lưu đánh giá học sinh qua API:", err);
      }
    }
  }
}

export function synthesizeGoodChildComment(
  childIdOrEvals: string | ActivityChildEvaluation[],
  monthOrName?: number | string,
  yearOrMonth?: number
): string {
  const childName = typeof monthOrName === "string" ? monthOrName : "Bé";
  const month =
    typeof yearOrMonth === "number"
      ? yearOrMonth
      : typeof monthOrName === "number"
      ? monthOrName
      : new Date().getMonth() + 1;

  if (!Array.isArray(childIdOrEvals) || childIdOrEvals.length === 0) {
    return "";
  }

  const evals = childIdOrEvals;
  const passedEvals = evals.filter(
    (e) => e.completed || e.result === true || e.result === "Đạt"
  );
  const failedEvals = evals.filter(
    (e) => e.result === false || e.result === "Chưa đạt"
  );

  // Gom các nhận xét thực tế của giáo viên theo từng hoạt động (tránh trùng lặp câu nhận xét)
  const activityCommentLines: string[] = [];
  const seenActivityComments = new Set<string>();

  evals.forEach((ev) => {
    const rawComment = String(ev.comment || ev.note || "").trim();
    if (!rawComment) return;
    const actTitle = String(ev.activityTitle || "Hoạt động").trim();
    const dateLabel = ev.date
      ? new Date(ev.date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        })
      : "";
    const dedupKey = `${actTitle.toLowerCase()}|${rawComment.toLowerCase()}`;
    if (seenActivityComments.has(dedupKey)) return;
    seenActivityComments.add(dedupKey);
    activityCommentLines.push(
      `• ${actTitle}${dateLabel ? ` (${dateLabel})` : ""}: ${rawComment}`
    );
  });

  // Gom tên các tiêu chí Đạt và Cần rèn luyện từ kết quả chấm thực tế
  const passedCriteria = Array.from(
    new Set(
      passedEvals
        .map((e) => e.criterionName || e.activityTitle)
        .filter((x): x is string => Boolean(x && x.trim()))
    )
  );
  const failedCriteria = Array.from(
    new Set(
      failedEvals
        .map((e) => e.criterionName || e.activityTitle)
        .filter((x): x is string => Boolean(x && x.trim()))
    )
  );

  const lines: string[] = [];
  lines.push(
    `Tổng hợp đánh giá hoạt động tháng ${month} của bé ${childName} (Đạt ${passedEvals.length}/${evals.length} nội dung đánh giá):`
  );

  if (activityCommentLines.length > 0) {
    lines.push(...activityCommentLines);
  }

  if (passedCriteria.length > 0) {
    lines.push(
      `- Nội dung thực hiện tốt (Đạt): ${passedCriteria.slice(0, 6).join(", ")}.`
    );
  }

  if (failedCriteria.length > 0) {
    lines.push(
      `- Nội dung cần rèn luyện thêm: ${failedCriteria.slice(0, 4).join(", ")}.`
    );
  }

  return lines.join("\n");
}
