import { ActivityChildEvaluation } from "./types";

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
