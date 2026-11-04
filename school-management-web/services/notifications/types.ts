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

export interface ParentChildSummary {
  id: string;
  hoTen: string;
  gioiTinh?: string;
  ngaySinh?: string;
  lop?: string;
  classId?: string;
  giaoVienChuNhiem?: string;
}

const READ_STORAGE_PREFIX = "mamnon_read_notifications_";
const SEEN_TOAST_PREFIX = "mamnon_seen_toast_notifications_";
const EVENT_TS_STORAGE_KEY = "mamnon_event_timestamps_v2";

export function getReadSet(userId: string): Set<string> {
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

export function stripEmbeddedImageTags(text: string): string {
  if (!text) return "";
  return text.replace(/<!--IMG:[\s\S]*?-->/g, "").trim();
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + " đ";
}

export function toIsoDateOnly(val: unknown): string {
  if (!val) return "";
  const str = String(val);
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function getLocalTodayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
}

export function getOrRecordEventTimestamp(notifId: string): string {
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

export function resolveRealtimeTimestamp(notifId: string, primaryIso?: unknown): string {
  if (primaryIso) {
    const d = new Date(String(primaryIso));
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString();
    }
  }
  return getOrRecordEventTimestamp(notifId);
}

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
