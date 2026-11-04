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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="admin-eyebrow">TUYỂN SINH MẦM NON</p>
          <h1 className="admin-title">Tuyển sinh</h1>
          <p className="admin-subtitle">
            Tiếp nhận hồ sơ xin nhập học trực tuyến từ phụ huynh và xét tuyển
            vào các lớp
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RefreshCw size={16} /> Làm mới danh sách
        </button>
      </header>

      {/* Shareable Online Registration Link Banner */}
      <div className="rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/60 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/20">
            <LinkIcon size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">
              Link gửi cho Phụ huynh điền phiếu Đơn xin nhập học:
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">
              Phụ huynh điền link này sẽ tự động cập nhật đầy đủ thông tin trẻ
              và bố mẹ vào danh sách bên dưới
            </p>
            <div className="mt-1.5 font-mono text-xs font-bold text-sky-800 bg-white px-3 py-1.5 rounded-xl border border-sky-200 inline-block">
              {publicLink}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={copyPublicLink}
          className="shrink-0 flex items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 text-xs font-bold shadow-md shadow-sky-600/20 transition cursor-pointer"
        >
          {copiedLink ? <Check size={16} /> : <Copy size={16} />}
          {copiedLink ? "Đã sao chép link!" : "Sao chép link gửi PH"}
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
