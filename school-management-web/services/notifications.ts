import { api, currentUser } from "./client";
import { getClasses } from "./classes";
import { getStaffByUserId } from "./staff";
import { getStudents } from "./students";
import { getAssessments, getCriteria, getActivities } from "./development";
import { isEvaluableActivity } from "@/app/components/schedule/WeeklyTimetable";
import { classifyWhoBmi } from "@/app/teacher/health/components/whoStandards";

export type NotificationCategory =
  | "all"
  | "urgent"
  | "attendance"
  | "assessment"
  | "health"
  | "tuition"
  | "message"
  | "schedule"
  | "news"
  | "leave";

export type NotificationSeverity = "info" | "success" | "warning" | "danger";

export interface AppNotification {
  id: string;
  category: Exclude<NotificationCategory, "all" | "urgent">;
  severity: NotificationSeverity;
  isUrgent: boolean;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRoute?: string;
  targetTab?: string;
  childId?: string;
  childName?: string;
  badgeText?: string;
}

const READ_STORAGE_PREFIX = "mamnon_read_notifications_";
const SEEN_TOAST_PREFIX = "mamnon_seen_toast_notifications_";

function getReadSet(userId: string): Set<string> {
  if (typeof window === "undefined" || !userId) return new Set();
  try {
    const raw = window.localStorage.getItem(`${READ_STORAGE_PREFIX}${userId}`);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function markNotificationRead(userId: string, notificationId: string): void {
  if (typeof window === "undefined" || !userId || !notificationId) return;
  try {
    const set = getReadSet(userId);
    set.add(notificationId);
    window.localStorage.setItem(
      `${READ_STORAGE_PREFIX}${userId}`,
      JSON.stringify(Array.from(set).slice(-500))
    );
  } catch {}
}

export function markAllNotificationsRead(userId: string, notificationIds: string[]): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    const set = getReadSet(userId);
    notificationIds.forEach((id) => set.add(id));
    window.localStorage.setItem(
      `${READ_STORAGE_PREFIX}${userId}`,
      JSON.stringify(Array.from(set).slice(-500))
    );
  } catch {}
}

export function getUnseenToastNotifications(
  userId: string,
  notifications: AppNotification[],
  markAsSeen = true
): AppNotification[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const key = `${SEEN_TOAST_PREFIX}${userId}`;
    const raw = window.sessionStorage.getItem(key);
    const seenSet: Set<string> = raw ? new Set(JSON.parse(raw)) : new Set();

    const unseen = notifications.filter((n) => !seenSet.has(n.id) && !n.read);

    if (markAsSeen) {
      notifications.forEach((n) => seenSet.add(n.id));
      window.sessionStorage.setItem(key, JSON.stringify(Array.from(seenSet).slice(-500)));
    }

    return unseen.slice(0, 3);
  } catch {
    return [];
  }
}

function stripEmbeddedImageTags(text: string): string {
  if (!text) return "";
  return text.replace(/<!--IMG:[\s\S]*?-->/g, "").trim();
}

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}

function toIsoDateOnly(val: unknown): string {
  if (!val) return "";
  const str = String(val);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function getLocalTodayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const EVENT_TS_STORAGE_KEY = "mamnon_event_timestamps_v2";

function getOrRecordEventTimestamp(notifId: string): string {
  const nowIso = new Date().toISOString();
  if (typeof window === "undefined" || !notifId) return nowIso;
  try {
    const raw = window.localStorage.getItem(EVENT_TS_STORAGE_KEY);
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    if (map[notifId]) {
      return map[notifId];
    }
    map[notifId] = nowIso;
    const keys = Object.keys(map);
    if (keys.length > 600) {
      keys.slice(0, keys.length - 500).forEach((k) => delete map[k]);
    }
    window.localStorage.setItem(EVENT_TS_STORAGE_KEY, JSON.stringify(map));
    return nowIso;
  } catch {
    return nowIso;
  }
}

/**
 * Chuẩn hóa mốc thời gian thực tế của sự kiện thông báo:
 * - Không bao giờ gán giờ cứng (08:00, 09:00, 10:00).
 * - Nếu bản ghi từ API chỉ có Ngày (YYYY-MM-DD hoặc T00:00:00 không kèm giờ thực tế),
 *   ghi nhận và giữ nguyên thời điểm chính xác lúc sự kiện xuất hiện trên hệ thống.
 * - Nếu chuỗi ISO từ C# DateTime.UtcNow thiếu hậu tố 'Z', tự động chuẩn hóa về UTC để không bị lệch 7 tiếng.
 */
function resolveRealtimeTimestamp(notifId: string, rawApiTimestamp?: unknown): string {
  if (!rawApiTimestamp) {
    return getOrRecordEventTimestamp(notifId);
  }
  const str = String(rawApiTimestamp).trim();
  if (!str) {
    return getOrRecordEventTimestamp(notifId);
  }

  // Nếu chỉ có ngày (YYYY-MM-DD) hoặc giờ 00:00:00 mặc định của kiểu Date trong DB
  if (
    /^\d{4}-\d{2}-\d{2}$/.test(str) ||
    /T00:00:00(\.0+)?(Z|[+-]\d{2}:\d{2})?$/i.test(str)
  ) {
    return getOrRecordEventTimestamp(notifId);
  }

  const nowMs = Date.now();
  const hasExplicitTz = /Z$|[+-]\d{2}:\d{2}$/i.test(str);

  if (!hasExplicitTz && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(str)) {
    const localMs = new Date(str).getTime();
    const utcMs = new Date(`${str}Z`).getTime();
    if (!Number.isNaN(localMs) && !Number.isNaN(utcMs)) {
      // Nếu parse theo giờ local bị lùi ~7 tiếng so với hiện tại trong khi parse UTC khớp với thời điểm hiện tại
      if (
        nowMs - localMs >= 5.5 * 3600 * 1000 &&
        utcMs <= nowMs + 5 * 60 * 1000 &&
        Math.abs(nowMs - utcMs) < Math.abs(nowMs - localMs)
      ) {
        return new Date(utcMs).toISOString();
      }
      return new Date(Math.min(localMs, nowMs)).toISOString();
    }
  }

  const parsed = new Date(str).getTime();
  if (Number.isNaN(parsed)) {
    return getOrRecordEventTimestamp(notifId);
  }
  return new Date(Math.min(parsed, nowMs)).toISOString();
}

let teacherNotifInFlight: Promise<AppNotification[]> | null = null;
let parentNotifInFlight: Promise<AppNotification[]> | null = null;

export const REALTIME_NOTIFICATION_EVENT = "mamnon:realtime-notification-update";

export function dispatchRealtimeNotificationSync(detail?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(REALTIME_NOTIFICATION_EVENT, {
      detail: detail || { timestamp: new Date().toISOString() },
    })
  );
  try {
    const channel = new BroadcastChannel("mamnon_notifications_channel");
    channel.postMessage({
      type: "SYNC",
      ...(detail || {}),
      timestamp: new Date().toISOString(),
    });
    channel.close();
  } catch {}
}

/**
 * Phát âm thanh chuông báo nhẹ nhàng bằng Web Audio API khi có thông báo khẩn / mới thời gian thực
 */
export function playNotificationChime(urgent = false): void {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(urgent ? 880 : 659.25, now);
    osc1.frequency.exponentialRampToValueAtTime(urgent ? 1174.66 : 880, now + 0.14);

    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.34);
  } catch {}
}

/**
 * Tải thông báo thực tế cho GIÁO VIÊN từ API:
 * 1. Tin nhắn từ phụ huynh (chỉ khi tin nhắn cuối cùng trong hội thoại là do phụ huynh gửi, giáo viên chưa phản hồi)
 * 2. Đơn xin nghỉ học đang chờ giáo viên duyệt (status === Pending)
 * 3. Lịch hoạt động giáo dục / sự kiện mới của lớp hoặc toàn trường (loại bỏ hoàn toàn các giờ sinh hoạt cố định như đón trẻ, ăn trưa, ngủ trưa)
 * 4. Thông báo từ nhà trường (/api/news dành cho Giáo viên hoặc Toàn trường)
 */
export async function fetchTeacherNotifications(): Promise<AppNotification[]> {
  const user = currentUser();
  if (!user?.id) return [];

  if (teacherNotifInFlight) {
    return teacherNotifInFlight;
  }

  teacherNotifInFlight = (async () => {
    const readSet = getReadSet(user.id);
    const items: AppNotification[] = [];
    const todayIso = getLocalTodayIso();

    try {
      const [staffMember, allClasses, allParents] = await Promise.all([
        getStaffByUserId(user.id).catch(() => null),
        getClasses().catch(() => []),
        api.get<any[]>("parents", "/api/parents").catch(() => []),
      ]);

      const matchedClass = allClasses.find(
        (c) => staffMember?.staffId && c.giaoVienChuNhiemId === staffMember.staffId
      );

      const classStudents = matchedClass
        ? await getStudents({ lopId: matchedClass.id }).catch(() => [])
        : [];

      const studentMap = new Map<string, string>();
      classStudents.forEach((s) => {
        studentMap.set(String(s.id), s.tenHocSinh);
      });

      const parentNameByUserId = new Map<string, string>();
      if (Array.isArray(allParents)) {
        allParents.forEach((p: any) => {
          const uid = String(p.taiKhoanId || p.TaiKhoanId || p.id || p.Id || "")
            .toLowerCase()
            .trim();
          const name = String(p.hoTen || p.HoTen || "");
          if (uid && name) parentNameByUserId.set(uid, name);
        });
      }

      const nextWeekDate = new Date();
      nextWeekDate.setDate(nextWeekDate.getDate() + 7);
      const nextWeekIso = nextWeekDate.toISOString().slice(0, 10);

      const [convsRes, leavesRes, newsRes, schedulesRes] = await Promise.allSettled([
        api.get<any[]>("communication", "/api/Conversations/mine"),
        api.get<any[]>("leave", "/api/leaves?subjectType=Child"),
        api.get<any>("news", "/api/news?trang=1&soLuongMoiTrang=10"),
        api.get<any[]>(
          "schedule",
          `/api/schedules?from=${todayIso}&to=${nextWeekIso}${
            matchedClass?.id ? `&classId=${matchedClass.id}` : ""
          }`
        ),
      ]);

      // 1. Tin nhắn từ phụ huynh (chỉ thông báo khi tin nhắn mới nhất trong hội thoại là do phụ huynh gửi)
      if (convsRes.status === "fulfilled" && Array.isArray(convsRes.value)) {
        const convs = convsRes.value.slice(0, 10);
        const msgResults = await Promise.allSettled(
          convs.map((c: any) => {
            const cid = c.messageConversationId || c.MessageConversationId || c.id || c.Id;
            return api.get<any[]>("communication", `/api/Messages/conversation/${cid}`);
          })
        );

        msgResults.forEach((res, idx) => {
          if (res.status !== "fulfilled" || !Array.isArray(res.value) || res.value.length === 0) {
            return;
          }
          const conv = convs[idx];
          const cid = conv.messageConversationId || conv.MessageConversationId || conv.id || conv.Id;
          const lastMessage = res.value[res.value.length - 1];
          const senderId = String(
            lastMessage?.senderUserId ??
              lastMessage?.SenderUserId ??
              lastMessage?.senderId ??
              lastMessage?.SenderId ??
              ""
          )
            .toLowerCase()
            .trim();
          const currentUserId = String(user.id || "").toLowerCase().trim();

          // Chỉ thông báo nếu người gửi tin nhắn cuối cùng KHÔNG phải là giáo viên hiện tại
          if (lastMessage && senderId && senderId !== currentUserId) {
            const senderName =
              parentNameByUserId.get(senderId) ||
              parentNameByUserId.get(
                String(
                  lastMessage?.senderUserId || lastMessage?.senderId || ""
                )
              );
            const sentAt =
              lastMessage.messageSentAt ||
              lastMessage.MessageSentAt ||
              lastMessage.sentAt ||
              lastMessage.createdAt ||
              conv.lastMessageSentAt ||
              conv.conversationCreatedAt ||
              "";
            const content = String(
              lastMessage.messageContent ??
                lastMessage.MessageContent ??
                lastMessage.content ??
                lastMessage.Content ??
                ""
            ).trim();
            if (!content) return;

            const msgId =
              lastMessage.messageId ||
              lastMessage.MessageId ||
              lastMessage.id ||
              lastMessage.Id ||
              cid;
            const notifId = `teacher-msg-${msgId}-${sentAt}`;
            items.push({
              id: notifId,
              category: "message",
              severity: "info",
              isUrgent: true,
              title: senderName
                ? `Tin nhắn mới từ phụ huynh ${senderName}`
                : "Tin nhắn mới từ phụ huynh",
              message: content,
              timestamp: resolveRealtimeTimestamp(notifId, sentAt),
              read: readSet.has(notifId),
              targetRoute: "/teacher/messages",
              badgeText: "Tin nhắn PH",
            });
          }
        });
      }

      // 2. Đơn xin nghỉ học đang chờ duyệt của học sinh trong lớp
      if (leavesRes.status === "fulfilled" && Array.isArray(leavesRes.value)) {
        leavesRes.value.forEach((lv: any) => {
          const childId = String(lv.childId || "");
          if (!studentMap.has(childId)) return;
          const childName = studentMap.get(childId)!;
          const statusStr = String(lv.status).toLowerCase();
          const isPending = statusStr === "0" || statusStr === "pending";
          if (!isPending) return;

          const fromDate = toIsoDateOnly(lv.fromDate);
          const toDate = toIsoDateOnly(lv.toDate);
          const createdAt = lv.createdAtUtc || lv.fromDate || "";
          const notifId = `teacher-leave-${lv.id}-${lv.status}`;

          items.push({
            id: notifId,
            category: "leave",
            severity: "warning",
            isUrgent: true,
            title: `Đơn xin nghỉ chờ duyệt: ${childName}`,
            message: `Xin nghỉ từ ${fromDate} đến ${toDate}.${
              lv.reason ? ` Lý do: ${lv.reason}` : ""
            }`,
            timestamp: resolveRealtimeTimestamp(notifId, createdAt),
            read: readSet.has(notifId),
            targetRoute: "/teacher/leave",
            childId,
            childName,
            badgeText: "Đơn xin nghỉ",
          });
        });
      }

      // 3. Lịch hoạt động giáo dục / sự kiện của lớp hoặc toàn trường (CHỈ lấy hoạt động giáo dục/sự kiện, không lấy giờ ăn/ngủ/đón/trả cố định)
      if (schedulesRes.status === "fulfilled" && Array.isArray(schedulesRes.value)) {
        const activitySchedules = schedulesRes.value.filter((s: any) => {
          const belongsToClass =
            s.isSchoolWide ||
            (matchedClass?.id && String(s.classId || s.lopId) === String(matchedClass.id));
          if (!belongsToClass) return false;
          return isEvaluableActivity(s);
        });

        activitySchedules.slice(0, 5).forEach((sch: any) => {
          const schId = sch.id || sch.scheduleId;
          const dateStr = toIsoDateOnly(sch.startDate || sch.ngayBatDau || sch.date);
          const startTime = String(sch.startTime || sch.gioBatDau || "").slice(0, 5);
          const endTime = String(sch.endTime || sch.gioKetThuc || "").slice(0, 5);
          const title = String(sch.title || sch.tieuDe || sch.tenSuKien || "").trim();
          if (!schId || !title || !dateStr) return;

          const isToday = dateStr === todayIso;
          const notifId = `teacher-schedule-${schId}-${dateStr}`;

          items.push({
            id: notifId,
            category: "schedule",
            severity: isToday ? "info" : "success",
            isUrgent: isToday,
            title: isToday
              ? `Hoạt động hôm nay${startTime ? ` (${startTime})` : ""}: ${title}`
              : `Lịch hoạt động ngày ${dateStr}: ${title}`,
            message: `${
              sch.isSchoolWide
                ? "Hoạt động toàn trường"
                : matchedClass?.tenLop
                ? `Lớp ${matchedClass.tenLop}`
                : ""
            }${startTime ? ` • ${startTime}${endTime ? ` - ${endTime}` : ""}` : ""}${
              sch.location ? ` • ${sch.location}` : ""
            }`,
            timestamp: resolveRealtimeTimestamp(notifId, sch.createdAt || sch.updatedAt),
            read: readSet.has(notifId),
            targetRoute: "/teacher/schedule",
            badgeText: isToday ? "Lịch hôm nay" : "Lịch mới",
          });
        });
      }

      // 4. Thông báo từ nhà trường (/api/news dành cho Giáo viên hoặc Toàn trường)
      if (newsRes.status === "fulfilled" && newsRes.value) {
        const rawNews = Array.isArray(newsRes.value)
          ? newsRes.value
          : Array.isArray(newsRes.value.items)
          ? newsRes.value.items
          : [];

        rawNews
          .filter((n: any) => {
            const scope = Number(n.phamVi ?? n.PhamVi ?? 0);
            return scope === 0 || scope === 1;
          })
          .slice(0, 5)
          .forEach((n: any) => {
            const nid = n.id || n.Id;
            const title = String(n.tieuDe || n.TieuDe || "").trim();
            const summary = stripEmbeddedImageTags(n.tomTat || n.TomTat || "");
            const pubDate = n.ngayXuatBan || n.NgayXuatBan || n.ngayTao || n.NgayTao || "";
            if (!nid || !title) return;

            const scope = Number(n.phamVi ?? n.PhamVi ?? 0);
            const notifId = `teacher-news-${nid}-${pubDate}`;

            items.push({
              id: notifId,
              category: "news",
              severity: scope === 1 ? "warning" : "info",
              isUrgent: scope === 1,
              title: `Thông báo trường: ${title}`,
              message: summary,
              timestamp: resolveRealtimeTimestamp(notifId, pubDate),
              read: readSet.has(notifId),
              targetRoute: "/teacher/news",
              badgeText: scope === 1 ? "Thông báo GV" : "Toàn trường",
            });
          });
      }
    } catch (err) {
      console.error("Lỗi tải thông báo giáo viên:", err);
    }

    return items.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  })().finally(() => {
    teacherNotifInFlight = null;
  });

  return teacherNotifInFlight;
}

export interface ParentChildSummary {
  id: string;
  hoTen: string;
  gioiTinh?: string;
  ngaySinh?: string;
  lop?: string;
  classId?: string;
  giaoVienChuNhiem?: string;
}

/**
 * Tải thông báo thực tế cho PHỤ HUYNH từ 100% dữ liệu thật trên API:
 * 1. Điểm danh HÔM NAY (chỉ thông báo khi giáo viên ĐÃ điểm danh ngày hôm nay: con đã đến lớp lúc mấy giờ, đã về lúc mấy giờ, hoặc hôm nay vắng mặt)
 * 2. Nợ học phí / Quá hạn thanh toán (chỉ thông báo khi hóa đơn thật trên /api/billing/invoices còn dư nợ > 0)
 * 3. Cảnh báo sức khỏe trẻ cần quan tâm (áp dụng bảng chuẩn WHO Child Growth Standards 24-60 tháng tuổi đồng nhất toàn hệ thống)
 * 4. Cảnh báo kết quả đánh giá hoạt động HÔM NAY (chỉ thông báo khi giáo viên đánh giá trẻ KHÔNG ĐẠT `result === false` trong hoạt động của ngày hôm nay)
 * 5. Tin nhắn mới từ giáo viên (chỉ khi tin nhắn cuối cùng trong hội thoại là do giáo viên gửi), kết quả duyệt đơn xin nghỉ học, và bản tin mới của trường.
 */
export async function fetchParentNotifications(
  children: ParentChildSummary[]
): Promise<AppNotification[]> {
  const user = currentUser();
  if (!user?.id) return [];

  if (parentNotifInFlight) {
    return parentNotifInFlight;
  }

  parentNotifInFlight = (async () => {
    const readSet = getReadSet(user.id);
    const items: AppNotification[] = [];
    const todayIso = getLocalTodayIso();

    try {
      const [criteriaRes, activitiesRes, newsRes, convsRes, leavesRes] = await Promise.allSettled([
        getCriteria({ page: 1, pageSize: 200 }),
        getActivities({ page: 1, pageSize: 200 }),
        api.get<any>("news", "/api/news?trang=1&soLuongMoiTrang=10"),
        api.get<any[]>("communication", "/api/Conversations/mine"),
        api.get<any[]>("leave", "/api/leaves?subjectType=Child"),
      ]);

      const criteriaMap = new Map<string, string>();
      if (criteriaRes.status === "fulfilled" && criteriaRes.value?.items) {
        criteriaRes.value.items.forEach((c) => criteriaMap.set(c.id, c.name));
      }

      const activityMap = new Map<string, string>();
      if (activitiesRes.status === "fulfilled" && activitiesRes.value?.items) {
        activitiesRes.value.items.forEach((a) => activityMap.set(a.id, a.name));
      }

      await Promise.all(
        children.map(async (child) => {
          if (!child?.id) return;

          const [attRes, healthRes, invoiceRes, assessRes, goodChildRes] = await Promise.allSettled([
            api.get<any>("attendance", `/api/DiemDanh/today/${child.id}?date=${todayIso}`),
            api.get<any>("health", `/api/SucKhoe/lich-su/${child.id}`),
            api.get<any>("billing", `/api/billing/invoices?childId=${child.id}`),
            getAssessments({ childId: child.id, page: 1, pageSize: 100 }),
            api.get<any>("learning", `/good-child-records?childId=${encodeURIComponent(child.id)}&pageSize=10`),
          ]);

          // 1A. ĐIỂM DANH HÔM NAY (Chỉ hiển thị khi có bản ghi điểm danh thực tế của ngày hôm nay từ API)
          if (attRes.status === "fulfilled" && attRes.value?.coBanGhi && attRes.value?.data) {
            const todayRecord = attRes.value.data;
            const status = String(todayRecord.trangThai || todayRecord.TrangThai || "").trim();
            const gioDen = todayRecord.gioDen || todayRecord.GioDen
              ? String(todayRecord.gioDen || todayRecord.GioDen).slice(0, 5)
              : "";
            const gioVe = todayRecord.gioVe || todayRecord.GioVe
              ? String(todayRecord.gioVe || todayRecord.GioVe).slice(0, 5)
              : "";

            if (status.toLowerCase().includes("vắng") || status.toLowerCase().includes("nghỉ")) {
              const notifId = `parent-att-absent-${child.id}-${todayIso}-${status}`;
              items.push({
                id: notifId,
                category: "attendance",
                severity: "danger",
                isUrgent: true,
                title: `Điểm danh hôm nay (${todayIso}): ${child.hoTen} - ${status}`,
                message: `Giáo viên lớp ${child.lop || ""} đã điểm danh trạng thái "${status}" trong ngày ${todayIso}.`,
                timestamp: resolveRealtimeTimestamp(notifId, todayRecord.updatedAt || todayRecord.createdAt),
                read: readSet.has(notifId),
                targetTab: "attendance",
                childId: child.id,
                childName: child.hoTen,
                badgeText: status,
              });
            } else if (gioVe) {
              const notifId = `parent-att-checkout-${child.id}-${todayIso}-${gioVe}`;
              items.push({
                id: notifId,
                category: "attendance",
                severity: "success",
                isUrgent: true,
                title: `${child.hoTen} đã được đón về lúc ${gioVe}`,
                message: `Điểm danh ngày ${todayIso}: Giờ đến lớp ${gioDen || "--:--"}, giờ đón về ${gioVe}.`,
                timestamp: resolveRealtimeTimestamp(notifId, `${todayIso}T${gioVe}:00`),
                read: readSet.has(notifId),
                targetTab: "attendance",
                childId: child.id,
                childName: child.hoTen,
                badgeText: "Đã về",
              });
            } else if (gioDen || status) {
              const isLate = status.toLowerCase().includes("muộn");
              const notifId = `parent-att-checkin-${child.id}-${todayIso}-${gioDen}-${status}`;
              items.push({
                id: notifId,
                category: "attendance",
                severity: isLate ? "warning" : "success",
                isUrgent: true,
                title: `${child.hoTen} đã đến lớp${gioDen ? ` lúc ${gioDen}` : ""} (${status})`,
                message: `Điểm danh ngày ${todayIso}: Trạng thái "${status}"${
                  gioDen ? `, giờ đến ${gioDen}` : ""
                }. Chưa ghi nhận giờ về.`,
                timestamp: resolveRealtimeTimestamp(
                  notifId,
                  gioDen ? `${todayIso}T${gioDen}:00` : undefined
                ),
                read: readSet.has(notifId),
                targetTab: "attendance",
                childId: child.id,
                childName: child.hoTen,
                badgeText: "Đã đến lớp",
              });
            }
          }

          // 1B. CẢNH BÁO SỨC KHỎE TRẺ CẦN QUAN TÂM (Theo bảng chuẩn WHO Child Growth Standards 24-60 tháng tuổi)
          if (healthRes.status === "fulfilled" && healthRes.value) {
            const rawHealth = Array.isArray(healthRes.value)
              ? healthRes.value
              : [healthRes.value];
            const sortedHealth = rawHealth
              .filter((h: any) => h && (h.canNang || h.chieuCao))
              .sort((a: any, b: any) =>
                String(b.ngayDo || "").localeCompare(String(a.ngayDo || ""))
              );

            const latestHealth = sortedHealth[0];
            if (latestHealth) {
              const weight = Number(latestHealth.canNang || 0);
              const heightCm = Number(latestHealth.chieuCao || 0);
              const heightM = heightCm > 0 ? heightCm / 100 : 0;
              const bmi = heightM > 0 ? Math.round((weight / (heightM * heightM)) * 10) / 10 : 0;
              const bmiRounded = bmi > 0 ? bmi.toFixed(1) : "";
              const note = String(latestHealth.ghiChu || "").trim();
              const noteLower = note.toLowerCase();
              const measureDate = toIsoDateOnly(latestHealth.ngayDo);

              const whoClass = classifyWhoBmi(bmi, child.gioiTinh, child.ngaySinh);
              const isObese =
                whoClass.code === "BEO_PHI_DO_I" ||
                whoClass.code === "BEO_PHI_DO_II" ||
                noteLower.includes("béo phì");
              const isOverweight =
                !isObese &&
                (whoClass.code === "TIEN_BEO_PHI" || noteLower.includes("thừa cân"));
              const isUnderweight =
                !isObese &&
                !isOverweight &&
                (whoClass.code === "CAN_NANG_THAP" ||
                  noteLower.includes("suy dinh dưỡng") ||
                  noteLower.includes("nhẹ cân") ||
                  noteLower.includes("thấp còi"));

              if (isObese || isOverweight || isUnderweight) {
                const statusLabel =
                  whoClass.code !== "BINH_THUONG"
                    ? whoClass.shortLabel
                    : isObese
                    ? "Béo phì"
                    : isOverweight
                    ? "Thừa cân"
                    : "Nhẹ cân / Suy dinh dưỡng";
                const notifId = `parent-health-alert-${child.id}-${latestHealth.id || measureDate}-${weight}-${heightCm}-${statusLabel}`;
                items.push({
                  id: notifId,
                  category: "health",
                  severity: isObese ? "danger" : "warning",
                  isUrgent: true,
                  title: `Cảnh báo sức khỏe (${statusLabel} - Chuẩn WHO): ${child.hoTen}`,
                  message: `Số đo ngày ${measureDate}: Cân nặng ${weight}kg, Chiều cao ${heightCm}cm (BMI ${bmiRounded} - ${whoClass.label}).${
                    note ? ` Ghi chú y tế: ${note}` : ""
                  }`,
                  timestamp: resolveRealtimeTimestamp(
                    notifId,
                    latestHealth.updatedAt || latestHealth.createdAt || latestHealth.ngayDo
                  ),
                  read: readSet.has(notifId),
                  targetTab: "health",
                  childId: child.id,
                  childName: child.hoTen,
                  badgeText: statusLabel,
                });
              }
            }
          }

          // 1C. THÔNG BÁO NỢ HỌC PHÍ / QUÁ HẠN (Chỉ thông báo khi có hóa đơn chưa thanh toán hoặc quá hạn thực tế)
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
                const invNum = inv.invoiceNumber || String(inv.id).slice(0, 8).toUpperCase();
                const notifId = `parent-tuition-debt-${child.id}-${inv.id}-${outstanding}-${inv.status}`;
                items.push({
                  id: notifId,
                  category: "tuition",
                  severity: isOverdue ? "danger" : "warning",
                  isUrgent: true,
                  title: isOverdue
                    ? `Quá hạn học phí: ${child.hoTen} (${formatVnd(outstanding)})`
                    : `Thông báo học phí chưa đóng: ${child.hoTen} (${formatVnd(outstanding)})`,
                  message: `Hóa đơn #${invNum}: Còn nợ ${formatVnd(outstanding)} / Tổng ${formatVnd(total)}${
                    dueDate ? ` (Hạn đóng: ${dueDate})` : ""
                  }.`,
                  timestamp: resolveRealtimeTimestamp(notifId, inv.updatedAt || inv.createdAt),
                  read: readSet.has(notifId),
                  targetTab: "tuition",
                  childId: child.id,
                  childName: child.hoTen,
                  badgeText: isOverdue ? "Quá hạn học phí" : "Nợ học phí",
                });
              }
            });
          }

          // 1D. CẢNH BÁO TRẺ KHÔNG ĐẠT TRONG HOẠT ĐỘNG NGÀY HÔM NAY DO GIÁO VIÊN ĐÁNH GIÁ
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

          // 1E. THÔNG BÁO SỔ BÉ NGOAN MỚI (Khi giáo viên cập nhật nhận xét hoặc tặng hoa bé ngoan thực tế)
          if (goodChildRes.status === "fulfilled" && goodChildRes.value) {
            const gcRecords = Array.isArray(goodChildRes.value)
              ? goodChildRes.value
              : Array.isArray(goodChildRes.value?.items)
              ? goodChildRes.value.items
              : [];
            const latestGc = gcRecords[0];
            if (latestGc && latestGc.teacherComment && String(latestGc.teacherComment).trim()) {
              const gcComment = String(latestGc.teacherComment).trim();
              const gcId = `parent-goodchild-${child.id}-${latestGc.id}-${gcComment.slice(0, 24)}`;
              items.push({
                id: gcId,
                category: "assessment",
                severity: "success",
                isUrgent: false,
                title: `Sổ bé ngoan Tháng ${latestGc.month}/${latestGc.year}: ${child.hoTen}`,
                message: gcComment,
                timestamp: resolveRealtimeTimestamp(gcId, latestGc.updatedAt || latestGc.createdAt),
                read: readSet.has(gcId),
                targetTab: "good-child",
                childId: child.id,
                childName: child.hoTen,
                badgeText: `Sổ bé ngoan T${latestGc.month}`,
              });
            }
          }
        })
      );

      // 2. Tin nhắn mới từ Giáo viên (chỉ khi tin nhắn cuối cùng trong cuộc hội thoại là của giáo viên gửi)
      if (convsRes.status === "fulfilled" && Array.isArray(convsRes.value)) {
        const convs = convsRes.value.slice(0, 10);
        const msgResults = await Promise.allSettled(
          convs.map((c: any) => {
            const cid = c.messageConversationId || c.MessageConversationId || c.id || c.Id;
            return api.get<any[]>("communication", `/api/Messages/conversation/${cid}`);
          })
        );

        msgResults.forEach((res, idx) => {
          if (res.status !== "fulfilled" || !Array.isArray(res.value) || res.value.length === 0) {
            return;
          }
          const conv = convs[idx];
          const cid = conv.messageConversationId || conv.MessageConversationId || conv.id || conv.Id;
          const lastMessage = res.value[res.value.length - 1];
          const senderId = String(
            lastMessage?.senderUserId ??
              lastMessage?.SenderUserId ??
              lastMessage?.senderId ??
              lastMessage?.SenderId ??
              ""
          )
            .toLowerCase()
            .trim();
          const currentUserId = String(user.id || "").toLowerCase().trim();

          if (lastMessage && senderId && senderId !== currentUserId) {
            const teacherName = children[0]?.giaoVienChuNhiem || "";
            const sentAt =
              lastMessage.messageSentAt ||
              lastMessage.MessageSentAt ||
              lastMessage.sentAt ||
              lastMessage.createdAt ||
              conv.lastMessageSentAt ||
              conv.conversationCreatedAt ||
              "";
            const content = String(
              lastMessage.messageContent ??
                lastMessage.MessageContent ??
                lastMessage.content ??
                lastMessage.Content ??
                ""
            ).trim();
            if (!content) return;

            const msgId =
              lastMessage.messageId ||
              lastMessage.MessageId ||
              lastMessage.id ||
              lastMessage.Id ||
              cid;
            const notifId = `parent-msg-${msgId}-${sentAt}`;
            items.push({
              id: notifId,
              category: "message",
              severity: "info",
              isUrgent: true,
              title: teacherName
                ? `Tin nhắn mới từ GV ${teacherName}`
                : "Tin nhắn mới từ giáo viên",
              message: content,
              timestamp: resolveRealtimeTimestamp(notifId, sentAt),
              read: readSet.has(notifId),
              targetTab: "messages",
              badgeText: "Tin nhắn GV",
            });
          }
        });
      }

      // 3. Kết quả duyệt Đơn xin nghỉ học (/api/leaves)
      if (leavesRes.status === "fulfilled" && Array.isArray(leavesRes.value)) {
        const childMap = new Map<string, string>();
        children.forEach((c) => childMap.set(String(c.id), c.hoTen));

        leavesRes.value.forEach((lv: any) => {
          const cid = String(lv.childId || "");
          if (!childMap.has(cid)) return;
          const childName = childMap.get(cid)!;
          const statusStr = String(lv.status).toLowerCase();
          const isApproved = statusStr === "1" || statusStr === "approved";
          const isRejected = statusStr === "2" || statusStr === "rejected";
          if (!isApproved && !isRejected) return;

          const fromDate = toIsoDateOnly(lv.fromDate);
          const toDate = toIsoDateOnly(lv.toDate);
          const notifId = `parent-leave-${lv.id}-${lv.status}`;

          items.push({
            id: notifId,
            category: "leave",
            severity: isApproved ? "success" : "warning",
            isUrgent: true,
            title: `Đơn xin nghỉ của ${childName}: ${isApproved ? "Đã duyệt" : "Từ chối"}`,
            message: `Từ ngày ${fromDate} đến ${toDate}${
              lv.reason ? ` (${lv.reason})` : ""
            }.${lv.reviewNote ? ` Phản hồi: ${lv.reviewNote}` : ""}`,
            timestamp: resolveRealtimeTimestamp(notifId, lv.reviewedAtUtc || lv.createdAtUtc),
            read: readSet.has(notifId),
            targetTab: "absence",
            childId: cid,
            childName,
            badgeText: isApproved ? "Đã duyệt đơn" : "Từ chối đơn",
          });
        });
      }

      // 4. Tin tức mới từ nhà trường (/api/news dành cho Phụ huynh hoặc Toàn trường)
      if (newsRes.status === "fulfilled" && newsRes.value) {
        const rawNews = Array.isArray(newsRes.value)
          ? newsRes.value
          : Array.isArray(newsRes.value.items)
          ? newsRes.value.items
          : [];

        rawNews
          .filter((n: any) => {
            const scope = Number(n.phamVi ?? n.PhamVi ?? 0);
            return scope === 0 || scope === 2;
          })
          .slice(0, 5)
          .forEach((n: any) => {
            const nid = n.id || n.Id;
            const title = String(n.tieuDe || n.TieuDe || "").trim();
            const summary = stripEmbeddedImageTags(n.tomTat || n.TomTat || "");
            const pubDate = n.ngayXuatBan || n.NgayXuatBan || n.ngayTao || n.NgayTao || "";
            if (!nid || !title) return;

            const notifId = `parent-news-${nid}-${pubDate}`;
            items.push({
              id: notifId,
              category: "news",
              severity: "info",
              isUrgent: false,
              title: `Bản tin trường: ${title}`,
              message: summary,
              timestamp: resolveRealtimeTimestamp(notifId, pubDate),
              read: readSet.has(notifId),
              targetTab: "news",
              badgeText: "Tin nhà trường",
            });
          });
      }
    } catch (err) {
      console.error("Lỗi tải thông báo phụ huynh:", err);
    }

    return items.sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  })().finally(() => {
    parentNotifInFlight = null;
  });

  return parentNotifInFlight;
}
