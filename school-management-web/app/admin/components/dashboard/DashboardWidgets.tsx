'use client';

import React from 'react';

export function DashboardKpi({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: any;
  label: string;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="admin-card p-4 text-left transition hover:-translate-y-0.5 hover:border-rose-300"
    >
      <div className="admin-icon">
        <Icon size={18} />
      </div>
      <p className="mt-4 text-2xl font-black text-slate-800">{value}</p>
      <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
    </button>
  );
}

export function DashboardMetric({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-800">{value}</p>
      <div className="mt-3 h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-rose-600"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-slate-400">{pct}%</p>
    </div>
  );
}

export function DashboardQuick({
  label,
  text,
  onClick,
}: {
  label: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="admin-card p-4 text-left hover:border-rose-300 transition"
    >
      <p className="font-bold text-slate-800">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </button>
  );
}
