"use client";

import { CurrentUser } from "./types";

// Các khóa lưu trữ token trong localStorage trình duyệt
export const TOKEN_KEY = "school_access_token";
export const PWD_KEY = "school_password_change_token";

/**
 * Lấy Access Token đang lưu trong trình duyệt
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Lưu hoặc xóa Access Token trong trình duyệt
 */
export function setAccessToken(tokenValue: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (tokenValue) {
    localStorage.setItem(TOKEN_KEY, tokenValue);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Lấy Token đổi mật khẩu lần đầu (nếu có)
 */
export function getPasswordChangeToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(PWD_KEY);
}

/**
 * Lưu hoặc xóa Token đổi mật khẩu lần đầu
 */
export function setPasswordChangeToken(tokenValue: string | null): void {
  if (typeof window === "undefined") {
    return;
  }
  if (tokenValue) {
    localStorage.setItem(PWD_KEY, tokenValue);
  } else {
    localStorage.removeItem(PWD_KEY);
  }
}

/**
 * Đăng xuất: Xóa sạch toàn bộ token phiên làm việc và chuyển về trang đăng nhập
 */
export function logout(): void {
  setAccessToken(null);
  setPasswordChangeToken(null);
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("school_user");
      localStorage.removeItem("school_current_user");
      localStorage.removeItem("school_access_token");
      localStorage.removeItem("school_password_change_token");
      sessionStorage.clear();
    } catch {}
    window.location.href = "/login";
  }
}

/**
 * Giải mã phần thông tin (payload) của chuỗi JWT token
 */
function decodeJwtPayload(jwtToken: string): Record<string, any> | null {
  try {
    const tokenParts = jwtToken.split(".");
    if (tokenParts.length < 2) {
      return null;
    }

    const payloadBase64Url = tokenParts[1];
    // Chuyển ký tự Base64Url (- và _) thành ký tự Base64 chuẩn (+ và /)
    const normalizedBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Giải mã chuỗi base64 có hỗ trợ ký tự Unicode tiếng Việt
    const decodedString = decodeURIComponent(
      atob(normalizedBase64)
        .split("")
        .map(function (character) {
          const hexCode = ("00" + character.charCodeAt(0).toString(16)).slice(-2);
          return "%" + hexCode;
        })
        .join("")
    );

    return JSON.parse(decodedString);
  } catch (error) {
    console.error("Không thể giải mã dữ liệu token:", error);
    return null;
  }
}

/**
 * Lấy thông tin tài khoản đang đăng nhập từ token hiện tại
 */
export function currentUser(): CurrentUser | null {
  const activeToken = getAccessToken() || getPasswordChangeToken();
  if (!activeToken) {
    return null;
  }

  const payload = decodeJwtPayload(activeToken);
  if (!payload) {
    return null;
  }

  // Trích xuất danh sách vai trò (roles)
  let rolesList: string[] = [];
  const rawRole =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload.role ||
    payload.roles;

  if (Array.isArray(rawRole)) {
    rolesList = rawRole;
  } else if (rawRole) {
    rolesList = [rawRole];
  }

  // Trích xuất mã định danh tài khoản (User ID)
  const rawUserId =
    payload.sub ||
    payload.nameid ||
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    payload.id ||
    payload.userId ||
    payload.UserId ||
    "";

  const fullName = payload.name || payload.unique_name || "";
  const username = payload.name || payload.unique_name || "";

  return {
    id: String(rawUserId).toLowerCase().trim(),
    name: fullName,
    username: username,
    roles: rolesList,
  };
}

/**
 * Xác định Base URL của API khi chạy trên ứng dụng Mobile (Capacitor) hoặc Web
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("custom_api_url");
    } catch {}

    // Kiểm tra nếu đang chạy bên trong ứng dụng Capacitor Native
    const isCapacitor =
      (window as any).Capacitor !== undefined ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:" ||
      (window.location.hostname === "localhost" && window.location.port === "");

    if (isCapacitor) {
      // Kết nối tới Next.js dev server trên máy tính qua localhost (dùng `adb reverse tcp:3000 tcp:3000`)
      return "http://localhost:3000";
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
  const method = (requestOptions.method || "GET").toUpperCase();
  const fullUrl = buildProxyUrl(serviceName, endpointPath);

  const executeRequest = (async (): Promise<T> => {
    const headers = new Headers(requestOptions.headers);

    // Tự động gắn token xác thực vào Header Authorization nếu người dùng đã đăng nhập
    const activeToken = getAccessToken() || getPasswordChangeToken();
    if (activeToken) {
      headers.set("Authorization", `Bearer ${activeToken}`);
    }

    // Chỉ thiết lập Content-Type là JSON khi có request body (tránh preflight không cần thiết cho GET)
    if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        ...requestOptions,
        headers: headers,
        cache: "no-store",
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
      // Nếu kết quả không phải định dạng JSON thì giữ nguyên dạng text
      responseBody = responseText;
    }

    // Xử lý khi HTTP Status không thành công (Status code != 2xx)
    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        // Khi hết hạn phiên làm việc và không ở trang đổi mật khẩu thì tự động đăng xuất
        const isPasswordChangePage = window.location.pathname.includes("doi-mat-khau");
        if (!isPasswordChangePage) {
          logout();
        }
      }

      let errorMessage = `Lỗi máy chủ HTTP ${response.status}`;
      if (responseBody && typeof responseBody === "object") {
        errorMessage = responseBody.message || responseBody.title || errorMessage;
      } else if (typeof responseBody === "string" && responseBody.trim().length > 0) {
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
  get: function <T = any>(serviceName: string, endpointPath: string): Promise<T> {
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

  delete: function <T = any>(serviceName: string, endpointPath: string): Promise<T> {
    return request<T>(serviceName, endpointPath, {
      method: "DELETE",
    });
  },
};

/**
 * Chuẩn hóa dữ liệu trả về từ API về dạng danh sách mảng thuần túy
 * Tránh lỗi khi backend trả về mảng trực tiếp hoặc gói trong { items: [...] } / { data: [...] }
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
    if (Array.isArray(objectMap.data)) {
      return objectMap.data as T[];
    }
    if (Array.isArray(objectMap.results)) {
      return objectMap.results as T[];
    }
  }

  return [];
}
