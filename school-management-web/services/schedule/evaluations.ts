import { api, normalizeList } from "../client";
import { ActivityChildEvaluation } from "./types";

export async function getEvaluationsForSchedule(
  scheduleId: string
): Promise<ActivityChildEvaluation[]> {
  try {
    const [batchRes, actCritRes] = await Promise.all([
      fetch(
        scheduleId
          ? `/api/assessment/batch?activityId=${encodeURIComponent(scheduleId)}`
          : `/api/assessment/batch`,
        { cache: "no-store" }
      ).catch(() => null),
      fetch("/api/activities-with-criteria", { cache: "no-store" }).catch(() => null),
    ]);

    const critMap = new Map<string, string>();
    if (actCritRes && actCritRes.ok) {
      const acts = await actCritRes.json();
      if (Array.isArray(acts)) {
        acts.forEach((a: any) => {
          (a.criteria || []).forEach((c: any) => {
            critMap.set(c.id, c.name);
          });
        });
      }
    }

    if (batchRes && batchRes.ok) {
      const data = await batchRes.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length > 0) {
        return items.map((x: any) => ({
          id: x.id,
          scheduleId: x.activityId,
          childId: x.childId,
          result: x.result,
          note: x.comment || x.notes,
          comment: x.comment || x.notes,
          criterionId: x.developmentCriterionId,
          criterionName: critMap.get(x.developmentCriterionId) || "",
          evaluatedAt: x.assessedAt,
        }));
      }
    }

    const res = await api.get<any>(
      "development",
      `/api/development/assessments?page=1&pageSize=100`
    );
    const items = normalizeList<any>(res).filter(
      (x) => !scheduleId || x.activityId === scheduleId
    );
    return items.map((x) => ({
      id: x.id,
      scheduleId: x.activityId,
      childId: x.childId,
      result: x.result,
      note: x.notes || x.comment,
      comment: x.comment || x.notes,
      criterionId: x.developmentCriterionId,
      criterionName: critMap.get(x.developmentCriterionId) || "",
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
    const [batchRes, actCritRes, assessRes, actRes, critRes] = await Promise.all([
      fetch(`/api/assessment/batch?childId=${encodeURIComponent(childId)}`, { cache: "no-store" }).catch(() => null),
      fetch("/api/activities-with-criteria", { cache: "no-store" }).catch(() => null),
      api
        .get<any>(
          "development",
          `/api/development/assessments?childId=${encodeURIComponent(
            childId
          )}&page=1&pageSize=300`
        )
        .catch(() => ({ items: [] })),
      api
        .get<any>("activity", "/api/activities?page=1&pageSize=200")
        .catch(() => ({ items: [] })),
      api
        .get<any>("development", "/api/development/criteria?page=1&pageSize=300")
        .catch(() => ({ items: [] })),
    ]);

    let rawAssessments: any[] = [];
    if (batchRes && batchRes.ok) {
      const bData = await batchRes.json();
      if (Array.isArray(bData?.items) && bData.items.length > 0) {
        rawAssessments = bData.items;
      }
    }
    if (rawAssessments.length === 0) {
      rawAssessments = normalizeList<any>(assessRes);
    }

    const activities = normalizeList<any>(actRes);
    const criteria = normalizeList<any>(critRes);

    const activityTitleMap = new Map<string, string>();
    const criterionToActivityMap = new Map<string, string>();
    const criterionNameMap = new Map<string, string>();

    if (actCritRes && actCritRes.ok) {
      const actCrits = await actCritRes.json();
      if (Array.isArray(actCrits)) {
        actCrits.forEach((a: any) => {
          if (a.id && a.name) activityTitleMap.set(a.id, a.name);
          (a.criteria || []).forEach((c: any) => {
            if (c.id && c.name) criterionNameMap.set(c.id, c.name);
            if (c.id && a.name) criterionToActivityMap.set(c.id, a.name);
          });
        });
      }
    }

    activities.forEach((act: any) => {
      const actId = String(act.id || "").trim();
      const actName = String(act.name || act.title || "").trim();
      if (actId && actName && !activityTitleMap.has(actId)) {
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

    criteria.forEach((cr: any) => {
      const cid = String(cr.id || "").trim();
      const cName = String(cr.name || "").trim();
      if (cid && cName && !criterionNameMap.has(cid)) {
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

export function isGoodChildDelivered(
  childId: string,
  month: number,
  year: number,
  classId?: string
): boolean {
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

export function setGoodChildDelivered(
  keyId: string,
  month: number,
  year: number,
  delivered = true,
  isClass = false
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const key = isClass
      ? `class_${keyId}_${month}_${year}`
      : `${keyId}_${month}_${year}`;
    map[key] = delivered;
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

export async function saveActivityEvaluations(
  scheduleIdOrPayload:
    | string
    | {
        scheduleId: string;
        activityId?: string;
        activityTitle?: string;
        date?: string;
        evaluations: ActivityChildEvaluation[];
      },
  evalsArg?: ActivityChildEvaluation[]
): Promise<void> {
  let activityId = "";
  let scheduleId = "";
  let evals: ActivityChildEvaluation[] = [];

  if (typeof scheduleIdOrPayload === "object") {
    scheduleId = scheduleIdOrPayload.scheduleId;
    activityId =
      scheduleIdOrPayload.activityId || scheduleIdOrPayload.scheduleId;
    evals = scheduleIdOrPayload.evaluations || [];
  } else {
    scheduleId = scheduleIdOrPayload;
    activityId = scheduleIdOrPayload;
    evals = evalsArg || [];
  }

  const guidRe =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  for (const item of evals) {
    if (
      item.criterionId &&
      item.childId &&
      guidRe.test(item.criterionId) &&
      guidRe.test(item.childId)
    ) {
      try {
        const rawAct = activityId || scheduleId;
        await api.post("development", "/api/development/assessments", {
          childId: item.childId,
          developmentCriterionId: item.criterionId,
          activityId: guidRe.test(rawAct) ? rawAct : null,
          result: Boolean(
            item.completed || item.result === true || item.result === "Đạt"
          ),
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
