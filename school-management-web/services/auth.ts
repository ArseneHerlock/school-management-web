import {
  api,
  normalizeList,
  setAccessToken,
  setPasswordChangeToken,
  logout,
  currentUser,
} from "./client";
import { CurrentUser } from "./types";

export interface LoginResult {
  accessToken?: string;
  passwordChangeToken?: string;
  requiresPasswordChange?: boolean;
  user?: CurrentUser;
}

export interface CreateUserInput {
  username?: string;
  password?: string;
  role: string;
  [key: string]: any;
}

export async function login(
  userName: string,
  password: string,
): Promise<LoginResult> {
  const result = await api.post<LoginResult>("auth", "/api/Auth/login", {
    UserName: userName,
    Password: password,
  });

  if (result.accessToken) {
    setAccessToken(result.accessToken);
  }
  if (result.passwordChangeToken) {
    setPasswordChangeToken(result.passwordChangeToken);
  }

  return result;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<any> {
  return await api.post("auth", "/api/Auth/change-password", {
    CurrentPassword: oldPassword,
    NewPassword: newPassword,
  });
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<any> {
  return await api.put(
    "auth",
    `/api/Auth/users/${encodeURIComponent(userId)}/password`,
    {
      currentPassword,
      newPassword,
    },
  );
}

export async function getUsers(): Promise<any[]> {
  const res = await api.get<any>("auth", "/users").catch(() => []);
  return normalizeList<any>(res);
}

export async function createUser(data: CreateUserInput): Promise<any> {
  return await api.post<any>("auth", "/users", data);
}

export async function updateUserStatus(
  userId: string,
  status: number,
): Promise<any> {
  return await api.put(
    "auth",
    `/users/${encodeURIComponent(userId)}/status`,
    status,
  );
}

export async function updateUserRole(
  userId: string,
  role: string,
): Promise<any> {
  return await api.put(
    "auth",
    `/users/${encodeURIComponent(userId)}/role`,
    role,
  );
}

export async function resetUserPassword(
  userId: string,
  newPassword: string,
): Promise<any> {
  return await api.put(
    "auth",
    `/users/${encodeURIComponent(userId)}/reset-password`,
    { newPassword },
  );
}

export { logout, currentUser };
