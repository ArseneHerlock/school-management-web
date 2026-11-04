'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BellRing, ChevronRight, AlertTriangle } from 'lucide-react';
import { AppNotification } from '@/services/notifications';

interface TeacherAlertsWidgetProps {
  alerts: AppNotification[];
}

export function TeacherAlertsWidget({ alerts }: TeacherAlertsWidgetProps) {
  const router = useRouter();

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-xs">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <BellRing size={16} />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">
              Thông báo & Cảnh báo mới ({alerts.length})
            </h4>
            <p className="text-[11px] text-slate-400">
              Tin nhắn phụ huynh, đơn nghỉ, lịch mới & thông báo trường
            </p>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
          Hiện chưa có thông báo hoặc cảnh báo mới.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          {alerts.slice(0, 6).map((alertItem) => {
            const isDanger = alertItem.severity === 'danger';
            const isWarning = alertItem.severity === 'warning';
            return (
              <div
                key={alertItem.id}
                onClick={() => {
                  if (alertItem.targetRoute) router.push(alertItem.targetRoute);
                }}
                className={`group flex items-start justify-between gap-2.5 rounded-2xl border p-3 transition cursor-pointer ${
                  isDanger
                    ? 'border-rose-200 bg-rose-50/70 hover:bg-rose-50'
                    : isWarning
                    ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-50'
                    : 'border-slate-100 bg-slate-50/80 hover:bg-orange-50/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {alertItem.badgeText && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase ${
                          isDanger
                            ? 'bg-rose-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-white'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {(isDanger || isWarning) && <AlertTriangle size={9} />}
                        <span>{alertItem.badgeText}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-extrabold text-slate-800 line-clamp-1">
                    {alertItem.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-600 line-clamp-2">
                    {alertItem.message}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="mt-1 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:text-orange-600 transition"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
