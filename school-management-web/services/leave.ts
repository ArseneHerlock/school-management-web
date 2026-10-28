import { api, normalizeList } from "./client";

export interface LeaveRequest {
  id: string;
  childId: string;
  childName?: string;
  parentId?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  note?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt?: string;
}

export interface SubmitLeaveInput {
  childId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  subjectType?: string;
}

export interface ReviewLeaveInput {
  approve: boolean;
  note?: string;
}

export async function getLeaves(params?: {
  status?: string;
  subjectType?: string;
}): Promise<LeaveRequest[]> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.subjectType) q.set("subjectType", params.subjectType);
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api.get<any>("leave", `/api/leaves${qs}`).catch(() => []);
  return normalizeList<LeaveRequest>(res);
}

export async function getLeavesByChild(childId: string): Promise<LeaveRequest[]> {
  const all = await getLeaves({ subjectType: "Child" });
  return all.filter((x) => String(x.childId).toLowerCase() === String(childId).toLowerCase());
}

export async function submitLeave(data: SubmitLeaveInput): Promise<LeaveRequest> {
  return await api.post<LeaveRequest>("leave", "/api/leaves", {
    ...data,
    subjectType: data.subjectType || "Child",
  });
}

export async function reviewLeave(id: string, data: ReviewLeaveInput): Promise<LeaveRequest> {
  return await api.put<LeaveRequest>("leave", `/api/leaves/${id}/review`, data);
}
