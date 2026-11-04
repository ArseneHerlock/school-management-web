import React from 'react';
import GoodChildDetailClient from './GoodChildDetailClient';

export function generateStaticParams() {
  return [{ childId: 'overview' }];
}

export default function GoodChildDetailPage() {
  return <GoodChildDetailClient />;
}
