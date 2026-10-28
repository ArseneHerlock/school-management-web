"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Layers,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { getActivities, ActivityItem } from "@/lib/development";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function TeacherActivitiesPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE">("ACTIVE");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getActivities({ page: 1, pageSize: 200, includeInactive: true });
      setActivities(res.items || []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (statusFilter === "ACTIVE" && !a.isActive) return false;
      if (search.trim()) {
        const kw = search.toLowerCase();
        return (
          a.name.toLowerCase().includes(kw) ||
          a.code.toLowerCase().includes(kw) ||
          (a.description || "").toLowerCase().includes(kw)
        );
      }
      return true;
    });
  }, [activities, statusFilter, search]);

  if (loading && activities.length === 0) {
    return (
      <LoadingScreen
        message="Đang tải Hoạt động toàn trường..."
        subMessage="Đồng bộ kế hoạch hoạt động ngoại khóa từ Ban giám hiệu"
        theme="orange"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-3 transition"
        >
          <ArrowLeft size={14} /> Quay lại Không gian Giáo viên
        </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                  <Sparkles size={13} className="mr-1.5" /> KẾ HOẠCH TOÀN TRƯỜNG
                </span>
                <span className="text-xs text-slate-400 font-medium">Chế độ làm theo (Read-only)</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
                Hoạt động & Sự kiện toàn trường
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Các sự kiện ngoại khóa, ngày hội, hoạt động chuyên đề (An toàn giao thông, Ngày lễ, Hội khỏe) do Ban giám hiệu ban hành để giáo viên triển khai cho lớp.
              </p>
            </div>

            <button
              onClick={() => void load()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Tải lại</span>
            </button>
          </div>
        </div>

        {/* Banner điều hướng nhanh sang Lịch Dạy */}
        <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-white p-5 text-xs text-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-black text-sm text-purple-950">
                Hoạt động đã xuất hiện trực tiếp trên Lịch Dạy của lớp
              </p>
              <p className="mt-0.5 text-purple-800 leading-relaxed">
                Ban giám hiệu đã xếp lịch hoạt động theo ngày & giờ cho từng lớp. Thầy/Cô chỉ cần vào <b>Lịch Dạy</b> để biết hôm nay lớp có hoạt động gì, và <b>nhấn trực tiếp vào hoạt động để đánh giá & nhận xét từng trẻ (kèm nhận xét hàng loạt)</b>!
              </p>
            </div>
          </div>

          <Link
            href="/teacher/schedule"
            className="flex items-center gap-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 text-xs font-black shadow-md shadow-purple-600/20 transition shrink-0"
          >
            <span>Mở Lịch Dạy & Đánh giá trẻ</span>
            <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </div>

        {/* Thanh tìm kiếm & Lọc */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs outline-none focus:border-orange-400 focus:bg-white"
              placeholder="Tìm theo tên hoạt động, mã, từ khóa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Hiển thị:</span>
            <select
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-orange-400"
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
            >
              <option value="ACTIVE">Đang diễn ra ({activities.filter((a) => a.isActive).length})</option>
              <option value="ALL">Tất cả ({activities.length})</option>
            </select>
          </div>
        </div>

        {/* Danh sách hoạt động */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                item.isActive ? "border-slate-200" : "border-slate-200/60 bg-slate-50/50 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-orange-50 px-2.5 py-1 font-mono text-[11px] font-bold text-orange-700 border border-orange-200/50">
                    {item.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      item.isActive
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.isActive ? (
                      <>
                        <CheckCircle2 size={12} /> Đang diễn ra
                      </>
                    ) : (
                      <>
                        <Clock size={12} /> Đã kết thúc
                      </>
                    )}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-bold text-slate-900 leading-snug">
                  {item.name}
                </h3>

                <p className="mt-1.5 text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {item.description || "Chưa có mô tả chi tiết."}
                </p>

                {item.instructions && (
                  <div className="mt-3.5 rounded-xl bg-orange-50/60 p-3 text-xs text-orange-900 border border-orange-100">
                    <b className="text-orange-950 block mb-1 flex items-center gap-1">
                      <FileText size={13} /> Hướng dẫn cho lớp:
                    </b>
                    <p className="line-clamp-3 text-[11px] leading-relaxed">{item.instructions}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  <span>
                    Độ tuổi: <b>{item.minAgeMonths ?? 18} - {item.maxAgeMonths ?? 72} tháng</b>
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-orange-600">
                  Lớp tham gia
                </span>
              </div>
            </div>
          ))}

          {!filtered.length && !loading && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Sparkles size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">Không có hoạt động nào đang hiển thị.</p>
            </div>
          )}
        </div>
      </div>
  );
}
