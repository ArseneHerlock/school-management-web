"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  Loader2,
  RefreshCw,
  X,
  XCircle,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { currentUser } from "@/services/client";
import { getStaffByUserId } from "@/services/staff";
import { getClasses } from "@/services/classes";
import { getStudents, Student } from "@/services/students";
import { getLeaves, reviewLeave } from "@/services/leave";

interface LeaveApplication {
  id: string;
  childId: string;
  childName?: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string | number;
  note?: string;
  createdAt?: string;
}

function resolveLeaveStatus(statusValue: any) {
  const normalized = String(statusValue ?? "").toLowerCase();
  if (normalized === "0" || normalized === "pending") {
    return {
      key: "pending",
      label: "Chờ duyệt",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock3,
    };
  }
  if (normalized === "1" || normalized === "approved") {
    return {
      key: "approved",
      label: "Đã chấp thuận",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircle2,
    };
  }
  if (normalized === "2" || normalized === "rejected") {
    return {
      key: "rejected",
      label: "Từ chối",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      icon: XCircle,
    };
  }
  return {
    key: "unknown",
    label: normalized || "Không rõ",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200",
    icon: AlertCircle,
  };
}

export default function TeacherLeavePage() {
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Bộ lọc và tìm kiếm
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "pending" | "approved" | "rejected"
  >("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  /**
   * Tải danh sách đơn xin nghỉ học của học sinh thuộc lớp phụ trách
   */
  const loadLeaveData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const activeUser = currentUser();
      if (!activeUser) return;

      // 1. Tìm giáo viên và lớp phụ trách
      const staffMember = await getStaffByUserId(activeUser.id);
      const allClasses = await getClasses();
      const assignedClass = allClasses.find(
        (c) => c.giaoVienChuNhiemId === staffMember?.staffId,
      );

      let studentsList: Student[] = [];
      if (assignedClass) {
        studentsList = await getStudents({ lopId: assignedClass.id });
      } else {
        studentsList = await getStudents();
      }
      setClassStudents(studentsList);

      const studentNameMap = new Map(
        studentsList.map((student) => [
          String(student.id).toLowerCase(),
          student.tenHocSinh,
        ]),
      );

      // 2. Lấy danh sách đơn nghỉ loại trẻ em (subjectType=Child)
      const rawLeaves = await getLeaves({ subjectType: "Child" });
      const leaveList: any[] = Array.isArray(rawLeaves) ? rawLeaves : [];

      const matchedLeaves: LeaveApplication[] = [];
      for (const leaveItem of leaveList) {
        const childId = String(leaveItem.childId || "").toLowerCase();
        if (studentNameMap.has(childId)) {
          matchedLeaves.push({
            id: leaveItem.id,
            childId: leaveItem.childId,
            childName: studentNameMap.get(childId) || "Học sinh",
            fromDate: leaveItem.fromDate,
            toDate: leaveItem.toDate,
            reason: leaveItem.reason || "Nghỉ có phép",
            status: leaveItem.status,
            note: leaveItem.note,
            createdAt: leaveItem.createdAt,
          });
        }
      }

      // Sắp xếp đơn mới nhất lên trên
      matchedLeaves.sort(function (a, b) {
        return String(b.fromDate || "").localeCompare(String(a.fromDate || ""));
      });

      setLeaveApplications(matchedLeaves);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Không tải được danh sách đơn nghỉ";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaveData();
  }, [loadLeaveData]);

  /**
   * Duyệt hoặc từ chối đơn xin nghỉ học
   */
  async function handleReviewApplication(
    application: LeaveApplication,
    isApproved: boolean,
  ): Promise<void> {
    setProcessingId(String(application.id));
    setFeedbackMessage("");
    setErrorMessage("");

    try {
      const reviewNote = isApproved
        ? "Giáo viên chủ nhiệm đã duyệt đơn nghỉ."
        : "Giáo viên từ chối đơn nghỉ học.";

      await reviewLeave(application.id, {
        approve: isApproved,
        note: reviewNote,
      });

      const actionText = isApproved
        ? `Đã duyệt đơn nghỉ cho học sinh ${application.childName}. Hệ thống tự động đồng bộ trạng thái Vắng có phép vào sổ điểm danh.`
        : `Đã từ chối đơn nghỉ của học sinh ${application.childName}.`;

      setFeedbackMessage(actionText);
      await loadLeaveData();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Không thể xử lý đơn xin nghỉ";
      setErrorMessage(msg);
    } finally {
      setProcessingId("");
    }
  }

  // Thống kê nhanh
  const pendingCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === "pending",
  ).length;
  const approvedCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === "approved",
  ).length;
  const rejectedCount = leaveApplications.filter(
    (app) => resolveLeaveStatus(app.status).key === "rejected",
  ).length;

  // Lọc danh sách theo tab trạng thái và từ khóa tìm kiếm
  const filteredApplications = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();

    return leaveApplications.filter(function (app) {
      const statusInfo = resolveLeaveStatus(app.status);
      const isStatusMatch =
        statusFilter === "ALL" || statusInfo.key === statusFilter;

      const searchContent =
        `${app.childName} ${app.reason} ${app.note || ""}`.toLowerCase();
      const isKeywordMatch = !keyword || searchContent.includes(keyword);

      return isStatusMatch && isKeywordMatch;
    });
  }, [leaveApplications, statusFilter, searchKeyword]);

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Làm mới */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-black tracking-wider text-orange-600 uppercase">
            Quản lý nề nếp & Chăm sóc trẻ
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Duyệt đơn xin nghỉ học của học sinh
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Xác nhận đơn xin nghỉ của phụ huynh. Khi duyệt, hệ thống sẽ tự động
            cập nhật trạng thái "Vắng có phép" trên sổ điểm danh.
          </p>
        </div>

        <button
          onClick={loadLeaveData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-orange-300 transition"
        >
          <RefreshCw
            size={15}
            className={isLoading ? "animate-spin text-orange-500" : ""}
          />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Thông báo kết quả thao tác */}
      {feedbackMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* 3 Thẻ thống kê */}
      <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-3">
        <button
          onClick={() => setStatusFilter("pending")}
          className={`rounded-3xl border p-4.5 text-left transition ${
            statusFilter === "pending"
              ? "border-amber-400 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/20"
              : "border-amber-100 bg-white hover:border-amber-200"
          }`}
        >
          <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
            <Clock3 size={15} />
            <span>Chờ giáo viên duyệt</span>
          </p>
          <p className="mt-2 text-3xl font-black text-amber-900">
            {pendingCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("approved")}
          className={`rounded-3xl border p-4.5 text-left transition ${
            statusFilter === "approved"
              ? "border-emerald-400 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-400/20"
              : "border-emerald-100 bg-white hover:border-emerald-200"
          }`}
        >
          <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <Check size={15} />
            <span>Đã chấp thuận</span>
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-900">
            {approvedCount}
          </p>
        </button>

        <button
          onClick={() => setStatusFilter("ALL")}
          className={`rounded-3xl border p-4.5 text-left transition ${
            statusFilter === "ALL"
              ? "border-orange-400 bg-orange-50/80 shadow-xs ring-2 ring-orange-400/20"
              : "border-slate-200 bg-white hover:border-orange-200"
          }`}
        >
          <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <FileText size={15} />
            <span>Tổng số đơn của lớp</span>
          </p>
          <p className="mt-2 text-3xl font-black text-slate-800">
            {leaveApplications.length}
          </p>
        </button>
      </div>

      {/* Thanh tìm kiếm và bộ lọc Tab */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 outline-none focus:border-orange-400 focus:bg-white transition"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="Tìm theo tên học sinh, lý do nghỉ học..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1 rounded-2xl">
          {[
            { key: "ALL", label: "Tất cả đơn" },
            { key: "pending", label: "Chờ duyệt" },
            { key: "approved", label: "Đã duyệt" },
            { key: "rejected", label: "Từ chối" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                statusFilter === tab.key
                  ? "bg-white text-orange-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách thẻ đơn xin nghỉ */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <Loader2 className="h-9 w-9 animate-spin text-orange-500 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">
            Đang tải danh sách đơn xin nghỉ...
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Đồng bộ trực tiếp từ LeaveService
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
          <FileText size={38} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">
            Không tìm thấy đơn xin nghỉ nào phù hợp
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Khi phụ huynh gửi đơn qua ứng dụng, danh sách sẽ tự động hiển thị
            tại đây
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredApplications.map((application) => {
            const statusInfo = resolveLeaveStatus(application.status);
            const StatusIcon = statusInfo.icon;
            const isPending = statusInfo.key === "pending";
            const isProcessing = processingId === String(application.id);

            return (
              <article
                key={application.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Thông tin học sinh và thời gian */}
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 font-black">
                      <CalendarDays size={22} />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-sm font-black text-slate-900">
                          {application.childName}
                        </h2>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${statusInfo.badgeClass}`}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-orange-700">
                        Lý do:{" "}
                        <span className="font-normal text-slate-700">
                          {application.reason}
                        </span>
                      </p>

                      <p className="text-xs text-slate-500 flex items-center gap-1.5">
                        <span>Thời gian nghỉ:</span>
                        <strong className="text-slate-800 font-mono">
                          {String(application.fromDate).slice(0, 10)}
                        </strong>
                        <span>đến</span>
                        <strong className="text-slate-800 font-mono">
                          {String(application.toDate).slice(0, 10)}
                        </strong>
                      </p>

                      {application.note && (
                        <p className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-[11px] text-slate-600 mt-2">
                          Ghi chú phụ huynh: {application.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Nút hành động Duyệt / Từ chối */}
                  {isPending && (
                    <div className="flex shrink-0 items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <button
                        disabled={isProcessing}
                        onClick={() =>
                          handleReviewApplication(application, false)
                        }
                        className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50"
                      >
                        <X size={15} />
                        <span>Từ chối</span>
                      </button>

                      <button
                        disabled={isProcessing}
                        onClick={() =>
                          handleReviewApplication(application, true)
                        }
                        className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50"
                      >
                        {isProcessing ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Check size={15} />
                        )}
                        <span>Duyệt đơn nghỉ</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Ghi chú đồng bộ */}
                {statusInfo.key === "approved" && (
                  <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-100 px-3.5 py-2 text-[11px] font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>
                      Đã xác nhận nghỉ học. Sổ điểm danh tự động ghi nhận vắng
                      có phép cho trẻ.
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
