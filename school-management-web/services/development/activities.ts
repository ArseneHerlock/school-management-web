import { api, normalizeList } from "../client";
import {
  ActivityItem,
  CreateActivityInput,
  UpdateActivityInput,
} from "./types";

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
  const res = await api
    .get<any>("activity", `/api/activities${qs}`)
    .catch(() => ({ items: [], total: 0 }));
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

export async function createActivity(
  input: CreateActivityInput
): Promise<ActivityItem> {
  return await api.post<ActivityItem>("activity", "/api/activities", input);
}

export async function updateActivity(
  id: string,
  input: UpdateActivityInput
): Promise<void> {
  await api.put("activity", `/api/activities/${id}`, input);
}

export async function deleteActivity(id: string): Promise<void> {
  await api.delete("activity", `/api/activities/${id}`);
}

export async function setActivityActive(
  id: string,
  isActive: boolean
): Promise<void> {
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

export async function unlinkActivityCriterion(
  id: string,
  criterionId: string
): Promise<void> {
  await api.delete("activity", `/api/activities/${id}/criteria/${criterionId}`);
}
