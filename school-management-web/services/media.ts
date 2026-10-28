import { request, getFullApiUrl } from "./client";

export function getMediaUrl(mediaIdOrUrl?: string | null): string {
  if (!mediaIdOrUrl) return "";
  const trimmed = String(mediaIdOrUrl).trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return trimmed;

  // External URL not pointing to local media service
  if (
    (trimmed.startsWith("http://") || trimmed.startsWith("https://")) &&
    !trimmed.includes(":5067") &&
    !trimmed.includes("/api/media") &&
    !trimmed.includes("/api/backend/media")
  ) {
    return trimmed;
  }

  // UUID pattern
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = trimmed.match(uuidRegex);
  if (match) {
    const id = match[0];
    return getFullApiUrl(`/api/backend/media/api/media/${id}/file`);
  }

  if (trimmed.startsWith("/")) {
    return getFullApiUrl(trimmed);
  }

  return trimmed;
}

export async function uploadMedia(file: File): Promise<{
  id: string;
  url: string;
  fileUrl: string;
  [key: string]: any;
}> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await request<any>("media", "/api/media/upload", {
    method: "POST",
    body: fd,
  });
  const id = res?.id || res?.Id || "";
  const url = id ? getFullApiUrl(`/api/backend/media/api/media/${id}/file`) : (res?.url || res?.fileUrl || "");
  return {
    ...res,
    id,
    url,
    fileUrl: url,
  };
}
