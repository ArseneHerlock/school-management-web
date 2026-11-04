"use client";

export interface RealtimeHubConnection {
  state: "Connected" | "Disconnected";
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  off: (eventName: string, callback?: (...args: any[]) => void) => void;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  invoke: (methodName: string, ...args: any[]) => Promise<void>;
}

export function createHubConnection(
  kind: "chat" | "news" | "attendance" = "chat",
): RealtimeHubConnection {
  const listeners = new Map<string, Set<(...args: any[]) => void>>();
  let eventSource: EventSource | null = null;
  let state: "Connected" | "Disconnected" = "Disconnected";

  const emit = (eventName: string, ...args: any[]) => {
    const set = listeners.get(eventName);
    if (!set) return;
    set.forEach((cb) => {
      try {
        cb(...args);
      } catch {}
    });
  };

  const conn: RealtimeHubConnection = {
    get state() {
      return state;
    },
    on(eventName: string, callback: (...args: any[]) => void) {
      if (!listeners.has(eventName)) {
        listeners.set(eventName, new Set());
      }
      listeners.get(eventName)!.add(callback);
    },
    off(eventName: string, callback?: (...args: any[]) => void) {
      if (!callback) {
        listeners.delete(eventName);
        return;
      }
      listeners.get(eventName)?.delete(callback);
    },
    async start() {
      if (typeof window === "undefined") return;
      try {
        if (eventSource) {
          eventSource.close();
        }
        eventSource = new EventSource("/api/notifications/stream");
        state = "Connected";

        eventSource.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data);
            if (data?.type !== "MUTATION") return;

            if (kind === "attendance" && data.service === "attendance") {
              emit("DiemDanhCapNhat", data);
            } else if (kind === "chat" && data.service === "communication") {
              emit("ReceiveMessage", data);
              emit("MessageReceived", data);
            } else if (kind === "news" && data.service === "news") {
              emit("ReceiveNews", data);
            }
          } catch {}
        };

        eventSource.onerror = () => {
          // Tự động kết nối lại ngầm của trình duyệt, không văng lỗi 1006
        };
      } catch {
        state = "Disconnected";
      }
    },
    async stop() {
      state = "Disconnected";
      try {
        eventSource?.close();
        eventSource = null;
      } catch {}
    },
    async invoke() {},
  };

  return conn;
}
