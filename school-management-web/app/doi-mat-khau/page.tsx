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
    if (password.length < 6)
      return setError("Mật khẩu mới cần ít nhất 6 ký tự.");
    if (password !== confirm) return setError("Mật khẩu xác nhận không khớp.");
    const token = getPasswordChangeToken();
    const user = currentUser();
    if (!token || !user?.id)
      return setError(
        "Phiên đổi mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
      );

    try {
      setSaving(true);
      await api.post("auth", "/change-initial-password", {
        newPassword: password,
        confirmPassword: confirm,
      });
      setPasswordChangeToken(null);
      setSuccess(
        "Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...",
      );
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi mật khẩu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white">
          <KeyRound size={22} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Đổi mật khẩu lần đầu
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Tài khoản của bạn cần tạo mật khẩu mới trước khi truy cập hệ thống.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Mật khẩu mới
            <span className="relative mt-1.5 block">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 pr-10 outline-none focus:border-rose-400"
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          <label className="block text-sm font-semibold text-slate-700">
            Xác nhận mật khẩu mới
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-rose-400"
              placeholder="Nhập lại mật khẩu mới"
            />
          </label>

          {error && (
            <div className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-emerald-50 px-3.5 py-3 text-sm font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <button
            disabled={saving || Boolean(success)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-rose-500 font-semibold text-white hover:bg-rose-600 transition disabled:opacity-60"
          >
            {saving ? (
              "Đang lưu..."
            ) : success ? (
              "Thành công!"
            ) : (
              <>
                <CheckCircle2 size={17} />
                <span>Xác nhận đổi mật khẩu</span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
