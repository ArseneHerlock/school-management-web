import { api, currentUser } from "../client";
import { getClasses } from "../classes";
import { getStaffByUserId } from "../staff";
import { getStudents } from "../students";
import { isEvaluableActivity } from "@/app/components/schedule/WeeklyTimetable";
import {
  AppNotification,
  getReadSet,
  getLocalTodayIso,
  toIsoDateOnly,
  resolveRealtimeTimestamp,
  stripEmbeddedImageTags,
} from "./types";

let teacherContextCache: {
  userId: string;
  expiresAt: number;
  matchedClass: any;
  studentMap: Map<string, string>;
  parentNameByUserId: Map<string, string>;
} | null = null;

const conversationMessagesCache = new Map<
  string,
  { marker: string; messages: any[]; fetchedAt: number }
>();

let teacherNotifInFlight: Promise<AppNotification[]> | null = null;

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
      const nowMs = Date.now();
      let matchedClass: any = null;
      let studentMap = new Map<string, string>();
      let parentNameByUserId = new Map<string, string>();

      if (
        teacherContextCache &&
        teacherContextCache.userId === user.id &&
        teacherContextCache.expiresAt > nowMs
      ) {
        matchedClass = teacherContextCache.matchedClass;
        studentMap = teacherContextCache.studentMap;
        parentNameByUserId = teacherContextCache.parentNameByUserId;
      } else {
        const [staffMember, allClasses, allParents] = await Promise.all([
          getStaffByUserId(user.id).catch(() => null),
          getClasses().catch(() => []),
          api.get<any[]>("parents", "/api/parents").catch(() => []),
        ]);

        matchedClass = allClasses.find(
          (c) => staffMember?.staffId && c.giaoVienChuNhiemId === staffMember.staffId
        );

        const classStudents = matchedClass
          ? await getStudents({ lopId: matchedClass.id }).catch(() => [])
          : [];

        classStudents.forEach((s) => {
          studentMap.set(String(s.id), s.tenHocSinh);
        });

        if (Array.isArray(allParents)) {
          allParents.forEach((p: any) => {
            const uid = String(p.taiKhoanId || p.TaiKhoanId || p.id || p.Id || "")
              .toLowerCase()
              .trim();
            const name = String(p.hoTen || p.HoTen || "");
            if (uid && name) parentNameByUserId.set(uid, name);
          });
        }

        teacherContextCache = {
          userId: user.id,
          expiresAt: nowMs + 5 * 60 * 1000,
          matchedClass,
          studentMap,
          parentNameByUserId,
        };
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

      if (convsRes.status === "fulfilled" && Array.isArray(convsRes.value)) {
        const convs = convsRes.value.slice(0, 10);
        const msgResults = await Promise.allSettled(
          convs.map(async (c: any) => {
            const cid = String(c.messageConversationId || c.MessageConversationId || c.id || c.Id || "");
            const marker = String(
              c.lastMessageSentAt || c.LastMessageSentAt || c.updatedAt || c.UpdatedAt || ""
            );
            const cached = conversationMessagesCache.get(cid);
            if (
              cached &&
              ((marker && cached.marker === marker) || (!marker && nowMs - cached.fetchedAt < 180000))
            ) {
              return cached.messages;
            }
            const msgs = await api.get<any[]>("communication", `/api/Messages/conversation/${cid}`);
            conversationMessagesCache.set(cid, {
              marker,
              messages: Array.isArray(msgs) ? msgs : [],
              fetchedAt: Date.now(),
            });
            return msgs;
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
            const senderName =
              parentNameByUserId.get(senderId) ||
              parentNameByUserId.get(
                String(lastMessage?.senderUserId || lastMessage?.senderId || "")
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
