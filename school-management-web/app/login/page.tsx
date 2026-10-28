"use client";

import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  login,
  currentUser,
  setAccessToken,
  setPasswordChangeToken,
} from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!userName.trim() || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(userName.trim(), password);
      if (result.requiresPasswordChange) {
        router.push("/doi-mat-khau");
        return;
      }

      const user = currentUser();
      const role = user?.roles?.[0];
      if (role === "ADMIN") router.push("/admin");
      else if (role === "GIAO_VIEN") router.push("/teacher");
      else if (role === "PHU_HUYNH") router.push("/parent");
      else router.push("/");
    } catch (err) {
      setAccessToken(null);
      setPasswordChangeToken(null);
      setError(
        err instanceof Error ? err.message : "Đăng nhập không thành công.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-rose-50 via-white to-slate-50 px-3 sm:px-4 py-6 sm:py-10 flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-6 lg:gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600">
              <ShieldCheck size={15} /> Hệ thống quản lý trường học
            </div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Một không gian quản lý rõ ràng cho nhà trường, giáo viên và phụ
              huynh.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-500">
              Đăng nhập để tiếp tục quản lý học sinh, lớp học, lịch hoạt động,
              trao đổi và các nghiệp vụ của nhà trường.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/40">
          <div className="mb-5 sm:mb-7">
            <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-rose-500 text-white">
              <ShieldCheck size={22} className="sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Đăng nhập</h2>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-500">
              Sử dụng tài khoản được nhà trường cấp.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Tên đăng nhập
              </span>
              <span className="relative block">
                <UserRound
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                  autoComplete="username"
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Mật khẩu
              </span>
              <span className="relative block">
                <LockKeyhole
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-11 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
            </label>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-500 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={17} /> {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
