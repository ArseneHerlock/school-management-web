"use client";

import React, { useState } from "react";
import { Link as LinkIcon, Copy, Check, RefreshCw } from "lucide-react";

interface TuyenSinhHeaderProps {
  onRefresh: () => void;
  notice?: string;
  onClearNotice?: () => void;
}

export function TuyenSinhHeader({
  onRefresh,
  notice,
  onClearNotice,
}: TuyenSinhHeaderProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const publicLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/dang-ky-nhap-hoc`
      : "/dang-ky-nhap-hoc";

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="admin-title">Quản lý tuyển sinh</h1>
        </div>
        <button
          onClick={onRefresh}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RefreshCw size={16} /> Làm mới
        </button>
      </header>

      {/* Shareable Online Registration Link Banner */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full max-w-full overflow-hidden">
        <div className="flex items-start sm:items-center gap-3 min-w-0 w-full flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-xs">
            <LinkIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
              Cổng đăng ký tuyển sinh trực tuyến
            </h3>
            <div className="mt-1 flex items-center bg-white px-2.5 py-1.5 rounded-lg border border-sky-200 w-full min-w-0 overflow-hidden">
              <span className="font-mono text-[11px] sm:text-xs font-medium text-sky-800 truncate select-all block w-full">
                {publicLink}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={copyPublicLink}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-sky-600/20 transition cursor-pointer"
        >
          {copiedLink ? <Check size={16} /> : <Copy size={16} />}
          <span>{copiedLink ? "Đã sao chép link!" : "Sao chép link gửi PH"}</span>
        </button>
      </div>

      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 flex justify-between items-center shadow-xs">
          <span>{notice}</span>
          {onClearNotice && (
            <button onClick={onClearNotice} className="cursor-pointer">
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}
