import { FCMInferenceResult, FCMHistoryRecord } from './fcm';

export interface FridayAwardFlowerItem {
  id: string;
  date: string;
  type: string;
  reason: string;
}

export interface FridayAwardChild {
  childId: string;
  childName: string;
  gender: string;
  presentDays: number;
  excusedDays: number;
  unexcusedDays: number;
  isQualified: boolean;
  hasAwardedToday: boolean;
  reasonText: string;
  monthFlowerCount: number;
  monthStarCount: number;
  totalFlowerCount: number;
  hasMonthlyStar: boolean;
  monthFlowers: FridayAwardFlowerItem[];
}

export interface FridayAwardsResponse {
  classId: string;
  weekRange: { monday: string; friday: string };
  targetDate: string;
  month?: number;
  year?: number;
  totalCount: number;
  qualifiedCount: number;
  awardedCount?: number;
  monthlyStarsCount?: number;
  children: FridayAwardChild[];
}

export async function getFridayAwardsStatus(
  classId: string,
  date?: string,
  month?: number,
  year?: number
): Promise<FridayAwardsResponse> {
  const q = new URLSearchParams({ classId });
  if (date) q.set('date', date);
  if (month) q.set('month', String(month));
  if (year) q.set('year', String(year));
  const res = await fetch(`/api/friday-awards?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách xét Phiếu Bé Ngoan.');
  return await res.json();
}

export async function submitFridayAwards(data: {
  classId: string;
  awardDate: string;
  awardedChildIds: string[];
  reason?: string;
  teacherUserId?: string;
}): Promise<{ success: boolean; message: string; awardedCount: number; monthlyStarsCount: number }> {
  const res = await fetch('/api/friday-awards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi khi phát Phiếu Bé Ngoan.');
  }
  return await res.json();
}

export interface YearEndAwardItem {
  id?: string | null;
  childId: string;
  childName: string;
  gender: string;
  birthDate?: string;
  totalDays?: number;
  presentDays?: number;
  attendanceRate?: number | null;
  attendanceText?: string;
  healthStatus: string;
  isHealthNormal?: boolean;
  normalQuartersCount?: number;
  totalQuartersCount?: number;
  quarterlyHealth?: Array<{
    round: number;
    label: string;
    date: string;
    weight: number;
    height: number;
    conclusion: string;
    isNormal: boolean;
  }>;
  totalAssessments?: number;
  passedAssessments?: number;
  activityPassRate?: number | null;
  activityText?: string;
  fcmClusterId?: number | null;
  fcmClusterName?: string | null;
  awardTitle: string;
  suggestedTitle: string;
  teacherNote?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  certificateCode?: string | null;
}

export interface ClassAwardsResponse {
  classId: string;
  schoolYear: string;
  semester: number;
  totalChildren: number;
  submitted: boolean;
  approved: boolean;
  awards: YearEndAwardItem[];
}

export async function getClassYearEndAwards(
  classId: string,
  schoolYear = '2026-2027',
  semester = 0
): Promise<ClassAwardsResponse> {
  const q = new URLSearchParams({ classId, schoolYear, semester: String(semester) });
  const res = await fetch(`/api/year-end-awards?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách khen thưởng năm học.');
  return await res.json();
}

export async function saveClassYearEndAwards(data: {
  classId: string;
  schoolYear: string;
  semester: number;
  awardsList: Array<{
    childId: string;
    awardTitle: string;
    suggestedTitle?: string;
    attendanceRate?: number;
    healthStatus?: string;
    teacherNote?: string;
  }>;
  action: 'SAVE_CLASS' | 'SUBMIT_CLASS';
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/year-end-awards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi khi lưu bảng xét khen thưởng.');
  }
  return await res.json();
}

export async function getSchoolAwardsAdmin(schoolYear = '2026-2027', semester = 0): Promise<any> {
  const q = new URLSearchParams({ schoolYear, semester: String(semester) });
  const res = await fetch(`/api/year-end-awards?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải danh sách khen thưởng toàn trường.');
  return await res.json();
}

export async function approveAllAwardsAdmin(schoolYear = '2026-2027', semester = 0, adminUserId?: string): Promise<any> {
  const res = await fetch('/api/year-end-awards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'APPROVE_ALL', schoolYear, semester, adminUserId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi khi phê duyệt khen thưởng.');
  }
  return await res.json();
}

export async function getChildYearEndAward(childId: string, schoolYear = '2026-2027', semester = 0): Promise<any> {
  const q = new URLSearchParams({ childId, schoolYear, semester: String(semester) });
  const res = await fetch(`/api/year-end-awards?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return await res.json();
}

// ----------------- FCM API Connectors -----------------

export async function getClassFCM(classId: string, month: number, year: number): Promise<any> {
  const q = new URLSearchParams({ classId, month: String(month), year: String(year) });
  const res = await fetch(`/api/fcm?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải dữ liệu phân cụm FCM của lớp.');
  return await res.json();
}

export async function runClassFCM(data: {
  classId?: string;
  childId?: string;
  gradeId?: string;
  scope?: 'ALL' | 'GRADE' | 'CLASS' | 'CHILD';
  month: number;
  year: number;
  evaluatedBy?: string;
  intakeFeatures?: Record<string, Record<string, number>>;
}): Promise<any> {
  const res = await fetch('/api/fcm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi khi chạy thuật toán phân cụm FCM.');
  }
  return await res.json();
}

export async function getChildFCMHistory(childId: string): Promise<any> {
  const q = new URLSearchParams({ childId });
  const res = await fetch(`/api/fcm?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) return { history: [], latest: null };
  return await res.json();
}

export async function getSchoolFCMOverview(month: number, year: number): Promise<any> {
  const q = new URLSearchParams({ month: String(month), year: String(year) });
  const res = await fetch(`/api/fcm?${q.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Không thể tải tổng quan FCM toàn trường.');
  return await res.json();
}
