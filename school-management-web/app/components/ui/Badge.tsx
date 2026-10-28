import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'rose' | 'amber';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantStyles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
  danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
  info: 'bg-sky-50 text-sky-700 border-sky-200/80',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200/80',
  rose: 'bg-pink-50 text-pink-700 border-pink-200/80',
  amber: 'bg-orange-50 text-orange-700 border-orange-200/80',
};

const dotColors = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  info: 'bg-sky-500',
  neutral: 'bg-slate-500',
  rose: 'bg-pink-500',
  amber: 'bg-orange-500',
};

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
}: BadgeProps) {
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${variantStyles[variant]} ${sizeStyle}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
