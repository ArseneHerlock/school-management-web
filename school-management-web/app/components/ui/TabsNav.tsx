import React, { ElementType } from 'react';

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: ElementType;
  badge?: number | string;
}

interface TabsNavProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  className?: string;
}

export default function TabsNav<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: TabsNavProps<T>) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-2xl border border-rose-100 bg-white/90 p-1.5 shadow-xs backdrop-blur-xs overflow-x-auto max-w-full min-w-0 no-scrollbar ${className}`}
    >
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 sm:flex-initial justify-center inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/20'
                : 'text-slate-600 hover:bg-rose-50/60 hover:text-rose-700'
            }`}
          >
            {Icon && <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />}
            <span>{t.label}</span>
            {t.badge !== undefined && (
              <span
                className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
                }`}
              >
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
