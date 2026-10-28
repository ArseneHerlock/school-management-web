"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export function useApiQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error, T, readonly unknown[]>, "queryKey" | "queryFn">
) {
  return useQuery({ queryKey, queryFn, ...options });
}
