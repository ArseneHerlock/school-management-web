"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Newspaper,
  HeartPulse,
  CreditCard,
  Sparkles,
  ClipboardCheck,
  FileCheck2,
  X,
  ChevronRight,
} from "lucide-react";
import { currentUser } from "@/services/client";
import {
  AppNotification,
  fetchTeacherNotifications,
  fetchParentNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnseenToastNotifications,
  ParentChildSummary,
  REALTIME_NOTIFICATION_EVENT,
  dispatchRealtimeNotificationSync,
  playNotificationChime,
} from "@/services/notifications";

interface NotificationCenterProps {
  role: "teacher" | "parent";
  childrenList?: ParentChildSummary[];
  onNavigateParentTab?: (tab: string, childId?: string) => void;
  onCountsChange?: (counts: {
    unreadTotal: number;
    urgentUnread: number;
    unreadMessages: number;
    pendingLeaves: number;
  }) => void;
}

function formatRelativeTime(timestamp: string): string {
  if (!timestamp) return "Vừa xong";
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return String(timestamp).slice(0, 10);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getCategoryIcon(category: AppNotification["category"], severity: AppNotification["severity"]) {
  switch (category) {
    case "attendance":
      return <ClipboardCheck size={16} />;
    case "assessment":
      return severity === "danger" ? <AlertTriangle size={16} /> : <Sparkles size={16} />;
    case "health":
      return <HeartPulse size={16} />;
    case "tuition":
      return <CreditCard size={16} />;
    case "message":
      return <MessageSquare size={16} />;
    case "schedule":
      return <Calendar size={16} />;
    case "leave":
      return <FileCheck2 size={16} />;
    case "news":
    default:
      return <Newspaper size={16} />;
  }
}

function getSeverityStyles(severity: AppNotification["severity"]) {
  switch (severity) {
    case "danger":
      return {
        iconBg: "bg-rose-100 text-rose-600 border-rose-200",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        cardUnread: "bg-rose-50/60 border-rose-200/80 hover:bg-rose-50",
        dot: "bg-rose-500",
      };
    case "warning":
      return {
        iconBg: "bg-amber-100 text-amber-700 border-amber-200",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        cardUnread: "bg-amber-50/50 border-amber-200/80 hover:bg-amber-50",
        dot: "bg-amber-500",
      };
    case "success":
      return {
        iconBg: "bg-emerald-100 text-emerald-600 border-emerald-200",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cardUnread: "bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50/70",
        dot: "bg-emerald-500",
      };
    case "info":
    default:
      return {
        iconBg: "bg-blue-100 text-blue-600 border-blue-200",
        badge: "bg-blue-100 text-blue-700 border-blue-200",
        cardUnread: "bg-blue-50/40 border-blue-200/70 hover:bg-blue-50/70",
        dot: "bg-blue-500",
      };
  }
}

const EMPTY_CHILDREN: ParentChildSummary[] = [];

export default function NotificationCenter({
  role,
  childrenList = EMPTY_CHILDREN,
  onNavigateParentTab,
  onCountsChange,
}: NotificationCenterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "activity" | "contact">("all");
  const [toastAlerts, setToastAlerts] = useState<AppNotification[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadedRef = useRef(false);

  const childrenListRef = useRef<ParentChildSummary[]>(childrenList);
  childrenListRef.current = childrenList;

  const onCountsChangeRef = useRef(onCountsChange);
  onCountsChangeRef.current = onCountsChange;

  const inFlightRef = useRef(false);
  const pendingReloadRef = useRef(false);
  const childrenKey = childrenList.map((c) => c.id).join(",");

  const loadNotifications = useCallback(
    async (silent = false) => {
      if (inFlightRef.current) {
        pendingReloadRef.current = true;
        return;
      }
      const user = currentUser();
      if (!user?.id) return;
      inFlightRef.current = true;
      if (!silent) setLoading(true);
      try {
        const list =
          role === "teacher"
            ? await fetchTeacherNotifications()
            : await fetchParentNotifications(childrenListRef.current);

        setNotifications(list);

        const unreadTotal = list.filter((n) => !n.read).length;
        const urgentUnread = list.filter((n) => !n.read && n.isUrgent).length;
        const unreadMessages = list.filter((n) => !n.read && n.category === "message").length;
        const pendingLeaves = list.filter((n) => !n.read && n.category === "leave").length;

        onCountsChangeRef.current?.({
          unreadTotal,
          urgentUnread,
          unreadMessages,
          pendingLeaves,
        });

        const freshToasts = getUnseenToastNotifications(user.id, list, true);
        if (freshToasts.length > 0) {
          if (initialLoadedRef.current) {
            playNotificationChime(freshToasts.some((t) => t.isUrgent));
          }
          setToastAlerts((prev) => {
            const existingIds = new Set(prev.map((x) => x.id));
            const merged = [...freshToasts.filter((x) => !existingIds.has(x.id)), ...prev];
            return merged.slice(0, 3);
          });
        }
        initialLoadedRef.current = true;
      } finally {
        inFlightRef.current = false;
        if (!silent) setLoading(false);
        if (pendingReloadRef.current) {
          pendingReloadRef.current = false;
          setTimeout(() => void loadNotifications(true), 250);
        }
      }
    },
    [role, childrenKey]
  );

  const loadNotificationsRef = useRef(loadNotifications);
  loadNotificationsRef.current = loadNotifications;

  useEffect(() => {
    void loadNotifications(false);
  }, [loadNotifications]);

  useEffect(() => {
    // 1. Kết nối Server-Sent Events (SSE) qua cổng 3000 đẩy thông báo tức thì ngay khi có thay đổi trên hệ thống
    let eventSource: EventSource | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerInstantSync = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        void loadNotificationsRef.current(true);
      }, 180);
    };

    try {
      eventSource = new EventSource("/api/notifications/stream");
      eventSource.onopen = () => {
        setLiveConnected(true);
      };
      eventSource.onmessage = (ev) => {
        try {
          const parsed = JSON.parse(ev.data);
          if (parsed?.type === "CONNECTED") {
            setLiveConnected(true);
            return;
          }
          if (parsed?.type === "MUTATION") {
            triggerInstantSync();
          }
        } catch {}
      };
      eventSource.onerror = () => {
        setLiveConnected(false);
      };
    } catch {}

    // 2. Đồng bộ tức thì giữa các tab trình duyệt bằng BroadcastChannel & Window Focus
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("mamnon_notifications_channel");
      bc.onmessage = () => {
        void loadNotificationsRef.current(true);
      };
    } catch {}

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void loadNotificationsRef.current(true);
      }
    };
    const handleCustomRealtimeEvent = () => {
      void loadNotificationsRef.current(true);
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleCustomRealtimeEvent);

    // 3. Chu kỳ đối soát nền (Fallback Reconciliation) mỗi 15 giây để đảm bảo không sót sự kiện
    const interval = setInterval(() => {
      void loadNotificationsRef.current(true);
    }, 15000);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      clearInterval(interval);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener(REALTIME_NOTIFICATION_EVENT, handleCustomRealtimeEvent);
      try {
        eventSource?.close();
      } catch {}
      try {
        bc?.close();
      } catch {}
    };
  }, [role]);

  // Tự động ẩn Toast sau 9 giây
  useEffect(() => {
    if (toastAlerts.length === 0) return;
    const timer = setTimeout(() => {
      setToastAlerts((prev) => prev.slice(0, -1));
    }, 9000);
    return () => clearTimeout(timer);
  }, [toastAlerts]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleSelectNotification = (item: AppNotification) => {
    const user = currentUser();
    if (user?.id) {
      markNotificationRead(user.id, item.id);
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setToastAlerts((prev) => prev.filter((t) => t.id !== item.id));
    setOpen(false);
    dispatchRealtimeNotificationSync({ action: "read", id: item.id });

    if (role === "teacher" && item.targetRoute) {
      router.push(item.targetRoute);
    } else if (role === "parent" && item.targetTab && onNavigateParentTab) {
      onNavigateParentTab(item.targetTab, item.childId);
    }
  };

  const handleMarkAllRead = () => {
    const user = currentUser();
    if (!user?.id) return;
    markAllNotificationsRead(
      user.id,
      notifications.map((n) => n.id)
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setToastAlerts([]);
    onCountsChange?.({
      unreadTotal: 0,
      urgentUnread: 0,
      unreadMessages: 0,
      pendingLeaves: 0,
    });
    dispatchRealtimeNotificationSync({ action: "read_all" });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const urgentCount = notifications.filter((n) => !n.read && n.isUrgent).length;

  const filteredList = notifications.filter((n) => {
    if (activeFilter === "urgent") return n.isUrgent || n.severity === "danger" || n.severity === "warning";
    if (activeFilter === "activity")
      return ["attendance", "assessment", "health", "tuition"].includes(n.category);
    if (activeFilter === "contact")
      return ["message", "leave", "schedule", "news"].includes(n.category);
    return true;
  });

  const themeAccent =
    role === "teacher"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <div ref={containerRef} className="relative">
      {/* Nút chuông thông báo */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) void loadNotifications(true);
        }}
        className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
          urgentCount > 0
            ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : open
            ? role === "teacher"
              ? "border-orange-300 bg-orange-50 text-orange-600"
              : "border-indigo-300 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        }`}
        title="Trung tâm thông báo & Cảnh báo"
      >
        <Bell size={17} className={urgentCount > 0 ? "animate-bounce" : ""} />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-1.5 -right-1.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[10px] font-black text-white shadow-xs ${
              urgentCount > 0 ? "bg-rose-600 animate-pulse" : "bg-orange-500"
            }`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Toast thông báo nổi thời gian thực khi có cảnh báo mới */}
      {toastAlerts.length > 0 && !open && (
        <div className="fixed top-18 right-3 sm:right-6 z-50 flex flex-col gap-2 w-[calc(100vw-24px)] max-w-sm pointer-events-none">
          {toastAlerts.map((toast) => {
            const styles = getSeverityStyles(toast.severity);
            return (
              <div
                key={toast.id}
                className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/98 p-3.5 shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${styles.iconBg}`}
                >
                  {getCategoryIcon(toast.category, toast.severity)}
                </div>
                <div
                  onClick={() => handleSelectNotification(toast)}
                  className="min-w-0 flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {toast.badgeText && (
                      <span
                        className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${styles.badge}`}
                      >
                        {toast.badgeText}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatRelativeTime(toast.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                    {toast.title}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setToastAlerts((prev) => prev.filter((x) => x.id !== toast.id))
                  }
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Bảng danh sách thông báo Dropdown / Drawer */}
      {open && (
        <div className="fixed inset-x-2 top-16 sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 z-50 w-auto sm:w-[420px] max-h-[82vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800">
                  Thông báo & Cảnh báo
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                    liveConnected
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                  title={
                    liveConnected
                      ? "Đang kết nối trực tuyến thời gian thực (SSE + SignalR)"
                      : "Đang đồng bộ định kỳ"
                  }
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      liveConnected ? "bg-emerald-500 animate-ping" : "bg-slate-400"
                    }`}
                  />
                  <span>{liveConnected ? "Trực tuyến" : "Đồng bộ"}</span>
                </span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                    {unreadCount} mới
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {role === "teacher"
                  ? "Tin nhắn PH, đơn xin nghỉ, lịch dạy & thông báo trường"
                  : "Điểm danh, sức khỏe, đánh giá hoạt động, học phí & tin tức"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => void loadNotifications(false)}
                className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 transition cursor-pointer"
                title="Làm mới dữ liệu"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  title="Đánh dấu tất cả đã đọc"
                >
                  <CheckCheck size={13} />
                  <span>Đã đọc hết</span>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 sm:hidden cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Bộ lọc phân loại */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 overflow-x-auto no-scrollbar bg-white">
            <button
              onClick={() => setActiveFilter("all")}
              className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === "all"
                  ? themeAccent
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter("urgent")}
              className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === "urgent"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <AlertTriangle size={12} />
              <span>
                Cần chú ý (
                {
                  notifications.filter(
                    (n) => n.isUrgent || n.severity === "danger" || n.severity === "warning"
                  ).length
                }
                )
              </span>
            </button>
            {role === "parent" && (
              <button
                onClick={() => setActiveFilter("activity")}
                className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                  activeFilter === "activity"
                    ? themeAccent
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Điểm danh • Đánh giá • Sức khỏe
              </button>
            )}
            <button
              onClick={() => setActiveFilter("contact")}
              className={`rounded-xl px-2.5 py-1 text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
                activeFilter === "contact"
                  ? themeAccent
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tin nhắn • Lịch • Trường
            </button>
          </div>

          {/* Danh sách thông báo */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[60vh]">
            {loading && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <RefreshCw size={24} className="animate-spin mb-2 text-slate-400" />
                <p className="text-xs font-bold">Đang đồng bộ thông báo từ hệ thống...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-2.5">
                  <Bell size={22} />
                </div>
                <p className="text-xs font-bold text-slate-600">
                  Không có thông báo nào trong mục này
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Khi có thay đổi về điểm danh, tin nhắn, lịch học hoặc đánh giá, hệ thống sẽ hiển thị ngay tại đây.
                </p>
              </div>
            ) : (
              filteredList.map((item) => {
                const styles = getSeverityStyles(item.severity);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectNotification(item)}
                    className={`group flex items-start gap-3 p-3.5 transition cursor-pointer ${
                      item.read ? "bg-white hover:bg-slate-50" : styles.cardUnread
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${styles.iconBg}`}
                    >
                      {getCategoryIcon(item.category, item.severity)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.badgeText && (
                            <span
                              className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-tight ${styles.badge}`}
                            >
                              {item.badgeText}
                            </span>
                          )}
                          {item.childName && (
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                              {item.childName}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>

                      <p
                        className={`text-xs leading-snug ${
                          item.read
                            ? "font-bold text-slate-700"
                            : "font-extrabold text-slate-900"
                        }`}
                      >
                        {item.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-3">
                        {item.message}
                      </p>

                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition">
                          <span>Xem chi tiết</span>
                          <ChevronRight size={12} />
                        </span>
                        {!item.read && (
                          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
