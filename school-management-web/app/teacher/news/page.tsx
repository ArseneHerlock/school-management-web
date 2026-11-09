'use client';

import React from 'react';
import NewsListView from '@/app/components/news/NewsListView';

export default function TeacherNews() {
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <NewsListView role="teacher" />
    </div>
  );
}
