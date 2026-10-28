/**
 * Cấu hình định tuyến API Gateway (BFF) tới các Microservices nội bộ
 */

export const DEFAULT_SERVICES: Record<string, string> = {
  auth: "http://127.0.0.1:5049",
  billing: "http://127.0.0.1:5257",
  communication: "http://127.0.0.1:5093",
  students: "http://127.0.0.1:5050",
  student: "http://127.0.0.1:5050",
  parents: "http://127.0.0.1:5051",
  grades: "http://127.0.0.1:5053",
  classes: "http://127.0.0.1:5069",
  staff: "http://127.0.0.1:5286",
  health: "http://127.0.0.1:5070",
  media: "http://127.0.0.1:5067",
  news: "http://127.0.0.1:8080",
  schedule: "http://127.0.0.1:5015",
  attendance: "http://127.0.0.1:5068",
  assessment: "http://127.0.0.1:5291",
  leave: "http://127.0.0.1:5290",
  learning: "http://127.0.0.1:5292",
  activity: "http://127.0.0.1:5293",
  development: "http://127.0.0.1:5294",
};

export const SERVICE_PREFIXES: Record<string, string> = {
  auth: "/api/Auth",
  attendance: "/api/DiemDanh",
  billing: "/api/billing",
  classes: "/api/Lop",
  communication: "/api",
  grades: "/api/grades",
  health: "/api/SucKhoe",
  assessment: "/api/assessments",
  media: "/api/media",
  news: "/api/news",
  parents: "/api/parents",
  schedule: "/api/schedules",
  staff: "/api/Staff",
  student: "/api/students",
  students: "/api/students",
  leave: "/api/leaves",
  learning: "/api/learning",
  activity: "/api/activities",
  development: "/api/development",
};

export const ALLOWED_METHODS = new Set(["GET", "POST", "PUT", "DELETE", "PATCH"]);

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
};

export function getServiceBaseUrl(service: string): string | undefined {
  return (
    process.env[`BACKEND_${service.toUpperCase()}_URL`] ||
    DEFAULT_SERVICES[service]
  );
}

export function normalizeEndpointPath(service: string, pathSegments: string[]): string {
  const incoming = `/${pathSegments.join("/")}`;
  if (!incoming.startsWith("/api/")) {
    const prefix = SERVICE_PREFIXES[service];
    if (prefix) {
      return `${prefix}${incoming}`;
    }
  }
  return incoming;
}

export function normalizeQueryParams(_service: string, rawSearch: string): string {
  const searchParams = new URLSearchParams(rawSearch);
  return searchParams.toString();
}
