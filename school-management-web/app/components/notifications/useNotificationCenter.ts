"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { NotificationCenterProps } from "./notificationTypes";

const EMPTY_CHILDREN: ParentChildSummary[] = [];

export function useNotificationCenter({
  role,
  childrenList = EMPTY_CHILDREN,
  onNavigateParentTab,
  onCountsChange,
}: NotificationCenterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "urgent" | "activity" | "contact"
  >("all");
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
        const unreadMessages = list.filter(
          (n) => !n.read && n.category === "message"
        ).length;
        const pendingLeaves = list.filter(
          (n) => !n.read && n.category === "leave"
        ).length;

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
            const merged = [
              ...freshToasts.filter((x) => !existingIds.has(x.id)),
              ...prev,
            ];
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

    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener(REALTIME_NOTIFICATION_EVENT, handleCustomRealtimeEvent);

    const interval = setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        (!eventSource || eventSource.readyState !== EventSource.OPEN)
      ) {
        void loadNotificationsRef.current(true);
      }
    }, 180000);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener(
        REALTIME_NOTIFICATION_EVENT,
        handleCustomRealtimeEvent
      );
      try {
        eventSource?.close();
      } catch {}
      try {
        bc?.close();
      } catch {}
    };
  }, [role]);

  useEffect(() => {
    if (toastAlerts.length === 0) return;
    const timer = setTimeout(() => {
      setToastAlerts((prev) => prev.slice(0, -1));
    }, 9000);
    return () => clearTimeout(timer);
  }, [toastAlerts]);

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
    if (activeFilter === "urgent")
      return n.isUrgent || n.severity === "danger" || n.severity === "warning";
    if (activeFilter === "activity")
      return ["attendance", "assessment", "health", "tuition"].includes(
        n.category
      );
    if (activeFilter === "contact")
      return ["message", "leave", "schedule", "news"].includes(n.category);
    return true;
  });

  return {
    open,
    setOpen,
    loading,
    notifications,
    activeFilter,
    setActiveFilter,
    toastAlerts,
    setToastAlerts,
    liveConnected,
    containerRef,
    unreadCount,
    urgentCount,
    filteredList,
    loadNotifications,
    handleSelectNotification,
    handleMarkAllRead,
  };
}
