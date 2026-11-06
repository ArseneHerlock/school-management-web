"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  api,
  currentUser,
  getPasswordChangeToken,
  setPasswordChangeToken,
} from "@/services";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password.length < 6) {
      return setError("Mật khẩu mới yêu cầu tối thiểu 6 ký tự.");
    }
    if (password !== confirm) {
      return setError("Mật khẩu xác nhận không trùng khớp.");
    }
    const token = getPasswordChangeToken();
    const user = currentUser();
    if (!token || !user?.id) {
      return setError(
        "Phiên đổi mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
      );
    }

    try {
      setSaving(true);
      await api.post("auth", "/change-initial-password", {
        newPassword: password,
        confirmPassword: confirm,
      });
      setPasswordChangeToken(null);
      setSuccess(
        "Đổi mật khẩu thành công! Hệ thống đang chuyển hướng về trang đăng nhập...",
      );
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-orange-50 px-4 font-sans text-slate-800">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-rose-100 bg-white/95 p-8 shadow-xl backdrop-blur-md"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/25">
            <KeyRound size={26} />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Đổi mật khẩu lần đầu
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Tài khoản của bạn đăng nhập lần đầu. Vui lòng thiết lập mật khẩu mới để bảo mật thông tin.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 font-semibold">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">
              Mật khẩu mới (tối thiểu 6 ký tự)
            </span>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-3 pr-10 text-xs outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 font-sans"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-700">
              Xác nhận mật khẩu mới
            </span>
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              className="h-11 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 font-sans"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 text-xs font-bold text-white shadow-md shadow-rose-500/20 transition hover:from-rose-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer font-sans"
          >
            {saving ? "Đang cập nhật mật khẩu..." : "Cập nhật mật khẩu & Tiếp tục"}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </main>
  );
}
