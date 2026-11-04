import React from 'react';
import { Loader2, FileText } from 'lucide-react';
import { LeaveApplication } from '../types';
import { LeaveCard } from './LeaveCard';

interface LeaveListProps {
  isLoading: boolean;
  filteredApplications: LeaveApplication[];
  processingId: string;
  onReviewApplication: (app: LeaveApplication, approve: boolean) => void;
}

export function LeaveList({
  isLoading,
  filteredApplications,
  processingId,
  onReviewApplication,
}: LeaveListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
        <Loader2 className="h-9 w-9 animate-spin text-orange-500 mb-3" />
        <h3 className="text-sm font-bold text-slate-800">
          Đang tải danh sách đơn xin nghỉ...
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Đồng bộ trực tiếp từ LeaveService
        </p>
      </div>
    );
  }

  if (filteredApplications.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
        <FileText size={38} className="mx-auto mb-3 text-slate-300" />
        <p className="text-sm font-bold text-slate-700">
          Không tìm thấy đơn xin nghỉ nào phù hợp
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Khi phụ huynh gửi đơn qua ứng dụng, danh sách sẽ tự động hiển thị tại đây
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {filteredApplications.map((application) => (
        <LeaveCard
          key={application.id}
          application={application}
          isProcessing={processingId === String(application.id)}
          onReviewApplication={onReviewApplication}
        />
      ))}
    </div>
  );
}
