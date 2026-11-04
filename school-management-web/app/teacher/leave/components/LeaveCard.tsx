import React from 'react';
import { CalendarDays, CheckCircle2, X, Check, Loader2 } from 'lucide-react';
import { LeaveApplication, resolveLeaveStatus } from '../types';

interface LeaveCardProps {
  application: LeaveApplication;
  isProcessing: boolean;
  onReviewApplication: (app: LeaveApplication, approve: boolean) => void;
}

export function LeaveCard({
  application,
  isProcessing,
  onReviewApplication,
}: LeaveCardProps) {
  const statusInfo = resolveLeaveStatus(application.status);
  const StatusIcon = statusInfo.icon;
  const isPending = statusInfo.key === 'pending';

  return (
    <article className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Thông tin học sinh và thời gian */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 font-black">
            <CalendarDays size={22} />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-sm font-black text-slate-900">
                {application.childName}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusInfo.badgeClass}`}
              >
                <StatusIcon size={12} />
                {statusInfo.label}
              </span>
            </div>

            <p className="text-xs font-bold text-orange-700">
              Lý do:{' '}
              <span className="font-normal text-slate-700">
                {application.reason}
              </span>
            </p>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>Thời gian nghỉ:</span>
              <strong className="text-slate-800 font-mono">
                {String(application.fromDate).slice(0, 10)}
              </strong>
              <span>đến</span>
              <strong className="text-slate-800 font-mono">
                {String(application.toDate).slice(0, 10)}
              </strong>
            </p>

            {application.note && (
              <p className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-[11px] text-slate-600 mt-2">
                Ghi chú phụ huynh: {application.note}
              </p>
            )}
          </div>
        </div>

        {/* Nút hành động Duyệt / Từ chối */}
        {isPending && (
          <div className="flex shrink-0 items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
            <button
              disabled={isProcessing}
              onClick={() => onReviewApplication(application, false)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 cursor-pointer"
            >
              <X size={15} />
              <span>Từ chối</span>
            </button>

            <button
              disabled={isProcessing}
              onClick={() => onReviewApplication(application, true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Check size={15} />
              )}
              <span>Duyệt đơn nghỉ</span>
            </button>
          </div>
        )}
      </div>

      {/* Ghi chú đồng bộ */}
      {statusInfo.key === 'approved' && (
        <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 px-3.5 py-2 text-[11px] font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
          <span>
            Đã xác nhận nghỉ học. Sổ điểm danh tự động ghi nhận vắng có phép cho trẻ.
          </span>
        </div>
      )}
    </article>
  );
}
