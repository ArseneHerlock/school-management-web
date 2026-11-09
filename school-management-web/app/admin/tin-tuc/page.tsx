"use client";

import React from "react";
import NewsListView from "@/app/components/news/NewsListView";

export default function TinTucPage() {
  return (
    <div className="space-y-4">
      <h1 className="admin-title">Bản tin & Thông báo</h1>
      <NewsListView role="admin" />
    </div>
  );
}
