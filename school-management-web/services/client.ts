"use client";

import {
  getAccessToken,
  getPasswordChangeToken,
  logout,
} from "./authStorage";

export * from "./authStorage";

/**
 * Xác định Base URL của API khi chạy trên ứng dụng Mobile (Capacitor) hoặc Web
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("custom_api_url");
    } catch {}

    // Khi truy cập qua cáp USB (adb reverse localhost:3000) hoặc IP nội bộ,
    // giữ nguyên origin để dữ liệu truyền trực tiếp qua cổng USB với tốc độ cao nhất (0ms)
    const hostname = window.location.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.0.")
    ) {
      return "";
    }

    const isCapacitor =
      (window as any).Capacitor !== undefined ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:";

    if (isCapacitor) {
      return "https://app.kindergarteny26.online";
    }
  }
  return "";
}

export function getFullApiUrl(path?: string | null): string {
  if (!path) return "";
  const trimmed = String(path).trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }
  const base = getApiBaseUrl();
  if (!base) return trimmed;
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

/**
 * Tạo đường dẫn gọi API trung gian qua Next.js Backend Proxy
 */
function buildProxyUrl(serviceName: string, endpointPath: string): string {
  let cleanEndpoint = endpointPath;
  if (!cleanEndpoint.startsWith("/")) {
    cleanEndpoint = "/" + cleanEndpoint;
  }
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/api/backend/${serviceName}${cleanEndpoint}`;
}

/**
 * Hàm gọi HTTP chung tới các dịch vụ Backend
 */
export async function request<T>(
  serviceName: string,
  endpointPath: string,
  requestOptions: RequestInit = {}
): Promise<T> {
  const fullUrl = buildProxyUrl(serviceName, endpointPath);

  const executeRequest = (async (): Promise<T> => {
    const headers = new Headers(requestOptions.headers);

    const activeToken = getAccessToken() || getPasswordChangeToken();
    if (activeToken) {
      headers.set("Authorization", `Bearer ${activeToken}`);
    }

    if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const method = (requestOptions.method || "GET").toUpperCase();
    const defaultCache = method === "GET" ? "default" : "no-store";
    const cacheMode = requestOptions.cache || defaultCache;

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        cache: cacheMode,
        ...requestOptions,
        headers: headers,
      });
    } catch (netErr) {
      throw netErr;
    }

    const responseText = await response.text();
    let responseBody: any = null;

    try {
      if (responseText && responseText.trim().length > 0) {
        responseBody = JSON.parse(responseText);
      }
    } catch (error) {
      responseBody = responseText;
    }

    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        const isPasswordChangePage =
          window.location.pathname.includes("doi-mat-khau");
        if (!isPasswordChangePage) {
          logout();
        }
      }

      let errorMessage = `Lỗi máy chủ HTTP ${response.status}`;
      if (responseBody && typeof responseBody === "object") {
        errorMessage =
          responseBody.message || responseBody.title || errorMessage;
      } else if (
        typeof responseBody === "string" &&
        responseBody.trim().length > 0
      ) {
        errorMessage = responseBody;
      }

      throw new Error(errorMessage);
    }

    return responseBody as T;
  })();

  return executeRequest;
}

/**
 * Bộ công cụ gọi API với các phương thức HTTP rõ ràng
 */
export const api = {
  get: function <T = any>(
    serviceName: string,
    endpointPath: string
  ): Promise<T> {
    return request<T>(serviceName, endpointPath, {
      method: "GET",
    });
  },

  post: function <T = any>(
    serviceName: string,
    endpointPath: string,
    requestBody?: unknown
  ): Promise<T> {
    const options: RequestInit = {
      method: "POST",
    };
    if (requestBody !== undefined) {
      options.body = JSON.stringify(requestBody);
    }
    return request<T>(serviceName, endpointPath, options);
  },

  put: function <T = any>(
    serviceName: string,
    endpointPath: string,
    requestBody?: unknown
  ): Promise<T> {
    const options: RequestInit = {
      method: "PUT",
    };
    if (requestBody !== undefined) {
      options.body = JSON.stringify(requestBody);
    }
    return request<T>(serviceName, endpointPath, options);
  },

  patch: function <T = any>(
    serviceName: string,
    endpointPath: string,
    requestBody?: unknown
  ): Promise<T> {
    const options: RequestInit = {
      method: "PATCH",
    };
    if (requestBody !== undefined) {
      options.body = JSON.stringify(requestBody);
    }
    return request<T>(serviceName, endpointPath, options);
  },

  delete: function <T = any>(
    serviceName: string,
    endpointPath: string
  ): Promise<T> {
    return request<T>(serviceName, endpointPath, {
      method: "DELETE",
    });
  },
};

/**
 * Chuẩn hóa dữ liệu trả về từ API về dạng danh sách mảng thuần túy
 */
export function normalizeList<T>(responseValue: unknown): T[] {
  if (Array.isArray(responseValue)) {
    return responseValue;
  }

  if (responseValue && typeof responseValue === "object") {
    const objectMap = responseValue as Record<string, unknown>;
    if (Array.isArray(objectMap.items)) {
      return objectMap.items as T[];
    }
    if (Array.isArray(objectMap.Items)) {
      return objectMap.Items as T[];
    }
    if (Array.isArray(objectMap.data)) {
      return objectMap.data as T[];
    }
    if (Array.isArray(objectMap.Data)) {
      return objectMap.Data as T[];
    }
    if (Array.isArray(objectMap.results)) {
      return objectMap.results as T[];
    }
    if (Array.isArray(objectMap.Results)) {
      return objectMap.Results as T[];
    }
  }

  return [];
}
