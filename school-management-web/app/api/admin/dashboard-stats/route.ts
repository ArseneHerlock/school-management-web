import { NextRequest, NextResponse } from "next/server";
import { getServiceBaseUrl, CORS_HEADERS } from "@/lib/bff/gatewayConfig";
import { DashboardStatsData } from "./types";
import { aggregateAttendanceStats } from "./attendanceAggregator";
import {
  aggregateKitchenAndTuition,
  aggregateDemographicsAndHealth,
} from "./operationsAggregator";

export * from "./types";

interface CacheStore {
  timestamp: number;
  data: DashboardStatsData;
}

let memoryCache: CacheStore | null = null;
const CACHE_TTL_MS = 20_000; // 20s TTL

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const isForceRefresh = request.nextUrl.searchParams.get("refresh") === "true";
  const now = Date.now();

  if (!isForceRefresh && memoryCache && now - memoryCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(
      { ...memoryCache.data, fromCache: true },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=20, stale-while-revalidate=40",
          "X-BFF-Cache": "HIT",
        },
      }
    );
  }

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
    const todayIsoDate = new Date().toISOString().slice(0, 10);

    const [
      studentsRaw,
      parentsRaw,
      staffRaw,
      classesRaw,
      newsRaw,
      activitiesRaw,
      criteriaRaw,
      assessmentsRaw,
      attendanceRaw,
      billingRaw,
      leavesRaw,
      healthRaw,
      domainsRaw,
    ] = await Promise.all([
      fetchInternal("students", "/api/students"),
      fetchInternal("parents", "/api/parents"),
      fetchInternal("staff", "/api/Staff"),
      fetchInternal("classes", "/api/Lop"),
      fetchInternal("news", "/api/news?trang=1&soLuongMoiTrang=4"),
      fetchInternal("activity", "/api/activities?page=1&pageSize=1"),
      fetchInternal("development", "/api/development/criteria?page=1&pageSize=1"),
      fetchInternal("development", "/api/development/assessments?page=1&pageSize=100"),
      fetchInternal("attendance", `/api/DiemDanh/today/all?date=${todayIsoDate}`),
      fetchInternal("billing", "/api/billing/invoices"),
      fetchInternal("leave", "/api/leaves?subjectType=Child"),
      fetchInternal("health", "/api/SucKhoe"),
      fetchInternal("development", "/api/development/domains?page=1&pageSize=20"),
    ]);

    const studentsList = toList(studentsRaw);
    const parentsList = toList(parentsRaw);
    const staffList = toList(staffRaw);
    const classesList = toList(classesRaw);
    const newsList = toList(newsRaw);
    const attendanceList = toList(attendanceRaw);
    const billingList = toList(billingRaw);
    const leavesList = toList(leavesRaw);
    const healthList = toList(healthRaw);
    const domainsList = toList(domainsRaw);
    const assessmentsList = toList(assessmentsRaw);

    const activeStudents = studentsList.filter(
      (s: any) => s.trangThaiHoc === "Đang học" || s.trangThaiHoc === "Active" || !s.trangThaiHoc
    );
    const unassignedStudents = activeStudents.filter((s: any) => !s.lopId);

    const assessedIds = new Set(assessmentsList.map((x: any) => x.childId));
    const assessedCount = studentsList.filter((s: any) => assessedIds.has(s.id)).length;

    // 1. Attendance & room ratios
    const {
      totalEnrolled,
      presentCount,
      absentWithNotice,
      absentWithoutNotice,
      attendanceRate,
      roomRatios,
      classAttendance,
      weeklyAttendance,
    } = aggregateAttendanceStats({
      activeStudents,
      classesList,
      attendanceList,
      leavesList,
    });

    // 2. Kitchen dispatch & tuition ledger
    const { kitchenDispatch, tuitionLedger, currentYear } = aggregateKitchenAndTuition({
      studentsList,
      classesList,
      billingList,
      presentCount,
    });

    // 3. Demographics, WHO Nutrition & Domain progress
    const { ageDistribution, whoNutrition, domainProgress } = aggregateDemographicsAndHealth({
      activeStudents,
      healthList,
      domainsList,
      assessmentsList,
      totalEnrolled,
      currentYear,
    });

    const stats: DashboardStatsData = {
      studentsCount: studentsList.length,
      activeStudentsCount: totalEnrolled,
      unassignedStudentsCount: unassignedStudents.length,
      parentsCount: parentsList.length,
      staffCount: staffList.length,
      classesCount: classesList.length,
      activitiesCount: activitiesRaw?.total ?? (Array.isArray(activitiesRaw) ? activitiesRaw.length : 0),
      criteriaCount: criteriaRaw?.total ?? (Array.isArray(criteriaRaw) ? criteriaRaw.length : 0),
      assessmentsCount: assessmentsRaw?.total ?? assessmentsList.length,
      assessedStudentsCount: assessedCount,

      attendanceToday: {
        present: presentCount,
        absentWithNotice,
        absentWithoutNotice,
        attendanceRate,
      },
      roomRatios,
      kitchenDispatch,
      tuitionLedger,
      weeklyAttendance,
      ageDistribution,
      classAttendance,
      whoNutrition,
      domainProgress,

      latestNews: newsList.slice(0, 4).map((n: any) => ({
        id: n.id,
        tieuDe: n.tieuDe || n.title,
        title: n.title || n.tieuDe,
        ngayTao: n.ngayTao || n.ngayXuatBan || n.createdAt,
        ngayXuatBan: n.ngayXuatBan || n.ngayTao,
      })),
      cachedAt: new Date().toISOString(),
    };

    memoryCache = {
      timestamp: now,
      data: stats,
    };

    return NextResponse.json(
      { ...stats, fromCache: false },
      {
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, max-age=20, stale-while-revalidate=40",
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
