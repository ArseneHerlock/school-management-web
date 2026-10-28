'use client';

import React from 'react';
import NewsListView from '@/app/components/news/NewsListView';

export default function TeacherNews() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-3xl border border-blue-200 bg-white p-6 shadow-xs">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
          BẢN TIN NỘI BỘ & TOÀN TRƯỜNG
        </span>
        <h1 className="text-2xl font-black text-slate-800">Tin Tức & Sự Kiện Trường</h1>
        <p className="mt-1 text-xs text-slate-500">
          Đăng tải thông báo, bản tin mầm non kèm hình ảnh minh họa và theo dõi sự kiện sắp tới.
        </p>
      </header>

      <NewsListView
        role="teacher"
        pageTitle="Tin Tức & Sự Kiện Trường"
        pageSubtitle="Đăng tải thông báo, bản tin mầm non kèm hình ảnh minh họa và theo dõi sự kiện sắp tới."
      />
    </div>
  );
}
