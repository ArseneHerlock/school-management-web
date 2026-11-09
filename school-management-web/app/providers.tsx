"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: 0 },
        },
      })
  );

  useEffect(() => {
    // Kích hoạt hỗ trợ trạng thái cảm ứng :active trên thiết bị di động (Android / iOS)
    const handleTouchStart = () => {};
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    // Ẩn triệt để Next.js dev indicators / floating toasts trên thiết bị di động
    const cleanDevIndicators = () => {
      const selectors = [
        "nextjs-portal",
        "[data-nextjs-dev-indicator]",
        "[data-nextjs-toast]",
        "#nextjs-dev-indicator",
        "[data-nextjs-indicator]",
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
          (el as HTMLElement).style.setProperty("display", "none", "important");
          (el as HTMLElement).style.setProperty("pointer-events", "none", "important");
          (el as HTMLElement).style.setProperty("visibility", "hidden", "important");
          (el as HTMLElement).style.setProperty("opacity", "0", "important");
        });
      });
    };
    cleanDevIndicators();
    const interval = setInterval(cleanDevIndicators, 1500);
    return () => clearInterval(interval);
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
