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
export function decodeJwtPayload(jwtToken: string): Record<string, any> | null {
  try {
    const tokenParts = jwtToken.split(".");
    if (tokenParts.length < 2) {
      return null;
    }

    const payloadBase64Url = tokenParts[1];
    const normalizedBase64 = payloadBase64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedString = decodeURIComponent(
      atob(normalizedBase64)
        .split("")
        .map(function (character) {
          const hexCode = (
            "00" + character.charCodeAt(0).toString(16)
          ).slice(-2);
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

  const rawUserId =
    payload.sub ||
    payload.nameid ||
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ] ||
    payload.id ||
    payload.userId ||
    payload.UserId ||
    "";

  const fullName =
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    payload.name ||
    payload.unique_name ||
    payload.fullName ||
    payload.FullName ||
    "";

  const username = payload.name || payload.unique_name || "";

  return {
    id: String(rawUserId).toLowerCase().trim(),
    name: fullName,
    username: username,
    roles: rolesList,
  };
}
