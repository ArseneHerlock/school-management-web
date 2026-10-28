"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserRoundCheck,
  UserCog,
  DoorOpen,
  Activity,
  Newspaper,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getAccessToken } from "@/services/client";
import { DevelopmentProgressWidget } from "./DevelopmentProgressWidget";
import { DashboardKpi, DashboardMetric, DashboardQuick } from "./DashboardWidgets";

interface DashboardStats {
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
}

const initialStats: DashboardStats = {
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
  latestNews: [],
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

  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    }

    // Tận dụng Session Cache để render tức thì (0ms) khi điều hướng nội bộ
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

      const data: DashboardStats = await res.json();
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
          Đang tổng hợp số liệu quản trị trường học...
        </h3>
        <p className="text-xs text-slate-400 mt-1">Đồng bộ trực tiếp qua BFF Gateway</p>
      </div>
    );
  }

  const assignedCount = Math.max(0, stats.activeStudentsCount - stats.unassignedStudentsCount);

  return (
    <section className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="admin-eyebrow">TRUNG TÂM QUẢN TRỊ</p>
          <h1 className="admin-title">Tổng quan trường học</h1>
          <p className="admin-subtitle">
            Số liệu thời gian thực được tổng hợp tự động từ các dịch vụ qua BFF Gateway.
          </p>
        </div>
        <button
          onClick={() => void load(true)}
          disabled={isRefreshing}
          className="admin-btn admin-btn-secondary disabled:opacity-50"
        >
          <RefreshCw size={15} className={isRefreshing ? "animate-spin text-rose-500" : ""} />
          {isRefreshing ? "Đang đồng bộ..." : "Làm mới"}
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 text-sm text-rose-800">
          <AlertCircle size={16} className="mr-2 inline text-rose-600" />
          {error}
        </div>
      )}

      {/* KPI Hàng 1 */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardKpi
          icon={Users}
          label="Học sinh"
          value={stats.studentsCount}
          onClick={() => navigate("hoc-sinh")}
        />
        <DashboardKpi
          icon={UserRoundCheck}
          label="Phụ huynh"
          value={stats.parentsCount}
          onClick={() => navigate("phu-huynh")}
        />
        <DashboardKpi
          icon={UserCog}
          label="Nhân sự"
          value={stats.staffCount}
          onClick={() => navigate("nhan-su")}
        />
        <DashboardKpi
          icon={DoorOpen}
          label="Lớp học"
          value={stats.classesCount}
          onClick={() => navigate("lop")}
        />
        <DashboardKpi
          icon={Activity}
          label="Đang học"
          value={stats.activeStudentsCount}
          onClick={() => navigate("hoc-sinh")}
        />
      </div>

      {/* KPI Phát triển trẻ */}
      <DevelopmentProgressWidget
        activitiesCount={stats.activitiesCount}
        criteriaCount={stats.criteriaCount}
        assessmentsCount={stats.assessmentsCount}
        assessedStudentsCount={stats.assessedStudentsCount}
        totalStudentsCount={stats.studentsCount}
        onOpenEvaluation={() => navigate("danh-gia")}
      />

      {/* Grid thông tin học sinh & tin tức */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="admin-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-slate-800">Tình hình học sinh</h2>
              <p className="mt-1 text-xs text-slate-500">Theo hồ sơ học sinh mầm non</p>
            </div>
            <button
              onClick={() => navigate("hoc-sinh")}
              className="text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              Mở hồ sơ <ArrowRight size={13} className="inline" />
            </button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <DashboardMetric
              label="Đang học"
              value={stats.activeStudentsCount}
              total={stats.studentsCount}
            />
            <DashboardMetric
              label="Chưa xếp lớp"
              value={stats.unassignedStudentsCount}
              total={stats.studentsCount}
            />
            <DashboardMetric
              label="Đã xếp lớp"
              value={assignedCount}
              total={stats.studentsCount}
            />
          </div>
        </section>

        <section className="admin-card p-5">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-rose-600" />
            <h2 className="font-black text-slate-800">Tin tức mới</h2>
          </div>
          {stats.latestNews.length ? (
            <div className="mt-4 space-y-2">
              {stats.latestNews.map((n: any, i: number) => (
                <div
                  key={n.id || i}
                  className="rounded-xl border border-rose-100 p-3 hover:bg-rose-50/30 transition"
                >
                  <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                    {n.tieuDe || n.title || "Tin tức"}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {n.ngayTao || n.ngayXuatBan || "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-400">Chưa có tin tức mới.</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <DashboardQuick
          label="Đánh giá trẻ"
          text="Quản lý hoạt động & tiêu chí"
          onClick={() => navigate("danh-gia")}
        />
        <DashboardQuick
          label="Quản lý học sinh"
          text="Hồ sơ, lớp, trạng thái"
          onClick={() => navigate("hoc-sinh")}
        />
        <DashboardQuick
          label="Quản lý phụ huynh"
          text="Tài khoản và con"
          onClick={() => navigate("phu-huynh")}
        />
        <DashboardQuick
          label="Điểm danh"
          text="Theo dõi chuyên cần ngày"
          onClick={() => navigate("diem-danh")}
        />
      </div>
    </section>
  );
}
