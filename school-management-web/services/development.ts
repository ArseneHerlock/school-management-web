import { api, normalizeList } from "./client";

export interface ActivityCriterion {
  id: string;
  developmentCriterionId: string;
  observationGuide?: string | null;
}

export interface ActivityItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  instructions?: string | null;
  minAgeMonths?: number | null;
  maxAgeMonths?: number | null;
  isActive: boolean;
  createdAt: string;
  developmentCriteria: ActivityCriterion[];
}

export interface CreateActivityInput {
  code: string;
  name: string;
  description?: string;
  instructions?: string;
  minAgeMonths?: number;
  maxAgeMonths?: number;
}

export interface UpdateActivityInput extends CreateActivityInput {
  isActive: boolean;
}

export interface DomainItem {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CreateDomainInput {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateDomainInput extends CreateDomainInput {
  isActive: boolean;
}

export interface CriterionItem {
  id: string;
  developmentDomainId: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CreateCriterionInput {
  developmentDomainId: string;
  code: string;
  name: string;
  description?: string;
}

export interface UpdateCriterionInput extends CreateCriterionInput {
  isActive: boolean;
}

export interface AssessmentItem {
  id: string;
  childId: string;
  developmentCriterionId: string;
  activityId?: string | null;
  result: boolean;
  notes?: string | null;
  comment?: string | null;
  evidence?: string | null;
  assessedAt: string;
  assessedByUserId?: string;
  assessedBy?: string;
  assessedByName?: string;
  [key: string]: any;
}

export interface CreateAssessmentInput {
  childId: string;
  developmentCriterionId: string;
  activityId?: string;
  result: boolean;
  notes?: string;
  comment?: string;
  evidence?: string;
  assessedBy?: string;
  assessedAt?: string;
  [key: string]: any;
}

export interface UpdateAssessmentInput {
  result?: boolean;
  notes?: string;
  comment?: string;
  evidence?: string;
  [key: string]: any;
}

// ----------------- Activity Service APIs -----------------
export async function getActivities(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  includeInactive?: boolean;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  items: ActivityItem[];
}> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.search) q.set("search", params.search);
  if (params?.includeInactive !== undefined)
    q.set("includeInactive", String(params.includeInactive));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api.get<any>("activity", `/api/activities${qs}`).catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<ActivityItem>(res);
  return {
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    pageSize: res?.pageSize ?? (items.length || 0),
    items,
  };
}

export async function getActivityById(id: string): Promise<ActivityItem> {
  return await api.get<ActivityItem>("activity", `/api/activities/${id}`);
}

export async function createActivity(input: CreateActivityInput): Promise<ActivityItem> {
  return await api.post<ActivityItem>("activity", "/api/activities", input);
}

export async function updateActivity(id: string, input: UpdateActivityInput): Promise<void> {
  await api.put("activity", `/api/activities/${id}`, input);
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete("activity", `/api/activities/${id}`);
}

export async function setActivityActive(id: string, isActive: boolean): Promise<void> {
  await api.patch("activity", `/api/activities/${id}/active`, isActive);
}

export async function linkActivityCriterion(
  id: string,
  criterionId: string,
  observationGuide?: string
): Promise<void> {
  await api.put("activity", `/api/activities/${id}/criteria`, {
    developmentCriterionId: criterionId,
    observationGuide: observationGuide || null,
  });
}

export async function unlinkActivityCriterion(id: string, criterionId: string): Promise<void> {
  await api.delete("activity", `/api/activities/${id}/criteria/${criterionId}`);
}

// ----------------- Development Domain & Criteria APIs -----------------
export async function getDomains(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  includeInactive?: boolean;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  items: DomainItem[];
}> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.search) q.set("search", params.search);
  if (params?.includeInactive !== undefined)
    q.set("includeInactive", String(params.includeInactive));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api.get<any>("development", `/api/development/domains${qs}`).catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<DomainItem>(res);
  return {
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    pageSize: res?.pageSize ?? (items.length || 0),
    items,
  };
}

export async function createDomain(input: CreateDomainInput): Promise<DomainItem> {
  return await api.post<DomainItem>("development", "/api/development/domains", input);
}

export async function updateDomain(id: string, input: UpdateDomainInput): Promise<void> {
  await api.put("development", `/api/development/domains/${id}`, input);
}

export async function deleteDomain(id: string): Promise<void> {
  await api.delete("development", `/api/development/domains/${id}`);
}

export async function getCriteria(params?: {
  domainId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  includeInactive?: boolean;
}): Promise<{
  total: number;
  page: number;
  pageSize: number;
  items: CriterionItem[];
}> {
  const q = new URLSearchParams();
  if (params?.domainId) q.set("domainId", params.domainId);
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.search) q.set("search", params.search);
  if (params?.includeInactive !== undefined)
    q.set("includeInactive", String(params.includeInactive));
  const qs = q.toString() ? `?${q.toString()}` : "";
  const res = await api.get<any>("development", `/api/development/criteria${qs}`).catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<CriterionItem>(res);
  return {
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    pageSize: res?.pageSize ?? (items.length || 0),
    items,
  };
}

export async function getCriterionById(id: string): Promise<CriterionItem> {
  return await api.get<CriterionItem>("development", `/api/development/criteria/${id}`);
}

export async function createCriterion(input: CreateCriterionInput): Promise<CriterionItem> {
  return await api.post<CriterionItem>("development", "/api/development/criteria", input);
}

export async function updateCriterion(id: string, input: UpdateCriterionInput): Promise<void> {
  await api.put("development", `/api/development/criteria/${id}`, input);
}

export async function deleteCriterion(id: string): Promise<void> {
  await api.delete("development", `/api/development/criteria/${id}`);
}

// ----------------- Development Assessment APIs -----------------
const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  if (params?.childId && toValidGuidOrNull(params.childId)) {
    q.set("childId", params.childId.trim());
  }
  if (params?.criterionId && toValidGuidOrNull(params.criterionId)) {
    q.set("criterionId", params.criterionId.trim());
  }
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const qs = q.toString() ? `?${q.toString()}` : "";

  const res = await api
    .get<any>("development", `/api/development/assessments${qs}`)
    .catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<AssessmentItem>(res);
  return {
    total: res?.total ?? items.length,
    page: params?.page || 1,
    pageSize: params?.pageSize || (items.length || 50),
    items,
  };
}

export async function createAssessment(input: CreateAssessmentInput): Promise<AssessmentItem> {
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
  return await api.post<AssessmentItem>("development", "/api/development/assessments", payload);
}

export async function updateAssessment(id: string, input: UpdateAssessmentInput): Promise<void> {
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

export const KNOWN_BACKEND_CRITERIA_IDS = new Set<string>();

export function registerBackendCriteria(items: CriterionItem[]) {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (item?.id) {
      KNOWN_BACKEND_CRITERIA_IDS.add(item.id.toLowerCase().trim());
    }
  }
}

export async function getChildAssessmentHistory(childId: string): Promise<AssessmentItem[]> {
  const res = await getAssessments({ childId, page: 1, pageSize: 500 });
  return res.items;
}
