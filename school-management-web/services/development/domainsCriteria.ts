import { api, normalizeList } from "../client";
import {
  DomainItem,
  CreateDomainInput,
  UpdateDomainInput,
  CriterionItem,
  CreateCriterionInput,
  UpdateCriterionInput,
} from "./types";

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
  const res = await api
    .get<any>("development", `/api/development/domains${qs}`)
    .catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<DomainItem>(res);
  return {
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    pageSize: res?.pageSize ?? (items.length || 0),
    items,
  };
}

export async function createDomain(
  input: CreateDomainInput
): Promise<DomainItem> {
  return await api.post<DomainItem>(
    "development",
    "/api/development/domains",
    input
  );
}

export async function updateDomain(
  id: string,
  input: UpdateDomainInput
): Promise<void> {
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
  const res = await api
    .get<any>("development", `/api/development/criteria${qs}`)
    .catch(() => ({ items: [], total: 0 }));
  const items = normalizeList<CriterionItem>(res);
  return {
    total: res?.total ?? items.length,
    page: res?.page ?? 1,
    pageSize: res?.pageSize ?? (items.length || 0),
    items,
  };
}

export async function getCriterionById(id: string): Promise<CriterionItem> {
  return await api.get<CriterionItem>(
    "development",
    `/api/development/criteria/${id}`
  );
}

export async function createCriterion(
  input: CreateCriterionInput
): Promise<CriterionItem> {
  return await api.post<CriterionItem>(
    "development",
    "/api/development/criteria",
    input
  );
}

export async function updateCriterion(
  id: string,
  input: UpdateCriterionInput
): Promise<void> {
  await api.put("development", `/api/development/criteria/${id}`, input);
}

export async function deleteCriterion(id: string): Promise<void> {
  await api.delete("development", `/api/development/criteria/${id}`);
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
