'use client';

import React from 'react';
import NewsListView from '@/app/components/news/NewsListView';

interface NewsTabProps {
  newsList?: any[];
}

export default function NewsTab({ newsList }: NewsTabProps) {
  return (
    <section className="space-y-4">
      <NewsListView
        role="parent"
        pageTitle="Tin tức & Sự kiện Nhà trường"
        pageSubtitle="Cập nhật tin tức, sự kiện và thông báo chính thức từ Trường Mầm non Bé Ngoan."
      />
    </section>
  );
}
