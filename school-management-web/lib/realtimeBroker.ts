// Bộ phát sự kiện thông báo thời gian thực (Real-time In-Memory Pub/Sub Broker)
// Giữ singleton trên globalThis để hoạt động xuyên suốt các Route Handler trong Next.js

export interface RealtimeMutationEvent {
  type: "MUTATION";
  service: string;
  method: string;
  endpoint: string;
  timestamp: string;
  payload?: unknown;
}

type RealtimeListener = (event: RealtimeMutationEvent) => void;

const globalForRealtime = globalThis as unknown as {
  __mamnonRealtimeListeners?: Set<RealtimeListener>;
};

function getListeners(): Set<RealtimeListener> {
  if (!globalForRealtime.__mamnonRealtimeListeners) {
    globalForRealtime.__mamnonRealtimeListeners = new Set<RealtimeListener>();
  }
  return globalForRealtime.__mamnonRealtimeListeners;
}

export function subscribeRealtimeEvents(listener: RealtimeListener): () => void {
  const listeners = getListeners();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function publishRealtimeMutation(event: RealtimeMutationEvent): void {
  const listeners = getListeners();
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch {}
  });
}
