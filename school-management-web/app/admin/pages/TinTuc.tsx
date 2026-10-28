"use client";

import React from "react";
import NewsListView from "@/app/components/news/NewsListView";

export default function TinTuc() {
  return (
    <div className="space-y-6">
      <header>
        <p className="admin-eyebrow">TRUYỀN THÔNG & TIN TỨC</p>
        <h1 className="admin-title">Bản tin & Sự kiện Nhà trường</h1>
        <p className="admin-subtitle">
          Quản lý tin tức, hoạt động và các sự kiện sắp tới toàn trường chuẩn
          trực quan.
        </p>
      </header>

      <NewsListView
        role="admin"
        pageTitle="Tin tức & Sự kiện Nhà trường"
        pageSubtitle="Cập nhật tin tức, sự kiện và thông báo chính thức từ Trường Mầm non Bé Ngoan."
      />
    </div>
  );
}
