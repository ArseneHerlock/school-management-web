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
          <p className="admin-eyebrow">
            QUẢN TRỊ Y TẾ & THỂ TRẠNG HỌC SINH (CHUẨN WHO 0 - 5 TUỔI)
          </p>
          <h1 className="admin-title">
            Giám Sát Thể Trạng & Khám Sức Khỏe Toàn Trường
          </h1>
          <p className="admin-subtitle">
            Đánh giá toàn diện theo 3 chỉ số WHO: HAZ (Thấp còi), WAZ (Nhẹ cân), WHZ (Thể trạng). Xem báo cáo tổng quan toàn trường và chi tiết biểu đồ đường cong tăng trưởng.
          </p>
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
