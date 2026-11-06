'use client';

import React from 'react';
import { BellRing, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { AppNotification } from '@/services/notifications';

interface ChildAlertsBannerProps {
  childAlerts: AppNotification[];
  childName?: string;
  onNavigateTab: (tab: string) => void;
}

export function ChildAlertsBanner({
  childAlerts,
  childName,
  onNavigateTab,
}: ChildAlertsBannerProps) {
  if (childAlerts.length === 0) return null;

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-4 sm:p-5 shadow-xs">
      <div className="mb-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <BellRing size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800">
              Lời nhắc & Thông báo dành cho bé {childName}
            </h3>
            <p className="text-[11px] text-slate-500">
              Thông tin cập nhật từ giáo viên và nhà trường về sinh hoạt, sức khỏe và học phí của bé
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700 shrink-0 whitespace-nowrap">
          {childAlerts.length} thông báo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {childAlerts.slice(0, 6).map((alertItem) => {
          const isDanger = alertItem.severity === 'danger';
          const isWarning = alertItem.severity === 'warning';
          const isSuccess = alertItem.severity === 'success';

          const boxClass = isDanger
            ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-50'
            : isWarning
            ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-50'
            : isSuccess
            ? 'border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50'
            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70';

          const badgeClass = isDanger
            ? 'bg-rose-600 text-white'
            : isWarning
            ? 'bg-amber-500 text-white'
            : isSuccess
            ? 'bg-emerald-600 text-white'
            : 'bg-blue-600 text-white';

          return (
            <div
              key={alertItem.id}
              onClick={() => {
                if (alertItem.targetTab) onNavigateTab(alertItem.targetTab);
              }}
              className={`group flex items-start justify-between gap-3 rounded-2xl border p-3.5 transition cursor-pointer ${boxClass}`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  {alertItem.badgeText && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${badgeClass}`}
                    >
                      {(isDanger || isWarning) && <AlertTriangle size={10} />}
                      {isSuccess && <CheckCircle2 size={10} />}
                      <span>{alertItem.badgeText}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                  {alertItem.title}
                </p>
                <p className="mt-1 text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {alertItem.message}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="mt-1 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-700 transition"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
