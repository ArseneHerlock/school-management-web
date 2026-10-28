"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseAsyncResourceResult<T> {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  isLoading: boolean;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  reload: () => Promise<void>;
}

/**
 * Custom Hook chuẩn doanh nghiệp quản lý vòng đời tải dữ liệu bất đồng bộ (Loading / Error / Data / Reload)
 * Giúp tái sử dụng logic gọi API và tránh rò rỉ bộ nhớ khi component unmount.
 */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  initialData: T,
  deps: React.DependencyList = [],
  options: { enabled?: boolean; defaultErrorMessage?: string } = {}
): UseAsyncResourceResult<T> {
  const { enabled = true, defaultErrorMessage = "Không thể tải dữ liệu từ hệ thống." } = options;

  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string>("");
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : defaultErrorMessage;
        setError(message);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (enabled) {
      void reload();
    }
  }, [enabled, reload]);

  return {
    data,
    setData,
    isLoading,
    error,
    setError,
    reload,
  };
}
