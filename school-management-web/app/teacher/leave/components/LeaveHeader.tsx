import React from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, X, Clock3, Check, FileText } from 'lucide-react';

interface LeaveHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  feedbackMessage: string;
  setFeedbackMessage: (msg: string) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  statusFilter: 'ALL' | 'pending' | 'approved' | 'rejected';
  setStatusFilter: (f: 'ALL' | 'pending' | 'approved' | 'rejected') => void;
  pendingCount: number;
  approvedCount: number;
  totalCount: number;
}

export function LeaveHeader({
  isLoading,
  onRefresh,
  feedbackMessage,
  setFeedbackMessage,
  errorMessage,
  setErrorMessage,
  statusFilter,
  setStatusFilter,
  pendingCount,
  approvedCount,
  totalCount,
}: LeaveHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Tiêu đề & Làm mới */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Đơn xin nghỉ học
          </h1>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-orange-300 transition cursor-pointer"
        >
          <RefreshCw
            size={15}
            className={isLoading ? 'animate-spin text-orange-500' : ''}
          />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* 3 Thẻ thống kê */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3">
        <button
          onClick={() => setStatusFilter('pending')}
          className={`rounded-3xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'pending'
              ? 'border-amber-400 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/20'
              : 'border-amber-100 bg-white hover:border-amber-200'
          }`}
        >
          <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <Clock3 size={15} />
            <span>Chờ giáo viên duyệt</span>
          </p>
          <p className="mt-2 text-3xl font-black text-amber-900">
            {pendingCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter('approved')}
          className={`rounded-3xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'approved'
              ? 'border-emerald-400 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-400/20'
              : 'border-emerald-100 bg-white hover:border-emerald-200'
          }`}
        >
          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <Check size={15} />
            <span>Đã chấp thuận</span>
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-900">
            {approvedCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter('ALL')}
          className={`rounded-3xl border p-4.5 text-left transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'border-orange-400 bg-orange-50/80 shadow-xs ring-2 ring-orange-400/20'
              : 'border-slate-200 bg-white hover:border-orange-200'
          }`}
        >
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <FileText size={15} />
            <span>Tổng số đơn của lớp</span>
          </p>
          <p className="mt-2 text-3xl font-black text-slate-800">
            {totalCount}
          </p>
        </button>
      </div>
    </div>
  );
}
