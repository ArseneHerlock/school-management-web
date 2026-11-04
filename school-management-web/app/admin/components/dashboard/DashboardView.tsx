"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  CalendarCheck,
  HeartPulse,
  UtensilsCrossed,
  Award,
  DollarSign,
  Building2,
  FileText,
  Users,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import { getAccessToken } from "@/services/client";
import { DirectorHeader } from "./DirectorHeader";
import { DashboardKpis } from "./DashboardKpis";
import { ClassAttendanceChart } from "./ClassAttendanceChart";
import { WhoNutritionChart } from "./WhoNutritionChart";
import { AgeDistributionChart } from "./AgeDistributionChart";
import { KitchenDispatchWidget } from "./KitchenDispatchWidget";
import { LiveRoomRatiosWidget } from "./LiveRoomRatiosWidget";
import { TuitionLedgerWidget } from "./TuitionLedgerWidget";
import { DevelopmentProgressWidget } from "./DevelopmentProgressWidget";
import { DashboardNewsPortal } from "./DashboardNewsPortal";
import { DashboardStatsData } from "@/services/adminDashboardTypes";

type AdminTab = "overview" | "nutrition" | "kitchen" | "safety" | "tuition";

const initialStats: DashboardStatsData = {
  studentsCount: 0,
  activeStudentsCount: 0,
  unassignedStudentsCount: 0,
  parentsCount: 0,
  staffCount: 0,
  classesCount: 0,
  activitiesCount: 0,
  criteriaCount: 0,
  assessmentsCount: 0,
  assessedStudentsCount: 0,
  attendanceToday: {
    present: 0,
    absentWithNotice: 0,
    absentWithoutNotice: 0,
    attendanceRate: 0,
  },
  roomRatios: [],
  kitchenDispatch: {
    breakfastCount: 0,
    lunchCount: 0,
    afternoonSnackCount: 0,
    specialDietCount: 0,
    statusText: "Đang tải dữ liệu bếp...",
    allergyWatchlist: [],
  },
  tuitionLedger: {
    totalExpected: 0,
    totalCollected: 0,
    totalOutstanding: 0,
    collectionRate: 0,
    periodLabel: "Tháng hiện tại",
  },
  weeklyAttendance: [],
  ageDistribution: [],
  classAttendance: [],
  whoNutrition: {
    totalStudents: 0,
    measuredCount: 0,
    normalCount: 0,
    underweightOrStuntedCount: 0,
    overweightOrObeseCount: 0,
    unmeasuredCount: 0,
    normalPercent: 0,
    underweightPercent: 0,
    overweightPercent: 0,
  },
  domainProgress: [],
  latestNews: [],
  cachedAt: new Date().toISOString(),
};

export default function Dashboard({
  navigate: externalNavigate,
}: {
  navigate?: (page: any) => void;
} = {}) {
  const router = useRouter();
  const navigate = (id: string) => {
    if (externalNavigate) {
      externalNavigate(id);
    } else {
      router.push(id === "dashboard" ? "/admin" : `/admin/${id}`);
    }
  };

  const [stats, setStats] = useState<DashboardStatsData>(initialStats);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const load = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    }

    if (!forceRefresh) {
      try {
        const cached = sessionStorage.getItem("admin_dashboard_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setStats(parsed);
          setLoading(false);
        }
      } catch {}
    }

    try {
      const token = getAccessToken();
      const url = `/api/admin/dashboard-stats${forceRefresh ? "?refresh=true" : ""}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Không thể kết nối đến máy chủ tổng hợp số liệu");
      }

      const data: DashboardStatsData = await res.json();
      setStats(data);
      setError("");

      try {
        sessionStorage.setItem("admin_dashboard_cache", JSON.stringify(data));
      } catch {}
    } catch (err: any) {
      setError(err?.message || "Lỗi kết nối máy chủ dịch vụ.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void load(false);
  }, []);

  if (loading && stats.studentsCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500 mb-3" />
        <h3 className="text-base font-black text-slate-800">
          Đang khởi động Trung tâm Điều hành Ban Giám Hiệu...
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Đồng bộ dữ liệu định biên, bán trú, chuyên cần và học phí
        </p>
      </div>
    );
  }

  // 8 nút thao tác nhanh chuẩn mobile native (App Grid Launcher)
  const quickLaunchers = [
    { label: "Điểm danh", icon: CalendarCheck, color: "bg-emerald-50 text-emerald-600 border-emerald-200", path: "diem-danh" },
    { label: "Sức khỏe WHO", icon: HeartPulse, color: "bg-rose-50 text-rose-600 border-rose-200", path: "suc-khoe" },
    { label: "Bếp ăn", icon: UtensilsCrossed, color: "bg-amber-50 text-amber-600 border-amber-200", path: "suc-khoe" },
    { label: "Đánh giá trẻ", icon: Award, color: "bg-purple-50 text-purple-600 border-purple-200", path: "danh-gia" },
    { label: "Phòng học", icon: Building2, color: "bg-sky-50 text-sky-600 border-sky-200", path: "lop" },
    { label: "Học phí", icon: DollarSign, color: "bg-emerald-50 text-emerald-700 border-emerald-200", path: "hoc-phi" },
    { label: "Báo cáo Sở", icon: FileText, color: "bg-orange-50 text-orange-600 border-orange-200", path: "bao-cao-thang" },
    { label: "Nhân sự", icon: Users, color: "bg-indigo-50 text-indigo-600 border-indigo-200", path: "nhan-su" },
  ];

  const tabsConfig = [
    { id: "overview" as AdminTab, label: "Tổng quan", icon: Activity, badge: `${stats.attendanceToday.present} trẻ` },
    { id: "nutrition" as AdminTab, label: "Sức khỏe WHO", icon: HeartPulse },
    { id: "kitchen" as AdminTab, label: "Bán trú & Bếp", icon: UtensilsCrossed, badge: stats.kitchenDispatch.specialDietCount > 0 ? `${stats.kitchenDispatch.specialDietCount} dị ứng` : undefined },
    { id: "safety" as AdminTab, label: "Tỷ lệ Trẻ/Cô", icon: Building2 },
    { id: "tuition" as AdminTab, label: "Học phí & Quỹ", icon: DollarSign },
  ];

  return (
    <section className="space-y-4 sm:space-y-6 max-w-full min-w-0">
      {/* 1. Header Điều hành Ban Giám Hiệu (Gọn gàng chuẩn di động) */}
      <DirectorHeader
        onRefresh={() => void load(true)}
        isRefreshing={isRefreshing}
        onNavigate={navigate}
        attendanceRate={stats.attendanceToday.attendanceRate}
        totalPresent={stats.attendanceToday.present}
        totalEnrolled={stats.activeStudentsCount}
      />

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs font-bold text-rose-800 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => void load(true)}
            className="text-xs font-black text-rose-700 underline hover:text-rose-800 cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 2. Bàn Phím Tắt 1-Chạm Chuẩn Ứng Dụng Di Động (Native App Launcher 8 Icons) */}
      <div className="bg-white rounded-3xl p-3.5 sm:p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Tiện ích điều hành nhanh
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            1-Chạm mở tính năng
          </span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3 text-center">
          {quickLaunchers.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition cursor-pointer group"
              >
                <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center border shadow-2xs group-hover:scale-105 transition ${item.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-bold text-slate-700 leading-tight truncate w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bộ Chuyển Chuyên Mục Thông Minh (Segmented Tab Control - Không phải vuốt xuống vô tận!) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-200/60 rounded-2xl max-w-full">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[105px] sm:min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-white text-rose-700 shadow-sm shadow-slate-300"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              <Icon size={14} className={isActive ? "text-rose-600" : "text-slate-400"} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-rose-100 text-rose-700" : "bg-slate-300 text-slate-700"
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Vùng Nội Dung Chuyên Sâu Từng Tab (Chỉ hiển thị nội dung theo tab được chọn - Tối ưu 100% diện tích di động) */}
      <div className="space-y-4 sm:space-y-6">
        {activeTab === "overview" && (
          <>
            {/* 4 Chỉ số KPI Vận hành Trọng yếu */}
            <DashboardKpis stats={stats} onNavigate={navigate} />

            {/* Biểu đồ Điểm danh 12 Lớp (Rút gọn khối & toggle cột/danh sách) */}
            <ClassAttendanceChart
              classAttendance={stats.classAttendance}
              onNavigate={navigate}
            />

            {/* Bản tin Trường học & Cảnh báo nhanh */}
            <DashboardNewsPortal
              latestNews={stats.latestNews}
              onNavigate={navigate}
            />
          </>
        )}

        {activeTab === "nutrition" && (
          <>
            {/* Biểu đồ Dinh dưỡng Chuẩn WHO 2006 */}
            <WhoNutritionChart
              whoNutrition={stats.whoNutrition}
              onNavigate={navigate}
            />

            {/* Cơ cấu 3 Khối Lứa tuổi (Mầm - Chồi - Lá) */}
            <AgeDistributionChart ageData={stats.ageDistribution} />
          </>
        )}

        {activeTab === "kitchen" && (
          <>
            {/* Điều phối Bếp ăn Bán trú & Sổ theo dõi Dị ứng */}
            <KitchenDispatchWidget
              dispatch={stats.kitchenDispatch}
              onNavigateHealth={() => navigate("suc-khoe")}
            />
          </>
        )}

        {activeTab === "safety" && (
          <>
            {/* Định biên An toàn Trẻ / Giáo viên theo Phòng học */}
            <LiveRoomRatiosWidget
              ratios={stats.roomRatios}
              onNavigateClass={() => navigate("lop")}
            />
          </>
        )}

        {activeTab === "tuition" && (
          <>
            {/* Sổ quỹ Học phí & Bán trú */}
            <TuitionLedgerWidget
              ledger={stats.tuitionLedger}
              onNavigateBilling={() => navigate("hoc-phi")}
            />

            {/* Giám sát Tiến độ Đánh giá Trẻ em 5 Lĩnh vực */}
            <DevelopmentProgressWidget
              activitiesCount={stats.activitiesCount}
              criteriaCount={stats.criteriaCount}
              assessmentsCount={stats.assessmentsCount}
              assessedStudentsCount={stats.assessedStudentsCount}
              totalStudentsCount={stats.studentsCount}
              onOpenEvaluation={() => navigate("danh-gia")}
            />
          </>
        )}
      </div>
    </section>
  );
}
