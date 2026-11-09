"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  login,
  currentUser,
  setAccessToken,
  setPasswordChangeToken,
} from "@/services";

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = currentUser();
    if (user && user.roles && user.roles.length > 0) {
      if (user.roles.includes("ADMIN")) {
        window.location.href = "/admin";
      } else if (user.roles.includes("GIAO_VIEN")) {
        window.location.href = "/teacher";
      } else if (user.roles.includes("PHU_HUYNH")) {
        window.location.href = "/parent";
      }
    }
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const userInput = form.elements.namedItem("userName") as HTMLInputElement | null;
    const pwdInput = form.elements.namedItem("password") as HTMLInputElement | null;
    const targetUser = (userInput?.value ?? userName).trim();
    const targetPwd = pwdInput?.value ?? password;

    if (!targetUser || !targetPwd) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(targetUser, targetPwd);
      if (result.requiresPasswordChange) {
        window.location.href = "/doi-mat-khau";
        return;
      }

      const user = currentUser();
      if (user?.roles?.includes("ADMIN")) {
        window.location.href = "/admin";
      } else if (user?.roles?.includes("GIAO_VIEN")) {
        window.location.href = "/teacher";
      } else if (user?.roles?.includes("PHU_HUYNH")) {
        window.location.href = "/parent";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setAccessToken(null);
      setPasswordChangeToken(null);
      setError(
        err instanceof Error ? err.message : "Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-orange-50 p-4 font-sans text-slate-800">
      <div className="w-full max-w-md">
        <section className="rounded-3xl border border-rose-100 bg-white/90 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/25">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Hệ thống Quản lý Trường Mầm non
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Đăng nhập cổng thông tin Cán bộ, Giáo viên & Phụ huynh
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(e);
            }}
            className="space-y-4"
          >
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">
                Tài khoản đăng nhập
              </span>
              <span className="relative block">
                <UserRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  name="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const form = e.currentTarget.closest("form");
                      if (form) submit({ preventDefault: () => {}, currentTarget: form } as any);
                    }
                  }}
                  placeholder="Nhập tên đăng nhập hoặc số điện thoại..."
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-xs outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 font-sans"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-700">
                Mật khẩu
              </span>
              <span className="relative block">
                <LockKeyhole
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const form = e.currentTarget.closest("form");
                      if (form) submit({ preventDefault: () => {}, currentTarget: form } as any);
                    }
                  }}
                  placeholder="Nhập mật khẩu..."
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-11 text-xs outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 font-sans"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                const form = e.currentTarget.closest("form");
                if (form) submit({ preventDefault: () => {}, currentTarget: form } as any);
              }}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-xs font-bold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer font-sans"
            >
              <LogIn size={17} /> {loading ? "Đang xác thực thông tin..." : "Đăng nhập hệ thống"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
