import { NextRequest, NextResponse } from "next/server";
import { getServiceBaseUrl, CORS_HEADERS } from "@/lib/bff/gatewayConfig";

interface DashboardStatsData {
  studentsCount: number;
  activeStudentsCount: number;
  unassignedStudentsCount: number;
  parentsCount: number;
  staffCount: number;
  classesCount: number;
  activitiesCount: number;
  criteriaCount: number;
  assessmentsCount: number;
  assessedStudentsCount: number;
  latestNews: Array<{
    id?: string;
    tieuDe?: string;
    title?: string;
    ngayTao?: string;
    ngayXuatBan?: string;
  }>;
  cachedAt: string;
}

interface CacheStore {
  timestamp: number;
  data: DashboardStatsData;
}

let memoryCache: CacheStore | null = null;
const CACHE_TTL_MS = 30_000; // 30 giây TTL

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const isForceRefresh = request.nextUrl.searchParams.get("refresh") === "true";
  const now = Date.now();

  // 1. Trả về Cache In-Memory nếu còn hiệu lực (chỉ mất ~1ms)
  if (!isForceRefresh && memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { ...memoryCache.data, fromCache: true },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
          "X-BFF-Cache": "HIT",
        },
      }
    );
  }

  // 2. Chuẩn bị headers gọi nội bộ tới microservices
  const authHeader = request.headers.get("authorization");
  const internalHeaders: Record<string, string> = {
    Accept: "application/json",
  };
  if (authHeader) {
    internalHeaders.Authorization = authHeader;
  }

  const fetchInternal = async (service: string, path: string): Promise<any> => {
    const baseUrl = getServiceBaseUrl(service);
    if (!baseUrl) return null;
    const url = `${baseUrl}${path}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, {
        headers: internalHeaders,
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const toList = (raw: any): any[] => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      if (Array.isArray(raw.items)) return raw.items;
      if (Array.isArray(raw.data)) return raw.data;
    }
    return [];
  };

  try {
    // 3. Thực hiện song song từ server-side Next.js tới các dịch vụ cục bộ
    const [
      studentsRaw,
      parentsRaw,
      staffRaw,
      classesRaw,
      newsRaw,
      activitiesRaw,
      criteriaRaw,
      assessmentsRaw,
    ] = await Promise.all([
      fetchInternal("students", "/api/students"),
      fetchInternal("parents", "/api/parents"),
      fetchInternal("staff", "/api/Staff"),
      fetchInternal("classes", "/api/Lop"),
      fetchInternal("news", "/api/news?trang=1&soLuongMoiTrang=4"),
      fetchInternal("activity", "/api/activities?page=1&pageSize=1"),
      fetchInternal("development", "/api/development/criteria?page=1&pageSize=1"),
      fetchInternal("development", "/api/development/assessments?page=1&pageSize=100"),
    ]);

    const studentsList = toList(studentsRaw);
    const parentsList = toList(parentsRaw);
    const staffList = toList(staffRaw);
    const classesList = toList(classesRaw);
    const newsList = toList(newsRaw);

    const activeStudents = studentsList.filter(
      (s: any) => s.trangThaiHoc === "Đang học" || s.trangThaiHoc === "Active"
    );
    const unassignedStudents = activeStudents.filter((s: any) => !s.lopId);

    const assessmentsList = toList(assessmentsRaw);
    const assessedIds = new Set(assessmentsList.map((x: any) => x.childId));
    const assessedCount = studentsList.filter((s: any) => assessedIds.has(s.id)).length;

    const stats: DashboardStatsData = {
      studentsCount: studentsList.length,
      activeStudentsCount: activeStudents.length,
      unassignedStudentsCount: unassignedStudents.length,
      parentsCount: parentsList.length,
      staffCount: staffList.length,
      classesCount: classesList.length,
      activitiesCount: activitiesRaw?.total ?? (Array.isArray(activitiesRaw) ? activitiesRaw.length : 0),
      criteriaCount: criteriaRaw?.total ?? (Array.isArray(criteriaRaw) ? criteriaRaw.length : 0),
      assessmentsCount: assessmentsRaw?.total ?? assessmentsList.length,
      assessedStudentsCount: assessedCount,
      latestNews: newsList.slice(0, 4).map((n: any) => ({
        id: n.id,
        tieuDe: n.tieuDe || n.title,
        title: n.title || n.tieuDe,
        ngayTao: n.ngayTao || n.ngayXuatBan || n.createdAt,
        ngayXuatBan: n.ngayXuatBan || n.ngayTao,
      })),
      cachedAt: new Date().toISOString(),
    };

    // 4. Cập nhật In-memory Cache
    memoryCache = {
      timestamp: now,
      data: stats,
    };

    return NextResponse.json(
      { ...stats, fromCache: false },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
          "X-BFF-Cache": "MISS",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể tổng hợp số liệu dashboard", error: String(error) },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
