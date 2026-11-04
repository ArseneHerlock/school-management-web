import { Clock3, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export interface LeaveApplication {
  id: string;
  childId: string;
  childName?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string | number;
  note?: string;
  createdAt?: string;
}

export function resolveLeaveStatus(statusValue: any) {
  const normalized = String(statusValue ?? '').toLowerCase();
  if (normalized === '0' || normalized === 'pending') {
    return {
      key: 'pending',
      label: 'Chờ duyệt',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock3,
    };
  }
  if (normalized === '1' || normalized === 'approved') {
    return {
      key: 'approved',
      label: 'Đã chấp thuận',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    };
  }
  if (normalized === '2' || normalized === 'rejected') {
    return {
      key: 'rejected',
      label: 'Từ chối',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    };
  }
  return {
    key: 'unknown',
    label: normalized || 'Không rõ',
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: AlertCircle,
  };
}
