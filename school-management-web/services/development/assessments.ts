import { api, normalizeList } from "../client";
import {
  AssessmentItem,
  CreateAssessmentInput,
  UpdateAssessmentInput,
} from "./types";

const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toValidGuidOrNull(val?: string | null): string | null {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  return GUID_REGEX.test(trimmed) ? trimmed : null;
}

export async function getAssessments(params?: {
  childId?: string;
  criterionId?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  items: AssessmentItem[];
}> {
  const q = new URLSearchParams();
  const trimmedChildId = toValidGuidOrNull(params?.childId);
  if (trimmedChildId) {
    q.set("childId", trimmedChildId);
  }
  if (params?.criterionId && toValidGuidOrNull(params.criterionId)) {
    q.set("criterionId", params.criterionId.trim());
  }
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const qs = q.toString() ? `?${q.toString()}` : "";

  let items: AssessmentItem[] = [];
  let total = 0;

  try {
    const res = await api.get<any>("development", `/api/development/assessments${qs}`);
    items = normalizeList<AssessmentItem>(res);
    total = res?.total ?? items.length;
  } catch {}

  // Dùng endpoint batch làm giải pháp dự phòng / bọc an toàn nếu gọi trực tiếp trả về rỗng
  if (items.length === 0 && trimmedChildId) {
    try {
      const batchRes = await fetch(`/api/assessment/batch?childId=${trimmedChildId}`, { cache: "no-store" });
      if (batchRes.ok) {
        const batchData = await batchRes.json();
        const batchItems = Array.isArray(batchData?.items) ? batchData.items : [];
        if (batchItems.length > 0) {
          items = batchItems;
          total = batchData?.total ?? batchItems.length;
        }
      }
    } catch {}
  }

  return {
    total,
    page: params?.page || 1,
    pageSize: params?.pageSize || (items.length || 50),
    items,
  };
}

export async function createAssessment(
  input: CreateAssessmentInput
): Promise<AssessmentItem> {
  const payload = {
    childId: input.childId.trim(),
    developmentCriterionId: input.developmentCriterionId.trim(),
    result: Boolean(input.result),
    assessmentMethod: input.assessmentMethod || "QuanSat",
    activityId: toValidGuidOrNull(input.activityId),
    evidence: input.evidence ?? null,
    comment: input.comment ?? input.notes ?? null,
    assessedBy: toValidGuidOrNull(input.assessedBy || input.assessedByUserId),
    assessedAt: input.assessedAt || new Date().toISOString(),
  };
  return await api.post<AssessmentItem>(
    "development",
    "/api/development/assessments",
    payload
  );
}

export async function updateAssessment(
  id: string,
  input: UpdateAssessmentInput
): Promise<void> {
  const payload = {
    result: Boolean(input.result),
    assessmentMethod: input.assessmentMethod || "QuanSat",
    activityId: toValidGuidOrNull(input.activityId),
    evidence: input.evidence ?? null,
    comment: input.comment ?? input.notes ?? null,
    assessedBy: toValidGuidOrNull(input.assessedBy),
    assessedAt: input.assessedAt || new Date().toISOString(),
  };
  await api.put("development", `/api/development/assessments/${id}`, payload);
}

export async function deleteAssessment(id: string): Promise<void> {
  await api.delete("development", `/api/development/assessments/${id}`);
}

export async function getChildAssessmentHistory(
  childId: string
): Promise<AssessmentItem[]> {
  const trimmed = toValidGuidOrNull(childId);
  if (!trimmed) return [];
  try {
    const res = await fetch(`/api/assessment/batch?childId=${trimmed}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      if (items.length > 0) return items;
    }
  } catch {}
  const res = await getAssessments({ childId: trimmed, page: 1, pageSize: 500 });
  return res.items;
}
