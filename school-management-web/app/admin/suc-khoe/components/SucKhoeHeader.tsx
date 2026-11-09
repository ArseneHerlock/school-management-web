"use client";

import React from "react";
import { RefreshCw, X } from "lucide-react";

interface SucKhoeHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  notificationMessage: string;
  onClearNotification: () => void;
  errorMessage: string;
}

export default function SucKhoeHeader({
  isLoading,
  onRefresh,
  notificationMessage,
  onClearNotification,
  errorMessage,
}: SucKhoeHeaderProps) {
  return (
    <>
      <header className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="admin-title">Sức khỏe & Thể trạng</h1>
        </div>
        <button
          onClick={onRefresh}
          className="admin-btn admin-btn-secondary cursor-pointer"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Đang tải" : "Làm mới"}
        </button>
      </header>

      {notificationMessage && (
        <div className="admin-alert">
          {notificationMessage}
          <button onClick={onClearNotification} className="cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {errorMessage}
        </div>
      )}
    </>
  );
}
