"use client";

import {
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  ArrowLeft,
  Plus,
} from "lucide-react";
import Link from "next/link";
import LoadingScreen from "@/app/components/LoadingScreen";
import ActivityMomentsModal from "./components/ActivityMomentsModal";
import TeacherPostMomentModal from "../components/TeacherPostMomentModal";
import { CreateActivityModal } from "./components/CreateActivityModal";
import { TeacherActivityCard } from "./components/TeacherActivityCard";
import { useTeacherActivities } from "./useTeacherActivities";

export default function TeacherActivitiesPage() {
  const {
    activities,
    teacherClassInfo,
    loading,
    search,
    setSearch,
    scopeFilter,
    setScopeFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedActivityForMoments,
    setSelectedActivityForMoments,
    postMomentActivity,
    setPostMomentActivity,
    toastMessage,
    setToastMessage,
    load,
    filtered,
  } = useTeacherActivities();

  if (loading && activities.length === 0) {
    return (
      <LoadingScreen
        message="Đang tải Hoạt động rèn luyện..."
        subMessage="Đồng bộ danh sách hoạt động toàn trường & hoạt động riêng của lớp"
        theme="orange"
      />
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <Link
          href="/teacher"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-orange-600 mb-3 transition"
        >
          <ArrowLeft size={14} /> Quay lại Không gian Giáo viên
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Kế hoạch hoạt động {teacherClassInfo ? `— ${teacherClassInfo.name || teacherClassInfo.tenLop}` : ''}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Tải lại</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-orange-600/20 transition cursor-pointer"
            >
              <Plus size={15} />
              <span>Tạo hoạt động cho lớp</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 flex justify-between items-center shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            {toastMessage}
          </span>
          <button
            onClick={() => setToastMessage("")}
            className="text-emerald-600 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs">
          <button
            onClick={() => setScopeFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
              scopeFilter === "ALL"
                ? "bg-white shadow-xs text-slate-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Tất cả ({activities.length})
          </button>
          <button
            onClick={() => setScopeFilter("CLASS")}
            className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
              scopeFilter === "CLASS"
                ? "bg-white shadow-xs text-purple-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Hoạt động của lớp ({activities.filter((a) => a.scope === "CLASS").length})
          </button>
          <button
            onClick={() => setScopeFilter("SCHOOL")}
            className={`rounded-lg px-3 py-1.5 font-bold transition cursor-pointer ${
              scopeFilter === "SCHOOL"
                ? "bg-white shadow-xs text-blue-700"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Hoạt động của trường ({activities.filter((a) => a.scope !== "CLASS").length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Tìm tên, lĩnh vực..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-orange-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <TeacherActivityCard
            key={item.id}
            item={item}
            teacherClassInfo={teacherClassInfo}
            onViewMoments={setSelectedActivityForMoments}
            onPostMoment={setPostMomentActivity}
          />
        ))}

        {!filtered.length && !loading && (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            <Sparkles size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">Không tìm thấy hoạt động nào phù hợp.</p>
          </div>
        )}
      </div>

      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        classId={teacherClassInfo?.id}
        onSuccess={(name) => {
          setToastMessage(`Đã tạo thành công hoạt động "${name}" cho lớp!`);
          void load();
        }}
      />

      <ActivityMomentsModal
        isOpen={Boolean(selectedActivityForMoments)}
        onClose={() => setSelectedActivityForMoments(null)}
        activity={selectedActivityForMoments}
        onOpenPostMoment={(act) => {
          setSelectedActivityForMoments(null);
          setPostMomentActivity(act);
        }}
      />

      {postMomentActivity && (
        <TeacherPostMomentModal
          isOpen={Boolean(postMomentActivity)}
          onClose={() => setPostMomentActivity(null)}
          onSuccess={() => {
            setToastMessage("Đăng khoảnh khắc lên Bảng tin lớp thành công!");
          }}
          defaultActivityId={postMomentActivity.id}
          defaultActivityTitle={postMomentActivity.name}
          defaultClassId={teacherClassInfo?.id}
          defaultClassName={teacherClassInfo?.name || teacherClassInfo?.tenLop}
        />
      )}
    </div>
  );
}
