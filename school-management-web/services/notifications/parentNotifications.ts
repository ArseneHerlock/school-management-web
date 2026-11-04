import { api, currentUser } from "../client";
import { getCriteria, getActivities } from "../development";
import {
  AppNotification,
  ParentChildSummary,
  getReadSet,
  getLocalTodayIso,
  toIsoDateOnly,
  resolveRealtimeTimestamp,
  stripEmbeddedImageTags,
} from "./types";
import { processChildNotifications } from "./parentChildNotifs";

let parentNotifInFlight: Promise<AppNotification[]> | null = null;
const conversationMessagesCache = new Map<
  string,
  { marker: string; messages: any[]; fetchedAt: number }
>();

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
      const [criteriaRes, activitiesRes, newsRes, convsRes, leavesRes] =
        await Promise.allSettled([
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

      // Process children specific notifications
      const childNotifResults = await Promise.all(
        children.map((child) =>
          processChildNotifications({
            child,
            todayIso,
            readSet,
            criteriaMap,
            activityMap,
          })
        )
      );
      childNotifResults.forEach((cItems) => items.push(...cItems));

      // Process messages from teachers
      if (convsRes.status === "fulfilled" && Array.isArray(convsRes.value)) {
        const nowMs = Date.now();
        const convs = convsRes.value.slice(0, 10);
        const msgResults = await Promise.allSettled(
          convs.map(async (c: any) => {
            const cid = String(
              c.messageConversationId ||
                c.MessageConversationId ||
                c.id ||
                c.Id ||
                ""
            );
            const marker = String(
              c.lastMessageSentAt ||
                c.LastMessageSentAt ||
                c.updatedAt ||
                c.UpdatedAt ||
                ""
            );
            const cached = conversationMessagesCache.get(cid);
            if (
              cached &&
              ((marker && cached.marker === marker) ||
                (!marker && nowMs - cached.fetchedAt < 180000))
            ) {
              return cached.messages;
            }
            const msgs = await api.get<any[]>(
              "communication",
              `/api/Messages/conversation/${cid}`
            );
            conversationMessagesCache.set(cid, {
              marker,
              messages: Array.isArray(msgs) ? msgs : [],
              fetchedAt: Date.now(),
            });
            return msgs;
          })
        );

        msgResults.forEach((res, idx) => {
          if (
            res.status !== "fulfilled" ||
            !Array.isArray(res.value) ||
            res.value.length === 0
          ) {
            return;
          }
          const conv = convs[idx];
          const cid =
            conv.messageConversationId ||
            conv.MessageConversationId ||
            conv.id ||
            conv.Id;
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

      // Process leave application responses
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
            title: `Đơn xin nghỉ của ${childName}: ${
              isApproved ? "Đã duyệt" : "Từ chối"
            }`,
            message: `Từ ngày ${fromDate} đến ${toDate}${
              lv.reason ? ` (${lv.reason})` : ""
            }.${lv.reviewNote ? ` Phản hồi: ${lv.reviewNote}` : ""}`,
            timestamp: resolveRealtimeTimestamp(
              notifId,
              lv.reviewedAtUtc || lv.createdAtUtc
            ),
            read: readSet.has(notifId),
            targetTab: "absence",
            childId: cid,
            childName,
            badgeText: isApproved ? "Đã duyệt đơn" : "Từ chối đơn",
          });
        });
      }

      // Process news
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
            const pubDate =
              n.ngayXuatBan || n.NgayXuatBan || n.ngayTao || n.NgayTao || "";
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
