import { api } from "../client";
import { getAssessments } from "../development";
import {
  AppNotification,
  ParentChildSummary,
  toIsoDateOnly,
  resolveRealtimeTimestamp,
  formatVnd,
} from "./types";
import { checkAttendanceAndHealth } from "./parentChildHealthAtt";

export async function processChildNotifications({
  child,
  todayIso,
  readSet,
  criteriaMap,
  activityMap,
}: {
  child: ParentChildSummary;
  todayIso: string;
  readSet: Set<string>;
  criteriaMap: Map<string, string>;
  activityMap: Map<string, string>;
}): Promise<AppNotification[]> {
  const items: AppNotification[] = [];
  if (!child?.id) return items;

  // 1 & 2. Điểm danh và Sức khỏe
  const attAndHealthItems = await checkAttendanceAndHealth({
    child,
    todayIso,
    readSet,
  });
  items.push(...attAndHealthItems);

  const [invoiceRes, assessRes, goodChildRes] = await Promise.allSettled([
    api.get<any>("billing", `/api/billing/invoices?childId=${child.id}`),
    getAssessments({ childId: child.id, page: 1, pageSize: 100 }),
    api.get<any>(
      "learning",
      `/good-child-records?childId=${encodeURIComponent(
        child.id
      )}&pageSize=10`
    ),
  ]);

  // 3. Học phí & Công nợ
  if (invoiceRes.status === "fulfilled" && invoiceRes.value) {
    const rawInvoices = Array.isArray(invoiceRes.value)
      ? invoiceRes.value
      : Array.isArray(invoiceRes.value?.items)
      ? invoiceRes.value.items
      : [invoiceRes.value];

    rawInvoices.forEach((inv: any) => {
      if (!inv || !inv.id) return;
      const total = Number(inv.totalAmount ?? inv.subTotal ?? 0);
      const paid = Number(inv.paidAmount ?? 0);
      const outstanding = Number(
        inv.outstandingAmount ?? Math.max(0, total - paid)
      );
      const status = String(inv.status || "").toLowerCase();
      const dueDate = toIsoDateOnly(inv.dueDate);
      const isOverdue =
        status === "overdue" ||
        (dueDate && dueDate < todayIso && outstanding > 0);
      const isUnpaid =
        isOverdue ||
        status === "unpaid" ||
        status === "partiallypaid" ||
        outstanding > 0;

      if (isUnpaid && outstanding > 0) {
        const invNum =
          inv.invoiceNumber || String(inv.id).slice(0, 8).toUpperCase();
        const notifId = `parent-tuition-debt-${child.id}-${inv.id}-${outstanding}-${inv.status}`;
        items.push({
          id: notifId,
          category: "tuition",
          severity: isOverdue ? "danger" : "warning",
          isUrgent: true,
          title: isOverdue
            ? `Quá hạn học phí: ${child.hoTen} (${formatVnd(outstanding)})`
            : `Thông báo học phí chưa đóng: ${child.hoTen} (${formatVnd(
                outstanding
              )})`,
          message: `Hóa đơn #${invNum}: Còn nợ ${formatVnd(
            outstanding
          )} / Tổng ${formatVnd(total)}${
            dueDate ? ` (Hạn đóng: ${dueDate})` : ""
          }.`,
          timestamp: resolveRealtimeTimestamp(
            notifId,
            inv.updatedAt || inv.createdAt
          ),
          read: readSet.has(notifId),
          targetTab: "tuition",
          childId: child.id,
          childName: child.hoTen,
          badgeText: isOverdue ? "Quá hạn học phí" : "Nợ học phí",
        });
      }
    });
  }

  // 4. Đánh giá chưa đạt hôm nay
  if (assessRes.status === "fulfilled" && assessRes.value?.items) {
    const failedToday = assessRes.value.items.filter((a) => {
      if (a.result !== false) return false;
      const assessDate = toIsoDateOnly(a.assessedAt);
      return assessDate === todayIso;
    });

    failedToday.forEach((a) => {
      const critName = criteriaMap.get(a.developmentCriterionId) || "";
      const actName = a.activityId ? activityMap.get(a.activityId) || "" : "";
      const notifId = `parent-assess-fail-today-${child.id}-${a.id}`;

      items.push({
        id: notifId,
        category: "assessment",
        severity: "danger",
        isUrgent: true,
        title: `Cần quan tâm hôm nay: ${child.hoTen} chưa đạt${
          actName ? ` (${actName})` : ""
        }`,
        message: `Giáo viên đánh giá chưa đạt ở tiêu chí "${critName}"${
          actName ? ` trong hoạt động "${actName}"` : ""
        } ngày ${todayIso}.${a.comment ? ` Nhận xét: ${a.comment}` : ""}`,
        timestamp: resolveRealtimeTimestamp(notifId, a.assessedAt),
        read: readSet.has(notifId),
        targetTab: "assessment",
        childId: child.id,
        childName: child.hoTen,
        badgeText: "Chưa đạt hôm nay",
      });
    });
  }

  // 5. Bé ngoan
  if (goodChildRes.status === "fulfilled" && goodChildRes.value) {
    const gcRecords = Array.isArray(goodChildRes.value)
      ? goodChildRes.value
      : Array.isArray(goodChildRes.value?.items)
      ? goodChildRes.value.items
      : [];
    const latestGc = gcRecords[0];
    if (
      latestGc &&
      latestGc.teacherComment &&
      String(latestGc.teacherComment).trim()
    ) {
      const gcComment = String(latestGc.teacherComment).trim();
      const gcId = `parent-goodchild-${child.id}-${
        latestGc.id
      }-${gcComment.slice(0, 24)}`;
      items.push({
        id: gcId,
        category: "assessment",
        severity: "success",
        isUrgent: false,
        title: `Sổ bé ngoan Tháng ${latestGc.month}/${latestGc.year}: ${child.hoTen}`,
        message: gcComment,
        timestamp: resolveRealtimeTimestamp(
          gcId,
          latestGc.updatedAt || latestGc.createdAt
        ),
        read: readSet.has(gcId),
        targetTab: "good-child",
        childId: child.id,
        childName: child.hoTen,
        badgeText: `Sổ bé ngoan T${latestGc.month}`,
      });
    }
  }

  return items;
}
