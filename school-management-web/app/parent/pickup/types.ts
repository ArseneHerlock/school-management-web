export interface AuthorizedPerson {
  Id?: string;
  ParentId?: string;
  ChildId?: string;
  FullName: string;
  Relationship: string;
  PhoneNumber: string | null;
  IdCardNumber: string | null;
  PhotoUrl: string | null;
  IsDefault: boolean;
  IsOfficialParent?: boolean;
  Notes?: string | null;
}

export interface DailyAuth {
  Id: string;
  PickupDate: string;
  PickupPersonName: string;
  Relationship: string;
  PhoneNumber: string | null;
  IdCardNumber: string | null;
  PhotoUrl: string | null;
  ExpectedTime: string | null;
  ParentNote: string | null;
  Status: string;
  ActualPickupTime: string | null;
  TeacherConfirmedBy: string | null;
}

export interface RecentPickupLog {
  Id: string;
  Ngay: string;
  GioVe: any;
  NguoiDon: string;
  TrangThai: string;
  LyDoVeSom: string | null;
  GhiChu: string | null;
}

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatPickupTime(timeVal: any): string {
  if (!timeVal) return '---';
  if (typeof timeVal === 'string') return timeVal.slice(0, 5);
  if (typeof timeVal === 'object' && ('hours' in timeVal || 'minutes' in timeVal)) {
    const h = String(timeVal.hours || 0).padStart(2, '0');
    const m = String(timeVal.minutes || 0).padStart(2, '0');
    return `${h}:${m}`;
  }
  return String(timeVal).slice(0, 5);
}
