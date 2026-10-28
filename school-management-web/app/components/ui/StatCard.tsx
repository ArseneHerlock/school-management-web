import React, { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ElementType;
  color?: 'rose' | 'amber' | 'emerald' | 'sky' | 'violet' | 'indigo';
  trend?: {
    value: string;
    isUp?: boolean;
  };
  onClick?: () => void;
}

const colorMap = {
  rose: {
    bg: 'from-rose-50 to-pink-50/50 border-rose-100',
    iconBg: 'bg-rose-500/10 text-rose-600',
    text: 'text-rose-600',
  },
  amber: {
    bg: 'from-amber-50 to-orange-50/50 border-amber-100',
    iconBg: 'bg-amber-500/10 text-amber-600',
    text: 'text-amber-600',
  },
  emerald: {
    bg: 'from-emerald-50 to-teal-50/50 border-emerald-100',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
    text: 'text-emerald-600',
  },
  sky: {
    bg: 'from-sky-50 to-blue-50/50 border-sky-100',
    iconBg: 'bg-sky-500/10 text-sky-600',
    text: 'text-sky-600',
  },
  violet: {
    bg: 'from-violet-50 to-purple-50/50 border-violet-100',
    iconBg: 'bg-violet-500/10 text-violet-600',
    text: 'text-violet-600',
  },
  indigo: {
    bg: 'from-indigo-50 to-blue-50/50 border-indigo-100',
    iconBg: 'bg-indigo-500/10 text-indigo-600',
    text: 'text-indigo-600',
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'rose',
  trend,
  onClick,
}: StatCardProps) {
  const styles = colorMap[color] || colorMap.rose;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${styles.bg} p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </span>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-black tracking-tight text-slate-800">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-bold ${
              trend.isUp ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trend.isUp ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
